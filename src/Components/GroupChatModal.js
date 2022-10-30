import {
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { memo, useState } from "react";
import { ChatState } from "../providers/ChatProvider";
import UserListItem from "./UserListItem";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();
  const handlerSearch = async (query) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };

      const { data } = await axios.get(
        `https://zolachatapp.herokuapp.com/api/user?search=${search}`,
        config
      );
      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else
        toast({
          title: "Error Occured",
          description: "Failed to load search results",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom-left",
        });
    }
    return () => {
      source.cancel();
    };
  };
  const handlerSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please flill all the fields",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.post(
        `https://zolachatapp.herokuapp.com/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: `${groupChatName} was successfully created!`,
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } catch (error) {
      toast({
        title: "Failed to create the chat",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleRemove = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };
  console.log("GroupChatModal is rendered");
  return (
    <>
      <Button
        bg="transparent"
        onClick={onOpen}
        position="relative"
        w={10}
        borderRadius="full"
      >
        <i className="fa fa-users"></i>
        <Text position="absolute" top="0" right="2">
          +
        </Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignContent="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add more than 3 users to the group ex: John, Lous, Ann"
                mb={1}
                onChange={(e) => handlerSearch(e.target.value)}
              />
            </FormControl>
            <Box style={{ display: "flex", flexWrap: "wrap" }} w="100%">
              {selectedUsers.map((u) => (
                <Box
                  border={"1px solid white"}
                  borderRadius="md"
                  _hover={{ bg: "red" }}
                  className="transition-colors"
                  py="1"
                  px="2"
                  m={1}
                  ml={0}
                  key={u._id}
                  display="flex"
                  justifyContent={"center"}
                  alignItems="center"
                  onClick={() => handleRemove(u)}
                  cursor="pointer"
                >
                  <Avatar size="xs" src={u.pic} />
                  <Text>@{u.username}</Text>
                </Box>
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 5)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handlerSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default memo(GroupChatModal);
