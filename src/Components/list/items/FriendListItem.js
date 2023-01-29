import { ChatIcon, InfoIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useBoolean,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { FaUserTimes } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { unfriend } from "../../../apis/friends.api";
import ProfileModal from "../../modal/ProfileModal";
// const ENDPOINT = process.env.REACT_APP_PORT;
function FriendListItem({ user, handleFunction }) {
  const [isLoading, setIsLoading] = useBoolean(false);

  const [isDeniedSuccess, setDeniedSuccess] = useBoolean(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { colorMode } = useColorMode();
  const unfriendHandler = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setIsLoading.on();
    setDeniedSuccess.off();

    try {
      await unfriend(user._id).then(() => {
        setIsLoading.off();
        setDeniedSuccess.off();
        onClose();
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else console.log(error);
      setDeniedSuccess.off();
    } finally {
      setIsLoading.off();
      onClose();
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  return (
    <Box
      className="transition-opacity pullRight"
      position="relative"
      alignItems={"center"}
      justifyContent="space-between"
      display={"flex"}
      py="7px"
      pl="15px"
      w="full"
      opacity={0.8}
    >
      <Avatar mr={2} size="md" name={user.username} src={user.pic} />
      <Box flex="1">
        <Text fontSize={"sm"}>@{user.username}</Text>
        <Text fontWeight={"bold"}>{user.fullname}</Text>
        <Text fontSize="xs" className="truncate">
          Email: {user.email}
        </Text>
      </Box>
      <Box mx="1">
        <Menu>
          <MenuButton
            as={IconButton}
            variant={"ghost"}
            w="10"
            h="10"
            rounded="full"
            icon={<HiOutlineDotsVertical w="10" h="10" />}
          ></MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem icon={<InfoIcon />}>
                <Text textAlign={"left"} w="full">
                  Infomation
                </Text>
              </MenuItem>
            </ProfileModal>
            <MenuItem icon={<FaUserTimes />} onClick={onOpen}>
              <Text textAlign={"left"} w="full">
                Unfriend
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
        <Tooltip label="Chat" hasArrow>
          <IconButton
            onClick={handleFunction}
            variant={"ghost"}
            rounded="full"
            w="10"
            h="10"
            icon={<ChatIcon w="4" h="4" />}
          ></IconButton>
        </Tooltip>
      </Box>
      {/* <UnfriendDialog isOpen={isOpen} onClose={onClose} cancelRef={cancelRef} username={user?.username} onClick={unfriendHandler}/>*/}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Unfriend with @{user?.username}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={colorMode === "dark" && "outline"}
                colorScheme="red"
                onClick={unfriendHandler}
                ml={3}
              >
                Unfriend
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default FriendListItem;
