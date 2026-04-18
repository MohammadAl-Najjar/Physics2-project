import { useEffect, useState } from "react";
import "../css/home.css";
import Hero from "../components/Hero.jsx";
import HomeSidebar from "../components/HomeSidebar.jsx";
import Post from "../components/Post.jsx";
import { usePage } from "../context/PageContext.jsx";
import { fetchPosts } from "../handlers/postsHandlers.js";

export default function HomePage() {
  const { setActivePage, setActivePostId } = usePage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const timeAgoFormatter = (dateString) => {
    const date = new Date(dateString);
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

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  return (
    <main className="home-page">
      <Hero />
      <div className="home-feed">
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading posts...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              category={post.category}
              body={post.title}
              author={post.author || "Unknown"}
              timeAgo={timeAgoFormatter(post.created_at)}
              answersCount={post.answers_count}
              onClick={() => {
                setActivePostId(post.id);
                setActivePage("view_post");
              }}
            />
          ))
        ) : (
          <p style={{ color: "var(--text-muted)" }}>
            {selectedCategory ? "No posts in this category." : "No posts yet. Be the first to ask!"}
          </p>
        )}
      </div>
      <HomeSidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </main>
  );
}
