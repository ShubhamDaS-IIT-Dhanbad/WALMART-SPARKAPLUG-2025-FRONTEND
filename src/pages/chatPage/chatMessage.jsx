import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Cookies from "js-cookie";

import logo from "../../assets/bot-icon.png"; // Replace with your product logo if available
import bot_icon from "../../assets/bot-icon.png";
import user_icon from "../../assets/user-icon.png";
import useChatApi from "../../hooks/useChatApi.jsx";

const ChatMessages = ({
  theme,
  messages,
  isloading,
  setMessages,
  messagesEndRef,
  inputMessage,
  setInputMessage,
  handleSendSuggestion,
}) => {
  const inputRef = useRef(null);
  const { isLoading, error } = useChatApi();
  const [chatId, setChatId] = useState(() => {
    let id = Cookies.get("currentProductChatId");
    if (!id) {
      const now = new Date();
      id = `product-chat-${now.toISOString().replace(/[:.]/g, "-")}`;
      Cookies.set("currentProductChatId", id);
    }
    return id;
  });

  useEffect(() => {
    const allChats = JSON.parse(Cookies.get("productChatHistory") || "{}");
    const currentMessages = allChats[chatId]?.messages || [];
    setMessages(currentMessages);
  }, [chatId, setMessages]);

  const [loadingStage, setLoadingStage] = useState("loading");

  useEffect(() => {
    if (isloading) {
      const t1 = setTimeout(() => setLoadingStage("parsing"), 3000);
      const t2 = setTimeout(() => setLoadingStage("thinking"), 6500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setLoadingStage("loading");
    }
  }, [isloading]);

  const renderLoadingText = () => {
    switch (loadingStage) {
      case "loading":
        return <>Loading<span className="dots" /></>;
      case "parsing":
        return <>Parsing<span className="dots" /></>;
      case "thinking":
        return <>Thinking<span className="dots" /></>;
      default:
        return null;
    }
  };

  return (
    <section className={`chat-screen-${theme}`}>
      {messages?.length <= 0 ? (
        <div className={`chat-screen-init-${theme}`}>
          <img src={logo} alt="Product Chat Icon" className="orb" />
          <h1 className={`title-${theme}`}>Welcome to Product Assistant</h1>
          <p className={`chat-description-${theme}`}>
            Hi! I'm your Product Assistant. Ask me anything about this product — features, pricing, warranty, specifications, and more.
          </p>
        </div>
      ) : (
        <div className={`chat-messages-${theme}`}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ padding: "20px" }}>
              {msg.type !== "user" && (
                <div className={`bot-icon-div-${theme}`}>
                  <img src={bot_icon} alt="Bot icon" />
                  <p>ProductBot</p>
                </div>
              )}

              <div
                className={`chat-message-p-${theme} ${
                  msg.type === "user"
                    ? `user-chat-message-p-${theme}`
                    : `bot-chat-message-p-${theme}`
                }`}
              >
                <div
                  className={`chat-message-${theme} ${
                    msg.type === "user"
                      ? `user-message-${theme}`
                      : `bot-message-${theme}`
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={materialDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {(() => {
                      try {
                        const parsed = JSON.parse(msg.text);
                        return parsed.answer || msg.text;
                      } catch {
                        return msg.text;
                      }
                    })()}
                  </ReactMarkdown>
                </div>

                {msg.type === "user" && (
                  <div className={`user-icon-div-${theme}`}>
                    <img src={user_icon} alt="User icon" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {(isloading || isLoading) && (
            <div style={{ padding: "20px", marginTop: "30px" }}>
              <div className={`bot-icon-div-${theme}`}>
                <div className="bot-icon-loading">
                  <img src={bot_icon} alt="Bot icon" />
                </div>
                <div className={`chat-loader-${theme} chat-loader`}>
                  <div className="typing-animation">{renderLoadingText()}</div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </section>
  );
};

export default ChatMessages;
