import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, uploadProfilePicture } from '../api';
import './UpdateProfile.css';

function UpdateProfile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    role: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(storedUser);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      grade: user.grade,
      role: user.role,
      new_password: '',
      confirm_password: ''
    });
    setPreviewUrl(user.profile_picture_url || '');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validate passwords if provided
    if (formData.new_password || formData.confirm_password) {
      if (formData.new_password !== formData.confirm_password) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.new_password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        email: currentUser.email,
        name: formData.name,
        grade: formData.grade,
        role: formData.role
      };

      // Only include password if it was changed
      if (formData.new_password) {
        updateData.new_password = formData.new_password;
      }

      const response = await updateProfile(updateData);
      let updatedUser = response.user;

      // If a new profile picture is selected, upload it
      if (selectedFile) {
        const uploadRes = await uploadProfilePicture(currentUser.email, selectedFile);
        updatedUser = uploadRes.user;
        setPreviewUrl(uploadRes.profile_picture_url || '');
      }

      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="update-profile-container">
      <div className="update-profile-header">
        <h1>Update Profile</h1>
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="update-profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="avatar-section">
            <div className="avatar-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">No Photo</div>
              )}
            </div>
            <label className="avatar-upload-btn">
              Change Photo
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Grade</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g., 10th"
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email (cannot be changed)</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                style={{background: '#f0f0f0', cursor: 'not-allowed'}}
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Change Password (Optional)</h2>
            
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          {error && <div className="message error">{error}</div>}
          {message && <div className="message success">{message}</div>}

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;