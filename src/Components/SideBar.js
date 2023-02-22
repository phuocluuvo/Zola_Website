import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React from "react";
import ChatList from "./list/ChatsList";
import { ChatState } from "../providers/ChatProvider";

import CreateGroupChatButton from "./button/CreateGroupChatButton";

function SideBar({ fetchAgain, setFetchAgain }) {
  const bg = useColorModeValue(
    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
    "linear(to-t,blue.900,purple.900)"
  );
  const colorLoggedUser = useColorModeValue(
    "linear(to-b,whiteAlpha.900,#B1AEC6)",
    "linear(to-b,#1E2B6F,#193F5F)"
  );

  const {
    setCloseSideBar,
    user,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const { colorMode } = useColorMode();

  console.log("SideBar is rendered");
  return (
    <>
      <Box
        className="scrollbar-thin  scrollbar-track-blue-900 scrollbar-thumb-slate-500"
        // bgGradient={bg}
        h="100vh"
        position={"relative"}
        minW={"fit-content"}
        w="full"
        zIndex={1}
        overflowX="hidden"
      >
        {/**Sidebar navigation */}
        <Box position={"sticky"} top={0} zIndex={10}>
          <Box
            display="flex"
            alignItems={"center"}
            position={"sticky"}
            p={{ base: 0, md: 3 }}
            justifyContent={"center"}
            top={0}
            zIndex={10}
          >
            {/**Avata user badge: colorLoggedUser, user,notification */}
            <Box
              display="flex"
              w={{ base: "full", md: "fit-content" }}
              mt={{ base: "0", md: "5" }}
              p={2}
              borderRadius={{ base: " 0 0 20px 20px ", md: "full" }}
              bgGradient={{ base: "unset", md: colorLoggedUser }}
              boxShadow="xl"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex">
                <Menu>
                  <MenuButton
                    position="relative"
                    borderRadius="full"
                    border="3px solid black"
                    _hover={{
                      borderColor: "yellow.500",
                    }}
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
                          console.log(notify.chat);
                          setNotification(
                            notification.filter((n) => n !== notify)
                          );
                        }}
                      >
                        {notify.chat.isGroupChat
                          ? `New Message(s) in ${notify.chat.chatName}`
                          : `New Message(s) from @${notify.sender.username}`}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Box
                  textColor={useColorModeValue(
                    "blackAlpha.900",
                    "whiteAlpha.900"
                  )}
                >
                  <Text opacity={0.7} fontSize="xs">
                    @{user?.username}
                  </Text>
                  <Text
                    fontSize={"lg"}
                    w={{ lg: "125px", md: "fit-content" }}
                    noOfLines={1}
                  >
                    {user?.fullname}
                  </Text>
                </Box>
              </Box>
              <Box
                pos={"relative"}
                display="flex"
                justifyContent={"center"}
                alignItems="center"
                px="3"
              >
                <CreateGroupChatButton />
              </Box>
            </Box>
            {/**view button */}
            <IconButton
              display={{
                base: "none",
                md: "block",
              }}
              mt={5}
              mx={2}
              variant="outline"
              size={"lg"}
              onClick={() => setCloseSideBar(true)}
              icon={<ViewIcon size="xl" color={"whiteAlpha.900"} />}
              borderColor="transparent"
              bgBlendMode={"overlay"}
              borderRadius={"full"}
              aria-label="View"
            />
          </Box>
          {/** Background img*/}
          <Box
            pos={"absolute"}
            top={0}
            zIndex={5}
            h={"75px"}
            w={{ base: "full", md: "fit-content" }}
            p={{ base: "10px", md: "0" }}
            borderRadius={{ base: " 0 0 20px 20px ", md: "full" }}
            boxShadow="xl"
            bgImage={{ base: `url('${user?.pic}')`, md: "none" }}
            bgRepeat={"no-repeat"}
            bgSize="cover"
            bgPosition={"center"}
            className="transition-all"
            filter={"grayscale(100%)"}
          ></Box>
          {/** Background gradient*/}
          <Box
            pos={"absolute"}
            top={0}
            zIndex={6}
            h={"75px"}
            w={{ base: "full", md: "fit-content" }}
            p={{ base: "10px", md: "0" }}
            borderRadius={{ base: " 0 0 20px 20px ", md: "full" }}
            boxShadow="xl"
            bgRepeat={"no-repeat"}
            bgSize="cover"
            bgPosition={"center"}
            className={`transition-all bg-gradient-to-b ${
              colorMode === "dark" ? "from-[#00000d7d]" : "from-[#ffffff7d]"
            }`}
            filter={"grayscale(100%)"}
          ></Box>
        </Box>
        <ChatList fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
      <Box
        className="scrollbar-thin  scrollbar-track-blue-900 scrollbar-thumb-slate-500"
        bgGradient={bg}
        h="100vh"
        position={"absolute"}
        minW={"fit-content"}
        zIndex={0}
        w="full"
        overflowX="hidden"
      ></Box>
      <Box
        className="scrollbar-thin  scrollbar-track-blue-900 scrollbar-thumb-slate-500"
        bgImage={`url('${user?.pic}')`}
        display={{ md: "inline-block", base: "none" }}
        h="100vh"
        position={"absolute"}
        minW={"fit-content"}
        zIndex={0}
        opacity={0.3}
        w="full"
        filter={"grayscale(100%)"}
        overflowX="hidden"
        bgRepeat={"no-repeat"}
        bgSize="cover"
        bgPos={"top 45% right 45%"}
      ></Box>
    </>
  );
}

export default SideBar;
