import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
  DrawerOverlay,
  useToast,
  Input,
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../providers/ChatProvider";
import UserListItem from "../list/items/UserListItem";
import ChatLoading from "../loading/ChatLoading";
import { accessToChat, searchChats } from "../../apis/chats.api";
// const ENDPOINT = process.env.REACT_APP_PORT;
function DrawerSearchUser({ children }) {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await accessToChat(config, { userId });
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Failed to fetching chat",
        description: error.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Enter something to search",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await searchChats(search);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load search results",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        size={{ base: "full", md: "xs" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton display={{ base: "inline-block", md: "none" }} />
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search user by name or email to chat with"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : searchResult.length > 0 ? (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <Text className="font-bold">¯\_(ツ)_/¯</Text>
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
        <DrawerFooter></DrawerFooter>
      </Drawer>
    </>
  );
}

export default DrawerSearchUser;
