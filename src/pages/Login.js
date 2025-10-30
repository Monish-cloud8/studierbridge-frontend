import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(formData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(typeof err === 'string' ? err : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-new">
      <div className="login-header">
        <div className="login-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">SB</div>
          <span>StudierBridge</span>
        </div>
      </div>

      <div className="login-content">
        <div className="login-box-new">
          <div className="login-left">
            <h1>Welcome back!</h1>
            <p className="welcome-subtitle">Log in to continue your learning journey</p>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Connect with tutors instantly</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Schedule sessions easily</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>Track your learning progress</span>
              </div>
            </div>

            <div className="new-user-prompt">
              <p>New to StudierBridge?</p>
              <button className="create-account-btn" onClick={() => navigate('/signup')}>
                Create an account
              </button>
            </div>
          </div>

          <div className="login-right">
            <h2>Log in to your account</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label>Password</label>
                  <a href="#forgot" className="forgot-link">Forgot password?</a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <div className="login-footer">
              <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;