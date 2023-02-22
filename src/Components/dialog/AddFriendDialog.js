import {
  AlertDialog,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useBoolean,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { sendAddFriendRequest } from "../../apis/users.api";

function AddFriendDialog({ isOpen, onClose, friend }) {
  const [isLoading, setIsLoading] = useBoolean(false);
  const cancelRef = React.useRef();
  const sendFriendRequest = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();

    try {
      await sendAddFriendRequest(friend._id).then((data) => {
        setIsLoading.off();
        onClose();
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else console.log(error);

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
  );
}

export default AddFriendDialog;
