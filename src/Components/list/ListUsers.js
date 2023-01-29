import {
  Avatar,
  Badge,
  Box,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { removeUserFromChat } from "../../apis/chats.api";
import { ChatState } from "../../providers/ChatProvider";
import ProfileModal from "../modal/ProfileModal";
import UserBadgeItem from "./items/UserBadgeItem";
// const ENDPOINT = process.env.REACT_APP_PORT;
export default function ListUsers({ fetchAgain, setFetchAgain }) {
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
  const bgColor = useColorModeValue(
    "radial-gradient( circle farthest-corner at 10% 20%,  rgba(251,174,222,1) 0%, rgba(255,229,168,1) 100.7% )",
    "radial-gradient( circle 610px at 5.2% 51.6%,  rgba(5,8,114,1) 0%, rgba(255,229,168,1) 97.5% )"
  );
  const handleRemove = async (u) => {
    if (selectedChat.chatAdmin._id !== user._id && u._id !== user._id) {
      toast({
        title: "Only admins can remove member(s)",
        description: "error",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await removeUserFromChat(selectedChat._id, u._id);
      u._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  return (
    <Box>
      <Box m="1">
        <Text>Members:</Text>
        <Box display={"flex"} rounded="lg" bgGradient={bgColor} px="2" py="1">
          <Avatar size="md" src={selectedChat?.chatAdmin?.pic}></Avatar>
          <ProfileModal user={selectedChat?.chatAdmin}>
            <Text ml="2">@{selectedChat?.chatAdmin?.username}</Text>
            <Badge ml="1" colorScheme="yellow">
              Admin
            </Badge>
          </ProfileModal>
        </Box>
      </Box>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Box
          overflowY={"scroll"}
          maxHeight={"55vh"}
          height="fit-content"
          className="scrollbar-thin scrollbar-thumb-slate-300 scroll-smooth hover:scrollbar-thumb-slate-500"
        >
          {selectedChat.users.map((u) => (
            <UserBadgeItem
              key={u._id}
              _user={u}
              chat={selectedChat}
              isAdmin={selectedChat?.chatAdmin._id === u._id}
              handleFunction={() => handleRemove(u)}
              setFetchAgain={setFetchAgain}
              fetchAgain={fetchAgain}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
