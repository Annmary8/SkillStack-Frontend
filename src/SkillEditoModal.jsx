import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditSkillModal from './SkillEditoModal'; 


const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState({});
  const [editingSkill, setEditingSkill] = useState(null);

  const navigate = useNavigate();

  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/skills/');
      const data = res.data;
      setSkills(data);

      const totalSkills = data.length;
      const completedSkills = data.filter(skill => skill.status.toLowerCase() === 'completed').length;
      const totalHours = data.reduce((sum, skill) => sum + parseFloat(skill.hours_spent || 0), 0);

      const progressValues = data
        .map(skill => parseFloat(skill.progress))
        .filter(val => !isNaN(val));

      const avgProgress = progressValues.length > 0
        ? (progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
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
      fetchSkills(); // Refresh list after deletion
    } catch (err) {
      console.error('Delete failed:', err);
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

      <button className="add-skill-btn" onClick={() => navigate('/skill-form')}>
        ➕ Add Skill
      </button>

      <h2>📚 Your Skills</h2>
      <div className="skills-list">
        {skills.map(skill => (
          <div className="skill-card" key={skill.id}>
            <h3>{skill.skill_name}</h3>
            <p><strong>Category:</strong> {skill.category}</p>
            <p><strong>Resource Type:</strong> {skill.resource_type}</p>
            <p><strong>Platform:</strong> {skill.platform}</p>
            <p><strong>Status:</strong> {skill.status}</p>
            <p><strong>Hours Spent:</strong> {skill.hours_spent}</p>
            <p><strong>Estimated Hours:</strong> {skill.estimated_hours}</p>
            <p><strong>Difficulty:</strong> {skill.difficulty_rating}</p>
            <p><strong>Progress:</strong> {skill.progress || 0}%</p>
            <p><strong>URL:</strong> <a href={skill.resource_url} target="_blank" rel="noopener noreferrer">Open</a></p>
            <p><strong>Notes:</strong> {skill.notes}</p>

            <div className="btn-group">
              <button onClick={() => setEditingSkill(skill)}>✏️ Edit</button>
              <button onClick={() => handleDelete(skill.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingSkill && (
        <EditSkillModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onUpdate={fetchSkills}
        />
      )}
    </div>
  );
};

export default Dashboard;
