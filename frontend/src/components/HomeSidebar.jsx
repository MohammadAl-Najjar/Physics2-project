import "../css/home-sidebar.css";
import { usePage } from "../context/PageContext.jsx";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function HomeSidebar({ selectedCategory, onSelectCategory, showAskButton = true }) {
  const { setActivePage } = usePage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const categories = [
    "Electric fields",
    "Electric flux",
    "Electric potential",
    "Capacitors",
    "Current & Resistance",
    "Direct Current Circuits",
    "Kirchhoff’s Circuits",
    "Magnetic Fields",
    "Sources of the Magnetic Field",
    "Physics 1",
    "Other"
  ];

  const handleCategoryClick = (cat) => {
    if (selectedCategory === cat) {
      onSelectCategory(null);
    } else {
      onSelectCategory(cat);
    }
    setIsDropdownOpen(false); // Close dropdown on selection
  };

  return (
    <aside className="home-sidebar" ref={dropdownRef}>
      {showAskButton && (
        <button className="ask-question-btn" onClick={() => setActivePage("create_post")}>
          Make a question
        </button>
      )}
      
      <div className="categories-box">
        <button 
          className="categories-mobile-toggle" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FontAwesomeIcon icon={faFilter} style={{ marginRight: "10px" }} />
          {selectedCategory || "Filter by Category"}
          <FontAwesomeIcon 
            icon={isDropdownOpen ? faChevronUp : faChevronDown} 
            style={{ marginLeft: "auto" }} 
          />
        </button>

        <div className={`categories-content ${isDropdownOpen ? "categories-content-open" : ""}`}>
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
      </div>
    </aside>
  );
}
