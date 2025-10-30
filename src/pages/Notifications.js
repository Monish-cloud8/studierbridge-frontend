import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api';
import './Notifications.css';

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
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
    fetchNotifications(user.email);
  }, [navigate]);

  const fetchNotifications = async (email) => {
    try {
      const response = await getNotifications(email);
      setNotifications(response.notifications);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      fetchNotifications(currentUser.email);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead(currentUser.email);
      fetchNotifications(currentUser.email);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'session_request':
        return '📬';
      case 'session_accepted':
        return '✅';
      case 'session_declined':
        return '❌';
      default:
        return '🔔';
    }
  };

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading notifications...</div>;
  }

  if (error) {
    return <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>{error}</div>;
  }

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="notifications-content">
        <div className="notifications-toolbar">
          <h2>
            {unreadNotifications.length > 0 
              ? `${unreadNotifications.length} Unread` 
              : 'All Caught Up!'}
          </h2>
          {unreadNotifications.length > 0 && (
            <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <h2>No notifications yet</h2>
            <p>When you receive session requests or responses, they'll appear here!</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-time">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.read && <div className="unread-dot"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;