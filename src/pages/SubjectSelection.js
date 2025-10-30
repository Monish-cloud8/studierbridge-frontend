import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateSubjects } from '../api';
import './SubjectSelection.css';

function SubjectSelection() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Common subjects list
  const availableSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Economics',
    'Psychology',
    'Art',
    'Music'
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setSelectedSubjects(userData.subjects || []);
  }, [navigate]);

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSave = async () => {
    if (selectedSubjects.length === 0) {
      setMessage('Please select at least one subject');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await updateSubjects(user.email, selectedSubjects);
      
      // Update localStorage
      const updatedUser = { ...user, subjects: selectedSubjects };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Subjects updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setMessage(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="subject-selection-container">
      <div className="subject-header">
        <h1>Select Your Subjects</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back
        </button>
      </div>

      <div className="subject-content">
        <p className="instruction">
          {user.role === 'mentor' || user.role === 'both' 
            ? 'Select subjects you can teach:' 
            : 'Select subjects you want to learn:'}
        </p>

        <div className="subjects-grid">
          {availableSubjects.map((subject) => (
            <div
              key={subject}
              className={`subject-card ${selectedSubjects.includes(subject) ? 'selected' : ''}`}
              onClick={() => toggleSubject(subject)}
            >
              <span className="checkmark">{selectedSubjects.includes(subject) ? '✓' : ''}</span>
              {subject}
            </div>
          ))}
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Subjects'}
        </button>
      </div>
    </div>
  );
}

export default SubjectSelection;