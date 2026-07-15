import './RulesModal.css';

function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2 className="modal-title">¿Cómo Jugar?</h2>
        
        <div className="modal-body">
          <p><strong>El objetivo:</strong> Encadenar la mayor cantidad de palabras posibles antes de que se acabe el tiempo.</p>
          <ul>
            <li>Tenés <strong>15 segundos</strong> por turno, cada palabra que encadenés reinicia el reloj. Si el reloj <strong>llega a cero</strong>, ¡fin de la partida!</li>
            <li>Cada palabra nueva debe empezar con la <strong>última letra</strong> de la palabra anterior. (Ej: cas<strong>a</strong> -{'>'} <strong>a</strong>rbo<strong>l</strong> -{'>'} <strong>l</strong>una).</li>
            <li>No podés usar una palabra que <strong>ya esté</strong> en la cadena actual.</li>
            <li>Solo se cuentan como <strong>palabras válidas</strong> las que estén en el diccionario español.</li>
          </ul>
          <p className="modal-footer-text">¡Cada letra suma 1 punto!</p>
        </div>
      </div>
    </div>
  );
}

export default RulesModal;