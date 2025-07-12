import React from "react";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import {
  RiHome3Line,
  RiDeleteBackLine,
} from "react-icons/ri";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const Header = ({
  theme,
  startNewChat,
  deleteChatSession,
  loadChat,
  currentChatId,
  setCurrentChatId,
  chatHistory,
  messages,
}) => {
  const navigate = useNavigate();
  const hasMessages = Array.isArray(messages) && messages.length > 0;

  return (
    <header className={`chat-top-bar-${theme}`}>
    
   
      {/* ─────────────────────────────────────────────────────
           RIGHT COLUMN: Version / CLEAR CHAT / NEW CHAT
      ───────────────────────────────────────────────────── */}
      <div className={`chat-top-right-div-${theme}`}>

        {Object.keys(chatHistory).length !== 0 && 
        (
          <div className={`pc-recent-chats-${theme}`}>
            {Object.keys(chatHistory).map((date, index) => (
              <div
                key={date}
                className={`pc-history-row-${theme} ${
                  currentChatId === date ? `pc-selected-chat-${theme}` : ""
                }`}onClick={() => {
                    console.log("lp")
                    loadChat(date);
                    setCurrentChatId(date);
                  }}
              >
                
              </div>
            ))}
          </div>
        )}



        {hasMessages && (
          <button
            className={`delete-session-button-${theme}`}
            onClick={() => {
              deleteChatSession(currentChatId);
              setCurrentChatId(null);
            }}
            title="Clear current chat"
            aria-label={`Clear chat session ${currentChatId}`}
          >
            CLEAR CHAT
          </button>
        )}

      </div>
    </header>
  );
};

export default Header;
