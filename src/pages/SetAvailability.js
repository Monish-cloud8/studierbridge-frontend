import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAvailability, getAvailability } from '../api';
import './SetAvailability.css';

function SetAvailability() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const timeOptions = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(storedUser);
    setCurrentUser(user);
    loadAvailability(user.email);
  }, [navigate]);

  const loadAvailability = async (email) => {
    try {
      const response = await getAvailability(email);
      setTimeSlots(response.time_slots || []);
    } catch (err) {
      console.error('Error loading availability:', err);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setMonth(today.getMonth() + 3));
    return maxDate.toISOString().split('T')[0];
  };

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { date: getMinDate(), start_time: '09:00', end_time: '10:00' }
    ]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index, field, value) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    // Sort by date
    const sortedSlots = [...timeSlots].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    try {
      await setAvailability(currentUser.email, sortedSlots);
      setMessage('Availability updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setMessage(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="availability-container">
      <div className="availability-header">
        <h1>Set Your Availability</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back
        </button>
      </div>

      <div className="availability-content">
        <p className="instruction">
          Set specific dates and times when you're available for mentoring sessions.
        </p>

        <div className="time-slots-list">
          {timeSlots.length === 0 ? (
            <p className="no-slots">No time slots added yet. Click "Add Time Slot" to get started!</p>
          ) : (
            timeSlots.map((slot, index) => (
              <div key={index} className="time-slot-item">
                <input
                  type="date"
                  value={slot.date}
                  min={getMinDate()}
                  max={getMaxDate()}
                  onChange={(e) => updateTimeSlot(index, 'date', e.target.value)}
                  className="slot-input date-input"
                />

                <select
                  value={slot.start_time}
                  onChange={(e) => updateTimeSlot(index, 'start_time', e.target.value)}
                  className="slot-input"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>

                <span className="time-separator">to</span>

                <select
                  value={slot.end_time}
                  onChange={(e) => updateTimeSlot(index, 'end_time', e.target.value)}
                  className="slot-input"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>

                <button 
                  className="remove-slot-btn"
                  onClick={() => removeTimeSlot(index)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <button className="add-slot-btn" onClick={addTimeSlot}>
          + Add Time Slot
        </button>

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
          {loading ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </div>
  );
}

export default SetAvailability;