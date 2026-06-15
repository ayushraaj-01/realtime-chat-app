const getRoomIcon = (roomName) => {
  const normalized = roomName.toLowerCase();
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

export default function Sidebar({
  rooms,
  roomData,
  currentRoom,
  users,
  username,
  onSwitchRoom,
  onLeave,
  isOpen,
}) {
  const getRoomCount = (roomName) => {
    const data = roomData?.find((r) => r.name === roomName);
    return data?.userCount ?? 0;
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`} id="sidebar">
      {/* Workspace Header Dropdown */}
      <div className="sidebar__workspace-header">
        <button className="sidebar__workspace-btn" id="workspace-select">
          <div className="sidebar__workspace-name-wrapper">
            <div className="sidebar__workspace-logo">F</div>
            <span className="sidebar__workspace-name">FlowChat Workspace</span>
          </div>
          <span className="sidebar__workspace-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>

      {/* Rooms Section Header */}
      <div className="sidebar__section">
        <h3 className="sidebar__section-title">
          Channels
        </h3>
      </div>

      {/* Rooms Navigation List */}
      <nav className="sidebar__rooms">
        {rooms.map((room) => {
          const count = getRoomCount(room.name);
          return (
            <button
              key={room.name}
              className={`sidebar__room ${currentRoom === room.name ? 'sidebar__room--active' : ''}`}
              onClick={() => onSwitchRoom(room.name)}
              id={`sidebar-room-${room.name.toLowerCase()}`}
            >
              <span className="sidebar__room-icon">{getRoomIcon(room.name)}</span>
              <span className="sidebar__room-name">{room.name}</span>
              {count > 0 && (
                <span className="sidebar__room-count">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Online Users Section Header */}
      <div className="sidebar__users">
        <div className="sidebar__section">
          <h3 className="sidebar__section-title">
            Online Users
            <span className="sidebar__online-badge">{users.length}</span>
          </h3>
        </div>
        <div className="sidebar__users-list">
          {users.map((user) => (
            <div
              key={user.username}
              className={`sidebar__user ${user.username === username ? 'sidebar__user--you' : ''}`}
            >
              <div className="sidebar__user-avatar-wrapper">
                <div
                  className="sidebar__user-avatar"
                  style={{ backgroundColor: user.color }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="sidebar__user-status" />
              </div>
              <span className="sidebar__user-name">
                {user.username}
                {user.username === username && (
                  <span className="sidebar__user-you-badge">you</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* User profile footer widget */}
      <div className="sidebar__profile-widget">
        <div className="sidebar__profile-info">
          <div className="sidebar__profile-avatar">
            {username.charAt(0).toUpperCase()}
            <span className="sidebar__profile-status-dot" />
          </div>
          <div className="sidebar__profile-meta">
            <span className="sidebar__profile-name">{username}</span>
            <span className="sidebar__profile-sub">Active Now</span>
          </div>
        </div>
        <button
          onClick={onLeave}
          id="leave-button"
          className="sidebar__profile-logout-btn"
          title="Leave Chat"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
