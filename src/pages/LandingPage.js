import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const subjectCategories = {
    Mathematics: ['Algebra 1', 'Algebra 2', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
    Science: ['Biology', 'Chemistry', 'Physics', 'Earth Science', 'Environmental Science'],
    English: ['Literature', 'Writing', 'Grammar', 'Reading Comprehension', 'Essay Writing'],
    History: ['World History', 'US History', 'European History', 'Ancient Civilizations'],
    Coding: ['Python', 'JavaScript', 'Java', 'HTML/CSS', 'Web Development', 'Game Development'],
    'Foreign Languages': ['Spanish', 'French', 'German', 'Mandarin', 'Latin'],
    Arts: ['Music', 'Drawing', 'Painting', 'Photography', 'Digital Art'],
    'Test Prep': ['SAT', 'ACT', 'AP Exams', 'College Prep']
  };

  const heroTexts = [
    'Empower. Learn. Connect.',
    'Where Students Lift Each Other Up.',
    'Peer-to-Peer Learning Made Easy.',
    'Academic Help from Students Like You.'
  ];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

 React.useEffect(() => {
  const interval = setInterval(() => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroTexts.length);
  }, 3000);
  return () => clearInterval(interval);
}, [heroTexts.length]);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleSubjectClick = (subject) => {
    // Later: Navigate to find mentor page with this subject filter
    navigate('/find-mentor', { state: { subject } });
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">SB</div>
            <h1 className="logo-text">StudierBridge</h1>
          </div>
          <div className="header-buttons">
            <button className="btn-login" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-signup" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {/* Hero Section */}
<section className="hero-section">
  <div className="hero-images-left">
    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=400&fit=crop" alt="Student studying" className="hero-img hero-img-1" />
    <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&h=400&fit=crop" alt="Student learning" className="hero-img hero-img-2" />
  </div>

  <div className="hero-content">
    <h1 className="hero-title animated-text">
      {heroTexts[currentHeroIndex]}
    </h1>
    <p className="hero-subtitle">
      Free online peer tutoring platform where high school students help younger students excel academically
    </p>
    <div className="hero-buttons">
      <button className="btn-hero btn-find" onClick={() => navigate('/find-mentor')}>
        Find a Tutor
      </button>
      <button className="btn-hero btn-become" onClick={() => navigate('/signup')}>
        Become a Tutor
      </button>
    </div>
  </div>

  <div className="hero-images-right">
    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=400&fit=crop" alt="Student with books" className="hero-img hero-img-3" />
    <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&h=400&fit=crop" alt="Happy student" className="hero-img hero-img-4" />
  </div>
</section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <h2>What do you want to learn?</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
        </div>
      </section>

      {/* Subject Categories */}
      <section className="subjects-section">
        <div className="subjects-container">
          <h2>Popular Subjects</h2>
          <div className="subjects-grid">
            {Object.keys(subjectCategories).map((category) => (
              <div key={category} className="subject-category">
                <div
                  className="category-card"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="category-icon">
                    {category === 'Mathematics' && '📐'}
                    {category === 'Science' && '🔬'}
                    {category === 'English' && '📚'}
                    {category === 'History' && '🏛️'}
                    {category === 'Coding' && '💻'}
                    {category === 'Foreign Languages' && '🌍'}
                    {category === 'Arts' && '🎨'}
                    {category === 'Test Prep' && '📝'}
                  </div>
                  <h3>{category}</h3>
                  <p>{subjectCategories[category].length} topics</p>
                </div>
                
                {selectedCategory === category && (
                  <div className="subcategories">
                    {subjectCategories[category].map((subject) => (
                      <div
                        key={subject}
                        className="subcategory-item"
                        onClick={() => handleSubjectClick(subject)}
                      >
                        {subject}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
     {/* How It Works */}
<section className="how-it-works">
  <div className="container">
    <h2>How StudierBridge Works</h2>
    <div className="steps-grid">
      <div className="step-card">
        <div className="step-image">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" alt="Students collaborating" />
        </div>
        <div className="step-content">
          <div className="step-number">1</div>
          <h3>Find a Tutor</h3>
          <p>Browse subjects and find a student mentor who can help you</p>
        </div>
      </div>
      <div className="step-card">
        <div className="step-image">
          <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop" alt="Student studying" />
        </div>
        <div className="step-content">
          <div className="step-number">2</div>
          <h3>Schedule a Session</h3>
          <p>Pick a time that works for both of you</p>
        </div>
      </div>
    </div>
  </div>
</section>




      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-box">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of students helping each other succeed</p>
            <div className="cta-buttons">
              <button className="btn-cta primary" onClick={() => navigate('/find-mentor')}>
                Find a Tutor Now
              </button>
              <button className="btn-cta secondary" onClick={() => navigate('/signup')}>
                Become a Tutor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-icon">SB</div>
            <span>StudierBridge</span>
          </div>
          <p>© 2025 StudierBridge | Peer Tutoring for Students, by Students</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
