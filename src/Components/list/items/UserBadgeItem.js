import { CloseIcon, StarIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { changeAdmin } from "../../../apis/chats.api";
import { ChatState } from "../../../providers/ChatProvider";
import ChangeAdminDialog from "../../dialog/ChangeAdminDialog";
import ProfileModal from "../../modal/ProfileModal";

function UserBadgeItem({
  _user,
  handleFunction,
  isAdmin,
  setFetchAgain,
  fetchAgain,
}) {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue(
    "radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,229,168,1) 0%, rgba(251,174,222,1) 100.7% )",
    "radial-gradient( circle 610px at 5.2% 51.6%,  rgba(5,8,114,1) 0%, rgba(7,3,53,1) 97.5% )"
  );
  const { selectedChat, user } = ChatState();
  const toast = useToast();
  async function handleChangeAdmin() {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      await changeAdmin(selectedChat._id, _user._id).then((data) => data.data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else
        toast({
          title: "Error Occured",
          description: "Failed to promote" + error.message,
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return !isAdmin ? (
    <>
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
        justifyItems="center"
        variant="solid"
        textColor={"blackAlpha.900"}
        cursor="pointer"
        opacity="0.7"
        transition="all 0.25s ease-in-out"
        _hover={!isAdmin && { opacity: "1" }}
        bgGradient={bgColor}
      >
        <Avatar
          src={_user?.pic}
          size={user._id === selectedChat.chatAdmin._id ? "xs" : "md"}
        />
        <Box flex="1" px="2">
          <ProfileModal user={_user}>
            <Text
              textColor={
                colorMode === "light" ? "blackAlpha.900" : "whiteAlpha.900"
              }
              fontSize={15}
              _hover={{ textDecor: "underline" }}
            >
              @{_user?.username}
            </Text>
            <Badge ml="1" colorScheme="gray">
              Member
            </Badge>
          </ProfileModal>
        </Box>
        {user._id === selectedChat.chatAdmin._id ? (
          <>
            <Tooltip
              label={`Promte @${_user?.username} become Group Admin`}
              openDelay={300}
            >
              <IconButton
                onClick={onOpen}
                variant={"ghost"}
                _hover={{
                  bg: "none",
                  textColor: "yellow",
                  transform: "rotate(75deg)",
                  transitionDuration: "500ms",
                }}
                aria-label={`Remove @${_user?.username}`}
                icon={<StarIcon fontSize={12} />}
              ></IconButton>
            </Tooltip>
            <Tooltip label={`Remove @${_user?.username}`} openDelay={300}>
              <IconButton
                onClick={handleFunction}
                variant={"ghost"}
                _hover={{
                  bg: "none",
                  textColor: "red",
                  transform: "rotate(180deg)",
                }}
                aria-label={`Remove @${_user?.username}`}
                icon={<CloseIcon fontSize={12} />}
              ></IconButton>
            </Tooltip>
          </>
        ) : null}
      </Box>
      {isAdmin ? (
        <ChangeAdminDialog
          cancelRef={cancelRef}
          changeAdmin={handleChangeAdmin}
          isOpen={isOpen}
          onClose={onClose}
          username={_user?.username}
        />
      ) : null}
    </>
  ) : null;
}

export default UserBadgeItem;
