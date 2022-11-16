import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React from "react";

function FriendRequestItem({ friendRequest, user }) {
  const [isLoading, setIsLoading] = useBoolean(false);
  const [isAcceptedSuccess, setAcceptedSuccess] = useBoolean(false);
  const [isDeniedSuccess, setDeniedSuccess] = useBoolean(false);

  const acceptFriendRequest = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();
    setAcceptedSuccess.off();

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .post(
          `https://zolachatapp.herokuapp.com/api/friendRequest/accept/${friendRequest.user[0]._id}`,
          { friendRequestId: friendRequest.user[0]._id },
          config
        )
        .then((data) => {
          setIsLoading.off();
          setAcceptedSuccess.off();
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);
      setAcceptedSuccess.off();
    } finally {
      setIsLoading.off();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  const denyFriendRequest = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();
    setDeniedSuccess.off();

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .post(
          `https://zolachatapp.herokuapp.com/api/friendRequest/denied/${friendRequest.user[0]._id}`,
          { friendRequestId: friendRequest.user[0]._id },
          config
        )
        .then((data) => {
          setIsLoading.off();
          setDeniedSuccess.off();
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);
      setDeniedSuccess.off();
    } finally {
      setIsLoading.off();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  return (
    <Box
      className="transition-opacity pullRight"
      alignItems={"center"}
      justifyContent="space-between"
      flex={1}
      p={3}
      position="relative"
      w="full"
    >
      <Box w="full">
        <Box display={"flex"} justifyContent="space-between">
          <Avatar src={friendRequest?.user[0].pic} size="lg" />
          <Text
            fontSize="10"
            textAlign={"right"}
            w={{ base: "fit-content", md: "100px" }}
            p={{ base: "5", md: "1" }}
          >
            {moment(friendRequest?.createdAt).fromNow()}
          </Text>
        </Box>
        <Text fontSize={"xs"}>@{friendRequest?.user[0].username}</Text>
        <Text noOfLines={1}>{friendRequest?.user[0].fullname}</Text>
      </Box>
      <HStack spacing={2} mt="5">
        <Button
          isLoading={isLoading}
          variant={isAcceptedSuccess ? "solid" : "outline"}
          colorScheme={isAcceptedSuccess ? "green" : "blue"}
          onClick={acceptFriendRequest}
        >
          {isAcceptedSuccess ? <>Accepted ✓</> : "Accept"}
        </Button>

        <Button
          variant={isDeniedSuccess ? "solid" : "outline"}
          colorScheme={"red"}
          textColor="red"
          onClick={denyFriendRequest}
        >
          {isDeniedSuccess ? <>Denied ✕</> : "Deny"}
        </Button>
      </HStack>
    </Box>
  );
}

export default FriendRequestItem;
