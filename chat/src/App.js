import React, { useState } from "react";
import { WaitingRoom } from "./components/WaitingRoom";
import { HubConnectionBuilder } from "@microsoft/signalr"
import { Chat } from "./components/Chat";

function App() {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState("");

  const joinChat = async (chatId, userId) => {
    var connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5081/hubs/chat")
      .withAutomaticReconnect()
      .build();

      connection.on("RecieveMessage", (userId, message) => {
        setMessages((messages) => [...messages, {userId, message}]);
      });

      try {
        await connection.start();
        await connection.invoke("JoinChat", {chatId, userId});

        setConnection(connection);
        setChatId(chatId);
      } catch (error) {
        console.log(error);
      }
  }

  const sendMessage = (message) => {
    connection.invoke("SendMessage", message);
  }

  const closeChat = async () => {
    await connection.stop();
    setConnection(null);
  }

  return (
    <div className="App">
      {connection ? <Chat messages={messages} chatId={chatId} sendMessage={sendMessage} closeChat={closeChat}/> : <WaitingRoom joinChat={joinChat} />}
    </div>
  );
}

export default App;
