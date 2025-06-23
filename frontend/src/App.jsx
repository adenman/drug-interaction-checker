import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SavedTests from './components/SavedTests';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost/drug-interaction-checker/backend';
// This allows axios to send cookies (like session IDs) with requests
axios.defaults.withCredentials = true;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Simple check on load. A more robust solution might involve a "check-session" endpoint.
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (newUsername) => {
    setLoggedIn(true);
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout.php');
    } catch (error) {
      console.error("Error during logout, but logging out client-side anyway.", error);
    } finally {
      setLoggedIn(false);
      setUsername('');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      <Navbar loggedIn={loggedIn} username={username} onLogout={handleLogout} />
      <main className="content">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard loggedIn={loggedIn} />} />
          <Route path="/saved-tests" element={<SavedTests loggedIn={loggedIn} />} />
          <Route path="/" element={loggedIn ? <Dashboard loggedIn={loggedIn} /> : <Login onLogin={handleLogin}/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;