import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import CreatePartyPage from './pages/CreateaPartyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/createParty" element={<CreatePartyPage />} />
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
