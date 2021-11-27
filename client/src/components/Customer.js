import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import io from "socket.io-client";
import soundfile from "../sound/ringing.mp3";
import MeetingContianer from "../meetingContianer/MeetingContianer";

export default function Customer() {
  const audioRef = useRef();

  const ENDPOINT = process.env.REACT_APP_SERVER_URL;

  const [meetingId, setMeetingId] = useState(null);
  const [token, setToken] = useState(null);

  const socket = io.connect(ENDPOINT);
  const [status, setStatus] = useState("");

  socket.on("connectionStatus", ({ text, meetingId, token }) => {
    setStatus(text);

    if (text === "Ringing...") {
      audioRef.current.play();
    } else if (text === "Rejected :(") {
      audioRef.current.pause();
    } else if (text === "Connected!!") {
      audioRef.current.pause();
      // callFunc(meetingId);
      setMeetingId(meetingId);
      setToken(token);
    }
  });

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

  return meetingId && token ? (
    <MeetingContianer
      name={"Joan Robbins"}
      meetingId={meetingId}
      token={token}
    />
  ) : (
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
