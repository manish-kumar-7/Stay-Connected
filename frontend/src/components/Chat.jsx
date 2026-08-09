
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const SOCKET_URL = "http://localhost:5000";
const API_URL = "http://localhost:5000";

function Chat({ username }) {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [onlineUserList, setOnlineUserList] = useState([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const socketRef = useRef(null);

  
  const onlineUsersRef = useRef(null);

  
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socketRef.current = socket;

   
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);

      setConnectionError(false);

     
      socket.emit("join-chat", username);
    });

  
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);

      setConnectionError(true);
    });

   
    socket.on("receive-message", (message) => {
      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (item) => item._id === message._id
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [...previousMessages, message];
      });
    });

  
    socket.on("online-users", ({ count, users }) => {
      console.log("Online users:", users);

      setOnlineUsers(count);
      setOnlineUserList(users);
    });

   
    socket.on("user-joined", ({ username: joinedUsername }) => {
      console.log(`${joinedUsername} joined the chat`);
    });

    
    socket.on("user-left", ({ username: leftUsername }) => {
      console.log(`${leftUsername} left the chat`);
    });

    
    socket.on("user-typing", ({ username: typingUsername }) => {
      if (typingUsername !== username) {
        setTypingUser(typingUsername);
      }
    });

   
    socket.on("user-stop-typing", ({ username: stoppedUsername }) => {
      if (stoppedUsername !== username) {
        setTypingUser("");
      }
    });

  
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [username]);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        onlineUsersRef.current &&
        !onlineUsersRef.current.contains(event.target)
      ) {
        setShowOnlineUsers(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/messages`);

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const result = await response.json();

        setMessages(result.data || []);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    fetchMessages();
  }, []);

 
  const sendMessage = (message) => {
    if (!socketRef.current || !message.trim()) {
      return;
    }

    socketRef.current.emit("send-message", {
      username,
      message: message.trim(),
    });

    socketRef.current.emit("stop-typing", {
      username,
    });

    setTypingUser("");
  };

 
  const handleTyping = () => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit("typing", {
      username,
    });
  };

 
  const handleStopTyping = () => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit("stop-typing", {
      username,
    });
  };

 
  const toggleOnlineUsers = () => {
    setShowOnlineUsers((previous) => !previous);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">

      
        <header className="chat-header">

   
          <div
            className="online-users-wrapper"
            ref={onlineUsersRef}
          >
            <h1>Stay Connected</h1>

            <button
              type="button"
              className="online-users-button"
              onClick={toggleOnlineUsers}
            >
              {onlineUsers}{" "}
              {onlineUsers === 1 ? "user" : "users"} online
            </button>

          
            {showOnlineUsers && (
              <div className="online-users-dropdown">
                <div className="online-users-title">
                  Online Users
                </div>

                {onlineUserList.length > 0 ? (
                  <div className="online-users-list">
                    {onlineUserList.map((onlineUsername) => (
                      <div
                        className="online-user-item"
                        key={onlineUsername}
                      >
                        <span className="online-user-dot"></span>

                        <span className="online-user-name">
                          {onlineUsername}
                        </span>

                        {onlineUsername === username && (
                          <span className="online-user-you">
                            You
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-online-users">
                    No users online
                  </div>
                )}
              </div>
            )}
          </div>

         
          <div className="user-info">
            <div className="user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>
              <span>{username}</span>

              <div className="user-status">
                <span className="online-dot"></span>
                Online
              </div>
            </div>
          </div>

        </header>

     
        {connectionError && (
          <div className="connection-error">
            Unable to connect to the chat server.
          </div>
        )}

     
        <MessageList
          messages={messages}
          currentUsername={username}
        />

   
        {typingUser && (
          <div className="typing-indicator">
            {typingUser} is typing...
          </div>
        )}

      
        <MessageInput
          onSend={sendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />

      </div>
    </div>
  );
}

export default Chat;

