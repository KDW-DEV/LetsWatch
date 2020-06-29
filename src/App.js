import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { Jumbotron, Button } from "reactstrap";
import uniqid from "uniqid";
import qs from "querystring";
import VideoPlayer from "./components/Room/VideoPlayer";
import { disconnect } from "process";
//const socket = socketIOClient("http://localhost:3000");
const socket = socketIOClient({ transports: ["websocket"], upgrade: false });

const App = () => {
  let [room, setRoom] = useState("");
  let [userCount, setUserCount] = useState(0);

  useEffect(() => {
    socket.on("getCount", (data) => {
      console.log("count", Object.keys(data).length);
      setUserCount(Object.keys(data).length);
    });

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

  const copyLink = (e) => {
    e.preventDefault();
    let copiedLink = `https://letswatchthis.herokuapp.com/${room}`;
    navigator.clipboard.writeText(copiedLink).then(
      () => {
        console.log("successfully copied link : ", copiedLink);
      },
      () => {
        console.log("error copying link!");
      },
    );
  };

  console.log("new room: ", room);

  return (
    <div className="bottomDiv">
      {room && (
        <div>
          <h1
            onMouseDown={copyLink}
            style={{ color: "white", textAlign: "center", cursor: "pointer" }}
          >
            https://letswatchthis.herokuapp.com/{room}🔗
          </h1>
          <h4 style={{ color: "white", textAlign: "center" }}>
            Number of users in room: {userCount}
          </h4>
          <VideoPlayer users={userCount} socket={socket} room={room} />
        </div>
      )}
      {!room && (
        <div>
          <Jumbotron
            style={{ backgroundColor: "#1a1a1a", color: "white" }}
            className="animate__animated animate__fadeInDown"
            fluid
          >
            <h1 style={{ textAlign: "center" }}>LetsWatchThis</h1>
            <h1 style={{ textAlign: "center" }}>💪😂👌</h1>
          </Jumbotron>
          <div className="container">
            <Button
              className="createbutton animate__animated animate__fadeInDown"
              onClick={handleClick}
            >
              <h4>Create New Room</h4>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
