import { useState, useEffect, useCallback, useRef } from 'react';
import { socket } from '../socket';

const SESSION_KEY = 'flowchat_session';

function saveSession(username, room) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username, room }));
  } catch {}
}

function loadSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return null;
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function useChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [username, setUsername] = useState('');
  const [userColor, setUserColor] = useState('');
  const [isRejoining, setIsRejoining] = useState(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNewMessage(message) {
      setMessages((prev) => [...prev, message]);
    }

    function onRoomUsers(userList) {
      setUsers(userList);
    }

    function onRoomList(roomList) {
      setRooms(roomList);
    }

    function onTypingUpdate({ username: typingUser, isTyping }) {
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(typingUser) ? prev : [...prev, typingUser];
        }
        return prev.filter((u) => u !== typingUser);
      });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message:new', onNewMessage);
    socket.on('room:users', onRoomUsers);
    socket.on('room:list', onRoomList);
    socket.on('typing:update', onTypingUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message:new', onNewMessage);
      socket.off('room:users', onRoomUsers);
      socket.off('room:list', onRoomList);
      socket.off('typing:update', onTypingUpdate);
    };
  }, []);

  const joinRoom = useCallback((name, room) => {
    setUsername(name);
    setCurrentRoom(room);
    setMessages([]);
    setTypingUsers([]);

    if (!socket.connected) {
      socket.connect();
    }

    return new Promise((resolve) => {
      socket.emit('user:join', { username: name, room }, (response) => {
        if (response?.success) {
          setMessages(response.history || []);
          setUsers(response.users || []);
          setUserColor(response.color || '');
          saveSession(name, room);
        }
        resolve(response);
      });
    });
  }, []);

  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return;
    socket.emit('message:send', { text });
    // Stop typing when message is sent
    if (isTypingRef.current) {
      socket.emit('typing:stop');
      isTypingRef.current = false;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  const switchRoom = useCallback((newRoom) => {
    setMessages([]);
    setTypingUsers([]);
    setCurrentRoom(newRoom);

    return new Promise((resolve) => {
      socket.emit('room:switch', { newRoom }, (response) => {
        if (response?.success) {
          setMessages(response.history || []);
          setUsers(response.users || []);
          // Update saved session with new room
          const session = loadSession();
          if (session) {
            saveSession(session.username, newRoom);
          }
        }
        resolve(response);
      });
    });
  }, []);

  const handleTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start');
    }

    // Clear the previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('typing:stop');
    }, 2000);
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
    clearSession();
    setMessages([]);
    setUsers([]);
    setRooms([]);
    setTypingUsers([]);
    setCurrentRoom('');
    setUsername('');
    setUserColor('');
  }, []);

  // Attempt to rejoin from saved session (for page reload persistence)
  const tryRejoin = useCallback(async () => {
    const session = loadSession();
    if (!session?.username || !session?.room) return false;

    setIsRejoining(true);
    try {
      const response = await joinRoom(session.username, session.room);
      return response?.success || false;
    } catch {
      return false;
    } finally {
      setIsRejoining(false);
    }
  }, [joinRoom]);

  return {
    isConnected,
    messages,
    users,
    rooms,
    typingUsers,
    currentRoom,
    username,
    userColor,
    isRejoining,
    joinRoom,
    sendMessage,
    switchRoom,
    handleTyping,
    disconnect,
    tryRejoin,
    hasSavedSession: !!loadSession(),
  };
}
