import { useState } from 'react';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0) + ' ' + units[i];
}

function getFileIcon(type, name) {
  if (type === 'application/pdf' || name?.endsWith('.pdf')) return '📄';
  if (type?.startsWith('image/')) return '🖼️';
  if (type?.startsWith('video/')) return '🎬';
  if (type?.startsWith('audio/')) return '🎵';
  if (type?.includes('zip') || type?.includes('rar') || type?.includes('tar') || type?.includes('gz')) return '📦';
  if (type?.includes('word') || name?.endsWith('.doc') || name?.endsWith('.docx')) return '📝';
  if (type?.includes('sheet') || type?.includes('excel') || name?.endsWith('.xls') || name?.endsWith('.xlsx')) return '📊';
  if (type?.includes('presentation') || name?.endsWith('.ppt') || name?.endsWith('.pptx')) return '📑';
  if (type?.startsWith('text/') || name?.endsWith('.txt') || name?.endsWith('.csv')) return '📃';
  return '📎';
}

function AttachmentPreview({ attachment }) {
  const [pdfExpanded, setPdfExpanded] = useState(false);
  const { name, type, size, dataUrl } = attachment;
  const isPdf = type === 'application/pdf' || name?.endsWith('.pdf');
  const isImage = type?.startsWith('image/');

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PDF ---
  if (isPdf && dataUrl) {
    return (
      <div className="attachment-preview attachment-preview--pdf">
        <div className="attachment-preview__header" onClick={() => setPdfExpanded(!pdfExpanded)}>
          <div className="attachment-preview__icon-wrapper attachment-preview__icon-wrapper--pdf">
            <span className="attachment-preview__icon">📄</span>
          </div>
          <div className="attachment-preview__info">
            <span className="attachment-preview__name" title={name}>{name}</span>
            <span className="attachment-preview__meta">PDF · {formatFileSize(size)}</span>
          </div>
          <button
            className="attachment-preview__toggle"
            title={pdfExpanded ? 'Collapse' : 'Expand preview'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {pdfExpanded
                ? <polyline points="18 15 12 9 6 15" />
                : <polyline points="6 9 12 15 18 9" />
              }
            </svg>
          </button>
        </div>
        {pdfExpanded && (
          <div className="attachment-preview__embed">
            <iframe
              src={dataUrl}
              title={name}
              className="attachment-preview__pdf-frame"
            />
          </div>
        )}
        <div className="attachment-preview__actions">
          <button className="attachment-preview__btn" onClick={handleDownload}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button className="attachment-preview__btn" onClick={() => window.open(dataUrl, '_blank')}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Open
          </button>
        </div>
      </div>
    );
  }

  // --- Image ---
  if (isImage && dataUrl) {
    return (
      <div className="attachment-preview attachment-preview--image">
        <img
          src={dataUrl}
          alt={name}
          className="attachment-preview__image"
          onClick={() => window.open(dataUrl, '_blank')}
        />
        <div className="attachment-preview__image-footer">
          <span className="attachment-preview__name" title={name}>{name}</span>
          <span className="attachment-preview__meta">{formatFileSize(size)}</span>
        </div>
      </div>
    );
  }

  // --- Generic file ---
  return (
    <div className="attachment-preview attachment-preview--file">
      <div className="attachment-preview__icon-wrapper">
        <span className="attachment-preview__icon">{getFileIcon(type, name)}</span>
      </div>
      <div className="attachment-preview__info">
        <span className="attachment-preview__name" title={name}>{name}</span>
        <span className="attachment-preview__meta">{formatFileSize(size)}</span>
      </div>
      {dataUrl && (
        <button className="attachment-preview__download-btn" onClick={handleDownload} title="Download">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      )}
    </div>
  );
}

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
          {message.text && <div className="message-bubble__text">{message.text}</div>}
          {message.attachment && (
            <AttachmentPreview attachment={message.attachment} />
          )}
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
