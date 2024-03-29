import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import {
  removeUserFromChat,
  renameChat,
  searchChats,
} from "../../apis/chats.api";
import { ChatState } from "../../providers/ChatProvider";
import UserBadgeItem from "../list/items/UserBadgeItem";
import UserListItem from "../list/items/UserListItem";
const ENDPOINT = process.env.REACT_APP_PORT;
function UpdateGroupChatModal({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  children,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = ChatState();
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
      fetchMessages();
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
    //setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await renameChat(selectedChat._id, groupChatName);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await searchChats(search);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load search results",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleAddUser = async (u) => {
    if (selectedChat.users.find((_u) => _u._id === u._id)) {
      toast({
        title: "User Already Added",
        description: "error",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    //check if admin of the chat group is the logged user or not
    if (selectedChat.chatAdmin._id !== user._id) {
      toast({
        title: "Only admins can add new members",
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
        ENDPOINT + `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: u._id,
        },
        config
      );
      setSelectedChat(data);
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
  console.log("UpdateGroupChatModal is rendered");
  return (
    <>
      {children ? (
        <span onClick={onOpen} style={{ cursor: "pointer" }}>
          {children}
        </span>
      ) : (
        <IconButton display="flex" icon={<ViewIcon />} onClick={onOpen}>
          Open Modal
        </IconButton>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat?.chatName.toUpperCase()}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Text>Members</Text>
            <Box display="flex" flexWrap="wrap" w="100%" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  _user={u}
                  isAdmin={selectedChat?.chatAdmin._id === u._id}
                  handleFunction={() => handleRemove(u)}
                  setFetchAgain={setFetchAgain}
                  fetchAgain={fetchAgain}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                handleRemove(user);
                onClose();
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
