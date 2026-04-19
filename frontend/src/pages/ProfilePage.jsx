import { useEffect, useState } from "react";
import "../css/home.css";
import "../css/profile.css";
import HomeSidebar from "../components/HomeSidebar.jsx";
import Post from "../components/Post.jsx";
import { usePage } from "../context/PageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchMyPosts } from "../handlers/postsHandlers.js";
import { fetchMyAnswers } from "../handlers/answersHandlers.js";

// Reusing timeAgoFormatter from HomePage
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

export default function ProfilePage() {
  const { setActivePage, setActivePostId } = usePage();
  const { userName, userId } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [postsPage, setPostsPage] = useState(1);
  const [answersPage, setAnswersPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setPostsPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [postsData, answersData] = await Promise.all([
          fetchMyPosts(),
          fetchMyAnswers()
        ]);
        setPosts(postsData);
        setAnswers(answersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  const totalPostsPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentPosts = filteredPosts.slice((postsPage - 1) * itemsPerPage, postsPage * itemsPerPage);

  const totalAnswersPages = Math.ceil(answers.length / itemsPerPage);
  const currentAnswers = answers.slice((answersPage - 1) * itemsPerPage, answersPage * itemsPerPage);

  // assuming answers don't easily have category unless we joined it, 
  // but if we did, we can filter them. Currently answers don't have category returned.
  // Actually, answers might not have category. We'll show all answers or filter if possible.

  return (
    <main className="profile-page home-page">
      <div className="home-feed profile-feed-container">
        <h2 className="profile-welcome">Welcome, {userName || "User"}</h2>

        <div className="profile-side-by-side">
          {/* POSTS COLUMN */}
          <div className="profile-column">
            <h3 className="profile-column-title">Your Posts</h3>
            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Loading your posts...</p>
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
                {totalPostsPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-btn" 
                      disabled={postsPage === 1}
                      onClick={() => setPostsPage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {postsPage} of {totalPostsPages}
                    </span>
                    <button 
                      className="pagination-btn" 
                      disabled={postsPage === totalPostsPages}
                      onClick={() => setPostsPage(prev => Math.min(prev + 1, totalPostsPages))}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>
                {selectedCategory ? "No posts in this category." : "You haven't made any posts yet."}
              </p>
            )}
          </div>

          {/* ANSWERS COLUMN */}
          <div className="profile-column">
            <h3 className="profile-column-title">Your Answers</h3>
            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Loading your answers...</p>
            ) : currentAnswers.length > 0 ? (
              <>
                {currentAnswers.map((answer) => (
                  <div key={answer.id} className="profile-answer-card answer-item">
                    <div className="answer-meta">
                      Answered {timeAgoFormatter(answer.created_at)}
                    </div>
                    <div className="answer-body">{answer.body}</div>
                    <button 
                      className="profile-view-post-btn"
                      onClick={() => {
                        setActivePostId(answer.post_id);
                        setActivePage("view_post");
                      }}
                    >
                      View Post &rarr;
                    </button>
                  </div>
                ))}
                {totalAnswersPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-btn" 
                      disabled={answersPage === 1}
                      onClick={() => setAnswersPage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {answersPage} of {totalAnswersPages}
                    </span>
                    <button 
                      className="pagination-btn" 
                      disabled={answersPage === totalAnswersPages}
                      onClick={() => setAnswersPage(prev => Math.min(prev + 1, totalAnswersPages))}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: "var(--text-muted)" }}>You haven't answered any posts yet.</p>
            )}
          </div>
        </div>

      </div>
      <HomeSidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </main>
  );
}
