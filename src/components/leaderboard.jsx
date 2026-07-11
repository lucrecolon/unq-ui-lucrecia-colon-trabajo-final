import './leaderboard.css';

function Leaderboard({ leaderboard }) {
  return (
    <div className="leaderboard-panel">
      <h3>Top 10 Mejores Puntajes</h3>
      {leaderboard.length === 0 ? (
        <p className="empty-leaderboard">¡Ninguna partida registrada aún! Sé la primera.</p>
      ) : (
        <ol className="leaderboard-list">
          {leaderboard.map((item, index) => (
            <li key={index} className="leaderboard-item">
              <span className="leaderboard-position">#{index + 1}</span>
              <span className="leaderboard-score">{item.score} pts</span>
              <span className="leaderboard-date">{item.date}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Leaderboard;