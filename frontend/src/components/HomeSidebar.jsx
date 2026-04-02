import "../css/home-sidebar.css";
import { usePage } from "../context/PageContext.jsx";

export default function HomeSidebar() {
  const { setActivePage } = usePage();
  const placeholders = [
    "Classical Mechanics",
    "Thermodynamics",
    "Electromagnetism",
    "Quantum Mechanics",
    "Optics"
  ];

  return (
    <aside className="home-sidebar">
      <button className="ask-question-btn" onClick={() => setActivePage("create_post")}>
        Make a question
      </button>
      
      <div className="categories-box">
        <h3 className="categories-title">Filter by Category</h3>
        <div className="categories-list">
          {placeholders.map((cat, idx) => (
            <div key={idx} className="category-row">
              {cat}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
