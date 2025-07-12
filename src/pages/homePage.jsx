// Home.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/appwrite_config.js";
import Cookies from "js-cookie";

import NavBar from "../components/Navbar.jsx";
import walmartLogo from "../assets/wl.png";
import TypeAnimation from "../utils/typeAnimation.jsx";

import "../styles/homePageLight.css";
import "../styles/homePageDark.css";

import {
  FaLinkedin,
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState(0);
  const timerRef = useRef(null);

  const handleTap = () => {
    if (tapCount === 0) {
      timerRef.current = setTimeout(() => {
        setTapCount(0);
      }, 7000);
    }

    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 10) {
      clearTimeout(timerRef.current);
      const email = prompt("Enter your email:");
      if (email) {
        Cookies.set("anoId", email, { expires: 7 });
        alert(`Email stored: ${email}`);
      }
      setTapCount(0);
    }
  };

  const sequence = [
    "Walmart Review Analyzer 🛒",
    "Track Sentiment Over Time 📈",
    "Analyze Customer Opinions 📊",
    "Positive vs Negative Reviews 🔍",
    "Built with AI & LLMs 🚀",
    "Walmart Review Analyzer 🛒",
    "Track Sentiment Over Time 📈",
    "Analyze Customer Opinions 📊",
    "Positive vs Negative Reviews 🔍",
    "Built with AI & LLMs 🚀",
  ];

  const [userName, setUserName] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [themes, setThemes] = useState(theme);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
    setThemes(theme);
  }, [theme]);

  useEffect(() => {
    account
      .get()
      .then((res) => {
        Cookies.set("userId", res.$id, { expires: 7 });
        Cookies.set("userName", res.name, { expires: 7 });
        Cookies.set("userEmail", res.email, { expires: 7 });
        setUserName(res.name);
        console.log("Logged in user data stored in cookies");
      })
      .catch(() => {
        setUserName(null);
        console.log("User not logged in");
      });
  }, []);

  const handleLoginClick = () => {
    const rootUrl = window.location.origin;
    account.createOAuth2Session("google", rootUrl, `${rootUrl}/chat`);
  };

  const handleLogoutClick = () => {
    account
      .deleteSession("current")
      .then(() => {
        Cookies.remove("userId");
        Cookies.remove("userName");
        Cookies.remove("userEmail");
        setUserName(null);
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  const handleChatClick = () => navigate("/link");

  const handleFacebookClick = () => window.open("https://www.facebook.com/walmart", "_blank");
  const handleLinkedInClick = () => window.open("https://www.linkedin.com/company/walmart/", "_blank");
  const handleInstaClick = () => window.open("https://www.instagram.com/walmart/", "_blank");
  const handleTwitterClick = () => window.open("https://twitter.com/Walmart", "_blank");

  return (
    <>
      <NavBar theme={themes} />
      <div className={`home-${theme}`}>
        <div className={`home-left-${theme}`}>
          <div className={`home-left-1-${theme}`}>
            Hi, it's <p>Walmart Buddy</p>
          </div>

          <div className={`home-left-2-${theme}`}>
            <div className={`home-left-2-title-${theme}`}>
              <TypeAnimation sequence={sequence} wrapper="div" repeat={Infinity} />
            </div>
          </div>

          <p className={`home-left-3-1-${theme}`}>Welcome! 👋</p>
          <p className={`home-left-3-${theme}`}>
            This tool helps you analyze Walmart product reviews using advanced NLP techniques.
            Track how positive and negative sentiments evolve over time. Compare product performance
            based on customer feedback, and make smarter shopping decisions!
          </p>
          <p className={`home-left-3-2-${theme}`}>Start exploring the insights! 🔎</p>

          <div className={`home-left-4-${theme}`}>
            <FaLinkedin className={`footer-icons-div-${theme}`} onClick={handleLinkedInClick} />
            <FaFacebookSquare className={`footer-icons-div-${theme}`} onClick={handleFacebookClick} />
            <FaInstagramSquare className={`footer-icons-div-${theme}`} onClick={handleInstaClick} />
            <FaTwitterSquare className={`footer-icons-div-${theme}`} onClick={handleTwitterClick} />
          </div>


          <div className={`home-left-5-${theme}`}>
            <div className={`home-left-5-1-${theme}`} onClick={handleChatClick}>
              ANALYZE PRODUCT
            </div>

            
          </div>

          <div className={`home-left-br-${theme}`}>
            <div
              className={`theme-toggle-light-${theme} ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            ></div>
            <div
              className={`theme-toggle-dark-${theme} ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            ></div>
          </div>
        </div>

        <div className={`home-right-${theme}`} onClick={handleTap}>
          <img alt="Walmart Logo" src={walmartLogo}/>
        </div>
      </div>
    </>
  );
}

export default Home;
