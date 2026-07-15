import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Leaderboard from '../components/Leaderboard';
import logoImage from '../assets/background1.png';

function Game() {
  const [cadena, setCadena] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [inputActual, setInputActual] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameStarted, setGameStarted] = useState(false);
  
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('encadenadas_leaderboard');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
      return () => clearInterval(timerId); 
    } 
    
    if (timeLeft === 0 && gameStarted) {
      navigate('/game-over', { state: { puntaje, palabras: cadena.length } });
    }
  }, [gameStarted, timeLeft, navigate, puntaje, cadena.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  return (
    <div className="app-container">
      <div className="game-header">
        <h1>PALABRAS ENCADENADAS</h1>
      </div>

      <div className="game-card">
        <div className="score-panel">
          <h2>Puntaje Total: {puntaje}</h2>
          <p>Palabras válidas: {cadena.length}</p>
          <h3 className={timeLeft <= 5 && gameStarted ? 'time-warning' : ''}>
            Tiempo: {gameStarted ? `${timeLeft}s` : "Ingresá la primera palabra..."}
          </h3>
        </div>

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

        {mensajeError && (
          <div className="error-message">
            {mensajeError}
          </div>
        )}
      </div>

      <div className="game-card history-panel">
        <h3>Cadena actual:</h3>
        <p className="history-text">
          {cadena.length === 0 ? "Aún no ingresaste palabras." : cadena.join(" -> ")}
        </p>
      </div>

      <Leaderboard leaderboard={leaderboard} />
    </div>
  )};

export default Game;