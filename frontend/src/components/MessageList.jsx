import { useEffect, useRef } from "react";

function MessageList({ messages, currentUsername }) {
  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <div className="empty-icon">💬</div>

          <h2>No messages yet</h2>

          <p>Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage =
            message.username === currentUsername;

          const messageTime = new Date(
            message.createdAt
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={message._id}
              className={`message-wrapper ${
                isOwnMessage
                  ? "own-message"
                  : "other-message"
              }`}
            >
              <div className="message-bubble">
                {!isOwnMessage && (
                  <div className="message-username">
                    {message.username}
                  </div>
                )}

                <div className="message-text">
                  {message.message}
                </div>

                <div className="message-time">
                  {messageTime}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Invisible element used as the scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;