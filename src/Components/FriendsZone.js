import {
  Avatar,
  Box,
  Divider,
  Grid,
  GridItem,
  HStack,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBoolean,
  useColorMode,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { IoMdListBox } from "react-icons/io";
import { HiUserAdd } from "react-icons/hi";
import { FaUserFriends, FaUserPlus } from "react-icons/fa";

import React, { useEffect, useState } from "react";
import FriendRequestItem from "./FriendRequestItem";
import FriendRequestUserItem from "./FriendRequestUserItem";
import { ChatState } from "../providers/ChatProvider";
import { RiEmotionSadFill } from "react-icons/ri";

import FriendListItem from "./FriendListItem";

function FriendsZone({ display, user, setIsDisplay }) {
  const [friendRequests, setFriendsRequests] = useState([]);
  const [userFriendRequests, setUserFriendsRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const { setSelectedChat, chats, setChats } = ChatState();
  const [loadingChat, setLoadingChat] = useState(false);
  const { colorMode } = useColorMode();
  const bg = useColorModeValue(
    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
    "linear(to-t,blue.900,purple.900)"
  );
  const toast = useToast();

  const fetchFriends = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(
      `https://zolachatapp.herokuapp.com/api/friends`,
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
        `https://zolachatapp.herokuapp.com/api/chat`,
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

  const [isLoadingUserRequestedList, setIsLoadingUserRequestedList] =
    useBoolean(false);
  const fetchUserFriendRequests = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoadingUserRequestedList.on();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .get(
          `https://zolachatapp.herokuapp.com/api/friendRequest/sended`,
          config
        )
        .then((data) => {
          setUserFriendsRequests(data.data);
          setIsLoadingUserRequestedList.off();
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);
    } finally {
      setIsLoadingUserRequestedList.off();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  const [isLoading, setIsLoading] = useBoolean(false);
  const fetchFriendRequests = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    try {
      setIsLoading.on();
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .get(
          `https://zolachatapp.herokuapp.com/api/friendRequest/request`,
          config
        )
        .then((data) => {
          setFriendsRequests(data.data);
          setIsLoading.off();
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);
      setIsLoading.off();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  useEffect(() => {
    fetchFriendRequests();
    fetchUserFriendRequests();
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display]);
  return (
    <Box w="full" h="full" bgGradient={bg}>
      <Box
        boxSize="full"
        backdropFilter="auto"
        backdropBlur="100px"
        width="100%"
        display="flex"
        flexDirection="column"
      >
        <Tabs
          size={{ sm: "sm", md: "md", lg: "lg" }}
          variant="enclosed"
          display="flex"
          w="full"
          h="full"
        >
          <TabList
            display="flex"
            flexDir="column"
            border="none"
            bg="blackAlpha.100"
          >
            <Tab
              _selected={{
                borderLeft: colorMode === "dark" && "2px solid white",
                bg: colorMode === "light" ? "whiteAlpha.900" : "whiteAlpha.200",
              }}
              border="none"
              w="250px"
              rounded={"none"}
              className="transition-opacity pullRight"
              pos="relative"
            >
              <HStack w="full" px="3" py="2">
                <FaUserPlus fontSize="1.5rem" bg="white" />
                <Text fontSize={{ base: "md", md: "lg" }} whiteSpace="nowrap">
                  Friend Requests
                </Text>
              </HStack>
            </Tab>
            <Tab
              w="250px"
              border="none"
              _selected={{
                borderLeft: colorMode === "dark" && "2px solid white",
                bg: colorMode === "light" ? "whiteAlpha.900" : "whiteAlpha.200",
              }}
              rounded={"none"}
              className="transition-opacity pullRight"
              pos="relative"
            >
              <HStack w="full" border="none" px="3" py="2">
                <FaUserPlus fontSize="1.5rem" bg="white" />
                <Text fontSize={{ base: "md", md: "lg" }} whiteSpace="nowrap">
                  Your Friend Requests
                </Text>
              </HStack>
            </Tab>
            <Tab
              border="none"
              w="250px"
              _selected={{
                borderLeft: colorMode === "dark" && "2px solid white",
                bg: colorMode === "light" ? "whiteAlpha.900" : "whiteAlpha.200",
              }}
              rounded={"none"}
              className="transition-opacity pullRight"
              pos="relative"
            >
              <HStack w="full" px="3" py="2">
                <FaUserFriends fontSize="1.5rem" bg="white" />
                <Text fontSize={{ base: "md", md: "lg" }} whiteSpace="nowrap">
                  Friends List ({friends.length})
                </Text>
              </HStack>
            </Tab>
          </TabList>
          <TabPanels w="full" h="full">
            <TabPanel>
              <Box w="full" h="100vh">
                {isLoading ? (
                  <Spinner size={"lg"} mx="auto" />
                ) : friendRequests.length > 0 ? (
                  <Grid
                    p={{ base: "5", md: "10" }}
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    }}
                    gap={6}
                  >
                    {friendRequests.map((fr, index) => (
                      <GridItem
                        key={index}
                        border="1px solid"
                        borderColor={colorMode === "light" && "blackAlpha.300"}
                        bg={colorMode === "light" ? "white" : "whiteAlpha.200"}
                        opacity="0.8"
                        className="transition-opacity"
                        _hover={{ opacity: 1 }}
                        rounded="lg"
                        boxShadow={"lg"}
                      >
                        <FriendRequestItem friendRequest={fr} user={user} />
                      </GridItem>
                    ))}
                  </Grid>
                ) : (
                  <VStack opacity="0.5" m="auto">
                    <IoMdListBox fontSize={"160"} />
                    <Text fontSize={"lg"}>The list is empty</Text>
                  </VStack>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box w="full" h="100vh">
                {isLoadingUserRequestedList ? (
                  <Box w="full">
                    <Spinner size={"lg"} mx="auto" />
                  </Box>
                ) : userFriendRequests.length > 0 ? (
                  <Grid
                    p={{ base: "5", md: "10" }}
                    templateColumns={{
                      base: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    }}
                    gap={6}
                  >
                    {userFriendRequests.map((fr, index) => (
                      <GridItem
                        key={index}
                        border="1px solid"
                        borderColor={colorMode === "light" && "blackAlpha.300"}
                        bg={colorMode === "light" ? "white" : "whiteAlpha.200"}
                        opacity="0.8"
                        className="transition-opacity"
                        _hover={{ opacity: 1 }}
                        rounded="lg"
                        boxShadow={"lg"}
                      >
                        <FriendRequestUserItem ufr={fr} user={user} />
                      </GridItem>
                    ))}
                  </Grid>
                ) : (
                  <VStack opacity="0.5" m="auto">
                    <IoMdListBox fontSize={"100"} />
                    <Text>The list is empty</Text>
                  </VStack>
                )}
              </Box>
            </TabPanel>
            <TabPanel>
              <Grid
                p={{ base: "5", md: "10" }}
                templateColumns={{
                  base: "repeat(4, 1fr)",
                  md: "repeat(4, 1fr)",
                }}
                gap={6}
              >
                {friends.length > 0 &&
                  friends.map((user) => (
                    <GridItem
                      key={user._id}
                      border="1px solid"
                      borderColor={colorMode === "light" && "blackAlpha.300"}
                      bg={colorMode === "light" ? "white" : "whiteAlpha.200"}
                      opacity="0.8"
                      className="transition-opacity"
                      _hover={{ opacity: 1 }}
                      rounded="lg"
                      boxShadow={"lg"}
                    >
                      <FriendListItem
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      />
                    </GridItem>
                  ))}
              </Grid>
              {friends.length <= 0 && (
                <VStack opacity="0.5" m="auto">
                  <RiEmotionSadFill fontSize={"100"} />
                  <Text textAlign={"center"}>
                    You seems so lonely, find some friend to add to the list
                  </Text>
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

export default FriendsZone;
