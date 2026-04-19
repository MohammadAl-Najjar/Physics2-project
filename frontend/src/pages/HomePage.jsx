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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

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

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <main className="home-page">
      <Hero />
      <div className="home-feed">
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading posts...</p>
        ) : currentPosts.length > 0 ? (
          <>
            {currentPosts.map((post) => (
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
            ))}
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
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
