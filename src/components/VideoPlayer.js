import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import socketIOClient from "socket.io-client";
import qs from "querystring";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    controls: 2,
    rel: 0,
    modestbranding: 1,
    autoplay: 1,
  },
};

const VideoPlayer = ({ room }) => {
  //Socket
  let [socket, setSocket] = useState();
  //URL submit handlers
  let [videoURL, setVideoURL] = useState(
    "https://www.youtube.com/watch?v=CNjZ1GKZXmc",
  );
  let [formURL, setFormURL] = useState("");
  //Player Controls
  let [playing, setPlaying] = useState(false);
  //Player Ref
  let playerRef = useRef();

  useEffect(() => {
    console.log("useEffect!", playerRef);
    const socket = socketIOClient("/");
    setSocket(socket);

    socket.on("connect", () => {
      if (room) {
        console.log("joinedRoom");
        socket.emit("joinRoom", {
          room: room,
        });
      } else {
        console.log("joinedRoom");

        socket.emit("joinRoom", {
          room: qs.parse(window.location.hash.slice(1)).room,
        });
      }
      console.log("CONNECTED");
      socketFunctions(socket);
      socket.emit("ASK_FOR_VIDEO_INFORMATION");
    });
  }, []);

  //Player emit functions

  const ready = (e) => {
    console.log("player is ready. player object: ", playerRef.current);
    const currentURL = playerRef.current.player.props.url;
    console.log(videoURL);
    socketFunctions(socket);
  };

  const pause = (e) => {
    console.log(playerRef.current.getCurrentTime());
    socket.emit("PAUSE", playerRef.current.getCurrentTime());
  };

  const play = (e) => {
    socket.emit("PLAY");
  };

  const seek = (e) => {
    socket.emit("SYNC_TIME", playerRef.current.getCurrentTime());
    socket.emit("PLAY");
  };

  //Socket on Functions

  const socketFunctions = (socket) => {
    console.log("socket object: ", socket);

    socket.on("PLAY", () => {
      console.log("onPlay");
      setPlaying(true);
    });

    socket.on("PAUSE", (currentTime) => {
      console.log("onPause");

      syncTime(currentTime);

      setPlaying(false);
    });

    socket.on("NEW_VIDEO", (data) => {
      console.log("old url", videoURL);
      console.log("onNewVideo", data);

      setVideoURL(data);
    });

    socket.on("SYNC_TIME", (currentTime) => {
      console.log("onSyncTime");
      syncTime(currentTime);
    });

    socket.on("ASK_FOR_VIDEO_INFORMATION", () => {
      console.log("Received request!!");
      const data = {
        url: videoURL,
        currentTime: playerRef.current.getCurrentTime(),
        playing: true,
      };
      console.log("data to send: ", data);
      socket.emit("SYNC_VIDEO_INFORMATION", data);
    });

    socket.on("SYNC_VIDEO_INFORMATION", (data) => {
      console.log("Data received! Syncing data...");
      console.log(data);
      setVideoURL(data.url);
      syncTime(data.currentTime);
      setPlaying(true);
    });

    const syncTime = (currentTime) => {
      if (
        playerRef.current.getCurrentTime() < currentTime - 0.5 ||
        playerRef.current.getCurrentTime() > currentTime + 0.5
      ) {
        console.log("Time synced!");
        playerRef.current.seekTo(currentTime);
        setPlaying(true);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("newVideo submit", socket);
    socket.emit("NEW_VIDEO", formURL);
    setFormURL("");
  };

  const handleChange = (e) => {
    setFormURL(e.target.value);
  };

  return (
    <div>
      <div className="playerHolder">
        <ReactPlayer
          className="player"
          onReady={ready}
          onPause={pause}
          onPlay={play}
          onSeek={seek}
          playing={playing}
          ref={playerRef}
          url={videoURL}
          volume={0.2}
          width={"90vw"}
          height={"75vh"}
        />
        <h3>{}</h3>
        <button
          type="button"
          onClick={() => {
            playerRef.current.seekTo(
              playerRef.current.getCurrentTime() + 10,
              "seconds",
            );
            setPlaying(true);
          }}
        >
          +10 sec
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="white-text"
          type="text"
          placeholder="Insert Youtube link"
          id="videoUrl"
          value={formURL}
          onChange={handleChange}
        />

        <button type="submit" className="black">
          Load new Video
        </button>
      </form>
    </div>
  );
};

export default VideoPlayer;
