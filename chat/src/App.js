import React, { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { WaitingRoom } from "./components/WaitingRoom";
import { Chat } from "./components/Chat";
import { LoginForm } from "./components/LoginForm";
import userService from "./services/userService";
import { jwtDecode } from "jwt-decode";

const tokenUtils = {
  getToken: () => localStorage.getItem("authToken"),
  decodeToken: (token) => {
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  },
  isTokenValid: (token) => {
    if (!token) return false;
    const decoded = tokenUtils.decodeToken(token);
    return decoded?.exp * 1000 > Date.now();
  }
};

function App() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState("");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token && tokenUtils.isTokenValid(token)) {
      const decodedUser = tokenUtils.decodeToken(token);
      setUser(decodedUser);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { token } = await userService.login(credentials);
      const decodedUser = tokenUtils.decodeToken(token);
      console.log("handleLogin");
      console.log(decodedUser);
      setUser(decodedUser);
      setAuthError("");
    } catch (error) {
      setAuthError("Ошибка авторизации. Проверьте данные");
      localStorage.removeItem("authToken");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    if (connection) connection.stop();
    setConnection(null);
  };

  const joinChat = async (chatId) => {
    if (!user) return;
    
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5081/hubs/chat", { accessTokenFactory: () => localStorage.getItem("authToken").replace("Bearer ", "") })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (userId, message) => {
      setMessages((prev) => [...prev, { userId, message }]);
    });

    try {
      await connection.start();
      await connection.invoke("JoinChat", chatId);
      
      setConnection(connection);
      setChatId(chatId);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const sendMessage = (chatId, message) => {
    if (connection) {
      connection.invoke("SendMessage", chatId, message);
    }
  };

  const closeChat = async () => {
    if (connection) {
      await connection.stop();
      setConnection(null);
    }
  };

  return (
    <div className="App">
      {!user ? (
        <LoginForm onLogin={handleLogin} error={authError} />
      ) : connection ? (
        <Chat
          messages={messages}
          chatId={chatId}
          user={user}
          sendMessage={sendMessage}
          closeChat={closeChat}
          onLogout={handleLogout}
        />
      ) : (
        <WaitingRoom 
          joinChat={joinChat} 
          onLogout={handleLogout}
          user={user}
        />
      )}
    </div>
  );
}

export default App;