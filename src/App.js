import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import uniqid from "uniqid";
import qs from "querystring";
import Chat from "./components/Chat";
const socket = socketIOClient("http://localhost:3000");

const App = () => {
  let [room, setRoom] = useState("");

  useEffect(() => {
    if (window.location.hash) {
      console.log("here be the hash! ");
      setRoom(qs.parse(window.location.hash.slice(1)).room);
    } else {
      console.log("no hash!");
    }
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    console.log(window.location);
    setRoom(uniqid.process());
  };

  console.log(room);

  return (
    <div>
      {room && <h1 style={{ textAlign: "center" }}>localhost:3000/{room}</h1>}
      {!room && (
        <button
          style={{
            display: "block",
            margin: "auto",
            marginTop: "50vh",
            width: "50%",
          }}
          onClick={handleClick}
        >
          Create New Room
        </button>
      )}
    </div>
  );
};

export default App;
