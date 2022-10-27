import {
  ArrowForwardIcon,
  HamburgerIcon,
  InfoIcon,
  Search2Icon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getSender } from "../logic/ChatLogic";
import { ChatState } from "../providers/ChatProvider";
import ProfileModal from "./ProfileModal";

function SideBarClosed() {
  const bg = useColorModeValue(
    "linear(to-b,#C39A9E,#808293)",
    "linear(to-t,blue.900,purple.900)"
  );
  const colorLoggedUser = useColorModeValue(
    "linear(to-b,#1E2B6F,#193F5F)",
    "linear(to-b,whiteAlpha.900,#B1AEC6)"
  );
  const {
    setCloseSideBar,
    user,
    setSelectedChat,

    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigator = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigator("/");
  };
  const btnRef = React.useRef();
  console.log("SideBarClosed is rendered");
  return (
    <Box
      bgGradient={bg}
      h="full"
      position={"relative"}
      w="fit-content"
      py={5}
      px={2}
    >
      <Box
        display="flex"
        flexDir={"column"}
        alignItems={"center"}
        position={"relative"}
        top="0"
        zIndex={10}
      >
        <IconButton
          placement="left"
          icon={<HamburgerIcon />}
          ref={btnRef}
          colorScheme="teal"
          onClick={onOpen}
        >
          Open
        </IconButton>
        <Drawer
          isOpen={isOpen}
          placement={"left"}
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader textAlign={"center"}>Menu</DrawerHeader>

            <DrawerBody>
              <VStack spacing={0} align="stretch">
                <ProfileModal user={user}>
                  <Button w={"full"} leftIcon={<InfoIcon />} variant="ghost">
                    <Text>Infomation</Text>
                  </Button>{" "}
                </ProfileModal>
                <Button
                  w={"full"}
                  leftIcon={<ArrowForwardIcon />}
                  variant="ghost"
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
                <Text w={"full"} leftIcon={<Search2Icon />} variant="ghost">
                  Search chat
                </Text>
                <Input placeholder="Type here..." />
              </VStack>
            </DrawerBody>

            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>

        <IconButton
          variant="outline"
          size={"lg"}
          icon={<ViewOffIcon size="xl" color={"whiteAlpha.900"} />}
          borderColor="transparent"
          borderRadius={"full"}
          aria-label="View Off"
          onClick={() => setCloseSideBar(false)}
          _hover={{
            bgColor: "transparent",
          }}
          _active={{
            bgColor: "transparent",
          }}
        />
        <Box display="flex" w="fit-content" borderRadius="full">
          <Box position="relative">
            <Menu>
              <MenuButton
                position="relative"
                borderRadius="full"
                border="3px solid black"
                _hover={{
                  borderColor: "yellow.500",
                }}
                onClick={() => setCloseSideBar(false)}
                mr={3}
              >
                <Box borderRadius="full" id="bgChatZone">
                  <Avatar
                    size={"md"}
                    name={user?.fullname}
                    src={user?.pic}
                  ></Avatar>
                  {notification.length > 0 && (
                    <Text
                      position="absolute"
                      bg="red"
                      borderRadius="full"
                      w="22px"
                      fontSize="14px"
                      h="22px"
                      verticalAlign="middle"
                      color="whiteAlpha.900"
                      top="0px"
                      right="0px"
                    >
                      {notification.length}
                    </Text>
                  )}
                </Box>
              </MenuButton>
              <MenuList pl={2}>
                {!notification.length && "No new messages"}
                {notification.map((notify) => (
                  <MenuItem
                    key={notify._id}
                    onClick={() => {
                      setSelectedChat(notify.chat);
                      setNotification(notify.filter((n) => n !== notify));
                    }}
                  >
                    {notify.chat.isGroupChat
                      ? `New Message(s) in ${notify.chat.chatName}`
                      : `New Message(s) from ${getSender(
                          user,
                          notify.chat.users
                        )}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SideBarClosed;
