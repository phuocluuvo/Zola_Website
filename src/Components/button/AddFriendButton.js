import {
  Badge,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { getUsersFriends } from "../../apis/users.api";
import {
  getSender,
  getSenderInfo,
  isExistInArray,
} from "../../logic/ChatLogic";
import AddFriendDialog from "../dialog/AddFriendDialog";
function AddFriendButton({ user, selectedChat, friend }) {
  const [friends, setFriends] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  const fetchFriends = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      await getUsersFriends().then((res) => setFriends(res.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else {
        console.log(error);
        toast({
          title: "Error Occured",
          description: "Failed to load friend list",
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
  return (
    <>
      <AddFriendDialog friend={friend} isOpen={isOpen} onClose={onClose} />
      <Text>
        {getSender(user, selectedChat.users)}{" "}
        {!isExistInArray(getSenderInfo(user, selectedChat.users), friends) ? (
          <>
            <Badge colorScheme={"facebook"} mx="2">
              Stranger
            </Badge>

            <IconButton
              icon={<IoPersonAdd />}
              rounded="full"
              h="5"
              onClick={onOpen}
            ></IconButton>
          </>
        ) : null}
      </Text>
    </>
  );
}

export default AddFriendButton;
