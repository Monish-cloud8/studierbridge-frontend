import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMentees } from '../api';
import './FindMentee.css';

function FindMentee() {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    fetchMentees();
  }, [navigate]);

  const fetchMentees = async () => {
    try {
      const response = await getMentees();
      setMentees(response.mentees);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading mentees...</div>;
  }

  if (error) {
    return <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>{error}</div>;
  }

  return (
    <div className="find-mentee-container">
      <div className="find-mentee-header">
        <h1>Find Mentees</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="mentees-grid">
        {mentees.length === 0 ? (
          <p className="no-mentees">No mentees available yet. Check back later!</p>
        ) : (
          mentees.map((mentee) => (
            <div key={mentee._id} className="mentee-card">
              <div className="mentee-avatar">
                {mentee.name.charAt(0).toUpperCase()}
              </div>
              <h3>{mentee.name}</h3>
              <p className="mentee-grade">Grade: {mentee.grade}</p>
              <p className="mentee-email">Email: {mentee.email}</p>
              
              {mentee.subjects && mentee.subjects.length > 0 ? (
                <div className="mentee-subjects">
                  <strong>Interested in:</strong>
                  <div className="subject-tags">
                    {mentee.subjects.map((subject, index) => (
                      <span key={index} className="subject-tag">{subject}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-subjects">No subjects selected yet</p>
              )}
              
              <button className="contact-btn" onClick={() => alert('Messaging feature coming soon!')}>
                Send Message
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FindMentee;