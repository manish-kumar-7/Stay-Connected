import { useEffect, useRef, useState } from "react";

function MessageInput({ onSend, onTyping, onStopTyping }) {
  const [message, setMessage] = useState("");
  const typingTimerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;

    setMessage(value);

    // If the input is empty, immediately stop typing
    if (!value.trim()) {
      onStopTyping();

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      return;
    }

    // Tell server that user is typing
    onTyping();

    // Reset previous timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // If user stops typing for 1 second
    typingTimerRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    onSend(trimmedMessage);

    setMessage("");

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    onStopTyping();
  };

  // Cleanup timer when component is removed
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return (
    <form className="message-input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleChange}
        maxLength={500}
      />

      <button type="submit" disabled={!message.trim()}>
        Send
      </button>
    </form>
  );
}

export default MessageInput;