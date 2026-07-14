import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GameOver() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const puntaje = location.state?.puntaje || 0;
  const palabras = location.state?.palabras || 0;

  const [decision, setDecision] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  const handleSaveScore = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setErrorInput("¡El nombre no puede estar vacío!");
      return;
    }

    const saved = localStorage.getItem('encadenadas_leaderboard');
    const leaderboard = saved ? JSON.parse(saved) : [];

    const nuevoRegistro = {
      name: playerName.trim(),
      score: puntaje,
      date: new Date().toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };

    const nuevoTop10 = [...leaderboard, nuevoRegistro]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    localStorage.setItem('encadenadas_leaderboard', JSON.stringify(nuevoTop10));
    setScoreSaved(true);
  };

  const playAgain = () => {
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="game-over-panel">
        <h2 className="go-title">¡Fin de la Partida!</h2>
        <p className="go-stats">Lograste encadenar <strong>{palabras}</strong> palabras.</p>
        <p className="go-stats">Tu puntaje final es de <strong>{puntaje}</strong> puntos.</p>
        
        {decision === null && (
          <div className="decision-box">
            <p>¿Querés guardar tu score en el Leaderboard?</p>
            <div className="btn-group">
              <button onClick={() => setDecision('yes')} className="btn-submit">Sí, guardar</button>
              <button onClick={() => setDecision('no')} className="btn-restart">No, gracias</button>
            </div>
          </div>
        )}

        {decision === 'yes' && !scoreSaved && (
          <form onSubmit={handleSaveScore} className="save-form">
            <p>Ingresá tu nombre para el ranking:</p>
            <input 
              type="text" 
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setErrorInput("");
              }}
              placeholder="Tu nombre..."
              className="game-input"
            />
            {errorInput && <p className="error-message" style={{fontSize: '0.9em', marginTop: '5px'}}>{errorInput}</p>}
            <div className="btn-group">
              <button type="submit" className="btn-submit">Guardar Score</button>
            </div>
          </form>
        )}

        {(scoreSaved || decision === 'no') && (
          <div className="play-again-box">
            {scoreSaved && <p style={{color: '#4ade80', fontWeight: 'bold'}}>¡Score guardado exitosamente!</p>}
            <button onClick={playAgain} className="btn-submit btn-large">Volver a jugar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameOver;