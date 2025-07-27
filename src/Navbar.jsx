import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <h1 className="logo">SkillStack</h1>
      {isAuthenticated && (
        <div className="nav-buttons">
          <button onClick={() => navigate("/add-skill")} className="btn add-skill">
            Add Skill
          </button>
          <button onClick={handleLogout} className="btn logout">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
