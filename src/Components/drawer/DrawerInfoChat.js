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
  useEditableControls,
  ButtonGroup,
  Flex,
  EditablePreview,
  Editable,
  EditableInput,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  CheckIcon,
  CloseIcon,
  EditIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import { ChatState } from "../../providers/ChatProvider";
import axios from "axios";
import UserListItem from "../list/items/UserListItem";
import ListUsers from "../list/ListUsers";
import { HiUserAdd, HiUserGroup } from "react-icons/hi";
import {
  addUserToChat,
  removeUserFromChat,
  renameChat,
} from "../../apis/chats.api";
const ENDPOINT = process.env.REACT_APP_PORT;
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
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
          onSubmit={handleRename}
        />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  }
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        ENDPOINT + `/api/user?search=${search}`,
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

      const { data } = await addUserToChat(selectedChat._id, u._id);
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
  return selectedChat.isGroupChat ? (
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
              ? "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
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
            mt={5}
            fontSize="25px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            <Editable
              textAlign="center"
              defaultValue={selectedChat?.chatName.toUpperCase()}
              onSubmit={handleRename}
              fontSize="2xl"
              display="flex"
              alignItems={"center"}
              justifyContent="center"
              isPreviewFocusable={false}
            >
              <EditablePreview />
              {/* Here is the custom input */}
              <Input
                value={groupChatName}
                as={EditableInput}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <EditableControls />
            </Editable>
          </DrawerHeader>
          <DrawerBody>
            <Tabs onChange={(index) => setTabIndex(index)} variant="enclosed">
              <TabList mb="1em">
                <Tab>
                  {tabIndex === 0 ? <HiUserAdd mx="2" /> : null}
                  <Text fontSize={13}>Add a User</Text>
                </Tab>
                <Tab>
                  {tabIndex === 1 ? <HiUserGroup mx="2" /> : null}
                  <Text fontSize={13}>Group Members</Text>
                </Tab>
              </TabList>
              <TabPanels>
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
              variant={colorMode === "dark" && "outline"}
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
  ) : null;
}
