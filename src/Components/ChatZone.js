import {
  ChevronLeftIcon,
  CloseIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import axios from "axios";

import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { getSender, getSenderInfo } from "../logic/ChatLogic";
import { ChatState } from "../providers/ChatProvider";
import MessageList from "./MessageList";
import { motion } from "framer-motion";
import animationData from "../animations/52671-typing-animation-in-chat.json";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ProfileModal from "./ProfileModal";
import moment from "moment";
import useMessagePagination from "../hooks/useMessagePagination";
import DrawerInfoChat from "./DrawerInfoChat";
import DrawerInfoUser from "./DrawerInfoUser";

const ENDPOINT = "https://zolachatapp.herokuapp.com";

let socket, selectedChatCompare;
function ChatZone({ fetchAgain, setFetchAgain }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue(
    "linear(to-b,whiteAlpha.900,#B1AEC6)",
    "linear(to-b,#1E2B6F,#193F5F)"
  );
  const [loadingNewMessage, setLoadingNewMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { onToggle } = useDisclosure();
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    response,
    setResponse,
  } = ChatState();

  const [pageNumber, setPageNumber] = useState(1);
  const { messages, setMessages, hasMore, loadingMessage, error } =
    useMessagePagination(user, selectedChat, pageNumber);
  const [toggle, setToggle] = useState(false);
  const [pic, setPic] = useState("");
  const [loadingPic, setLoadingPic] = useState(false);
  const fetchMessages = async () => {
    if (!selectedChat) return;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      setLoading(true);
      await axios
        .get(
          `https://zolachatapp.herokuapp.com/api/message/${
            selectedChat._id
          }/${1}`,
          config
        )
        .then((data) => setMessages(data.data));
      setLoading(false);

      if (user) socket.emit("join chat", selectedChat._id);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else
        toast({
          title: "Error Occured",
          description: "Failed to load message",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  const inputRef = useRef(null);
  const selectChange = (event) => {
    const picture = event.target.files && event.target.files[0];
    if (!picture) {
      return;
    }
    if (picture) {
      setLoadingPic(true);
      const data = new FormData();
      console.log(data);
      data.append("file", picture);
      data.append("upload_preset", "chat-chit");
      data.append("cloud_name", "voluu");
      fetch("https://api.cloudinary.com/v1_1/voluu/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoadingPic(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingPic(false);
        });
    }
  };
  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event === "Send") && (newMessage || pic)) {
      if (user) socket.emit("stop typing", selectedChat._id);
      inputRef.current.value = null;
      try {
        setLoadingNewMessage(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "https://zolachatapp.herokuapp.com/api/message",
          {
            multiMedia: pic,
            content: newMessage,
            chatId: selectedChat._id,
            response: response,
          },
          config
        );
        setPic("");
        socket.emit("new message", data);
        setResponse(null);
        setMessages([...messages, data]);
        setLoadingNewMessage(false);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send message",
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    //if user is typing
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timerDiff = timeNow - lastTypingTime;
      if (timerDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const callMess = () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    setNewMessage("");
    axios
      .post(
        "https://zolachatapp.herokuapp.com/api/message",
        {
          content: "📞📞📞📞",
          chatId: selectedChat._id,
        },
        config
      )
      .then((data) => {
        socket.emit("call", data.data);
        setResponse(null);
        setMessages([...messages, data.data]);
        setFetchAgain(!fetchAgain);
      });
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    if (user) {
      socket.emit("setup", user);
      socket.on("connected", () => {
        setSocketConnected(true);
      });
      socket.on("typing", () => {
        setIsTyping(true);
        onToggle();
      });
      socket.on("stop typing", () => {
        setIsTyping(false);
        onToggle();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //notification
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    console.log("");
    socket.on("answer", (answer) => {
      const win = window.open(
        "https://zolachatapp.netlify.app/call/" + answer,
        "Call",
        "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=70,width=1200,height=600"
      );
    });
  }, []);

  return (
    <Box
      w="full"
      h="full"
      bgImage={
        selectedChat
          ? selectedChat.isGroupChat
            ? selectedChat.chatAdmin.pic
            : `url(${getSenderInfo(user, selectedChat.users).pic})`
          : "initial"
      }
      bgColor={useColorModeValue(
        "linear(to-b,whiteAlpha.900,#B1AEC6)",
        "linear(to-b,#1E2B6F,#193F5F)"
      )}
      bgRepeat="no-repeat"
      bgPosition={"center"}
      bgSize="cover"
      position="relative"
    >
      {!selectedChat ? (
        <Box
          boxSize="full"
          backdropFilter="auto"
          backdropBlur="100px"
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            mixBlendMode={"difference"}
            fontSize="3xl"
            textAlign={"center"}
            textColor={"whiteAlpha.900"}
          >
            CHOOSE A CHAT TO GET START
          </Text>
        </Box>
      ) : (
        <>
          <Box
            justifyContent="space-between"
            display={"flex"}
            position="relative"
            boxSize="full"
            backdropFilter="auto"
            backdropBlur="200px"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" m="auto" />
            ) : (
              <Box
                display="flex"
                justifyContent={"flex-end"}
                pos={"absolute"}
                width="100%"
                height="100%"
                flexDir="column"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                {/**user badge */}
                <Box
                  display={"flex"}
                  alignItems="center"
                  position={{ base: "unset", md: "absolute" }}
                  top={5}
                  zIndex={2}
                  left={10}
                  bgGradient={bgColor}
                  minW="300"
                  w={{ base: "full", md: "fit-content" }}
                  p={2}
                  opacity="0.95"
                  transition={"all 0.5s ease-in-out"}
                  _hover={{ opacity: 1 }}
                  borderRadius={{ base: "0", md: "full" }}
                  textColor={
                    colorMode === "light" ? "whiteAlpha.900" : "blackAlpha.900"
                  }
                >
                  <IconButton
                    mx={1}
                    my={2}
                    bg="none"
                    w="50px"
                    h="30px"
                    borderRadius="full"
                    display={{ base: "flex", md: "none" }}
                    icon={<ChevronLeftIcon fontSize={"lg"} />}
                    size="20px"
                    textColor={
                      colorMode === "light"
                        ? "blackAlpha.900"
                        : "whiteAlpha.900"
                    }
                    onClick={() => {
                      selectedChat
                        ? socket.emit("outchat", selectedChat._id)
                        : console.log("out out out");
                      setSelectedChat("");
                    }}
                  />
                  {selectedChat.isGroupChat ? (
                    <AvatarGroup size={"sm"} max={2} marginRight={3}>
                      {selectedChat.users.map((u) => (
                        <Avatar
                          key={u._id}
                          size={"xs"}
                          name={u.fullname}
                          src={u.pic}
                        />
                      ))}
                    </AvatarGroup>
                  ) : (
                    <>
                      <Avatar
                        showBorder={true}
                        size={"md"}
                        marginRight={3}
                        name={user?._id && getSender(user, selectedChat.users)}
                        src={getSenderInfo(user, selectedChat.users).pic}
                      >
                        <AvatarBadge
                          boxSize={5}
                          bg={
                            getSenderInfo(user, selectedChat.users).statusOnline
                              ? "green.500"
                              : "red.500"
                          }
                          borderColor={"whiteAlpha.900"}
                        ></AvatarBadge>
                      </Avatar>
                    </>
                  )}

                  <Text
                    fontWeight={"bold"}
                    textColor={
                      colorMode === "light" ? "black" : "whiteAlpha.900"
                    }
                    w="full"
                    pr="5"
                  >
                    {selectedChat.isGroupChat ? (
                      <div>
                        <UpdateGroupChatModal
                          fetchAgain={fetchAgain}
                          setFetchAgain={setFetchAgain}
                          fetchMessages={fetchMessages}
                        >
                          <Text _hover={{ textDecor: "underline" }}>
                            {selectedChat.chatName}{" "}
                          </Text>
                        </UpdateGroupChatModal>
                        <Text fontWeight={"normal"}>
                          {selectedChat.users.length} members
                        </Text>
                      </div>
                    ) : (
                      <>
                        <Text>{getSender(user, selectedChat.users)}</Text>
                        <Text fontWeight={"normal"} opacity={0.8}>
                          {getSenderInfo(user, selectedChat.users).statusOnline
                            ? "online"
                            : "Last online " +
                              moment(
                                getSenderInfo(user, selectedChat.users)
                                  .updatedAt
                              ).calendar()}
                        </Text>
                      </>
                    )}
                  </Text>
                </Box>
                {/** button group*/}
                <Box
                  position="absolute"
                  top={{ base: 3.5, md: 7 }}
                  right={{ base: 5, md: 10 }}
                  zIndex={2}
                  display="flex"
                  alignItems={"center"}
                >
                  <IconButton
                    onClick={() => {
                      window.open(
                        "https://zolachatapp.netlify.app/call/null",
                        "Call Video",
                        "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=70,width=1200,height=600"
                      );
                      callMess();
                    }}
                    variant={"ghost"}
                    className="transition-opacity"
                    borderRadius="full"
                    bgColor="transparent"
                    display={selectedChat?.isGroupChat && "none"}
                    _hover={{
                      color: "black",
                    }}
                    icon={
                      colorMode === "dark" ? (
                        <PhoneIcon textColor={"whiteAlpha.900"} />
                      ) : (
                        <PhoneIcon textColor={"yellow"} />
                      )
                    }
                  />
                  <div
                    className={`${
                      isOn ? "justify-end" : "justify-start"
                    } w-[50px] h-[30px] bg-slate-400 flex rounded-full p-1 cursor-pointer 
                    `}
                    onClick={() => {
                      toggleSwitch();
                      toggleColorMode();
                    }}
                  >
                    <motion.div
                      className="handle w-[20px] flex justify-center items-center h-[20px]  rounded-full"
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 20,
                      }}
                      onClick={toggleColorMode}
                    >
                      <IconButton
                        variant={"ghost"}
                        className="transition-opacity"
                        borderRadius="full"
                        transform="unset"
                        _hover={{
                          transform: "rotate(40deg)",

                          color: "black",
                          bgGradient:
                            colorMode === "light"
                              ? "linear(to-b,#C39A9E,#808293)"
                              : "linear(to-b,#1E2B6F,#193F5F)",
                        }}
                        icon={
                          colorMode === "light" ? (
                            <MoonIcon textColor={"whiteAlpha.900"} />
                          ) : (
                            <SunIcon textColor={"yellow"} />
                          )
                        }
                      />
                    </motion.div>
                  </div>
                  <DrawerInfoChat
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                  <DrawerInfoUser
                    _user={getSenderInfo(user, selectedChat.users)}
                  />
                </Box>
                <MessageList
                  loadingMessage={loadingMessage}
                  error={error}
                  messages={messages}
                  hasMore={hasMore}
                  setPageNumber={setPageNumber}
                />
                <FormControl
                  onKeyDown={sendMessage}
                  isRequired
                  bottom={0}
                  left={0}
                  p={5}
                  pos="absolute"
                >
                  {isTyping ? (
                    <Fade in={onToggle}>
                      <Box
                        w="fit-content"
                        border={"1px solid black"}
                        display="flex"
                        pos="relative"
                        bottom={-5}
                        bgColor={"blackAlpha.800"}
                        borderRadius={"full"}
                        p={1}
                      >
                        <Text
                          mixBlendMode={"difference"}
                          textColor="whiteAlpha.900"
                          fontSize={12}
                        >
                          {selectedChat.isGroupChat
                            ? getSender(user, selectedChat.users)
                            : selectedChat.users[0]._id !== user._id
                            ? selectedChat.users[1].fullname
                            : selectedChat.users[0].fullname}{" "}
                          is typing
                        </Text>
                      </Box>
                    </Fade>
                  ) : (
                    <></>
                  )}
                  <Box
                    display={`${toggle ? "" : "none"}`}
                    pos="absolute"
                    bottom={"28"}
                    right={5}
                  >
                    <EmojiPicker
                      onEmojiClick={(emojiData, e) => {
                        setNewMessage(newMessage + emojiData.emoji);
                      }}
                      autoFocusSearch={false}
                      theme={colorMode ? Theme.DARK : Theme.LIGHT}
                    />
                  </Box>
                  {pic && (
                    <>
                      <Image
                        pos="absolute"
                        bottom={28}
                        right={5}
                        borderRadius="sm"
                        border="1px solid white"
                        maxH="100px"
                        maxW="100px"
                        w="fit-content"
                        h="fit-content"
                        objectFit="cover"
                        src={pic}
                      />
                      <IconButton
                        pos="absolute"
                        bottom={28}
                        right={5}
                        rounded="full"
                        icon={<CloseIcon />}
                        onClick={() => setPic("")}
                      ></IconButton>
                    </>
                  )}
                  <InputGroup size="lg" marginY={4}>
                    {response && (
                      <Box
                        pos="absolute"
                        bg="gray.500"
                        zIndex={10}
                        top={-10}
                        right={10}
                        p={2}
                        pr={10}
                        borderTopRadius={"xl"}
                      >
                        <Box color={"white.500"} display="flex">
                          <Text fontWeight={"bold"}>
                            {(response?.sender._id !== user._id
                              ? "@" + response?.sender.username
                              : "You") + ": "}
                          </Text>
                          <Text className="truncate" maxW={"200px"} mx={1}>
                            {response?.content}
                          </Text>
                          <IconButton
                            pos="absolute"
                            zIndex={10}
                            top={0}
                            right={0}
                            bg="none"
                            icon={<CloseIcon />}
                            onClick={() => setResponse(null)}
                          ></IconButton>
                        </Box>
                      </Box>
                    )}

                    <Input
                      variant="outline"
                      rounded={"full"}
                      bg="whiteAlpha.900"
                      textColor={"black"}
                      placeholder="Type something..."
                      value={newMessage}
                      onChange={typingHandler}
                      _focus={{
                        opacity: 0.8,
                      }}
                    />
                    <InputRightElement
                      width="9rem"
                      justifyContent={"space-around"}
                    >
                      <Tooltip
                        label={
                          !loadingPic ? "Attach an image" : "Uploading image"
                        }
                        isOpen={loadingPic}
                      >
                        <Input
                          accept="image/*"
                          id="icon-button-file"
                          type="file"
                          className="hidden"
                          ref={inputRef}
                          onChange={selectChange}
                        />
                      </Tooltip>
                      <label htmlFor="icon-button-file">
                        <Text
                          as="span"
                          className={`shadow-md
                            ${
                              colorMode === "light"
                                ? "text-darkblue bg-gradient-to-bl from-whiteAlpha.900 to-[#B1AEC6]"
                                : "text-whiteAlpha.900 bg-gradient-to-tr from-[#1E2B6F] to-[#193F5F]"
                            }   rounded-full text-3xl w-8 h-fit hover:bg-opacity-50`}
                          cursor={"pointer"}
                        >
                          <i class="fas fa-image mr-2 mt-2 "></i>
                        </Text>
                      </label>
                      <Text
                        cursor={"pointer"}
                        className={`shadow-md
                      ${
                        colorMode === "light"
                          ? "text-darkblue bg-gradient-to-bl from-whiteAlpha.900 to-[#B1AEC6]"
                          : "text-whiteAlpha.900 bg-gradient-to-tr from-[#1E2B6F] to-[#193F5F]"
                      }
                      rounded-full text-3xl w-8 h-8  hover:bg-opacity-50`}
                        onClick={() => setToggle(!toggle)}
                      >
                        <i className="fa fa-smile" aria-hidden="true"></i>
                      </Text>

                      <Text
                        cursor={"pointer"}
                        className={`shadow-md
                      ${
                        colorMode === "light"
                          ? "text-darkblue bg-gradient-to-bl from-whiteAlpha.900 to-[#B1AEC6]"
                          : "text-whiteAlpha.900 bg-gradient-to-tr from-[#1E2B6F] to-[#193F5F]"
                      }
                      rounded-full text-3xl w-8 h-8  hover:bg-opacity-50`}
                        onClick={() => sendMessage("Send")}
                      >
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                      </Text>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default ChatZone;
