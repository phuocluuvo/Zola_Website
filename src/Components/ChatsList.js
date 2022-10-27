import React, { memo, useEffect } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import moment from "moment";
import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import { getSender, getSenderInfo } from "../logic/ChatLogic";
import io from "socket.io-client";
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
      const { data } = await axios.get(`/api/chat`, config);
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
    <VStack zIndex={1} mb={5}>
      {user &&
        chats.map((chat, index) => (
          <Box
            key={index}
            className="transition-opacity"
            _hover={{
              opacity: selectedChat?._id !== chat._id ? "0.80" : "1",
              border: "2px solid white",
              p: "6px",
            }}
            onClick={() => {
              selectedChat
                ? io("http://localhost:5000").emit("outchat", selectedChat._id)
                : console.log("out out out");
              setSelectedChat(chat);
            }}
            cursor="pointer"
            bgColor={
              selectedChat
                ? selectedChat._id === chat._id
                  ? "white"
                  : "whiteAlpha.700"
                : "whiteAlpha.700"
            }
            position="relative"
            display="flex"
            alignItems={"center"}
            justifyContent="space-between"
            borderRadius={"full"}
            mt={3}
            w={"95%"}
            p={"8px"}
            mx={3}
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
                textColor={"black"}
                className="truncate"
              >
                {chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
              </Text>
              <Text
                textColor={"black"}
                w={{ base: "100%", md: "250px" }}
                textOverflow={"ellipsis"}
                overflow="hidden"
                whiteSpace={"nowrap"}
              >
                {chat.latestMessage?.content === undefined ? (
                  <Text color={"GrayText"} className="italic">
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
              bgGradient="linear(to-br,blue.900,blue.800)"
              textAlign={"right"}
              w={{ base: "200px", md: "100px" }}
              p={{ base: "5", md: "1" }}
            >
              {moment(chat.latestMessage?.createdAt).calendar()}
            </Text>
          </Box>
        ))}
    </VStack>
  );
}

export default memo(ChatList);
