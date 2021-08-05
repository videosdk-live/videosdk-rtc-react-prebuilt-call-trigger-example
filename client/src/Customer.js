import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import io from "socket.io-client";
import soundfile from "./ringing.mp3";

export default function Customer() {
  const audioRef = useRef();

  const ENDPOINT = "http://localhost:5000/";
  const socket = io.connect(ENDPOINT);
  const [status, setStatus] = useState("");

  const getToken = async () => {
    try {
      const response = await fetch(`${ENDPOINT}get-token`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const { token } = await response.json();
      return token;
    } catch (e) {
      console.log(e);
    }
  };

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
    const token = await getToken();

    let name = "Customer";

    const videoMeetingSpecs = {
      micEnabled: true,
      webcamEnabled: true,
      name,
      meetingId,
      redirectOnLeave: window.location.href,
      chatEnabled: true,
      screenShareEnabled: true,
      pollEnabled: true,
      whiteBoardEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      raiseHandEnabled: true,
      token: token,
      containerId: null,
      recordingEnabled: true,
      recordingWebhookUrl: "https://www.videosdk.live/callback",
    };
    await videoMeeting.init(videoMeetingSpecs);
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
