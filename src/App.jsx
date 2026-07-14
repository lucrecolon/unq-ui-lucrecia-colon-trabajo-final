import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './pages/Game';
import GameOver from './pages/GameOver';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/game-over" element={<GameOver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;