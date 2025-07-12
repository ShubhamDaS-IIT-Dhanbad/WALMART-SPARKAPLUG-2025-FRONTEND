import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import "../styles/navbarLight.css";
import "../styles/navbarDark.css";

const NavBar = ({theme}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  // Update body class for global styling (optional)
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

 
  return (
    <>
      <div className={`navbar-block-${theme}`}></div>
      <div className={`navbar navbar-${theme}`}>
        <div className={`navbar-left navbar-left-${theme}`}>
          <div className={`navbar-left-name navbar-left-name-${theme}`} style={{ display: "flex", gap: "7px" }}>
            WALMART <p>PODUCT ANALYZER</p>
          </div>
        </div>

        

      </div>

      
    </>
  );
};

export default NavBar;
