import React, { useEffect, useState } from "react";
import Youtube from "react-youtube";
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
  let [player, setPlayer] = useState();

  const getYoutubeIdByUrl = (url) => {
    var ID = "";

    url = url
      .replace(/(>|<)/gi, "")
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_-]/i);
      ID = ID[0];
    } else {
      ID = url;
    }
    return ID;
  };

  const syncTime = (currentTime) => {
    if (
      player.getCurrentTime() < currentTime - 0.5 ||
      player.getCurrentTime() > currentTime + 0.5
    ) {
      player.seekTo(currentTime);
      player.playVideo();
    }
  };

  const onStateChanged = (e) => {
    setPlayer(e.target);
    console.log("player", e);
    if (player) {
      socket.on("PLAY", () => {
        console.log("Player:", player);
        player.playVideo();
      });

      socket.on("PAUSE", () => {
        player.pauseVideo();
      });

      socket.on("SYNC_TIME", (currentTime) => {
        syncTime(currentTime);
      });

      socket.on("NEW_VIDEO", (videoUrl) => {
        player.loadVideoById({
          videoId: getYoutubeIdByUrl(videoUrl),
        });
        setVideoURL("");
      });

      socket.on("ASK_FOR_VIDEO_INFORMATION", () => {
        const data = {
          url: player.getVideoUrl(),
          currentTime: player.getCurrentTime(),
        };
        console.log("video info: ", data);
        socket.emit("SYNC_VIDEO_INFORMATION", data);
      });

      socket.on("SYNC_VIDEO_INFORMATION", (data) => {
        const videoId = getYoutubeIdByUrl(data.url);
        player.loadVideoById({
          videoId: videoId,
          startSeconds: data.currentTime,
        });
      });

      switch (player.getPlayerState()) {
        case -1:
          socket.emit("PLAY");
          break;
        case 0:
          break;
        case 1:
          socket.emit("SYNC_TIME", player.getCurrentTime());
          socket.emit("PLAY");
          console.log(player.getCurrentTime());
          break;
        case 2:
          socket.emit("PAUSE");
          break;
        case 3:
          socket.emit("SYNC_TIME", player.getCurrentTime());
          break;
        case 5:
          break;
        default:
          break;
      }
    }
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("NEW_VIDEO", videoURL);
  };

  let handleChange = (e) => {
    setVideoURL(e.target.value);
  };

  return (
    <div>
      <Youtube
        opts={opts}
        videoId="rTs4ZpM3xWs"
        onStateChange={onStateChanged}
        className="yt"
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
