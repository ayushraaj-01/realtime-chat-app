# 💬 FlowChat — Realtime Chat Application

A stunning, real-time chat application built with **React**, **Node.js**, and **Socket.io**.

![Made with React](https://img.shields.io/badge/React-19-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4-green)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)

## ✨ Features

- **Real-time messaging** — Instant message delivery via WebSockets
- **Multiple chat rooms** — General, Tech, Random, Gaming
- **Typing indicators** — See who's typing in real-time
- **Online presence** — Live user list with colored avatars
- **Room switching** — Seamlessly move between rooms
- **Message history** — See recent messages when joining a room
- **Responsive design** — Works beautifully on mobile and desktop
- **Dark mode** — Premium dark UI with glassmorphism effects

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Start Development Servers

Open **two terminals**:

```bash
# Terminal 1 — Start the backend
cd server
npm run dev

# Terminal 2 — Start the frontend
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

### 3. Test It Out

1. Open **http://localhost:5173** in two browser tabs
2. Enter different usernames in each tab
3. Join the same room and start chatting!

## 🏗️ Production Build

```bash
# Build the React app
cd client
npm run build

# Start the server (serves both API + React build)
cd ../server
set NODE_ENV=production
node index.js
```

The production app will be at **http://localhost:3001**

## 📁 Project Structure

```
chatapp/
├── server/
│   ├── index.js        # Express + Socket.io server
│   ├── package.json
│   └── .env            # Server config
├── client/
│   ├── src/
│   │   ├── App.jsx              # Main app shell
│   │   ├── main.jsx             # Entry point
│   │   ├── socket.js            # Socket.io singleton
│   │   ├── index.css            # Full design system
│   │   ├── hooks/
│   │   │   └── useChat.js       # Custom chat hook
│   │   └── components/
│   │       ├── JoinScreen.jsx   # Landing page
│   │       ├── ChatRoom.jsx     # Chat layout
│   │       ├── Sidebar.jsx      # Room & user list
│   │       ├── MessageList.jsx  # Scrollable messages
│   │       ├── MessageBubble.jsx # Message styling
│   │       ├── MessageInput.jsx  # Input bar
│   │       └── TypingIndicator.jsx
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## 🎨 Tech Stack

| Layer     | Technology           |
|-----------|---------------------|
| Frontend  | React 19, Vite      |
| Backend   | Node.js, Express    |
| Real-time | Socket.io v4        |
| Styling   | Vanilla CSS         |
| Fonts     | Inter (Google Fonts) |
