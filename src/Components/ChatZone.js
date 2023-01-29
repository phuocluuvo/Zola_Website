import { ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Fade,
  FormControl,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import axios from "axios";
import Lottie from "react-lottie";
import io from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import { getSender, getSenderInfo } from "../logic/ChatLogic";
import { ChatState } from "../providers/ChatProvider";
import MessageList from "./modal/MessageList";
import animationData from "../animations/81154-typing-in-chat.json";
import UpdateGroupChatModal from "./modal/UpdateGroupChatModal";
import moment from "moment";
import useMessagePagination from "../hooks/useMessagePagination";
import DrawerInfoChat from "./drawer/DrawerInfoChat";
import DrawerInfoUser from "./drawer/DrawerInfoUser";
import { IoResize } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiFillSmile } from "react-icons/ai";
import { MdAddPhotoAlternate } from "react-icons/md";
import UploadMenuButton from "./button/UploadMenuButton";
import AddFriendButton from "./button/AddFriendButton";
import { HiVideoCamera } from "react-icons/hi";
import {
  getMessagesPagination,
  sendMedia,
  sendNewMessage,
} from "../apis/messages.api";

const ENDPOINT = process.env.REACT_APP_PORT;

let socket, selectedChatCompare;
function ChatZone({ fetchAgain, setFetchAgain }) {
  const { colorMode } = useColorMode();
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
  const [video, setVideo] = useState("");
  const [file, setFile] = useState("");
  const [loadingPic, setLoadingPic] = useState(false);
  const [toggleExpand, setToggleExpand] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      setLoading(true);
      await getMessagesPagination(selectedChat._id, 1).then((data) =>
        setMessages(data.data)
      );
      setLoading(false);

      if (user) socket.emit("join chat", selectedChat._id);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else
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

  const selectImageChange = (event) => {
    const picture = event.target.files && event.target.files[0];
    if (!picture) {
      return;
    }
    if (picture) {
      setLoadingPic(true);
      sendMedia(picture, "image")
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());

          setLoadingPic(false);
        })
        .catch((err) => {
          setLoadingPic(false);
        });
    }
  };
  const selectVideoChange = (event) => {
    const video = event.target.files[0];
    if (!video) {
      return;
    }
    if (video) {
      sendMedia(video, "video")
        .then((res) => res.json())
        .then((data) => {
          setVideo(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };
  const selectFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (file) {
      sendMedia(file, "raw")
        .then((res) => res.json())
        .then((data) => {
          setFile(data.url.toString());

          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };
  const sendMessage = async (e) => {
    if (
      ((e.keyCode == 13 && !e.shiftKey) || e === "Send") &&
      (newMessage || pic)
    ) {
      if (user) socket.emit("stop typing", selectedChat._id);
      inputRef.current.value = null;
      try {
        setLoadingNewMessage(true);

        setNewMessage("");
        await sendNewMessage({
          multiMedia: pic,
          multiFile: file,
          multiVideo: video,
          content: newMessage,
          chatId: selectedChat._id,
          response: response,
        }).then((data) => {
          setPic("");
          setVideo("");
          setFile("");
          setResponse(null);
          socket.emit("new message", data.data);
          setMessages([...messages, data.data]);
          setLoadingNewMessage(false);
          setFetchAgain(!fetchAgain);
        });
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send message:" + error,
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
        setLoadingNewMessage(false);
      }
    }
  };

  const typingHandler = (e) => {
    if (e.keyCode === 13 && e.shiftKey) {
      setNewMessage(newMessage + "&#13");
    } else setNewMessage(e.target.value);
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
    setNewMessage("");
    sendNewMessage({
      content: "📞 A call was made by " + user.username,
      chatId: selectedChat._id,
    }).then((data) => {
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
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
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
    socket.on("answer", (id) => {
      const win = window.open(
        "https://zolachatapp.netlify.app/call/" + id + "/" + id,
        "Call Video",
        "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=70,width=1200,height=600"
      );
    });
    return () => {};
  }, []);

  return (
    <Box
      w="full"
      h="full"
      bgImage={
        selectedChat && colorMode === "light"
          ? selectedChat.isGroupChat
            ? selectedChat.chatAdmin.pic
            : `url(${getSenderInfo(user, selectedChat.users).pic})`
          : "linear-gradient( 94.3deg,  rgba(26,33,64,1) 10.9%, rgba(81,84,115,1) 87.1% )"
      }
      bgRepeat="repeat"
      bgSize="contain"
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
                        <AddFriendButton
                          user={user}
                          friend={getSenderInfo(user, selectedChat.users)}
                          selectedChat={selectedChat}
                        />

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
                  <Tooltip label={"Make a video call"} hasArrow>
                    <IconButton
                      onClick={() => {
                        window.open(
                          "https://zolachatapp.netlify.app/call/null/" +
                            getSenderInfo(user, selectedChat.users)._id,
                          "Call",
                          "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=70,width=1200,height=600"
                        );
                        callMess();
                      }}
                      variant={"ghost"}
                      className="transition-opacity"
                      borderRadius="full"
                      bgColor="transparent"
                      _hover={{
                        color: "black",
                      }}
                      icon={
                        <HiVideoCamera
                          fontSize={"24"}
                          color={colorMode === "light" ? "white" : "yellow"}
                        />
                      }
                    />
                  </Tooltip>

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
                  pos={"relative"}
                >
                  {isTyping ? (
                    <Fade in={onToggle}>
                      <Box
                        w="fit-content"
                        border={"1px solid black"}
                        display="flex"
                        pos="absolute"
                        top={-9}
                        alignItems="center"
                        className="backdrop-blur-lg bg-opacity-50"
                        bgColor={"blackAlpha.800"}
                        borderRadius={"full"}
                        roundedBottomLeft={0}
                        p={2}
                        px={4}
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
                        <Lottie
                          width={30}
                          options={{
                            loop: true,
                            autoplay: true,
                            animationData: animationData,
                            rendererSettings: {
                              preserveAspectRatio: "xMidYMid slice",
                            },
                          }}
                          style={{
                            marginBottom: 0,
                            marginLeft: 0,
                          }}
                        />
                      </Box>
                    </Fade>
                  ) : (
                    <></>
                  )}
                  {loadingNewMessage ? (
                    <Fade in={onToggle}>
                      <Box
                        w="fit-content"
                        border={"1px solid black"}
                        display="flex"
                        pos="relative"
                        bottom={0}
                        bgColor={"blackAlpha.800"}
                        borderRadius={"full"}
                        roundedBottomLeft={0}
                        p={1}
                      >
                        <Text
                          mixBlendMode={"difference"}
                          textColor="whiteAlpha.900"
                          fontSize={12}
                        >
                          ...sending new messsage
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
                  {pic ? (
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
                  ) : null}

                  <InputGroup
                    display={"flex"}
                    alignItems={"center"}
                    bg={colorMode === "light" ? "white" : "whiteAlpha.800"}
                    py="2"
                  >
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
                    <InputRightAddon bg="transparent" border="none">
                      <UploadMenuButton
                        inputRef={inputRef}
                        selectVideoChange={selectVideoChange}
                        selectFileChange={selectFileChange}
                      />
                    </InputRightAddon>
                    <Box flex={1} pos="relative">
                      <Textarea
                        className={`crollbar-thin scrollbar-thumb-dark-blue
                        ${
                          colorMode === "light"
                            ? "white"
                            : "bg-white bg-opacity-50"
                        }
                            focus:bg-opacity-50`}
                        disabled={loadingNewMessage}
                        variant="outline"
                        border="none"
                        rows={1}
                        maxH="80"
                        minH="10"
                        height={!toggleExpand ? 10 : 80}
                        autosize
                        textColor={"black"}
                        placeholder="Type something..."
                        value={newMessage}
                        rounded={"sm"}
                        onChange={typingHandler}
                      />
                      <IconButton
                        variant={"ghost"}
                        className="transition-opacity"
                        borderRadius="full"
                        transform="unset"
                        right={0}
                        bottom={0}
                        resize="none"
                        _hover={{
                          bgGradient:
                            colorMode === "light"
                              ? "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
                              : "linear(to-b,#1E2B6F,#193F5F)",
                        }}
                        pos="absolute"
                        zIndex={10}
                        size="xs"
                        icon={<IoResize w="10" h="10" color="black" />}
                        onClick={() => setToggleExpand(!toggleExpand)}
                      />
                    </Box>
                    <InputLeftAddon
                      bg="transparent"
                      border={"transparent"}
                      w={{ base: "8rem", md: "12rem" }}
                      display="flex"
                      justifyContent={"space-evenly"}
                    >
                      <Input
                        accept="image/*"
                        id="icon-button-image"
                        type="file"
                        hidden
                        ref={inputRef}
                        onChange={(e) => selectImageChange(e)}
                      />
                      <label htmlFor="icon-button-image">
                        <IconButton
                          icon={
                            <Icon
                              color={
                                colorMode === "light"
                                  ? "blackAlpha.800"
                                  : "whiteAlpha.800"
                              }
                              as={MdAddPhotoAlternate}
                              w={{ base: "4", md: "6" }}
                              h={{ base: "4", md: "6" }}
                            />
                          }
                          as={"span"}
                          h={{ base: "6", md: "8" }}
                          w={{ base: "6", md: "8" }}
                          rounded="full"
                          bgGradient={
                            colorMode !== "light"
                              ? "linear-gradient(to top right, #1E2B6F, #193F5F)"
                              : "unset"
                          }
                          _hover={{ opacity: 0.8 }}
                        />
                      </label>

                      <IconButton
                        icon={
                          <Icon
                            color={
                              colorMode === "light" ? "blackAlpha.800" : "white"
                            }
                            as={AiFillSmile}
                            w={{ base: "4", md: "6" }}
                            h={{ base: "4", md: "6" }}
                          />
                        }
                        h={{ base: "6", md: "8" }}
                        w={{ base: "6", md: "8" }}
                        rounded="full"
                        bgGradient={
                          colorMode !== "light"
                            ? "linear-gradient(to top right, #1E2B6F, #193F5F)"
                            : "unset"
                        }
                        _hover={{ opacity: 0.8 }}
                        onClick={() => setToggle(!toggle)}
                      />
                      <Tooltip
                        label={
                          !loadingPic ? "Attach an image" : "Uploading file"
                        }
                        isOpen={loadingPic}
                      >
                        <IconButton
                          icon={
                            <Icon
                              color={
                                colorMode === "light"
                                  ? "blackAlpha.800"
                                  : "white"
                              }
                              as={RiSendPlaneFill}
                              w={{ base: "4", md: "6" }}
                              h={{ base: "4", md: "6" }}
                            />
                          }
                          h={{ base: "6", md: "8" }}
                          w={{ base: "6", md: "8" }}
                          rounded="full"
                          bgGradient={
                            colorMode !== "light"
                              ? "linear-gradient(to top right, #1E2B6F, #193F5F)"
                              : "unset"
                          }
                          _hover={{ opacity: 0.8 }}
                          onClick={() => sendMessage("Send")}
                        />
                      </Tooltip>
                    </InputLeftAddon>
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
