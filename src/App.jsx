import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Index from './pages/homePage.jsx';
import ChatPage from './pages/chatPage/chatPage.jsx';
import SingleProductPage from './pages/singleProductPage.jsx';
import CompareProductPage from './pages/compareProductPage.jsx';
import LinkMainPage from './pages/linkMain.jsx';

import walmartLogo from "./assets/wl.png";
import PrivateRoute from './secure/privateRoute.jsx';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (you can replace this with actual API or auth check)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img
          src={walmartLogo}
          alt="Loading..."
          className="w-32 h-32 animate-fadeInOut"
        />
        <style>
          {`
            @keyframes fadeInOut {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
            .animate-fadeInOut {
              animation: fadeInOut 2s infinite;
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/link" element={<LinkMainPage />} />
          <Route path="/single/product/:productId" element={<SingleProductPage />} />
          {/* <Route path="/compare" element={<CompareProductPage />} /> */}

          {/* User Routes */}
          <Route path="/chat/:productId" element={<ChatPage />} />
          <Route path="/compare/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
