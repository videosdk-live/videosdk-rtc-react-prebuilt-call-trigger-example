import React, { useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";
import soundfile from "./calling.mp3";

export default function Sales() {
  const audioRef = useRef();
  const ENDPOINT = "http://localhost:5000/";
  const socket = io.connect(ENDPOINT);
  const [title, setTitle] = useState("Waiting...");
  const [triggered, setTriggered] = useState(false);
  const [isLoggedin, setisLoggedin] = useState(false);
  const [fromUser, setFromUSer] = useState("");

  socket.on("notify", ({ name, from }) => {
    audioRef.current.play();
    setTitle(`${name} is Calling...`);
    setTriggered(true);
    setFromUSer(from);
  });

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

  const getMeetingId = async (token) => {
    try {
      const VIDEOSDK_API_ENDPOINT = `https://api.zujonow.com/api/meetings`;
      const options = {
        method: "POST",
        headers: {
          Authorization: token,
        },
      };
      const response = await fetch(VIDEOSDK_API_ENDPOINT, options)
        .then(async (result) => {
          const { meetingId } = await result.json();
          return meetingId;
        })
        .catch((error) => console.log("error", error));
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const callFunc = async () => {
    audioRef.current.pause();
    const videoMeeting = new window.VideoSDKMeeting();
    const token = await getToken();
    const meetingId = await getMeetingId(token);
    if (meetingId) {
      let name = "Sales Person";

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

      socket.emit(
        "accept-call",
        {
          to: fromUser,
          meetingId: meetingId,
        },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
    }
  };

  const login = () => {
    setisLoggedin(true);
    audioRef.current.load();
    socket.emit(
      "login",
      {
        user: {
          name: "John",
          id: "SALES",
          isAvailable: true,
        },
      },
      (error) => {
        if (error) {
          console.log(error);
          alert(error);
        }
      }
    );
  };

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
      {isLoggedin ? (
        <>
          <h1 style={{ color: "#fff" }}>{title}</h1>
          {triggered ? (
            <div>
              <button
                style={{ backgroundColor: "green" }}
                className="button"
                onClick={(e) => {
                  e.preventDefault();
                  callFunc();
                }}
              >
                <h1 style={{ color: "#fff" }}>Accept</h1>
              </button>

              <button
                style={{ marginLeft: 8 }}
                className="button"
                onClick={(e) => {
                  e.preventDefault();
                  audioRef.current.pause();
                  socket.emit(
                    "reject-call",
                    {
                      to: fromUser,
                    },
                    (error) => {
                      if (error) {
                        console.log(error);
                      }
                    }
                  );
                  setTriggered(false);
                  setTitle("Waiting...");
                }}
              >
                <h1 style={{ color: "#fff" }}>Reject</h1>
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <button className="button" onClick={login}>
          <h1 style={{ color: "#fff" }}>Login as Sales</h1>
        </button>
      )}
      <audio ref={audioRef} src={soundfile} />
    </div>
  );
}
