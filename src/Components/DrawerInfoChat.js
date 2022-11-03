import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import ListUsers from "./ListUsers";
export default function DrawerInfoChat({ fetchAgain, setFetchAgain }) {
  const { colorMode } = useColorMode();
  const btnRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);

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
    //setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `https://zolachatapp.herokuapp.com/api/user?search=${search}`,
        config
      );

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
        `https://zolachatapp.herokuapp.com/api/chat/groupadd`,
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
  return (
    selectedChat.isGroupChat && (
      <>
        <IconButton
          variant={"ghost"}
          className="transition-opacity"
          borderRadius="full"
          onClick={onOpen}
          transform="unset"
          ml={3}
          _hover={{
            color: "black",
            bgGradient:
              colorMode === "light"
                ? "linear(to-b,#C39A9E,#808293)"
                : "linear(to-b,#1E2B6F,#193F5F)",
          }}
          icon={
            colorMode === "light" ? (
              <HamburgerIcon textColor={"whiteAlpha.900"} />
            ) : (
              <HamburgerIcon textColor={"yellow"} />
            )
          }
        />
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          size={{ base: "full", md: "sm" }}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton
              top={{ base: 5, md: 7 }}
              right={{ base: 5, md: 10 }}
            />
            <DrawerHeader
              mt={3}
              fontSize="25px"
              fontFamily="Work Sans"
              display="flex"
              justifyContent="center"
            >
              {selectedChat?.chatName.toUpperCase()}
            </DrawerHeader>
            <DrawerBody>
              <Tabs onChange={(index) => setTabIndex(index)} variant="enclosed">
                <TabList mb="1em">
                  <Tab>
                    {tabIndex === 0 ? (
                      <Text fontSize={13}>Change Group Name</Text>
                    ) : (
                      <i class="fas fa-pen-square"></i>
                    )}
                  </Tab>
                  <Tab>
                    {tabIndex === 1 ? (
                      <Text fontSize={13}>Add a User</Text>
                    ) : (
                      <>
                        <i class="fa fa-users"></i>
                        <i class="fa fa-plus" aria-hidden="true"></i>
                      </>
                    )}
                  </Tab>
                  <Tab>
                    {tabIndex === 2 ? (
                      <Text fontSize={13}>Group Members</Text>
                    ) : (
                      <i class="fa fa-users"></i>
                    )}
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <FormControl>
                      <FormLabel>Change Group Name</FormLabel>
                      <Input
                        placeholder="Chat Name"
                        mb={3}
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                      <Button
                        variant="solid"
                        colorScheme="teal"
                        isLoading={renameLoading}
                        onClick={handleRename}
                      >
                        Update
                      </Button>
                    </FormControl>
                  </TabPanel>
                  <TabPanel display={"flex"} flexDir="column">
                    <FormControl>
                      <FormLabel>Add User to Group</FormLabel>
                      <Input
                        placeholder="Add user to group"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </FormControl>
                    <Box
                      h="fit-content"
                      maxHeight={350}
                      overflowY={"scroll"}
                      className="scrollbar-thin scrollbar-thumb-slate-300 scroll-smooth hover:scrollbar-thumb-slate-500"
                    >
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
                      )}{" "}
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <ListUsers />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </DrawerBody>

            <DrawerFooter display={"flex"} justifyContent="space-between">
              <Button
                isDisabled={user._id === selectedChat?.chatAdmin._id}
                colorScheme="red"
                onClick={() => {
                  handleRemove(user);
                  onClose();
                }}
              >
                Leave Group
              </Button>
              <Text
                fontSize="xs"
                px="3"
                display={user._id !== selectedChat?.chatAdmin._id && "none"}
              >
                (*) You must promote another member to be Admin so you can leave
                group.
              </Text>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  );
}
