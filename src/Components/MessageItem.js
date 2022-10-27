import { ChatIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUserMargin,
} from "../logic/ChatLogic";
import { ChatState } from "../providers/ChatProvider";

function MessageItem({ messages, setMessages, m, i }) {
  const [isHover, setIsHover] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setResponse } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchMessages = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else
        toast({
          title: "Error Occured",
          description: "Failed to send message",
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };

  async function handleDelete(messageId) {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios
        .put(
          "/api/message/delete",
          {
            messageId: messageId,
          },
          config
        )
        .then((res) => {
          console.log(user);
          console.log(res.data);
        });
      fetchMessages();
    } catch (e) {
      toast({
        title: "Error Occured",
        description: "Failed to delete the message",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  return (
    <>
      <Box
        key={m._id}
        marginBottom={1}
        display="flex"
        textColor={"blackAlpha.900"}
        alignItems="center"
        position={"relative"}
        zIndex={0}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/** messages, m, i, _id */}
        {(isSameSender(messages, m, i, user._id) ||
          isLastMessage(messages, i, user._id)) && (
          <Tooltip
            label={"@" + m.sender.username}
            hasArrow
            placeContent="bottom-start"
          >
            <Avatar
              size="md"
              showBorder={true}
              cursor="pointer"
              my="auto"
              mr={2}
              display={m.sender._id === user._id && "none"}
              name={m.sender.username}
              src={m.sender.pic}
              marginTop={isSameUserMargin(messages, m, i, user._id) ? 0 : 45}
            />
          </Tooltip>
        )}

        <Box
          className="shadow-lg"
          display="flex"
          flexDirection="column"
          maxWidth="75%"
          w={"fit-content"}
          borderRadius="10px"
          backgroundColor={`${
            m.sender._id === user._id ? "#BEE3F8" : "whiteAlpha.900"
          }`}
          padding="10px"
          marginLeft={isSameSenderMargin(messages, m, i, user._id)}
          marginTop={isSameUserMargin(messages, m, i, user._id) ? "auto" : 30}
          position={"relative"}
        >
          {m?.response && (
            <Box pos="relative">
              <Text
                fontSize={"xs"}
                color="blackAlpha.800"
                pos="relative"
                top={0}
                left={0}
              >
                @{m.response?.sender.username}
              </Text>
              <Box bg="blackAlpha.500" p={1} pt={4} rounded="sm" display="flex">
                <Text
                  color="whiteAlpha.800"
                  className="truncate"
                  maxW={"150px"}
                >
                  {m.response?.content}
                </Text>
              </Box>
            </Box>
          )}
          <Text
            width={"fit-content"}
            color={m.content === "deleted" && "gray.600"}
            fontStyle={m.content === "deleted" && "italic"}
          >
            {m.content}
          </Text>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <Text
              width={"fit-content"}
              fontSize={9}
              marginLeft={0}
              textColor={"blackAlpha.900"}
            >
              {moment(m.createdAt).calendar()}
            </Text>
          )}
          <Box
            display={isHover && m.content !== "deleted" ? "flex" : "none"}
            position="absolute"
            w="100px"
            justifyContent={"space-between"}
            alignItems={"center"}
            top={0}
            bottom={0}
            m={"auto 0"}
            right={m.sender._id === user._id ? "unset" : -32}
            left={m.sender._id === user._id ? -32 : "unset"}
          >
            <IconButton
              borderRadius={"full"}
              onClick={() => {
                setResponse(m);
              }}
              icon={<ChatIcon fontSize={15} />}
            ></IconButton>
            <IconButton
              display={m.sender._id === user._id ? "inline" : "none"}
              onClick={onOpen}
              borderRadius={"full"}
              icon={<DeleteIcon fontSize={15} />}
            ></IconButton>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered="true">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Delete Message</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Are you sure you want to delete this message?</Text>
                <Text color={"gray"} fontStyle="italic">
                  You cannot undo the action
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>

                <Button
                  variant="solid"
                  colorScheme={"red"}
                  onClick={() => {
                    handleDelete(m._id);
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </>
  );
}

export default memo(MessageItem);
