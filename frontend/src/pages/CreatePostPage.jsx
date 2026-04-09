import { useState } from "react";
import { usePage } from "../context/PageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { handleLogout } from "../handlers/authHandlers.js";
import "../css/post-view.css";
import "../css/create-post.css";
import { createPost } from "../handlers/postsHandlers.js";

export default function CreatePostPage() {
  const { setActivePage } = usePage();
  const { refreshSession, setSignInMode } = useAuth();
  const [error, setError] = useState(null);

  const categories = [
    "Classical Mechanics",
    "Thermodynamics",
    "Electromagnetism",
    "Quantum Mechanics",
    "Optics"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.target);
    
    try {
      await createPost(formData);
      setActivePage("home");
    } catch (err) {
      if (err.message === "Session expired") {
        alert("Session expired, please log in");
        await handleLogout(refreshSession);
        setSignInMode("login");
        setActivePage("home");
      } else {
        setError(err.message || "Network error. Please try again.");
      }
    }
  };

  return (
    <main className="post-view-page">
      <div className="post-view-container">
        <button className="post-view-back" onClick={() => setActivePage("home")}>
          &larr; Back to Home
        </button>

        <article className="post-view-content">
          <h1 className="post-view-title" style={{ marginBottom: "40px" }}>Post a Question</h1>
          
          {error && <p className="create-post-error">{error}</p>}
          
          <form className="create-post-form" onSubmit={handleSubmit}>
            <div className="create-post-field">
              <label className="create-post-label" htmlFor="post-title">Title</label>
              <input className="create-post-input" id="post-title" type="text" name="title" required placeholder="What is your question?" />
            </div>

            <div className="create-post-field">
              <label className="create-post-label" htmlFor="post-category">Category</label>
              <select className="create-post-input" id="post-category" name="category" required>
                <option value="">Select a category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="create-post-field">
              <label className="create-post-label" htmlFor="post-body">Details</label>
              <textarea className="create-post-input create-post-textarea" id="post-body" name="body" required rows="8" placeholder="Provide more details to help others understand..."></textarea>
            </div>

            <div className="create-post-field">
              <label className="create-post-label" htmlFor="post-image">Upload Image (optional)</label>
              <input className="create-post-file" id="post-image" type="file" name="image" accept="image/*" />
            </div>

            <div className="create-post-actions">
              <button type="submit" className="create-post-submit">Post Question</button>
              <button type="button" className="create-post-cancel" onClick={() => setActivePage("home")}>Cancel</button>
            </div>
          </form>
        </article>
      </div>
    </main>
  );
}
