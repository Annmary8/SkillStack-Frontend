import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './SkillForm.css';
const SkillForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skill_name: "",
    category: "",
    resource_type: "",
    platform: "",
    status: "",
    hours_spent: "",
    difficulty_rating: "",
    estimated_hours: "",
    resource_url: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://skillstackbyannmary.onrender.com/api/skills/", formData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting skill:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Skill</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="skill_name" placeholder="Skill Name" onChange={handleChange} required />
        
        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Programming">Programming</option>
          <option value="Design">Design</option>
        </select>

        <select name="resource_type" onChange={handleChange} required>
          <option value="">Resource Type</option>
          <option value="Course">Course</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Book">Book</option>
        </select>

        <select name="platform" onChange={handleChange} required>
          <option value="">Select Platform</option> 
            <option value="Udemy">Udemy</option>
            <option value="Coursera">Coursera</option>
            <option value="YouTube">YouTube</option>
            </select>

        <select name="status" onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Ongoing">started</option>
          <option value="Completed">progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input type="number" name="hours_spent" placeholder="Hours Spent" onChange={handleChange} />
        <input type="number" name="difficulty_rating" placeholder="Difficulty (1-5)" onChange={handleChange} />
        <input type="number" name="estimated_hours" placeholder="Estimated Hours" onChange={handleChange} />
        <input type="url" name="resource_url" placeholder="Resource URL" onChange={handleChange} />
        <textarea name="notes" placeholder="Notes" rows="3" onChange={handleChange}></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SkillForm;
