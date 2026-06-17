export default function MessageBubble({ message, isOwn, currentUsername, onReact }) {
  if (message.type === 'system') {
    return (
      <div className="message-system">
        <div className="message-system__line" />
        <span className="message-system__text">{message.text}</span>
        <div className="message-system__line" />
      </div>
    );
  }

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`message-bubble ${isOwn ? 'message-bubble--own' : 'message-bubble--other'}`}>
      {/* Floating Hover Reactions bar */}
      <div className="message-bubble__actions">
        <button 
          className="message-bubble__action-btn" 
          title="React 👍"
          onClick={() => onReact?.(message.id, '👍')}
        >👍</button>
        <button 
          className="message-bubble__action-btn" 
          title="React ❤️"
          onClick={() => onReact?.(message.id, '❤️')}
        >❤️</button>
        <button 
          className="message-bubble__action-btn" 
          title="React 😂"
          onClick={() => onReact?.(message.id, '😂')}
        >😂</button>
        <button 
          className="message-bubble__action-btn" 
          title="React 🎉"
          onClick={() => onReact?.(message.id, '🎉')}
        >🎉</button>
        <button className="message-bubble__action-btn" title="More Actions">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      <div className="message-bubble__wrapper">
        {!isOwn && (
          <div className="message-bubble__sender">
            <div
              className="message-bubble__avatar"
              style={{ backgroundColor: message.color }}
            >
              {message.username?.charAt(0).toUpperCase()}
            </div>
            <span className="message-bubble__name">
              {message.username}
            </span>
            <span className="message-bubble__time-inline">{time}</span>
          </div>
        )}
        <div className="message-bubble__content">
          {message.text}
        </div>

        {/* Render reactions list */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="message-bubble__reactions">
            {Object.entries(message.reactions).map(([emoji, users]) => {
              if (!users || users.length === 0) return null;
              const hasReacted = users.includes(currentUsername);
              return (
                <button
                  key={emoji}
                  className={`message-bubble__reaction ${
                    hasReacted ? 'message-bubble__reaction--active' : ''
                  }`}
                  onClick={() => onReact?.(message.id, emoji)}
                  title={users.join(', ')}
                >
                  <span className="message-bubble__reaction-emoji">{emoji}</span>
                  <span className="message-bubble__reaction-count">{users.length}</span>
                </button>
              );
            })}
          </div>
        )}

        {isOwn && (
          <div className="message-bubble__meta-own">
            <span className="message-bubble__time">{time}</span>
            <span className="message-bubble__check">✓</span>
          </div>
        )}
      </div>
    </div>
  );
}
