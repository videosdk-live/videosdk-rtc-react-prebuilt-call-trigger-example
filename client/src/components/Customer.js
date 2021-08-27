import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import io from "socket.io-client";
import soundfile from "../sound/ringing.mp3";

export default function Customer() {
  const audioRef = useRef();

  const ENDPOINT = process.env.REACT_APP_SERVER_URL;

  const socket = io.connect(ENDPOINT);
  const [status, setStatus] = useState("");

  socket.on("connectionStatus", ({ text, meetingId }) => {
    setStatus(text);

    if (text === "Ringing...") {
      audioRef.current.play();
    } else if (text === "Rejected :(") {
      audioRef.current.pause();
    } else if (text === "Connected!!") {
      audioRef.current.pause();
      callFunc(meetingId);
    }
  });

  const callFunc = async (meetingId) => {
    const videoMeeting = new window.VideoSDKMeeting();
    const apiKey = process.env.REACT_APP_VIDEOSDK_API_KEY; // generated from app.videosdk.live
    const name = "Joan Robbins";
    const config = {
      name: name,
      apiKey: apiKey,
      meetingId: meetingId,

      containerId: null,
      redirectOnLeave: "https://www.videosdk.live/",

      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,

      chatEnabled: true,
      screenShareEnabled: true,
      pollEnabled: true,
      whiteBoardEnabled: true,
      raiseHandEnabled: true,

      recordingEnabled: true,
      recordingWebhookUrl: "https://www.videosdk.live/callback",
      participantCanToggleRecording: true,

      brandingEnabled: true,
      brandLogoURL: "https://picsum.photos/200",
      brandName: "Awesome startup",

      participantCanLeave: true, // if false, leave button won't be visible
    };

    await videoMeeting.init(config);
  };

  useEffect(() => {
    audioRef.current.load();
    socket.emit(
      "login",
      {
        user: {
          name: "Joan Robbins",
          id: "CLIENT",
        },
      },
      (error) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#16161d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {status ? <h1 style={{ color: "#fff" }}>{status}</h1> : null}

      <button
        className="button"
        onClick={() => {
          socket.emit(
            "call-sales",
            {
              name: "Joan Robbins",
            },
            (error) => {
              if (error) {
                alert(error);
              }
            }
          );
        }}
      >
        <h1 style={{ color: "#fff" }}>Execute Call</h1>
      </button>
      <audio ref={audioRef} src={soundfile} />
    </div>
  );
}
