import React, { useState, useRef } from "react";
import io from "socket.io-client";
import "../App.css";
import MeetingContianer from "../meetingContianer/MeetingContianer";
import soundfile from "../sound/calling.mp3";

export default function Sales() {
  const audioRef = useRef();
  const ENDPOINT = process.env.REACT_APP_SERVER_URL;
  const socket = io.connect(ENDPOINT);
  const [title, setTitle] = useState("Waiting...");
  const [triggered, setTriggered] = useState(false);
  const [isLoggedin, setisLoggedin] = useState(false);
  const [fromUser, setFromUSer] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [token, setToken] = useState(null);
  const [accepted, setAccepted] = useState(false);

  socket.on("notify", ({ name, from, meetingId, token }) => {
    audioRef.current.play();
    setTitle(`${name} is Calling...`);
    setTriggered(true);
    setFromUSer(from);
    setMeetingId(meetingId);
    setToken(token);
  });

  const callFunc = async () => {
    audioRef.current.pause();
    const videoMeeting = new window.VideoSDKMeeting();
    const apiKey = process.env.REACT_APP_VIDEOSDK_API_KEY; // generated from app.videosdk.live
    const meetingId = Date.now();
    const name = "Sales Name";

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

  return meetingId && token && accepted ? (
    <MeetingContianer meetingId={meetingId} name={"Sales Name"} token={token} />
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
                  // callFunc(meetingId);

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

                  setAccepted(true);
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
