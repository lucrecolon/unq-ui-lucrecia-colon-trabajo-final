import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [cadena, setCadena] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [inputActual, setInputActual] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
      return () => clearInterval(timerId); 
    } 
    
    if (timeLeft === 0 && !gameOver && gameStarted) {
      setGameOver(true);
    }
  }, [gameStarted, gameOver, timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (gameOver) return; 

    const palabra = inputActual.trim().toLowerCase();
    setMensajeError("");
    if (!palabra) return;

    if (cadena.length > 0) {
      const ultimaPalabra = cadena[cadena.length - 1];
      const ultimaLetra = ultimaPalabra.slice(-1);
      
      if (!palabra.startsWith(ultimaLetra)) {
        setMensajeError(`La palabra no respeta la regla. Debe empezar con "${ultimaLetra.toUpperCase()}".`);
        return;
      }
    }

    if (cadena.includes(palabra)) {
      setMensajeError("La palabra ya fue utilizada.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://word-api-hmlg.vercel.app/api/validate?word=${palabra}`);
      
      if (!response.data.exists) {
        setMensajeError("La palabra no existe.");
        setLoading(false);
        return;
      }

      setCadena([...cadena, palabra]);
      setPuntaje(puntaje + palabra.length);
      setInputActual("");
      setTimeLeft(15);
      
      if (!gameStarted) {
        setGameStarted(true);
      }

    } catch (error) {
      console.error(error);
      setMensajeError("Error de conexión al validar la palabra.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setCadena([]);
    setPuntaje(0);
    setInputActual("");
    setMensajeError("");
    setTimeLeft(15);
    setGameStarted(false);
    setGameOver(false);
  };

  return (
    <div className="app-container">
      <h1>Palabras Encadenadas</h1>
      
      <div className="score-panel">
        <h2>Puntaje Total: {puntaje}</h2>
        <p>Palabras válidas: {cadena.length}</p>
        
        <h3 className={timeLeft <= 5 && gameStarted && !gameOver ? 'time-warning' : ''}>
          Tiempo: {gameStarted ? `${timeLeft}s` : "Esperando primera palabra..."}
        </h3>
      </div>

      {gameOver ? (
        <div className="game-over-panel">
          <h2>¡Fin de la Partida!</h2>
          <p>Lograste encadenar <strong>{cadena.length}</strong> palabras válidas.</p>
          <p>Tu puntaje final es de <strong>{puntaje}</strong> puntos.</p>
          
          <button onClick={handleRestart} className="btn-restart">
            Jugar de nuevo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="game-form">
          <input 
            type="text" 
            value={inputActual}
            onChange={(e) => setInputActual(e.target.value)}
            placeholder="Ingresá una palabra..."
            disabled={loading}
            className="game-input"
          />
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Validando...' : 'Enviar'}
          </button>
        </form>
      )}

      {mensajeError && !gameOver && (
        <div className="error-message">
          {mensajeError}
        </div>
      )}

      <div className="history-panel">
        <h3>Cadena actual:</h3>
        <p className="history-text">
          {cadena.length === 0 ? "Aún no ingresaste palabras." : cadena.join(" -> ")}
        </p>
      </div>
    </div>
  );
}

export default App;