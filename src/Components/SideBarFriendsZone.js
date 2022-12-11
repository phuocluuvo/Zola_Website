import {
  Box,
  Divider,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import UserListItem from "./UserListItem";

import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import { RiEmotionSadFill } from "react-icons/ri";
function SideBarFriendsZone({
  display,
  setIsDisplay,
  fetchAgain,
  setFetchAgain,
}) {
  const { colorMode } = useColorMode();
  const [loadingChat, setLoadingChat] = useState(false);
  const bg = useColorModeValue(
    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
    "linear(to-t,blue.900,purple.900)"
  );
  const toast = useToast();
  const [friends, setFriends] = useState([]);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display]);
  const fetchFriends = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(
      `https://zolachatapp-sever.onrender.com/api/friends`,
      config
    );
    setFriends(data);
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `https://zolachatapp-sever.onrender.com/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      setIsDisplay(false);
    } catch (error) {
      toast({
        title: "Failed to fetching chat",
        description: error.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <Box
        className="scrollbar-thin  scrollbar-track-blue-900 scrollbar-thumb-slate-500"
        bgGradient={bg}
        h="100vh"
        position={"relative"}
        minW={"fit-content"}
        w="full"
        zIndex={1}
        overflowX="hidden"
        borderRight={"1px solid"}
        borderColor={"blackAlpha.500"}
      >
        {/**Sidebar navigation */}
        <Box position={"sticky"} top={0} zIndex={10}>
          <Box p="5">
            <HStack my="5">
              <Divider w="10"></Divider>
              <Text whiteSpace="nowrap">Friends List ({friends.length})</Text>
              <Divider></Divider>
            </HStack>
            <VStack>
              {friends.length > 0 ? (
                friends.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              ) : (
                <VStack opacity="0.5">
                  <RiEmotionSadFill fontSize={"100"} />
                  <Text textAlign={"center"}>
                    You seems so lonely, find some friend to add to the list
                  </Text>
                </VStack>
              )}
            </VStack>
          </Box>
          <Box
            display="flex"
            alignItems={"center"}
            position={"sticky"}
            p={{ base: 0, md: 3 }}
            justifyContent={"center"}
            top={0}
            zIndex={10}
          >
            {/* * Background img*/}
            <Box
              pos={"absolute"}
              top={0}
              zIndex={5}
              h={"75px"}
              w={{ base: "full", md: "fit-content" }}
              p={{ base: "10px", md: "0" }}
              borderRadius={{ base: " 0 0 20px 20px ", md: "full" }}
              boxShadow="xl"
              bgImage={{ base: `url('${user?.pic}')`, md: "none" }}
              bgRepeat={"no-repeat"}
              bgSize="cover"
              bgPosition={"center"}
              className="transition-all"
              filter={"grayscale(100%)"}
            ></Box>
            <Box
              pos={"absolute"}
              top={0}
              zIndex={6}
              h={"75px"}
              w={{ base: "full", md: "fit-content" }}
              p={{ base: "10px", md: "0" }}
              borderRadius={{ base: " 0 0 20px 20px ", md: "full" }}
              boxShadow="xl"
              bgRepeat={"no-repeat"}
              bgSize="cover"
              bgPosition={"center"}
              className={`transition-all bg-gradient-to-b ${
                colorMode === "dark" ? "from-[#00000d7d]" : "from-[#ffffff7d]"
              }`}
              filter={"grayscale(100%)"}
            ></Box>{" "}
          </Box>
        </Box>
      </Box>
      <Box
        className="scrollbar-thin  scrollbar-track-blue-900 scrollbar-thumb-slate-500"
        bgGradient={bg}
        h="full"
        position={"absolute"}
        minW={"fit-content"}
        zIndex={0}
        w="full"
        overflowX="hidden"
      ></Box>
      <Box
        className="scrollbar-thin  scrollbar-track-blue-900 scrollbar-thumb-slate-500"
        bgImage={`url('${user?.pic}')`}
        display={{ md: "inline-block", base: "none" }}
        h="full"
        position={"absolute"}
        minW={"fit-content"}
        zIndex={0}
        opacity={0.3}
        w="full"
        filter={"grayscale(100%)"}
        overflowX="hidden"
        bgRepeat={"no-repeat"}
        bgSize="cover"
        bgPos={"top 45% right 45%"}
      ></Box>
    </>
  );
}

export default SideBarFriendsZone;
