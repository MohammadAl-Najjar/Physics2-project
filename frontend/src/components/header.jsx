import "../css/header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faSun, faMoon, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "../context/AuthContext.jsx"
import { useTheme } from "../context/ThemeContext.jsx"
import { usePage } from "../context/PageContext.jsx"
import { useState, useRef, useEffect } from "react";
import { handleLogout } from "../handlers/authHandlers.js"

export default function Header() {
  const { userId, loading, refreshSession, setSignInMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setActivePage, setActivePostId } = usePage();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);

  const onLogout = () => handleLogout(refreshSession);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = (page) => {
    setActivePostId(null);
    setActivePage(page);
    setIsNavOpen(false);
  };

  return (
    <header className="header" ref={navRef}>
      <div className="header-left">
        <button 
          className="header-menu-toggle" 
          onClick={() => setIsNavOpen(!isNavOpen)} 
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={isNavOpen ? faXmark : faBars} />
        </button>
        
        <h1
          className="header-title"
          style={{ cursor: "pointer" }}
          onClick={() => navigateTo("home")}
        >
          PSUT PhysSpace
        </h1>

        <nav className={`header-nav ${isNavOpen ? "header-nav-open" : ""}`}>
          <button
            type="button"
            className="header-home-button"
            onClick={() => navigateTo("home")}
          >
            Home
          </button>

          {!loading && userId && (
            <button
              type="button"
              className="header-home-button"
              onClick={() => navigateTo("profile")}
            >
              Profile
            </button>
          )}
        </nav>
      </div>

      <div className="header-right-buttons">
        {!loading && !userId ? (
          <>
            <button type="button" className="header-login-button" onClick={() => setSignInMode("login")}>
              Login
            </button>
            <button type="button" className="header-signin-button" onClick={() => setSignInMode("signin")}>
              Sign up
            </button>
          </>
        ) : null}
        {!loading && userId ? (
          <>
            <button type="button" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              <FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} />
            </button>
            <button type="button" className="header-logout-button" onClick={onLogout} aria-label="Log out">
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="header-logout" />
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
