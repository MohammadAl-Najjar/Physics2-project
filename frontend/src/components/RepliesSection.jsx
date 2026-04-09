import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { usePage } from "../context/PageContext.jsx";
import { handleLogout } from "../handlers/authHandlers.js";
import "../css/post-view.css"; // Reuse styling
import { fetchAnswers, createAnswer } from "../handlers/answersHandlers.js";

export default function RepliesSection({ postId }) {
  const { userId, setSignInMode, refreshSession } = useAuth();
  const { setActivePage } = usePage();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadAnswers = async () => {
    try {
      const data = await fetchAnswers(postId);
      setAnswers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadAnswers();
    }
  }, [postId]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setSubmitting(true);
    try {
      await createAnswer(postId, newAnswer);
      setNewAnswer("");
      loadAnswers();
    } catch (err) {
      if (err.message === "Session expired") {
        alert("Session expired, please log in");
        await handleLogout(refreshSession);
        setSignInMode("login");
        setActivePage("home");
      } else {
        console.error(err);
        alert(err.message || "An error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgoFormatter = (dateString) => {
    const date = new Date(dateString + (dateString.includes("Z") ? "" : "Z"));
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.max(0, Math.floor(seconds)) + " seconds ago";
  };

  return (
    <section className="post-replies-container">
      <h3 className="post-replies-header">Replies ({answers.length})</h3>
      
      {userId ? (
        <form className="post-reply-form" onSubmit={handleAnswerSubmit}>
          <textarea
            className="post-reply-textarea"
            placeholder="Write your reply..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="post-reply-button"
            disabled={submitting || !newAnswer.trim()}
          >
            {submitting ? "Posting..." : "Post Reply"}
          </button>
        </form>
      ) : (
        <div className="reply-login-prompt">
          Please <button onClick={() => { setActivePage("home"); setSignInMode("login"); }}>log in</button> to join the discussion.
        </div>
      )}

      <div className="answers-list">
        {loading ? (
          <p className="no-answers">Loading replies...</p>
        ) : answers.length > 0 ? (
          answers.map((answer) => (
            <div key={answer.id} className="answer-item">
              <div className="answer-meta">
                <span className="answer-author">{answer.author}</span> &bull; {timeAgoFormatter(answer.created_at)}
              </div>
              <div className="answer-body">{answer.body}</div>
            </div>
          ))
        ) : (
          <p className="no-answers">No replies yet. Be the first to reply!</p>
        )}
      </div>
    </section>
  );
}
