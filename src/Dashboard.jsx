import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState({});
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/skills/');
      const data = res.data;
      setSkills(data);

      const totalSkills = data.length;
      const completedSkills = data.filter(skill => skill.status.toLowerCase() === 'completed').length;
      const totalHours = data.reduce((sum, skill) => sum + parseFloat(skill.hours_spent || 0), 0);

      const validProgress = data
        .map(skill => {
          const est = parseFloat(skill.estimated_hours || 0);
          const spent = parseFloat(skill.hours_spent || 0);
          return est > 0 ? (spent / est) * 100 : 0;
        })
        .filter(progress => !isNaN(progress));

      const avgProgress = validProgress.length > 0
        ? validProgress.reduce((a, b) => a + b, 0) / validProgress.length
        : 0;

      setStats({
        totalSkills,
        completedSkills,
        totalHours,
        averageProgress: avgProgress.toFixed(1),
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/skills/${id}/`);
      fetchSkills();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEditClick = (skill) => {
    setEditingSkillId(skill.id);
    setEditFormData({ ...skill });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/skills/${editingSkillId}/`, editFormData);
      setEditingSkillId(null);
      fetchSkills();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 SkillStack</h1>

      <div className="stats-grid">
        <div className="stat-card"><h2>{stats.totalSkills}</h2><p>Total Skills</p></div>
        <div className="stat-card"><h2>{stats.completedSkills}</h2><p>Completed</p></div>
        <div className="stat-card"><h2>{stats.totalHours} hrs</h2><p>Total Hours</p></div>
        <div className="stat-card"><h2>{stats.averageProgress}%</h2><p>Average Progress</p></div>
      </div>

      <button className="add-skill-btn" onClick={() => navigate('/skill-form')}>➕ Add Skill</button>

      <h2>📚 Your Skills</h2>
      <div className="skills-list">
        {skills.map(skill => {
          const estimated = parseFloat(skill.estimated_hours || 0);
          const spent = parseFloat(skill.hours_spent || 0);
          const progress = estimated > 0 ? ((spent / estimated) * 100).toFixed(1) : 0;

          return (
            <div className="skill-card" key={skill.id}>
              {editingSkillId === skill.id ? (
                <div className="edit-form">
                  <input name="skill_name" value={editFormData.skill_name} onChange={handleEditChange} />
                  <input name="category" value={editFormData.category} onChange={handleEditChange} />
                  <input name="resource_type" value={editFormData.resource_type} onChange={handleEditChange} />
                  <input name="platform" value={editFormData.platform} onChange={handleEditChange} />
                  <select name="status" value={editFormData.status} onChange={handleEditChange}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <input name="hours_spent" value={editFormData.hours_spent} onChange={handleEditChange} />
                  <input name="estimated_hours" value={editFormData.estimated_hours} onChange={handleEditChange} />
                  <input name="difficulty_rating" value={editFormData.difficulty_rating} onChange={handleEditChange} />
                  <input name="resource_url" value={editFormData.resource_url} onChange={handleEditChange} />
                  <textarea name="notes" value={editFormData.notes} onChange={handleEditChange}></textarea>

                  <button onClick={handleEditSubmit}>✅ Save</button>
                  <button onClick={() => setEditingSkillId(null)}>❌ Cancel</button>
                </div>
              ) : (
                <>
                  <h3>{skill.skill_name}</h3>
                  <p><strong>Category:</strong> {skill.category}</p>
                  <p><strong>Resource Type:</strong> {skill.resource_type}</p>
                  <p><strong>Platform:</strong> {skill.platform}</p>
                  <p><strong>Status:</strong> {skill.status}</p>
                  <p><strong>Hours Spent:</strong> {skill.hours_spent}</p>
                  <p><strong>Estimated Hours:</strong> {skill.estimated_hours}</p>
                  <p><strong>Difficulty:</strong> {skill.difficulty_rating}</p>
                  <p><strong>Progress:</strong> {progress}%</p>
                  <p><strong>URL:</strong> <a href={skill.resource_url} target="_blank" rel="noopener noreferrer">Open</a></p>
                  <p><strong>Notes:</strong> {skill.notes}</p>

                  <div className="btn-group">
                    <button onClick={() => handleEditClick(skill)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(skill.id)}>🗑️ Delete</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
