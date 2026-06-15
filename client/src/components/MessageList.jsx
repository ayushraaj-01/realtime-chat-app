import { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, username }) {
  const listRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = (smooth = true) => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant',
      });
    }
  };

  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom();
    } else {
      setShowScrollBtn(true);
    }
  }, [messages]);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isNearBottomRef.current = nearBottom;
    if (nearBottom) {
      setShowScrollBtn(false);
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  if (messages.length === 0) {
    return (
      <div className="chat-empty">
        <div className="chat-empty__icon-wrapper">
          <span className="chat-empty__icon">💬</span>
          <div className="chat-empty__pulse" />
        </div>
        <h3 className="chat-empty__title">Welcome to the conversation</h3>
        <p className="chat-empty__desc">Send a message to get things started!</p>
        <div className="chat-empty__hints">
          <span className="chat-empty__hint">💡 Type a message below</span>
          <span className="chat-empty__hint">🔗 Share the link to invite friends</span>
          <span className="chat-empty__hint">🔄 Messages sync in real-time</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div
        className="message-list"
        ref={listRef}
        onScroll={handleScroll}
        id="message-list"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.username === username}
          />
        ))}
      </div>

      {showScrollBtn && (
        <button
          className="message-list__scroll-btn"
          onClick={() => scrollToBottom()}
          id="scroll-to-bottom"
          aria-label="Scroll to latest messages"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  );
}
