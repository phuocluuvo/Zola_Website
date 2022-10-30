import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";

export default function CallPage() {
  const { caller } = useParams();
  let localStream;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    const peer = new Peer(userInfo._id);
    console.log("chay useEffect");
    peer.on("open", () => {
      console.log("chay open");
      openStream().then((stream) => {
        playStream("me", stream);
        localStream = stream;
        if (caller != "null") {
          var ac = window.confirm("Co Nhan Cuoc Goi");
          if (ac) {
            const call = peer.call(caller, stream);
            call.on("stream", (remoteStream) => playStream("en", remoteStream));
          }
        } else {
          peer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (remoteStream) => playStream("en", remoteStream));
          });
        }
      });
    });
  }, []);

  function openStream() {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }

  function playStream(idVideo, stream) {
    const video = document.getElementById(idVideo);
    video.srcObject = stream;
    video.play();
  }

  let stateVideo = true;
  const video = () => {
    localStream.getVideoTracks()[0].enabled = !stateVideo;
    stateVideo = !stateVideo;
  };
  let stateSound = true;
  const sound = () => {
    localStream.getAudioTracks()[0].enabled = !stateSound;
    stateSound = !stateSound;
  };

  return (
    <div>
      <video className="w-20 h-20" id="me" muted></video>
      <video className="w-150 h-150" id="en"></video>

      <div className="flex flex-row justify-around">
        <div>
          Mute Mic
          <input type="checkbox" onClick={sound}></input>
        </div>
        <div>
          Turn off Video
          <input type="checkbox" onClick={video}></input>
        </div>

        <button
          className=" bg-slate-400"
          onClick={() => {
            window.close();
          }}
        >
          Hang off
        </button>
      </div>
    </div>
  );
}
