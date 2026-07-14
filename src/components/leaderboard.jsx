import { useState } from 'react';
import './Leaderboard.css';

function Leaderboard({ leaderboard }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-header" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="leaderboard-title">Top 10 Mejores Puntajes</h3>
        <button className="toggle-btn" aria-label="Desplegar Leaderboard">
          {isOpen ? '🔼' : '🔽'}
        </button>
      </div>
      
      {isOpen && (
        leaderboard.length === 0 ? (
          <p className="empty-leaderboard">¡Ninguna partida registrada aún! Sé la primera.</p>
        ) : (
          <ol className="leaderboard-list">
            {leaderboard.map((item, index) => (
              <li key={index} className="leaderboard-item">
                <span className="leaderboard-position">#{index + 1}</span>
                <span className="leaderboard-name">{item.name}</span>
                <span className="leaderboard-score">{item.score} pts</span>
                <span className="leaderboard-date">{item.date}</span>
              </li>
            ))}
          </ol>
        )
      )}
    </div>
  );
}

export default Leaderboard;