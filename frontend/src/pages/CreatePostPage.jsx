import { useState } from "react";
import { usePage } from "../context/PageContext.jsx";
import "../css/create-post.css";

export default function CreatePostPage() {
  const { setActivePage } = usePage();
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
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || data.error || "Failed to create post");
        return;
      }
      
      setActivePage("home");
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <main className="create-post-page">
      <div className="create-post-card">
        <h2 className="create-post-title">Make a Question</h2>
        {error && <p className="create-post-error">{error}</p>}
        
        <form className="create-post-form" onSubmit={handleSubmit}>
          <label className="create-post-label" htmlFor="post-title">Title</label>
          <input className="create-post-input" id="post-title" type="text" name="title" required placeholder="What is your question?" />

          <label className="create-post-label" htmlFor="post-category">Category</label>
          <select className="create-post-input" id="post-category" name="category" required>
            <option value="">Select a category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <label className="create-post-label" htmlFor="post-body">Details</label>
          <textarea className="create-post-input create-post-textarea" id="post-body" name="body" required rows="6" placeholder="Provide more details to help others understand..."></textarea>

          <label className="create-post-label" htmlFor="post-image">Upload Image (optional)</label>
          <input className="create-post-file" id="post-image" type="file" name="image" accept="image/*" />

          <div className="create-post-actions">
            <button type="button" className="create-post-cancel" onClick={() => setActivePage("home")}>Cancel</button>
            <button type="submit" className="create-post-submit">Post Question</button>
          </div>
        </form>
      </div>
    </main>
  );
}
