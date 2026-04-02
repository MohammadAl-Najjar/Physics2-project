import "../css/post.css";

export default function Post({ category, body, author, timeAgo, onClick }) {
  return (
    <article className={`post-card ${onClick ? "post-clickable" : ""}`} onClick={onClick}>
      <div className="post-category">{category?.toUpperCase()}</div>
      <h2 className="post-body">{body}</h2>
      <div className="post-meta">
        by <span className="post-author">{author}</span> &bull; {timeAgo}
      </div>
    </article>
  );
}
