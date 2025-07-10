import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import useChatApi from "../../hooks/useChatApi.jsx";
import Sidebar from "./chatPageSidebar.jsx";

import { useParams } from "react-router-dom"; // make sure you have this

import Header from "./chatPageHeader.jsx";
import ChatMessages from "./chatMessage.jsx";
import ChatInput from "./chatInput.jsx";

import "../../styles/chatPageLight/chatPage.css";
import "../../styles/chatPageLight/chatPageHeader.css";
import "../../styles/chatPageLight/chatPageSidebar.css";
import "../../styles/chatPageLight/chatMessage.css";
import "../../styles/chatPageLight/chatInput.css";

import "../../styles/chatPageDark/chatPageDark.css";
import "../../styles/chatPageDark/chatPageHeaderDark.css";
import "../../styles/chatPageDark/chatPageSidebarDark.css";
import "../../styles/chatPageDark/chatMessageDark.css";
import "../../styles/chatPageDark/chatInputDark.css";

const ChatPage = () => {
// Inside your component:
const { productId } = useParams(); // extract product ID from URL
console.log(productId)
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const { sendMessage, isLoading, error } = useChatApi();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getToday = () => new Date().toISOString().split("T")[0];

  // Save messages and followUpQuestions for the current chatId into cookies and update chatHistory state
  const saveChatSessionToCookie = (msgs, followUps = []) => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    const chatId = currentChatId || getToday();

    allChats[chatId] = {
      messages: msgs,
      followUpQuestions: followUps,
    };

    Cookies.set("chatHistory", JSON.stringify(allChats), { expires: 7 });
    setChatHistory(allChats);
  };

  // Load today's chat data (messages and followUps) when component first mounts
  const loadMessagesFromCookie = () => {
    const date = getToday();
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    setChatHistory(allChats);
    setCurrentChatId(date);

    const chatData = allChats[date] || { messages: [], followUpQuestions: [] };
    setFollowUpQuestions(chatData.followUpQuestions || []);
    return chatData.messages;
  };

  // Load messages and followUps for a given chatId from cookies (but do NOT set currentChatId here)
  const loadChat = (chatId) => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    const chatData = allChats[chatId] || { messages: [], followUpQuestions: [] };

    setMessages(chatData.messages);
    setFollowUpQuestions(chatData.followUpQuestions || []);
  };

  // Create a fresh session key and clear messages, saving the old session first
  const startNewChat = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sessionKey = `session-${timestamp}`;
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");

    if (messages.length > 0 && currentChatId) {
      allChats[currentChatId] = {
        messages,
        followUpQuestions,
      };
    }

    Cookies.set("chatHistory", JSON.stringify(allChats), { expires: 7 });
    setChatHistory(allChats);
    setMessages([]);
    setFollowUpQuestions([]);
    setCurrentChatId(sessionKey);
  };

  // Delete a session from cookies and update state
  const deleteChatSession = (chatId) => {
    const allChats = JSON.parse(Cookies.get("chatHistory") || "{}");
    if (allChats[chatId]) {
      delete allChats[chatId];
      Cookies.set("chatHistory", JSON.stringify(allChats), { expires: 7 });
      setChatHistory(allChats);

      if (chatId === currentChatId) {
        setMessages([]);
        setFollowUpQuestions([]);
        setCurrentChatId(null);
      }
    }
  };

  // On initial mount: load today's messages and theme from localStorage
  useEffect(() => {
    const savedMessages = loadMessagesFromCookie();
    setMessages(savedMessages);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  // Whenever messages or loading state changes, scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Whenever currentChatId changes, load its messages and followUpQuestions
  useEffect(() => {
    if (currentChatId) {
      loadChat(currentChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId]);

  // Handle input text change
  const handleInputChange = (e) => setInputMessage(e.target.value);

  // Send a message to the API, append to messages, then save to cookie
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    const newMessages = [...messages, { type: "user", text: userMessage }];

    setMessages(newMessages);
    setInputMessage("");

    // Refocus the input after a short delay
    setTimeout(() => inputRef.current?.focus(), 50);
    console.log("herere",productId)
    const botResponse = await sendMessage({
      query: userMessage,
      product_id: productId,
    });
    console.log(botResponse)
    if (!botResponse) {
      const errorMessages = [...newMessages, { type: "bot", text: `Error: ${error}` }];
      setMessages(errorMessages);
      saveChatSessionToCookie(errorMessages, []);
      return;
    }

    // Destructure answer and followUpQuestions from your response
    const {response} = botResponse;

    // Add bot answer message with followUpQuestions included
    const finalMessages = [...newMessages, { type: "bot", text: response }];

    setMessages(finalMessages);
  };

  const handleSendSuggestion = async (suggestion) => {
    if (!suggestion.trim()) return;

    const userMessage = suggestion.trim();
    const newMessages = [...messages, { type: "user", text: userMessage }];
    setMessages(newMessages);
    setInputMessage("");

    // Refocus the input after a short delay
    setTimeout(() => inputRef.current?.focus(), 50);

    const botResponse = await sendMessage(userMessage);
    console.log(botResponse)
    if (!botResponse) {
      const errorMessages = [...newMessages, { type: "bot", text: `Error: ${error}` }];
      setMessages(errorMessages);
      saveChatSessionToCookie(errorMessages, []);
      return;
    }

    // Destructure answer and followUpQuestions from your response
    const { answer, follow_up_question} = botResponse;

    // Add bot answer message with followUpQuestions included
    const finalMessages = [...newMessages, { type: "bot", text: answer, follow_up_question }];

    setMessages(finalMessages);
    setFollowUpQuestions(follow_up_question|| []);
    saveChatSessionToCookie(finalMessages, follow_up_question || []);
  };

  // Pressing Enter in the input sends the message (if not already loading)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Escape HTML in messages to prevent injection
  const escapeHtml = (unsafe) => {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  return (
    <div className={`chat-container-main-${theme}`}>
      
      <main className={`chat-container-${theme}`}>
        <div className={`chat-main-div-${theme}`}>
          <Header
            theme={theme}
            startNewChat={startNewChat}
            messages={messages}
            chatHistory={chatHistory}
            loadChat={(id) => {
              setCurrentChatId(id);
            }}
            deleteChatSession={deleteChatSession}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />

          <ChatMessages
            theme={theme}
            handleSendSuggestion={handleSendSuggestion}
            setInputMessage={setInputMessage}
            inputMessage={inputMessage}
            messages={messages}
            isloading={isLoading}
            messagesEndRef={messagesEndRef}
            escapeHtml={escapeHtml}
            setMessages={setMessages}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />

          <ChatInput
            theme={theme}
            inputMessage={inputMessage}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            handleSend={handleSend}
            isLoading={isLoading}
            inputRef={inputRef}
            messagesEndRef={messagesEndRef}
            setMessages={setMessages}
            currentChatId={currentChatId}
            setCurrentChatId={setCurrentChatId}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
