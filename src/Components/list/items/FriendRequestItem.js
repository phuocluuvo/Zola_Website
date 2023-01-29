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
import {
  acceptFriendRequest,
  denyFriendRequest,
} from "../../../apis/friends.api";
// const ENDPOINT = process.env.REACT_APP_PORT;
function FriendRequestItem({ friendRequest, user }) {
  const [isLoading, setIsLoading] = useBoolean(false);
  const [isAcceptedSuccess, setAcceptedSuccess] = useBoolean(false);
  const [isDeniedSuccess, setDeniedSuccess] = useBoolean(false);

  const handlerAcceptRequest = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();
    setAcceptedSuccess.off();

    try {
      await acceptFriendRequest(friendRequest.user[0]._id).then((res) => {
        setIsLoading.off();
        setAcceptedSuccess.off();
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else console.log(error);
      setAcceptedSuccess.off();
    } finally {
      setIsLoading.off();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  const denyFriendRequestHandler = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();
    setDeniedSuccess.off();

    try {
      await denyFriendRequest(friendRequest.user[0]._id).then((data) => {
        setIsLoading.off();
        setDeniedSuccess.off();
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else console.log(error);
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
          onClick={handlerAcceptRequest}
        >
          {isAcceptedSuccess ? <>Accepted ✓</> : "Accept"}
        </Button>

        <Button
          variant={isDeniedSuccess ? "solid" : "outline"}
          colorScheme={"red"}
          textColor="red"
          onClick={denyFriendRequestHandler}
        >
          {isDeniedSuccess ? <>Denied ✕</> : "Deny"}
        </Button>
      </HStack>
    </Box>
  );
}

export default FriendRequestItem;
