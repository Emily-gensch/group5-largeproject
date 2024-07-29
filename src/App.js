import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VotePage from './pages/VotePage';
import SearchPage from './pages/SearchPage';
import ThankYouPage from './pages/ThankYouPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Waiting from './pages/WaitingPage';
import JoinPage from './pages/JoinPage';
import CreatePartyPage from './pages/CreatePartyPage';
import PollPage from './pages/PollPage';
import WatchedPage from './pages/WatchedPage';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/createParty" element={<CreatePartyPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/poll" element={<PollPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/changepassword" element={<ChangePasswordPage />} />
          <Route path="/wait" element={<Waiting />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/watched" element={<WatchedPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
