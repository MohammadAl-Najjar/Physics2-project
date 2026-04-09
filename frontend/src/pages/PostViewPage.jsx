import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext.jsx";
import RepliesSection from "../components/RepliesSection.jsx";
import "../css/post-view.css";
import { fetchPostById } from "../handlers/postsHandlers.js";

export default function PostViewPage() {
  const { activePostId, setActivePage, setActivePostId } = usePage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activePostId) {
      setActivePage("home");
      return;
    }

    const loadPost = async () => {
      try {
        const data = await fetchPostById(activePostId);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [activePostId, setActivePage]);

  const handleBack = () => {
    setActivePostId(null);
    setActivePage("home");
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
    <main className="post-view-page">
      <div className="post-view-container">
        <button className="post-view-back" onClick={handleBack}>
          &larr; Back to Home
        </button>

        {loading ? (
          <p style={{ color: "#a0a0a0", marginTop: "20px" }}>Loading post...</p>
        ) : !post ? (
          <p style={{ color: "#ff6565", marginTop: "20px" }}>Post not found.</p>
        ) : (
          <article className="post-view-content">
            <div className="post-view-category">{post.category?.toUpperCase()}</div>
            <h1 className="post-view-title">{post.title}</h1>
            <div className="post-view-meta">
              by <span className="post-view-author">{post.author || "Unknown"}</span> &bull; {timeAgoFormatter(post.created_at)}
            </div>
            
            {post.body && <p className="post-view-body">{post.body}</p>}

            {post.image_url && (
              <div className="post-view-image-container">
                <img src={post.image_url} alt="Post Attachment" className="post-view-image" />
              </div>
            )}

            <RepliesSection postId={activePostId} />
          </article>
        )}
      </div>
    </main>
  );
}
