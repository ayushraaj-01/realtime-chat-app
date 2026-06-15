import { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import JoinScreen from './components/JoinScreen';
import ChatRoom from './components/ChatRoom';

const ROOMS = [
  { name: 'General', emoji: '💬', desc: 'Hang out & chat' },
  { name: 'Tech', emoji: '💻', desc: 'Code & tech talk' },
  { name: 'Random', emoji: '🎲', desc: 'Anything goes' },
  { name: 'Gaming', emoji: '🎮', desc: 'Game on!' },
];

export default function App() {
  const [screen, setScreen] = useState('loading'); // 'loading' | 'join' | 'chat'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('flowchat-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const chat = useChat();

  // On mount, try to restore session from localStorage
  useEffect(() => {
    if (!chat.hasSavedSession) {
      setScreen('join');
      return;
    }

    chat.tryRejoin().then((success) => {
      setScreen(success ? 'chat' : 'join');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update HTML data-theme attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('flowchat-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleJoin = async (username, room) => {
    const response = await chat.joinRoom(username, room);
    if (response?.success) {
      setScreen('chat');
    }
  };

  const handleLeave = () => {
    chat.disconnect();
    setScreen('join');
  };

  // Loading state while checking for saved session
  if (screen === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-screen__spinner" />
        <p className="loading-screen__text">Reconnecting...</p>
      </div>
    );
  }

  if (screen === 'join') {
    return (
      <JoinScreen
        rooms={ROOMS}
        onJoin={handleJoin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <ChatRoom
      chat={chat}
      rooms={ROOMS}
      onLeave={handleLeave}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}
