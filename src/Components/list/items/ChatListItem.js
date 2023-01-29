import React from "react";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import moment from "moment";
import {
  getSender,
  getSenderInfo,
  isExistInArray,
} from "../../../logic/ChatLogic";
import io from "socket.io-client";
import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../providers/ChatProvider";
function ChatListItem({ chat, index, friends }) {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const { colorMode } = useColorMode();
  //   const [friends, setFriends] = useState([]);
  return (
    <Box
      display={"flex"}
      width="100%"
      justifyItems={"center"}
      alignItems="center"
      className="transition-colors "
      bgColor={
        selectedChat?._id !== chat?._id
          ? ""
          : colorMode === "light"
          ? "white"
          : "whiteAlpha.800"
      }
      mx={3}
    >
      <Box
        key={index}
        className="transition-opacity pullRight"
        onClick={() => {
          selectedChat
            ? io(process.env.REACT_APP_PORT).emit("outchat", selectedChat._id)
            : console.log("out r");
          setSelectedChat(chat);
        }}
        cursor="pointer"
        position="relative"
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        flex={1}
        py="7px"
        px="15px"
      >
        {chat.isGroupChat ? (
          <AvatarGroup
            size={"xs"}
            max={3}
            spacing={0}
            flexWrap={"wrap"}
            flexDirection="row-reverse"
            width="55px"
            py={0.5}
            pl={1}
          >
            {chat.users.map((u) => (
              <Avatar
                key={u._id}
                size={"md"}
                name={chat.chatName}
                src={u.pic}
              />
            ))}
          </AvatarGroup>
        ) : (
          <Avatar
            showBorder={true}
            width="55px"
            height="55px"
            size={"md"}
            name={user?._id && getSender(user, chat.users)}
            src={getSenderInfo(user, chat.users).pic}
          ></Avatar>
        )}
        <Box flex="1" px="2" maxW="400px" w="0.5">
          <HStack>
            <Text
              fontWeight={"bold"}
              textColor={
                selectedChat?._id === chat._id ? "black" : "whiteAlpha.900"
              }
              maxW={{ base: "fit-content", md: "250px" }}
              className="truncate"
              fontSize={{ base: "sm", md: "md" }}
            >
              {chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
            </Text>
            {!chat.isGroupChat &&
            isExistInArray(getSenderInfo(user, chat.users), friends) ===
              false ? (
              <Badge colorScheme={"facebook"} fontSize="2xs" mx="2">
                Stranger
              </Badge>
            ) : null}
          </HStack>
          <Text
            textColor={
              selectedChat?._id === chat._id ? "black" : "whiteAlpha.500"
            }
            w={{ base: "100%", md: "200px" }}
            fontSize={{ base: "sm", md: "md" }}
            textOverflow={"ellipsis"}
            overflow="hidden"
            whiteSpace={"nowrap"}
          >
            {chat.latestMessage?.content === undefined ? (
              <span className="italic">{"Chat something 🥺"}</span>
            ) : chat.isGroupChat ? (
              chat.latestMessage ? (
                `@${chat.latestMessage?.sender.username}: ${chat.latestMessage?.content} `
              ) : null
            ) : (
              `${
                chat.latestMessage?.sender._id === user._id
                  ? "You: " + chat.latestMessage?.content
                  : chat.latestMessage?.content
              }`
            )}{" "}
          </Text>
        </Box>
        <Text
          bgClip={"text"}
          fontSize="12"
          bgGradient={
            selectedChat?._id === chat._id
              ? "linear(to-br,blue.900,blue.800)"
              : "linear(to-br,white,white)"
          }
          textAlign={"right"}
          w={{ base: "fit-content", md: "100px" }}
          p={{ base: "5", md: "1" }}
        >
          {chat.latestMessage?.content === undefined
            ? ""
            : moment(chat.latestMessage?.createdAt).fromNow()}
        </Text>
        {/*menu button*/}
        <Box>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<ChevronDownIcon />}
              variant="outline"
              border="none"
              color={
                selectedChat?._id === chat._id
                  ? "blackAlpha.500"
                  : "whiteAlpha.900"
              }
              _hover={{ color: "blue.900" }}
              _active={{ color: "blue.900", fontSize: "20px" }}
              className={"forcus:animate-bounce transition-transform"}
            />
            <MenuList>
              <MenuItem icon={<DeleteIcon />} color={"red.500"}>
                Delete Chat
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatListItem;
