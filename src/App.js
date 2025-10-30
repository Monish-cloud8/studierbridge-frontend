import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FindMentor from './pages/FindMentor';
import FindMentee from './pages/FindMentee';
import SubjectSelection from './pages/SubjectSelection';
import MySessions from './pages/MySessions';
import UpdateProfile from './pages/UpdateProfile';
import Notifications from './pages/Notifications';
import SetAvailability from './pages/SetAvailability';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-mentor" element={<FindMentor />} />
          <Route path="/find-mentee" element={<FindMentee />} />
          <Route path="/subjects" element={<SubjectSelection />} />
          <Route path="/my-sessions" element={<MySessions />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/set-availability" element={<SetAvailability />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;