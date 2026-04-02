import "../css/header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from "../context/AuthContext.jsx"

export default function Header() {
  const { userId, loading, refreshSession, setSignInMode } = useAuth();

  async function handleLogout() {
    await fetch("/api/auth/logout", { credentials: "include" });
    await refreshSession();
  }

  return (
    <header className="header">
      <h1 className="header-title">Physics Forums</h1>
      <button type="button" className="header-home-button">
        Home
      </button>
      <div className="header-right-buttons">
        {!loading && !userId ? (
          <>
            <button type="button" className="header-login-button" onClick={() => setSignInMode("login")}>
              Login
            </button>
            <button type="button" className="header-signin-button" onClick={() => setSignInMode("signin")}>
              Sign in
            </button>
          </>
        ) : null}
        {!loading && userId ? (
          <button type="button" className="header-logout-button" onClick={handleLogout} aria-label="Log out">
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="header-logout" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
