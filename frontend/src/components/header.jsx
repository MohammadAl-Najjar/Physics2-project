import "../css/header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "../context/AuthContext.jsx"
import { useTheme } from "../context/ThemeContext.jsx"
import { usePage } from "../context/PageContext.jsx"
import { handleLogout } from "../handlers/authHandlers.js"

export default function Header() {
  const { userId, loading, refreshSession, setSignInMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { setActivePage, setActivePostId } = usePage();

  const onLogout = () => handleLogout(refreshSession);

  return (
    <header className="header">
      <h1
        className="header-title"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setActivePostId(null);
          setActivePage("home");
        }}
      >
        PSUT PhysSpace
      </h1>
      <button
        type="button"
        className="header-home-button"
        onClick={() => {
          setActivePostId(null);
          setActivePage("home");
        }}
      >
        Home
      </button>
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
