import React, { memo, useEffect } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import moment from "moment";
import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import { getSender, getSenderInfo } from "../logic/ChatLogic";
import io from "socket.io-client";
import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
function ChatList({ fetchAgain, setFetchAgain }) {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  useEffect(() => {
    fetchChats();
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
        `https://zolachatapp.herokuapp.com/api/chat`,
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
  console.log("chatList is rendered");
  return (
    <VStack zIndex={1} mb={5} spacing="0">
      {user &&
        chats.map((chat, index) => (
          <>
            <Box
              display={"flex"}
              width="100%"
              justifyItems={"center"}
              alignItems="center"
              _hover={{
                bg:
                  selectedChat?._id !== chat._id
                    ? "whiteAlpha.500"
                    : "whiteAlpha.900",
                border: "2px solid white",
                p: "6px",
              }}
              className="transition-colors"
              bgColor={
                selectedChat
                  ? selectedChat._id === chat._id
                    ? "white"
                    : "whiteAlpha.700"
                  : "whiteAlpha.700"
              }
              borderRadius={"full"}
              p={"8px"}
              mt={3}
              mx={3}
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
                  <Text
                    fontWeight={"bold"}
                    textColor={
                      selectedChat?._id === chat._id
                        ? "black"
                        : "whiteAlpha.900"
                    }
                    className="truncate"
                  >
                    {chat.isGroupChat
                      ? chat.chatName
                      : getSender(user, chat.users)}
                  </Text>
                  <Text
                    textColor={
                      selectedChat?._id === chat._id
                        ? "black"
                        : "whiteAlpha.500"
                    }
                    w={{ base: "100%", md: "250px" }}
                    textOverflow={"ellipsis"}
                    overflow="hidden"
                    whiteSpace={"nowrap"}
                  >
                    {chat.latestMessage?.content === undefined ? (
                      <Text color={"whiteAlpha.500"} className="italic">
                        {"Chat something 🥺"}
                      </Text>
                    ) : chat.isGroupChat ? (
                      chat.latestMessage &&
                      `@${chat.latestMessage?.sender.username}: ${chat.latestMessage?.content} `
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
                  w={{ base: "200px", md: "100px" }}
                  p={{ base: "5", md: "1" }}
                >
                  {moment(chat.latestMessage?.createdAt).fromNow()}
                </Text>
              </Box>
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
            <Divider w="95%" />
          </>
        ))}
    </VStack>
  );
}

export default memo(ChatList);
