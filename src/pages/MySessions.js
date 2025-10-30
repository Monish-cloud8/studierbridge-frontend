import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessions, updateSessionStatus } from '../api';
import './MySessions.css';


function MySessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(storedUser);
    setCurrentUser(user);
    fetchSessions(user.email);
  }, [navigate]);

  const fetchSessions = async (email) => {
    try {
      const response = await getSessions(email);
      setSessions(response.sessions);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleAccept = async (sessionId) => {
  try {
    await updateSessionStatus(sessionId, 'accepted');
    alert('Session accepted!');
    // Refresh sessions
    fetchSessions(currentUser.email);
  } catch (err) {
    alert(err);
  }
};

const handleDecline = async (sessionId) => {
  try {
    await updateSessionStatus(sessionId, 'declined');
    alert('Session declined.');
    // Refresh sessions
    fetchSessions(currentUser.email);
  } catch (err) {
    alert(err);
  }
};
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: '#ffa726',
      accepted: '#66bb6a',
      declined: '#ef5350'
    };
    
    return (
      <span 
        className="status-badge" 
        style={{ backgroundColor: statusColors[status] }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading sessions...</div>;
  }

  if (error) {
    return <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>{error}</div>;
  }

  return (
    <div className="my-sessions-container">
      <div className="sessions-header">
        <h1>My Sessions</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="sessions-content">
        {sessions.length === 0 ? (
          <div className="no-sessions">
            <h2>No sessions yet</h2>
            <p>Request a session with a mentor to get started!</p>
            <button 
              className="find-mentor-btn" 
              onClick={() => navigate('/find-mentor')}
            >
              Find a Mentor
            </button>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.map((session) => {
              const isMentor = currentUser.email === session.mentor_email;
              
              return (
                <div key={session._id} className="session-card">
                  <div className="session-header-info">
                    <h3>{session.subject}</h3>
                    {getStatusBadge(session.status)}
                  </div>
                  


                  <div className="session-details">
  <p>
    <strong>{isMentor ? 'Mentee' : 'Mentor'}:</strong>{' '}
    {isMentor ? session.mentee_email : session.mentor_email}
  </p>
  
  {session.scheduled_date && session.scheduled_time && (
    <p className="session-scheduled">
      <strong>📅 Scheduled:</strong>{' '}
      {new Date(session.scheduled_date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} at {session.scheduled_time}
    </p>
  )}
  
  {session.message && (
    <p className="session-message">
      <strong>Message:</strong> {session.message}
    </p>
  )}
  
  <p className="session-date">
    <strong>Requested:</strong>{' '}
    {new Date(session.created_at).toLocaleDateString()}
  </p>
</div>

                 {isMentor && session.status === 'pending' && (
  <div className="session-actions">
    <button 
      className="btn-accept" 
      onClick={() => handleAccept(session._id)}
    >
      Accept
    </button>
    <button 
      className="btn-decline" 
      onClick={() => handleDecline(session._id)}
    >
      Decline
    </button>
  </div>
)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySessions;