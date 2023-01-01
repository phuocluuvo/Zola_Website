import React, { memo, useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";

import moment from "moment";
import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import { getSender, getSenderInfo, isExistInArray } from "../logic/ChatLogic";
import io from "socket.io-client";
import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
function ChatList({ fetchAgain, setFetchAgain }) {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const { colorMode } = useColorMode();
  const [friends, setFriends] = useState([]);
  const toast = useToast();
  useEffect(() => {
    fetchChats();
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);
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
  const fetchFriends = async () => {
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
        `https://zolachatapp-sever.onrender.com/api/friends`,
        config
      );
      if (user) setFriends(data);
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
  console.log("chatList is rendered");
  return (
    <VStack zIndex={1} mb={5} spacing="0">
      {user
        ? chats.map((chat, index) => (
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
                mx={3}
              >
                <Box
                  key={index}
                  className="transition-opacity pullRight"
                  onClick={() => {
                    selectedChat
                      ? io("http://localhost:5000").emit(
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
                  <Box flex="1" px="2" maxW="400px" w="0.5">
                    <HStack>
                      <Text
                        fontWeight={"bold"}
                        textColor={
                          selectedChat?._id === chat._id
                            ? "black"
                            : "whiteAlpha.900"
                        }
                        maxW={{ base: "fit-content", md: "250px" }}
                        className="truncate"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {chat.isGroupChat
                          ? chat.chatName
                          : getSender(user, chat.users)}
                      </Text>
                      {!chat.isGroupChat &&
                      isExistInArray(
                        getSenderInfo(user, chat.users),
                        friends
                      ) === false ? (
                        <Badge colorScheme={"facebook"} fontSize="2xs" mx="2">
                          Stranger
                        </Badge>
                      ) : null}
                    </HStack>
                    <Text
                      textColor={
                        selectedChat?._id === chat._id
                          ? "black"
                          : "whiteAlpha.500"
                      }
                      w={{ base: "100%", md: "200px" }}
                      fontSize={{ base: "sm", md: "md" }}
                      textOverflow={"ellipsis"}
                      overflow="hidden"
                      whiteSpace={"nowrap"}
                    >
                      {chat.latestMessage?.content === undefined ? (
                        <Text color={"whiteAlpha.500"} className="italic">
                          {"Chat something 🥺"}
                        </Text>
                      ) : chat.isGroupChat ? (
                        chat.latestMessage ? (
                          `@${chat.latestMessage?.sender.username}: ${chat.latestMessage?.content} `
                        ) : null
                      ) : (
                        `${
                          chat.latestMessage?.sender._id === user._id
                            ? "You: " + chat.latestMessage?.content
                            : chat.latestMessage?.content
                        }`
                      )}{" "}
                    </Text>
                  </Box>
                  <Text
                    bgClip={"text"}
                    fontSize="12"
                    bgGradient={
                      selectedChat?._id === chat._id
                        ? "linear(to-br,blue.900,blue.800)"
                        : "linear(to-br,white,white)"
                    }
                    textAlign={"right"}
                    w={{ base: "fit-content", md: "100px" }}
                    p={{ base: "5", md: "1" }}
                  >
                    {chat.latestMessage?.content === undefined
                      ? ""
                      : moment(chat.latestMessage?.createdAt).fromNow()}
                  </Text>
                  {/*menu button*/}
                  <Box>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<ChevronDownIcon />}
                        variant="outline"
                        border="none"
                        color={
                          selectedChat?._id === chat._id
                            ? "blackAlpha.500"
                            : "whiteAlpha.900"
                        }
                        _hover={{ color: "blue.900" }}
                        _active={{ color: "blue.900", fontSize: "20px" }}
                        className={"forcus:animate-bounce transition-transform"}
                      />
                      <MenuList>
                        <MenuItem icon={<DeleteIcon />} color={"red.500"}>
                          Delete Chat
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </Box>
              </Box>
              <Divider w="95%" />
            </>
          ))
        : null}
    </VStack>
  );
}

export default memo(ChatList);
