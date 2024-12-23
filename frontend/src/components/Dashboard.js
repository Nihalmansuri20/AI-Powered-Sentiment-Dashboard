import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ token, onLogout }) {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [results]);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      const progress = (currentScroll / totalScroll) * 100;
      setScrollProgress(progress);

      // Show/hide scroll to top button
      setShowScrollTop(currentScroll > 300);

      // Handle scroll animations
      const scrollElements = document.querySelectorAll('.scroll-animate');
      scrollElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
        
        if (isVisible) {
          element.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setResults(response.data);
      setError('');
    } catch (err) {
      setError('Error analyzing file');
      setResults(null);
    }
    setIsUploading(false);
  };

  const chartData = results ? {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      label: 'Sentiment Distribution',
      data: [
        results.statistics.positive,
        results.statistics.neutral,
        results.statistics.negative
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',  // Green for positive
        'rgba(214, 96, 0, 0.8)',   // Dark orange for neutral (changed)
        'rgba(239, 68, 68, 0.8)',  // Red for negative
      ],
      borderColor: [
        'rgb(34, 197, 94)',       // Solid green
        'rgb(214, 96, 0)',        // Solid dark orange (changed)
        'rgb(239, 68, 68)',       // Solid red
      ],
      borderWidth: 1,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sentiment Analysis Results' }
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Add scroll progress indicator */}
      <div 
        className="scroll-progress" 
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {/* Add scroll to top button */}
      <div 
        className={`scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </div>

      <nav className="dashboard-nav">
        <h1>Sentiment Analysis Dashboard</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
          <span className="button-effect"></span>
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="upload-section scroll-animate fade-up"
             onDragEnter={handleDrag}
             onDragLeave={handleDrag}
             onDragOver={handleDrag}
             onDrop={handleDrop}>
          
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="file-input"
            id="file-input"
          />
          
          <label htmlFor="file-input" className={`drop-zone ${dragActive ? 'drag-active' : ''}`}>
            <div className="upload-icon"></div>
            <p>Drag & Drop your CSV file here or click to browse</p>
            {isUploading && <div className="loader"></div>}
          </label>
        </div>

        {error && <div className="error-message scroll-animate fade-up">{error}</div>}

        {results && (
          <div className="results-container">
            <div className="chart-section scroll-animate fade-up">
              <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="table-section scroll-animate fade-up">
              <h3>Detailed Results</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Text</th>
                      <th>Sentiment</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((result, index) => (
                      <tr 
                        key={result.id} 
                        className={`sentiment-${result.sentiment} scroll-animate fade-up`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td>{result.id}</td>
                        <td>{result.text}</td>
                        <td>
                          <span className={`sentiment-badge ${result.sentiment}`}>
                            {result.sentiment}
                          </span>
                        </td>
                        <td>{result.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
