import { Avatar, Box, Button, Text, useBoolean } from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React from "react";
import { cancelSendRequest } from "../../../apis/friends.api";
// const ENDPOINT = process.env.REACT_APP_PORT;
function FriendRequestUserItem({ ufr, user }) {
  const [isLoading, setIsLoading] = useBoolean(false);
  const [isCancelSuccess, setCancelSuccess] = useBoolean(false);

  const cancellingRequestHandler = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();
    setCancelSuccess.off();
    try {
      await cancelSendRequest(ufr.user[0]._id).then((data) => {
        setIsLoading.off();
        setCancelSuccess.off();
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else console.log(error);
      setCancelSuccess.off();
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
      width="100%"
      className="transition-opacity pullRight"
      alignItems={"center"}
      justifyContent="space-between"
      flex={1}
      p={3}
      position="relative"
    >
      <Box>
        <Box display={"flex"} justifyContent="space-between">
          <Avatar src={ufr?.user[0].pic} size="lg" />
          <Text
            fontSize="10"
            textAlign={"right"}
            w={{ base: "fit-content", md: "100px" }}
            p={{ base: "5", md: "1" }}
          >
            {moment(ufr?.createdAt).fromNow()}
          </Text>
        </Box>
        <Box
          display="flex"
          justifyContent={"space-between"}
          alignItems="center"
        >
          <Box>
            <Text fontSize={"xs"}>@{ufr?.user[0].username}</Text>
            <Text noOfLines={1}>{ufr?.user[0].fullname}</Text>
          </Box>
          <Button
            onClick={cancellingRequestHandler}
            variant={isCancelSuccess ? "solid" : "outline"}
            colorScheme="red"
            isLoading={isLoading}
          >
            {isCancelSuccess ? "Canceled ✓" : "Cancel"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FriendRequestUserItem;
