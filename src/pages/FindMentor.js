import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMentors, createScheduledSessionRequest, getAvailability } from '../api';
import './FindMentor.css';

function FindMentor() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestSubject, setRequestSubject] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setCurrentUser(JSON.parse(storedUser));
  }
  fetchMentors();
}, [navigate]);

  const fetchMentors = async () => {
    try {
      const response = await getMentors();
      setMentors(response.mentors);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const openRequestModal = async (mentor) => {
    setSelectedMentor(mentor);
    setRequestSubject(mentor.subjects && mentor.subjects.length > 0 ? mentor.subjects[0] : '');
    
    // Fetch mentor's availability
    try {
      const response = await getAvailability(mentor.email);
      setAvailableSlots(response.time_slots || []);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setAvailableSlots([]);
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMentor(null);
    setRequestSubject('');
    setRequestMessage('');
    setSelectedDate('');
    setSelectedTime('');
    setAvailableSlots([]);
  };

  const getAvailableDates = () => {
    // Get unique dates from mentor's availability
    const dates = availableSlots.map(slot => slot.date);
    const uniqueDates = [...new Set(dates)].sort();
    
    return uniqueDates.map(date => {
      const dateObj = new Date(date);
      return {
        date: date,
        display: dateObj.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      };
    });
  };

  const getAvailableTimesForDate = (selectedDate) => {
    return availableSlots.filter(slot => slot.date === selectedDate);
  };

  const handleSendRequest = async () => {
    if (!requestSubject) {
      alert('Please select a subject');
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    try {
      await createScheduledSessionRequest({
        mentee_email: currentUser.email,
        mentor_email: selectedMentor.email,
        subject: requestSubject,
        message: requestMessage,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime
      });

      alert('Session request sent successfully!');
      closeModal();
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading mentors...</div>;
  }

  if (error) {
    return <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>{error}</div>;
  }

  return (
    <div className="find-mentor-container">
      <div className="find-mentor-header">
        <h1>Find a Mentor</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="mentors-grid">
        {mentors.length === 0 ? (
          <p className="no-mentors">No mentors available yet. Check back later!</p>
        ) : (
          mentors.map((mentor) => (
            <div key={mentor._id} className="mentor-card">
              <div className="mentor-avatar">
                {mentor.name.charAt(0).toUpperCase()}
              </div>
              <h3>{mentor.name}</h3>
              <p className="mentor-grade">Grade: {mentor.grade}</p>
              <p className="mentor-role">Role: {mentor.role}</p>
              
              {mentor.subjects && mentor.subjects.length > 0 ? (
                <div className="mentor-subjects">
                  <strong>Teaches:</strong>
                  <div className="subject-tags">
                    {mentor.subjects.map((subject, index) => (
                      <span key={index} className="subject-tag">{subject}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="no-subjects">No subjects added yet</p>
              )}
              
              <button className="request-btn" onClick={() => openRequestModal(mentor)}>
                Request Session
              </button>
            </div>
          ))
        )}
      </div>

      {/* Request Modal */}
      {showModal && selectedMentor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content scheduling-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Request Session with {selectedMentor.name}</h2>
            
            <div className="form-group">
              <label>Select Subject:</label>
              <select 
                value={requestSubject} 
                onChange={(e) => setRequestSubject(e.target.value)}
                className="modal-select"
              >
                <option value="">Choose a subject</option>
                {selectedMentor.subjects && selectedMentor.subjects.map((subject, index) => (
                  <option key={index} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {availableSlots.length > 0 ? (
              <>
                <div className="form-group">
                  <label>Select Date:</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime('');
                    }}
                    className="modal-select"
                  >
                    <option value="">Choose a date</option>
                    {getAvailableDates().map((dateObj) => (
                      <option key={dateObj.date} value={dateObj.date}>
                        {dateObj.display}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDate && (
                  <div className="form-group">
                    <label>Select Time:</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="modal-select"
                    >
                      <option value="">Choose a time</option>
                      {getAvailableTimesForDate(selectedDate).map((slot, index) => (
                        <option key={index} value={`${slot.start_time}-${slot.end_time}`}>
                          {slot.start_time} - {slot.end_time}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            ) : (
              <div className="no-availability-message">
                <p>⚠️ This mentor hasn't set their availability yet.</p>
                <p>You can still send a request, but you'll need to coordinate the time later.</p>
              </div>
            )}

            <div className="form-group">
              <label>Message (optional):</label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Tell your mentor what you'd like to learn..."
                className="modal-textarea"
                rows="4"
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button 
                className="btn-send" 
                onClick={handleSendRequest}
                disabled={!requestSubject || (availableSlots.length > 0 && (!selectedDate || !selectedTime))}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindMentor;