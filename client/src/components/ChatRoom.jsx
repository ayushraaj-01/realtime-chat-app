import { useState } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const getRoomIcon = (roomName) => {
  const normalized = roomName ? roomName.toLowerCase() : 'general';
  if (normalized === 'general' || normalized === 'random') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </svg>
    );
  }
  if (normalized === 'tech') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (normalized === 'gaming') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <line x1="15" y1="13" x2="15.01" y2="13" />
        <line x1="18" y1="11" x2="18.01" y2="11" />
        <rect x="2" y="6" width="20" height="12" rx="3" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
};

export default function ChatRoom({ chat, rooms, onLeave, theme, onToggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSwitchRoom = async (roomName) => {
    if (roomName === chat.currentRoom) return;
    await chat.switchRoom(roomName);
    setSidebarOpen(false);
  };

  return (
    <div className="chat-layout" id="chat-room">
      {/* Mobile sidebar toggle */}
      <button
        className="sidebar__mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        id="sidebar-toggle"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        rooms={rooms}
        roomData={chat.rooms}
        currentRoom={chat.currentRoom}
        users={chat.users}
        username={chat.username}
        onSwitchRoom={handleSwitchRoom}
        onLeave={onLeave}
        isOpen={sidebarOpen}
      />

      <main className="chat-main">
        <header className="chat-header">
          <div className="chat-header__info">
            <span className="chat-header__room-icon">
              {getRoomIcon(chat.currentRoom)}
            </span>
            <div className="chat-header__room-meta">
              <h2 className="chat-header__room-name">{chat.currentRoom}</h2>
              <span className="chat-header__user-count">
                {chat.users.length} {chat.users.length === 1 ? 'member' : 'members'} online
              </span>
            </div>
          </div>

          {/* Centered Search Bar */}
          <div className="chat-header__search">
            <span className="chat-header__search-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={`Search ${chat.currentRoom ? chat.currentRoom.toLowerCase() : 'channel'}...`}
              className="chat-header__search-input"
              readOnly
            />
          </div>

          {/* Right Controls */}
          <div className="chat-header__actions">
            <button className="chat-header__action-btn" title="Toggle Notifications">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button className="chat-header__action-btn" title="Pinned Items">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="17" x2="12" y2="22" />
                <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.26V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.26a2 2 0 0 1-.78 1.24l-2.78 3.5a2 2 0 0 0-.44 1.24Z" />
              </svg>
            </button>
            <button className="chat-header__action-btn" title="Channel Details">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>

            {/* Theme Toggle Button */}
            <button
              className="chat-header__action-btn"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            
            <div className="chat-header__status">
              <span
                className={`chat-header__status-dot ${
                  chat.isConnected ? '' : 'chat-header__status-dot--disconnected'
                }`}
              />
              <span className="chat-header__status-text">
                {chat.isConnected ? 'Connected' : 'Reconnecting'}
              </span>
            </div>
          </div>
        </header>

        <MessageList
          messages={chat.messages}
          username={chat.username}
          onReact={chat.reactToMessage}
        />

        <TypingIndicator typingUsers={chat.typingUsers} />

        <MessageInput
          onSend={chat.sendMessage}
          onTyping={chat.handleTyping}
          disabled={!chat.isConnected}
        />
      </main>
    </div>
  );
}
