import "../css/home-sidebar.css";
import { usePage } from "../context/PageContext.jsx";

export default function HomeSidebar({ selectedCategory, onSelectCategory }) {
  const { setActivePage } = usePage();
  const categories = [
    "Classical Mechanics",
    "Thermodynamics",
    "Electromagnetism",
    "Quantum Mechanics",
    "Optics"
  ];

  const handleCategoryClick = (cat) => {
    if (selectedCategory === cat) {
      onSelectCategory(null);
    } else {
      onSelectCategory(cat);
    }
  };

  return (
    <aside className="home-sidebar">
      <button className="ask-question-btn" onClick={() => setActivePage("create_post")}>
        Make a question
      </button>
      
      <div className="categories-box">
        <h3 className="categories-title">Filter by Category</h3>
        <div className="categories-list">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`category-row ${selectedCategory === cat ? "category-row-active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
