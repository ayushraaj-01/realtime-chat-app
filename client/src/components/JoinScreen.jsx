import { useState } from 'react';

const getRoomIcon = (roomName) => {
  const normalized = roomName ? roomName.toLowerCase() : 'general';
  if (normalized === 'general' || normalized === 'random') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </svg>
    );
  }
  if (normalized === 'tech') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (normalized === 'gaming') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <line x1="15" y1="13" x2="15.01" y2="13" />
        <line x1="18" y1="11" x2="18.01" y2="11" />
        <rect x="2" y="6" width="20" height="12" rx="3" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
};

function CuteMascot({ isFocused, textLength, isJoining }) {
  // Eye tracking offset calculation based on text input length (0 to 20 chars)
  const eyeShiftX = isFocused ? Math.min(Math.max((textLength - 10) * 0.7, -7), 7) : 0;
  const eyeShiftY = isFocused ? 3 : 0;

  // Head tilt based on text length
  const headRotation = isFocused ? Math.min(Math.max((textLength - 10) * 0.5, -5), 5) : 0;

  return (
    <div className={`cute-mascot ${isJoining ? 'cute-mascot--celebrating' : ''}`}>
      <svg
        width="110"
        height="95"
        viewBox="0 0 120 100"
        className="cute-mascot__svg"
      >
        <defs>
          <linearGradient id="mascotBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="mascotEar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="mascotBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fdf2f8" />
            <stop offset="100%" stopColor="#fce7f3" />
          </linearGradient>
        </defs>

        {/* Soft Background Aura */}
        <circle cx="60" cy="55" r="42" fill="rgba(244, 114, 182, 0.25)" />

        {/* Head & Body Group with tilt rotation */}
        <g
          transform={`rotate(${headRotation}, 60, 55)`}
          style={{ transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* Left Ear */}
          <g className="cute-mascot__ear cute-mascot__ear--left">
            <circle cx="32" cy="24" r="13" fill="url(#mascotBody)" />
            <circle cx="32" cy="24" r="7" fill="url(#mascotEar)" opacity="0.85" />
          </g>

          {/* Right Ear */}
          <g className="cute-mascot__ear cute-mascot__ear--right">
            <circle cx="88" cy="24" r="13" fill="url(#mascotBody)" />
            <circle cx="88" cy="24" r="7" fill="url(#mascotEar)" opacity="0.85" />
          </g>

          {/* Main Head / Body */}
          <path
            d="M26 58 C26 30, 94 30, 94 58 C94 82, 26 82, 26 58 Z"
            fill="url(#mascotBody)"
          />

          {/* Soft Snout / Face Plate */}
          <ellipse cx="60" cy="62" rx="22" ry="16" fill="url(#mascotBelly)" />

          {/* Cute Nose */}
          <ellipse cx="60" cy="54" rx="5" ry="3.5" fill="#0f172a" />
          <circle cx="58.5" cy="53" r="1" fill="#ffffff" />

          {/* Cute Mouth */}
          <path
            d={isJoining ? "M53 62 Q60 72 67 62" : "M54 61 Q60 67 66 61"}
            fill={isJoining ? "#f43f5e" : "none"}
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Blush Cheeks */}
          <ellipse cx="38" cy="60" rx="5" ry="3" fill="#f472b6" opacity="0.6" />
          <ellipse cx="82" cy="60" rx="5" ry="3" fill="#f472b6" opacity="0.6" />

          {/* Left Eye */}
          <g transform={`translate(${eyeShiftX}, ${eyeShiftY})`} style={{ transition: 'transform 0.15s ease-out' }}>
            <circle cx="44" cy="46" r="7.5" fill="#ffffff" />
            <circle cx="44" cy="46" r="4" fill="#0f172a" />
            <circle cx="42.5" cy="44.5" r="1.5" fill="#ffffff" />
          </g>

          {/* Right Eye */}
          <g transform={`translate(${eyeShiftX}, ${eyeShiftY})`} style={{ transition: 'transform 0.15s ease-out' }}>
            <circle cx="76" cy="46" r="7.5" fill="#ffffff" />
            <circle cx="76" cy="46" r="4" fill="#0f172a" />
            <circle cx="74.5" cy="44.5" r="1.5" fill="#ffffff" />
          </g>

          {/* Cute Paws resting on the bottom edge */}
          <ellipse
            cx="34"
            cy={isJoining ? 32 : 78}
            rx="8"
            ry="7"
            fill="url(#mascotBelly)"
            stroke="#ec4899"
            strokeWidth="1.5"
            style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
          <ellipse
            cx="86"
            cy={isJoining ? 32 : 78}
            rx="8"
            ry="7"
            fill="url(#mascotBelly)"
            stroke="#ec4899"
            strokeWidth="1.5"
            style={{ transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />
        </g>
      </svg>
    </div>
  );
}

export default function JoinScreen({ rooms, onJoin, theme, onToggleTheme }) {
  const [username, setUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.name || 'General');
  const [isJoining, setIsJoining] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsJoining(true);
    try {
      await onJoin(username.trim(), selectedRoom);
    } catch {
      setIsJoining(false);
    }
  };

  return (
    <div className="join-screen" id="join-screen">
      {/* Ambient orbs for depth */}
      <div className="join-screen__orb-1" />
      <div className="join-screen__orb-2" />
      <div className="join-screen__orb-3" />

      {/* Floating Theme Toggle */}
      <button
        type="button"
        onClick={onToggleTheme}
        className="join-screen__theme-toggle"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      <div className="join-card">
        {/* Animated Cute Mascot */}
        <CuteMascot
          isFocused={isInputFocused}
          textLength={username.length}
          isJoining={isJoining}
        />

        <div className="join-card__logo">
          <h1 className="join-card__title">FlowChat</h1>
          <p className="join-card__subtitle">Real-time conversations, beautifully simple</p>
        </div>

        <form className="join-card__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="username-input">
              Display Name
            </label>
            <div className="form-group__input-wrapper">
              <span className="form-group__input-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="username-input"
                className="form-group__input"
                type="text"
                placeholder="What should we call you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                maxLength={20}
                autoFocus
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-group__label">Choose a Channel</label>
            <div className="room-grid">
              {rooms.map((room) => (
                <button
                  key={room.name}
                  type="button"
                  className={`room-option ${selectedRoom === room.name ? 'room-option--active' : ''}`}
                  onClick={() => setSelectedRoom(room.name)}
                  id={`room-option-${room.name.toLowerCase()}`}
                >
                  <span className="room-option__emoji" style={{ color: selectedRoom === room.name ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }}>
                    {getRoomIcon(room.name)}
                  </span>
                  <div className="room-option__text">
                    <span className="room-option__name">{room.name}</span>
                    {room.desc && <span className="room-option__desc">{room.desc}</span>}
                  </div>
                  {selectedRoom === room.name && <span className="room-option__check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="join-btn"
            disabled={!username.trim() || isJoining}
            id="join-button"
          >
            <span className="join-btn__text">
              {isJoining ? 'Connecting...' : 'Start Chatting'}
            </span>
            {!isJoining && (
              <span className="join-btn__arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            )}
            {isJoining && <span className="join-btn__spinner" />}
          </button>
        </form>

        <p className="join-card__footer">No account needed · Instant access</p>
      </div>
    </div>
  );
}
