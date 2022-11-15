import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import axios from "axios";
import { Avatar, Box, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { MdMic, MdMicOff } from "react-icons/md";
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
} from "react-icons/bs";
import { ImPhoneHangUp } from "react-icons/im";

export default function CallPage() {
  const { id, user } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [friend, setFriend] = useState();
  const [stateVideo, setstateVideo] = useState(true);
  const [stateSound, setstateSound] = useState(true);
  const [localStream, setlocalStream] = useState();
  async function getInfo() {
    await axios
      .get(`https://zolachatapp.herokuapp.com/api/user/${user}/id`)
      .then((data) => {
        setFriend(data.data);
      });
  }
  useEffect(() => {
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const peer = new Peer(userInfo._id);
    peer.on("open", () => {
      openStream().then((stream) => {
        playStream("me", stream);
        setlocalStream(stream);
        if (id != "null") {
          var ac = window.confirm("Co Nhan Cuoc Goi");
          if (ac) {
            const call = peer.call(id, stream);
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

  const video = () => {
    localStream.getVideoTracks()[0].enabled = !stateVideo;
    setstateVideo(!stateVideo);
  };

  const sound = () => {
    localStream.getAudioTracks()[0].enabled = !stateSound;
    setstateSound(!stateSound);
  };
  return (
    <Box className="bg-slate-700 h-[100vh] w-full">
      <Box pos="relative" w="100%" justifyContent={"space-evenly"}>
        <Box pos="absolute">
          <video
            className={`bg-black p-[0.5] rounded-xl ml-3 mt-3 w-[200px] h-1/3 ${
              !stateVideo && "opacity-0 -z-1"
            }`}
            id="me"
            muted
          ></video>
          <Text
            textColor={"whiteAlpha.900"}
            pos="absolute"
            bg="blackAlpha.900"
            px="2"
            py="1"
            rounded={"md"}
            top={7}
            left={7}
          >
            You
          </Text>
          <Box
            opacity={stateVideo ? 1 : 0}
            display={stateVideo && "none"}
            w="full"
            h="full"
            bg="blackAlpha.700"
            pos="absolute"
            top="0"
            left="0"
            zIndex={stateVideo ? 2 : -1}
          >
            <Avatar
              src={friend?.image}
              name={friend?.fullname}
              size="2xl"
            ></Avatar>
          </Box>
        </Box>
        <video
          className={` bg-black p-2 w-full h-[100vh] m-auto `}
          id="en"
        ></video>

        <Text
          textColor={"whiteAlpha.900"}
          pos="absolute"
          bg="blackAlpha.900"
          px="2"
          py="1"
          rounded={"md"}
          bottom={0}
          right={0}
        >
          {friend?.fullname}
        </Text>
      </Box>
      <Box
        w={{ base: "300px", md: "400px" }}
        mx={"auto"}
        bottom={{ base: "16", md: "24" }}
        className=" rounded-full flex flex-row items-center justify-evenly relative bg-slate-400 bg-opacity-50 
        backdrop-blur-lg border-white border left-5 px-4 py-2"
      >
        <Tooltip label={!stateSound ? "Unmute" : "Mute"}>
          <IconButton
            rounded={"full"}
            bgColor={!stateSound ? "red.500" : "gray.500"}
            icon={!stateSound ? <MdMicOff /> : <MdMic />}
            className={`text-white 
                            `}
            _hover={{ opacity: 0.8 }}
            cursor={"pointer"}
            onClick={sound}
          ></IconButton>
        </Tooltip>
        <Tooltip label={!stateVideo ? "Turn on Camera" : "Turn off Camera"}>
          <IconButton
            rounded={"full"}
            bgColor={!stateVideo ? "red.500" : "gray.500"}
            icon={
              !stateVideo ? (
                <BsFillCameraVideoOffFill />
              ) : (
                <BsFillCameraVideoFill />
              )
            }
            className={`text-white 
                            `}
            _hover={{ opacity: 0.8 }}
            cursor={"pointer"}
            onClick={video}
          ></IconButton>
        </Tooltip>
        <Tooltip label={"Hang up"}>
          <IconButton
            variant={"ghost"}
            className=" bg-slate-400"
            onClick={() => {
              window.close();
            }}
            rounded="full"
            icon={<ImPhoneHangUp color="red" />}
          >
            Hang off
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
