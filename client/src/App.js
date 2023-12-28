// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './widgets/Navbar';
import AuthForm from './Scenes/loginPage';
import Search from './Scenes/searchPage';
import Home from './Scenes/HomePage';
import Report from './Scenes/ReportPage';
const App = () => {
  const [isLoggedIn, setIsLogin] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [user_id, setuserId] = useState(localStorage.getItem('user_id'));

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('user_id', user_id);
  }, [isLoggedIn, user_id]);

  const handleLogin = (userId) => {
    setIsLogin(true);
    setuserId(userId);
  };
  const handleLogout = () => {
    setIsLogin(false);
    setuserId(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user_id');
  }
  return (

    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<AuthForm onLogin={handleLogin} />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/report" element={<Search userId={user_id} />} />
        <Route path="/search" element={<Report/>} />
      </Routes>
    </Router>

  );
};

export default App;
