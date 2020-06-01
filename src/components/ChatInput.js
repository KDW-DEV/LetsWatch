import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:3000");

const ChatInput = ({ chatHistory, setChatHistory }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("message", (data) => {
      let newHistory = chatHistory;
      newHistory.push(data);
      setChatHistory([...newHistory]);
      console.log(chatHistory);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit("message", message);
    setMessage("");
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form action="">
      <input onChange={handleInput} id="m" autoComplete="off" value={message} />
      <button onClick={sendMessage}>Send</button>
    </form>
  );
};

export default ChatInput;
