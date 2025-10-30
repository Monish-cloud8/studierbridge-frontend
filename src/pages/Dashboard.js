import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // If no user or token, redirect to login
    if (!storedUser || !token) {
      navigate('/login');
      return;
    }
    
    // Parse and set user data
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (user) {
        try {
          const response = await getNotifications(user.email);
          setUnreadCount(response.unread_count);
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      }
    };

    fetchNotificationCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    alert('Logged out successfully!');
    navigate('/login');
  };

  // Show loading while checking authentication
  if (!user) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <div className="header-actions">
          <button className="notification-bell" onClick={() => navigate('/notifications')}>
            🔔
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>Your Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          <p><strong>Grade:</strong> {user.grade}</p>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          {(user.role === 'mentee' || user.role === 'both') && (
            <button className="action-btn" onClick={() => navigate('/find-mentor')}>Find a Mentor</button>
          )}
         
          {(user.role === 'mentor' || user.role === 'both') && (
  <>
    <button className="action-btn" onClick={() => navigate('/find-mentee')}>Find Mentees</button>

    <button className="action-btn" onClick={() => navigate('/set-availability')}>
      Set Availability
    </button>
  </>
)}
          <button className="action-btn" onClick={() => navigate('/my-sessions')}>My Sessions</button>
          <button className="action-btn">Messages</button>
          <button className="action-btn" onClick={() => navigate('/subjects')}>Update Subjects</button>
          <button className="action-btn" onClick={() => navigate('/update-profile')}>Update Profile</button>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <p className="no-activity">No recent sessions yet!</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;