import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

// ✅ Use environment variable for API base URL, fallback to localhost for local dev
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

function MatrixRain() {
  useEffect(() => {
    const createRainDrop = () => {
      const column = document.createElement('div');
      column.className = 'rain-column';
      column.style.left = `${Math.random() * 100}%`;
      column.style.animationDuration = `${Math.random() * 2 + 1}s`;
      column.innerHTML = Math.random().toString(36).substring(2, 3);
      return column;
    };

    const matrixRain = document.querySelector('.matrix-rain');
    const rainDrops = [];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const drop = createRainDrop();
        matrixRain.appendChild(drop);
        rainDrops.push(drop);

        setTimeout(() => {
          drop.remove();
          rainDrops.splice(rainDrops.indexOf(drop), 1);
        }, 3000);
      }, i * 100);
    }

    const interval = setInterval(() => {
      const drop = createRainDrop();
      matrixRain.appendChild(drop);
      rainDrops.push(drop);

      setTimeout(() => {
        drop.remove();
        rainDrops.splice(rainDrops.indexOf(drop), 1);
      }, 3000);
    }, 100);

    return () => {
      clearInterval(interval);
      rainDrops.forEach(drop => drop.remove());
    };
  }, []);

  return <div className="matrix-rain" />;
}

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const isFormValid = () => username.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      if (isRegister) {
        // ✅ Registration request
        await axios.post(`${API}/register`, {
          username,
          password
        });
        alert("Registration successful! You can now log in.");
        setIsRegister(false);
        setUsername('');
        setPassword('');
        setError('');
      } else {
        // ✅ Login request
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await axios.post(`${API}/token`, formData);
        onLogin(response.data.access_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    }
    setIsLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="circuit-background"><div className="circuit-lines" /></div>
      <MatrixRain />
      <div className="login-container">
        <div className="login-visual">
          <div className="ai-circles" />
          <div className="ai-circles" />
          <div className="ai-circles" />
          <h1 style={{ color: '#fff' }}>AI Sentiment Analysis</h1>
        </div>

        <div className="login-form-container">
          <div className="login-header">
            <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p>{isRegister ? 'Register to start using the app' : 'Please sign in to continue'}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username">Username</label>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{" "}
              <span
                onClick={() => setIsRegister(!isRegister)}
                style={{ color: '#38BDF8', cursor: 'pointer' }}
              >
                {isRegister ? 'Login' : 'Register'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

