import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

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
  const [buttonPosition, setButtonPosition] = useState('center'); // 'center', 'left', 'right'

  const isFormValid = () => {
    return username.trim() !== '' && password.trim() !== '';
  };

  const handleButtonHover = () => {
    if (!isFormValid()) {
      // Dodge in the opposite direction of where the button currently is
      if (buttonPosition === 'center' || buttonPosition === 'right') {
        setButtonPosition('left');
      } else {
        setButtonPosition('right');
      }
    }
  };

  const getButtonClassName = () => {
    const baseClass = 'login-button';
    if (isLoading) return `${baseClass} loading`;
    if (isFormValid()) return `${baseClass} clickable`;
    if (buttonPosition === 'left') return `${baseClass} dodge-left`;
    if (buttonPosition === 'right') return `${baseClass} dodge-right`;
    return baseClass;
  };

  const handleSubmitAttempt = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setButtonPosition(buttonPosition === 'center' ? 'left' : 'center');
      return;
    }
    handleSubmit(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/token', formData);
      onLogin(response.data.access_token);
    } catch (err) {
      setError('Invalid credentials');
      setIsLoading(false);
    }
  };

  // Reset button position when form becomes valid
  useEffect(() => {
    if (isFormValid()) {
      setButtonPosition('center');
    }
  }, [username, password, isFormValid]); // Added isFormValid to dependencies

  return (
    <div className="login-wrapper">
      <div className="circuit-background">
        <div className="circuit-lines"></div>
      </div>
      <MatrixRain />
      <div className="login-container">
        <div className="login-visual">
          <div className="ai-circles"></div>
          <div className="ai-circles"></div>
          <div className="ai-circles"></div>
          <h1 style={{ color: '#fff', fontSize: '24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            AI Sentiment Analysis
          </h1>
        </div>

        <div className="login-form-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please sign in to continue</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmitAttempt}>
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

            <button 
              type="submit" 
              className={getButtonClassName()}
              onMouseEnter={handleButtonHover}
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
