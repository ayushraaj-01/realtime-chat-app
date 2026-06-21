import { useState, useRef, useEffect } from 'react';

const EMOJIS = ['😀', '😂', '👍', '❤️', '🔥', '🎉', '😮', '😢', '👏', '🚀', '🤔', '👀', '✨', '💯'];

export default function MessageInput({ onSend, onTyping, disabled }) {
  const [text, setText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  
  // Save current selection indexes in state to prevent selection loss on blur
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiTriggerRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  // Handle clicking outside emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showEmojis && emojiTriggerRef.current && !emojiTriggerRef.current.contains(e.target)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojis]);

  const updateSelection = () => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      });
    }
  };

  const handleSubmit = async () => {
    if ((!text.trim() && !attachedFile) || disabled) return;

    let attachment = null;
    if (attachedFile) {
      attachment = await readFileAsDataURL(attachedFile);
    }

    onSend(text, attachment);
    setText('');
    setAttachedFile(null);
    setSelection({ start: 0, end: 0 });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Read file as base64 data URL
  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: reader.result,
        });
      };
      reader.onerror = () => {
        resolve({ name: file.name, type: file.type, size: file.size, dataUrl: null });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();
    // Update selection state after content change
    setTimeout(updateSelection, 0);
  };

  // formatting helper using saved selection state
  const applyFormatting = (prefix, suffix) => {
    if (disabled) return;
    
    const start = selection.start;
    const end = selection.end;
    const selectedText = text.substring(start, end);
    
    const replacement = prefix + selectedText + suffix;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    
    setText(newText);
    
    // Focus back and highlight or position cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setSelection({ start: newCursorPos, end: newCursorPos });
      }
    }, 10);
  };

  const handleBold = () => applyFormatting('**', '**');
  const handleItalic = () => applyFormatting('*', '*');
  const handleStrike = () => applyFormatting('~~', '~~');
  const handleLink = () => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = text.substring(start, end);
    if (selectedText) {
      applyFormatting('[', '](url)');
    } else {
      applyFormatting('[link', '](url)');
    }
  };
  
  const handleCode = () => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = text.substring(start, end);
    const isMultiline = selectedText.includes('\n');
    if (isMultiline) {
      applyFormatting('```\n', '\n```');
    } else {
      applyFormatting('`', '`');
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji) => {
    if (disabled) return;
    
    const start = selection.start;
    const end = selection.end;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    
    setText(newText);
    setShowEmojis(false);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + emoji.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setSelection({ start: newCursorPos, end: newCursorPos });
      }
    }, 10);
  };

  return (
    <div className="message-input" id="message-input">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="attachment-input"
      />

      <div className="message-input__wrapper">
        {/* Formatting Toolbar */}
        <div className="message-input__toolbar">
          <button type="button" className="message-input__tool-btn" onClick={handleBold} title="Bold">B</button>
          <button type="button" className="message-input__tool-btn" onClick={handleItalic} style={{ fontStyle: 'italic' }} title="Italic">I</button>
          <button type="button" className="message-input__tool-btn" onClick={handleStrike} style={{ textDecoration: 'line-through' }} title="Strikethrough">S</button>
          <span style={{ width: '1px', height: '14px', background: 'var(--color-border)', margin: '0 4px' }} />
          <button type="button" className="message-input__tool-btn" onClick={handleLink} title="Link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>
          <button type="button" className="message-input__tool-btn" onClick={handleCode} title="Code Block">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </button>
          <span style={{ width: '1px', height: '14px', background: 'var(--color-border)', margin: '0 4px' }} />
          <button type="button" className="message-input__tool-btn" onClick={handleAttachClick} title="Add Attachment">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <div style={{ position: 'relative', display: 'inline-block' }} ref={emojiTriggerRef}>
            <button
              type="button"
              className="message-input__tool-btn"
              onClick={() => setShowEmojis(!showEmojis)}
              title="Emoji"
            >
              😀
            </button>
            {showEmojis && (
              <div className="message-input__emoji-picker">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="message-input__emoji-item"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attachment Badge */}
        {attachedFile && (
          <div className="message-input__attachment-badge">
            <span className="message-input__attachment-icon">📎</span>
            <span className="message-input__attachment-name" title={attachedFile.name}>
              {attachedFile.name}
            </span>
            <button
              type="button"
              className="message-input__attachment-remove"
              onClick={removeAttachment}
              title="Remove attachment"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input box */}
        <div className="message-input__box">
          <textarea
            ref={textareaRef}
            className="message-input__field"
            placeholder={disabled ? 'Reconnecting...' : 'Type a message...'}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={updateSelection}
            onKeyUp={updateSelection}
            onClick={updateSelection}
            disabled={disabled}
            rows={1}
            id="message-input-field"
          />
          <button
            className={`message-input__send ${(text.trim() || attachedFile) ? 'message-input__send--active' : ''}`}
            onClick={handleSubmit}
            disabled={(!text.trim() && !attachedFile) || disabled}
            id="send-button"
            aria-label="Send message"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="message-input__hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for new line
      </div>
    </div>
  );
}
