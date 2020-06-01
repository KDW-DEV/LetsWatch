import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import ChatInput from "./ChatInput";

const Chat = () => {
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div>
      <ul id="messages">
        <li>DEFAULT</li>
        {chatHistory.map((chat) => (
          <li key={Math.random()}>{chat}</li>
        ))}
      </ul>
      <ChatInput chatHistory={chatHistory} setChatHistory={setChatHistory} />
    </div>
  );
};

export default Chat;
