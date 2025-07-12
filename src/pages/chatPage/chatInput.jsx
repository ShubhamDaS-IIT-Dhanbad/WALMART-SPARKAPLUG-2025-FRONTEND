import React from "react";
import { AiOutlineSend } from "react-icons/ai";
const ChatInput = ({
  theme,
  inputMessage,
  handleInputChange,
  handleKeyDown,
  handleSend,
  isLoading,
  inputRef,
  messagesEndRef,
  productTitle
}) => {
  return (
    <div className={`input-container-main-${theme}`}>
      <div className={inputMessage.trim() === "" ?`input-container-${theme}`:`input-container-focus-${theme}` }>
        <div style={{ position: "relative" }}>
          <textarea
            placeholder={`Ask me about product :-> ${productTitle.substring(0,200)}`}
            className={`chat-input-${theme}`}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            ref={inputRef}
            spellCheck={false}
            aria-label="Type your message"
            onFocus={() =>
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({
                  behavior: "smooth",
                });
              }, 100)
            }
          />
          <button
            onClick={handleSend}
            disabled={isLoading || inputMessage.trim() === ""}
            className={`message-send-${theme}`}
            aria-label="Send Message"
          >
            <AiOutlineSend />
          </button>
          <span className={`char-counter-${theme}`}>{inputMessage.length}/1500</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
