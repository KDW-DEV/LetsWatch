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
  let [videoURL, setVideoURL] = useState("");
  const playerRef = useRef();

  const ready = (e) => {
    console.log(playerRef.current.getCurrentTime());
  };

  const pause = (e) => {
    console.log(playerRef.current.getCurrentTime());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("NEW_VIDEO", videoURL);
  };

  const handleChange = (e) => {
    setVideoURL(e.target.value);
  };

  return (
    <div>
      <ReactPlayer
        onReady={ready}
        onPause={pause}
        ref={playerRef}
        url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
      />
      <form onSubmit={handleSubmit}>
        <input
          className="white-text"
          type="text"
          placeholder="Insert Youtube link"
          id="videoUrl"
          value={videoURL}
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
