import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // Step 1: Role, Step 2: Details
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    grade: '',
    school: '',
    zipCode: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Combine first and last name for backend
      const signupData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        grade: formData.grade,
        role: formData.role,
        school: formData.school,
        zipCode: formData.zipCode
      };

      const response = await signup(signupData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      alert('Signup successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const gradeOptions = formData.role === 'mentor' 
    ? ['9th', '10th', '11th', '12th']
    : ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  return (
    <div className="signup-container-new">
      <div className="signup-header">
        <div className="signup-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">SB</div>
          <span>StudierBridge</span>
        </div>
      </div>

      <div className="signup-content">
        {step === 1 ? (
          <div className="role-selection">
            <h1>Join StudierBridge</h1>
            <p className="subtitle">Choose how you want to get started</p>
            
            <div className="role-cards">
              <div 
                className="role-card"
                onClick={() => handleRoleSelect('mentee')}
              >
                <div className="role-icon">🎓</div>
                <h2>I want to learn</h2>
                <p>Find a tutor to help you excel in your studies</p>
                <button className="role-btn">Get Started as Student</button>
              </div>

              <div 
                className="role-card"
                onClick={() => handleRoleSelect('mentor')}
              >
                <div className="role-icon">👨‍🏫</div>
                <h2>I want to tutor</h2>
                <p>Share your knowledge and help other students succeed</p>
                <button className="role-btn">Get Started as Tutor</button>
              </div>

             
            </div>

            <p className="login-prompt">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        ) : (
          <div className="signup-form-container">
            <button className="back-btn" onClick={() => setStep(1)}>
              ← Back
            </button>

            <h1>Create your account</h1>
            <p className="subtitle">
              {formData.role === 'mentor' && 'Start helping students succeed'}
              {formData.role === 'mentee' && 'Start your learning journey'}
              {formData.role === 'both' && 'Join as a learner and tutor'}
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  minLength="6"
                />
                <small>Must be at least 6 characters</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Grade *</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select grade</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <small>
                    {formData.role === 'mentor' 
                      ? 'Mentors must be in high school (9-12)'
                      : 'Select your current grade level'}
                  </small>
                </div>

                <div className="form-group">
                  <label>Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    placeholder="12345"
                    pattern="[0-9]{5}"
                    maxLength="5"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>School *</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  placeholder="Enter your school name"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="terms-text">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            <p className="login-prompt">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;