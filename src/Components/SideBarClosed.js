import {
  ArrowForwardIcon,
  HamburgerIcon,
  InfoIcon,
  Search2Icon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getSender, getSenderInfo } from "../logic/ChatLogic";
import { ChatState } from "../providers/ChatProvider";
import ProfileModal from "./ProfileModal";

function SideBarClosed({ fetchAgain }) {
  const bg = useColorModeValue(
    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
    "linear(to-t,blue.900,purple.900)"
  );
  const colorMode = useColorModeValue(
    "linear(to-b,#1E2B6F,#193F5F)",
    "linear(to-b,whiteAlpha.900,#B1AEC6)"
  );

  const {
    selectedChat,
    setSelectedChat,
    setCloseSideBar,
    user,
    setNotification,
    notification,
    chats,
    setChats,
  } = ChatState();
  const toast = useToast();
  const navigator = useNavigate();

  const fetchChats = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
        cancelToken: source.token,
      };
      const { data } = await axios.get(
        `https://zolachatapp-sever.onrender.com/api/chat`,
        config
      );
      if (user) setChats(data);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else {
        console.log(error);
        toast({
          title: "Error Occured",
          description: "Failed to load chats",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);
  console.log("SideBarClosed is rendered");
  return (
    <Box
      bgGradient={bg}
      h="full"
      position={"relative"}
      w="fit-content"
      display={"flex"}
      justifyContent="center"
      alignItems={"center"}
      flexDir="column"
      pt={5}
    >
      <Box display="flex" w="fit-content" borderRadius="full">
        <Box position="relative">
          <Menu>
            <MenuButton
              position="relative"
              borderRadius="full"
              border="3px solid black"
              _hover={{
                borderColor: "yellow.500",
              }}
              onClick={() => setCloseSideBar(false)}
            >
              <Box borderRadius="full" id="bgChatZone">
                <Avatar
                  size={"md"}
                  name={user?.fullname}
                  src={user?.pic}
                ></Avatar>
                {notification.length > 0 && (
                  <Text
                    position="absolute"
                    bg="red"
                    borderRadius="full"
                    w="22px"
                    fontSize="14px"
                    h="22px"
                    verticalAlign="middle"
                    color="whiteAlpha.900"
                    top="0px"
                    right="0px"
                  >
                    {notification.length}
                  </Text>
                )}
              </Box>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notify.filter((n) => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `New Message(s) in ${notify.chat.chatName}`
                    : `New Message(s) from ${getSender(
                        user,
                        notify.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <IconButton
        variant="outline"
        size={"lg"}
        icon={<ViewOffIcon size="xl" color={"whiteAlpha.900"} />}
        borderColor="transparent"
        borderRadius={"full"}
        aria-label="View Off"
        onClick={() => setCloseSideBar(false)}
        _hover={{
          bgColor: "transparent",
        }}
        _active={{
          bgColor: "transparent",
        }}
      />
      <Divider my={5} />
      <VStack
        className="scrollbar-thin  scrollbar-track-blue-900 scrollbar-thumb-slate-500"
        overflowY={"scroll"}
        spacing="0"
        h="fit-content"
      >
        {chats.map((chat, index) => (
          <>
            <Box
              display={"flex"}
              width="100%"
              justifyItems={"center"}
              alignItems="center"
              className="transition-colors "
              bgColor={
                selectedChat?._id !== chat?._id
                  ? ""
                  : colorMode === "light"
                  ? "white"
                  : "whiteAlpha.800"
              }
            >
              <Box
                key={index}
                className="transition-opacity pullRight"
                onClick={() => {
                  selectedChat
                    ? io("https://zolachatapp.herokuapp.com").emit(
                        "outchat",
                        selectedChat._id
                      )
                    : console.log("out out out");
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                position="relative"
                display="flex"
                alignItems={"center"}
                justifyContent="space-between"
                flex={1}
                py="7px"
                px="15px"
              >
                <Tooltip
                  label={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSender(user, chat.users)
                  }
                  hasArrow
                  placement="right-end"
                >
                  {chat.isGroupChat ? (
                    <AvatarGroup
                      size={"xs"}
                      max={3}
                      spacing={0}
                      flexWrap={"wrap"}
                      flexDirection="row-reverse"
                      width="55px"
                      py={0.5}
                      pl={1}
                    >
                      {chat.users.map((u) => (
                        <Avatar
                          key={u._id}
                          size={"md"}
                          name={chat.chatName}
                          src={u.pic}
                        />
                      ))}
                    </AvatarGroup>
                  ) : (
                    <Avatar
                      showBorder={true}
                      width="55px"
                      height="55px"
                      size={"md"}
                      name={user?._id && getSender(user, chat.users)}
                      src={getSenderInfo(user, chat.users).pic}
                    ></Avatar>
                  )}
                </Tooltip>
              </Box>
            </Box>
          </>
        ))}
      </VStack>
    </Box>
  );
}

export default SideBarClosed;
