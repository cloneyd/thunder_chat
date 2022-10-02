import './App.css';
import { Link } from "react-router-dom";

function App() {
  document.title = "Welcome Page | Thunder Chat";

  return (
    <div className="App">
      <h1>ITS HOME PAGE U DIG</h1>
      <Link to="/login" className="button-link">Login</Link>
      <Link to="/register" className="button-link">Register</Link>
      <Link to="/chats" className="button-link">Chat</Link>
      <Link to="/video-call" className="button-link">Call</Link>
    </div>
  );
}

export default App;
