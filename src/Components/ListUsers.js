import {
  Avatar,
  AvatarBadge,
  Box,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../providers/ChatProvider";
import ProfileModal from "./ProfileModal";
import UserBadgeItem from "./UserBadgeItem";

export default function ListUsers({ fetchAgain, setFetchAgain }) {
  const [loading, setLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `https://zolachatapp.herokuapp.com/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: u._id,
        },
        config
      );
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
      <Box display={"flex"} justifyContent="space-between">
        <Text>Members:</Text>
        <Box display={"flex"} justifyContent="center" alignItems={"center"}>
          <Avatar size="sm" src={selectedChat?.chatAdmin?.pic}>
            <AvatarBadge borderColor="papayawhip" bg="yellow" boxSize="1em" />
          </Avatar>
          <ProfileModal user={selectedChat?.chatAdmin}>
            <Text ml="2">@{selectedChat?.chatAdmin?.username}</Text>
          </ProfileModal>
        </Box>
      </Box>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Box maxH={250} h="fit-content">
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
