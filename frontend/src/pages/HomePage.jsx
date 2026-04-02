import { useEffect, useState } from "react";
import "../css/home.css";
import Hero from "../components/Hero.jsx";
import HomeSidebar from "../components/HomeSidebar.jsx";
import Post from "../components/Post.jsx";
import { usePage } from "../context/PageContext.jsx";

export default function HomePage() {
  const { setActivePage, setActivePostId } = usePage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const timeAgoFormatter = (dateString) => {
    const date = new Date(dateString + "Z");
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
    <main className="home-page">
      <Hero />
      <div className="home-feed">
        {loading ? (
          <p style={{ color: "#a0a0a0" }}>Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Post 
              key={post.id}
              category={post.category} 
              body={post.title} 
              author={post.author || "Unknown"} 
              timeAgo={timeAgoFormatter(post.created_at)} 
              onClick={() => {
                setActivePostId(post.id);
                setActivePage("view_post");
              }}
            />
          ))
        ) : (
          <p style={{ color: "#a0a0a0" }}>No posts yet. Be the first to ask!</p>
        )}
      </div>
      <HomeSidebar />
    </main>
  );
}
