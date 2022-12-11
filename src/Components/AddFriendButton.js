import {
  AlertDialog,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Button,
  IconButton,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { getSender, getSenderInfo, isExistInArray } from "../logic/ChatLogic";

function AddFriendButton({ user, selectedChat, friend }) {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useBoolean(false);
  const [isSendFriendRequest, setSendFriendRequest] = useBoolean(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

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

  const sendFriendRequest = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      await axios
        .post(
          `https://zolachatapp-sever.onrender.com/api/friendRequest/${friend._id}`,
          { friendRequestId: friend._id },
          config
        )
        .then((data) => {
          setIsLoading.off();
          onClose();
        });
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else console.log(error);

      setIsLoading.off();
    } finally {
      setIsLoading.off();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            Send Friend Request to @{friend?.username}?
          </AlertDialogHeader>
          <AlertDialogCloseButton />

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              variant={"solid"}
              colorScheme="messenger"
              ml={3}
              onClick={sendFriendRequest}
              isLoading={isLoading}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Text>
        {getSender(user, selectedChat.users)}{" "}
        {!isExistInArray(getSenderInfo(user, selectedChat.users), friends) && (
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
        )}
      </Text>
    </>
  );
}

export default AddFriendButton;
