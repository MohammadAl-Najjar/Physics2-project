import { useState } from "react";
import "../css/auth.css";
import { useAuth } from "../context/AuthContext.jsx";
import { handleLoginSubmit, handleRegisterSubmit } from "../handlers/authHandlers.js";

export default function Auth() {
  const { signInMode, setSignInMode, refreshSession } = useAuth();
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);

  return (
    <main className="auth-page">
      <section className="auth-card">
        {signInMode === "login" ? (
          <>
            <h2 className="auth-title">Login</h2>
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={(e) => handleLoginSubmit(e, setError, refreshSession)}>
              <label className="auth-label" htmlFor="login-email">
                Email
              </label>
              <input className="auth-input" id="login-email" type="email" name="email" required />

              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <input className="auth-input" id="login-password" type="password" name="password" required minLength="8" />

              <button type="submit" className="auth-submit-button">
                Login
              </button>
            </form>

            <p className="auth-switch-text">
              Don't have an account?
              <button type="button" className="auth-switch-button" onClick={() => setSignInMode("signin")}>
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="auth-title">Sign up</h2>
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={(e) => handleRegisterSubmit(e, setError, refreshSession)}>
              <label className="auth-label" htmlFor="signin-name">
                Name
              </label>
              <input className="auth-input" id="signin-name" type="text" name="name" required />

              <label className="auth-label" htmlFor="signin-email">
                Email
              </label>
              <input className="auth-input" id="signin-email" type="email" name="email" required />

              <label className="auth-label" htmlFor="signin-password">
                Password
              </label>
              <input className="auth-input" id="signin-password" type="password" name="password" required />

              <label className="auth-label" htmlFor="signin-role">
                Role
              </label>
              <select
                className="auth-input"
                id="signin-role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>

              {role === "instructor" ? (
                <>
                  <label className="auth-label" htmlFor="instructor-code">
                    Code
                  </label>
                  <input className="auth-input" id="instructor-code" type="text" name="code" required />
                </>
              ) : null}

              <button type="submit" className="auth-submit-button">
                Sign in
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?
              <button type="button" className="auth-switch-button" onClick={() => setSignInMode("login")}>
                Login
              </button>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
