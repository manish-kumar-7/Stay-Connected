import { useState } from "react";
import Chat from "./components/Chat";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    setUsername(trimmedUsername);
    setJoined(true);
  };

  if (!joined) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo">V</div>

          <h1>Stay Connected</h1>

          <p>Join the conversation and start chatting in real time.</p>

          <form onSubmit={handleJoin}>
            <label htmlFor="username">Enter your name</label>

            <input
              id="username"
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
            />

            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return <Chat username={username} />;
}

export default App;