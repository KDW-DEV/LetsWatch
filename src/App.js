import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import uniqid from "uniqid";
import qs from "querystring";
import Chat from "./components/Chat";
import VideoPlayer from "./components/VideoPlayer";
import { disconnect } from "process";
//const socket = socketIOClient("http://localhost:3000");
const socket = socketIOClient({ transports: ["websocket"], upgrade: false });

const App = () => {
  let [room, setRoom] = useState("");
  let [users, setUsers] = useState(0);

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
    let newRoom = uniqid.process();
    setRoom(newRoom);
  };

  console.log("new room: ", room);

  return (
    <div>
      {room && (
        <div>
          <h1 style={{ textAlign: "center" }}>
            https://letswatchthis.herokuapp.com/{room}
          </h1>
          <h4 style={{ textAlign: "center" }}>
            Number of users in room: {users}
          </h4>
          <VideoPlayer socket={socket} room={room} />
        </div>
      )}
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
