import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import socketIOClient from "socket.io-client";

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

const VideoPlayer = ({ socket }) => {
  //URL submit handlers
  let [videoURL, setVideoURL] = useState(
    "https://www.youtube.com/watch?v=CNjZ1GKZXmc",
  );
  let [formURL, setFormURL] = useState("");
  //Player Controls
  let [playing, setPlaying] = useState(false);
  //Player Ref
  let playerRef = useRef();

  useEffect(() => {}, []);

  //Player emit functions
  const ready = (e) => {
    console.log(playerRef.current);
    const currentURL = playerRef.current.player.props.url;
    socketFunctions(socket);
    socket.emit("ASK_FOR_VIDEO_INFORMATION");
    console.log("Asked!");
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
    socket.on("PLAY", () => {
      setPlaying(true);
    });

    socket.on("PAUSE", (currentTime) => {
      syncTime(currentTime);

      setPlaying(false);
    });

    socket.on("NEW_VIDEO", (data) => {
      setVideoURL(data);
    });

    socket.on("SYNC_TIME", (currentTime) => {
      syncTime(currentTime);
    });

    socket.on("SYNC_VIDEO_INFORMATION", (data) => {
      console.log("Syncing!");
      setVideoURL(data.url);
      syncTime(data.currentTime);
      setPlaying(data.playing);
    });

    socket.on("ASK_FOR_VIDEO_INFORMATION", () => {
      console.log("Received request!!");
      const data = {
        url: videoURL,
        currentTime: playerRef.current.getCurrentTime(),
        playing: playing,
      };
      console.log("info data: ", data);
      socket.emit("SYNC_VIDEO_INFORMATION", data);
    });

    const syncTime = (currentTime) => {
      if (
        playerRef.current.getCurrentTime() < currentTime - 0.5 ||
        playerRef.current.getCurrentTime() > currentTime + 0.5
      ) {
        playerRef.current.seekTo(currentTime);
        setPlaying(true);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setVideoURL(formURL);
    console.log("form", formURL);
    setFormURL("");
    socket.emit("NEW_VIDEO", formURL);
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
