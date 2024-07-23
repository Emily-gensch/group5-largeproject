import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import CreatePartyPage from './pages/CreateaPartyPage';
import HomePage from './pages/HomePage';
import PollPage from './pages/PollPage';
import ProfilePage from './pages/ProfilePage';
import ChangepasswordPage from './pages/ChangepassPage';
import SearchPage from './pages/SearchPage';
import VotePage from './pages/VotePage';
import WaitingPage from './pages/WaitingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/createParty" element={<CreatePartyPage />} />
        <Route path="/home" element={< HomePage />} />
        <Route path="/poll" element={<PollPage />} />
        <Route path="/profile" element={< ProfilePage />} />
        <Route path="/changepassword" element={< ChangepasswordPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/vote" element={<VotePage />} />
        <Route path="/wait" element={<WaitingPage />} />
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
