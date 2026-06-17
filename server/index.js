require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Accept any localhost origin in development to avoid port-mismatch CORS errors
const corsOrigin = process.env.NODE_ENV === 'production'
  ? CLIENT_URL
  : [CLIENT_URL, /^http:\/\/localhost:\d+$/];

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Socket.io Setup
// ---------------------------------------------------------------------------
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
});

// ---------------------------------------------------------------------------
// In-Memory Data Stores
// ---------------------------------------------------------------------------
const connectedUsers = new Map();   // socketId -> { username, room, color }
const roomMessages = new Map();     // room -> Message[]
const MAX_MESSAGES_PER_ROOM = 100;

const DEFAULT_ROOMS = ['General', 'Tech', 'Random', 'Gaming'];

// Ensure default rooms exist in the messages map
DEFAULT_ROOMS.forEach((room) => {
  roomMessages.set(room, []);
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateColor(username) {
  // Deterministic HSL color from username hash
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

function getRoomUsers(room) {
  const users = [];
  connectedUsers.forEach((user) => {
    if (user.room === room) {
      users.push({ username: user.username, color: user.color });
    }
  });
  return users;
}

function getRoomList() {
  const rooms = {};
  DEFAULT_ROOMS.forEach((room) => {
    rooms[room] = 0;
  });
  connectedUsers.forEach((user) => {
    if (rooms[user.room] !== undefined) {
      rooms[user.room]++;
    } else {
      rooms[user.room] = 1;
    }
  });
  return Object.entries(rooms).map(([name, count]) => ({ name, userCount: count }));
}

function addMessage(room, message) {
  if (!roomMessages.has(room)) {
    roomMessages.set(room, []);
  }
  const messages = roomMessages.get(room);
  messages.push(message);
  // Keep only the last N messages
  if (messages.length > MAX_MESSAGES_PER_ROOM) {
    messages.shift();
  }
}

// ---------------------------------------------------------------------------
// Socket.io Event Handlers
// ---------------------------------------------------------------------------
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // --- User Joins ---
  socket.on('user:join', ({ username, room }, callback) => {
    if (!username || !room) {
      return callback?.({ error: 'Username and room are required' });
    }

    const color = generateColor(username);
    connectedUsers.set(socket.id, { username, room, color });
    socket.join(room);

    // Send message history for this room
    const history = roomMessages.get(room) || [];

    // Notify room
    const joinMessage = {
      id: `system-${Date.now()}-${Math.random()}`,
      type: 'system',
      text: `${username} joined the room`,
      timestamp: new Date().toISOString(),
    };
    addMessage(room, joinMessage);
    io.to(room).emit('message:new', joinMessage);

    // Update user list for the room
    io.to(room).emit('room:users', getRoomUsers(room));

    // Update room list for everyone
    io.emit('room:list', getRoomList());

    callback?.({ success: true, history, users: getRoomUsers(room), color });
  });

  // --- Send Message ---
  socket.on('message:send', ({ text }) => {
    const user = connectedUsers.get(socket.id);
    if (!user || !text?.trim()) return;

    const message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      type: 'user',
      text: text.trim(),
      username: user.username,
      color: user.color,
      timestamp: new Date().toISOString(),
      reactions: {},
    };

    addMessage(user.room, message);
    io.to(user.room).emit('message:new', message);
  });

  // --- React to Message ---
  socket.on('message:react', ({ messageId, emoji }) => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    const messages = roomMessages.get(user.room) || [];
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    if (!message.reactions) {
      message.reactions = {};
    }

    if (!message.reactions[emoji]) {
      message.reactions[emoji] = [];
    }

    const index = message.reactions[emoji].indexOf(user.username);
    if (index > -1) {
      // Toggle off: remove user's username
      message.reactions[emoji].splice(index, 1);
      if (message.reactions[emoji].length === 0) {
        delete message.reactions[emoji];
      }
    } else {
      // Toggle on: add user's username
      message.reactions[emoji].push(user.username);
    }

    io.to(user.room).emit('message:reaction', {
      messageId,
      reactions: message.reactions,
    });
  });

  // --- Typing Indicators ---
  socket.on('typing:start', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    socket.to(user.room).emit('typing:update', {
      username: user.username,
      isTyping: true,
    });
  });

  socket.on('typing:stop', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;
    socket.to(user.room).emit('typing:update', {
      username: user.username,
      isTyping: false,
    });
  });

  // --- Switch Room ---
  socket.on('room:switch', ({ newRoom }, callback) => {
    const user = connectedUsers.get(socket.id);
    if (!user || !newRoom) return;

    const oldRoom = user.room;

    // Leave old room
    socket.leave(oldRoom);
    const leaveMessage = {
      id: `system-${Date.now()}-${Math.random()}`,
      type: 'system',
      text: `${user.username} left the room`,
      timestamp: new Date().toISOString(),
    };
    addMessage(oldRoom, leaveMessage);
    io.to(oldRoom).emit('message:new', leaveMessage);
    io.to(oldRoom).emit('room:users', getRoomUsers(oldRoom));

    // Join new room
    user.room = newRoom;
    socket.join(newRoom);
    const joinMessage = {
      id: `system-${Date.now()}-${Math.random()}`,
      type: 'system',
      text: `${user.username} joined the room`,
      timestamp: new Date().toISOString(),
    };
    addMessage(newRoom, joinMessage);
    io.to(newRoom).emit('message:new', joinMessage);
    io.to(newRoom).emit('room:users', getRoomUsers(newRoom));

    // Update room list for everyone
    io.emit('room:list', getRoomList());

    const history = roomMessages.get(newRoom) || [];
    callback?.({ success: true, history, users: getRoomUsers(newRoom) });
  });

  // --- Disconnect ---
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`💤 ${user.username} disconnected from ${user.room}`);

      const leaveMessage = {
        id: `system-${Date.now()}-${Math.random()}`,
        type: 'system',
        text: `${user.username} left the room`,
        timestamp: new Date().toISOString(),
      };
      addMessage(user.room, leaveMessage);
      io.to(user.room).emit('message:new', leaveMessage);
      io.to(user.room).emit('room:users', getRoomUsers(user.room));
      connectedUsers.delete(socket.id);
      io.emit('room:list', getRoomList());
    }
  });
});

// ---------------------------------------------------------------------------
// REST API
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/rooms', (_req, res) => {
  res.json(getRoomList());
});

// ---------------------------------------------------------------------------
// Production: Serve React build
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
}

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`\n🚀 Chat server running on http://localhost:${PORT}`);
  console.log(`   Accepting clients from: ${CLIENT_URL}\n`);
});
