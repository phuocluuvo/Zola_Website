import React, { Fragment, memo, useEffect, useState } from "react";
import { Divider, useToast, VStack } from "@chakra-ui/react";
import { ChatState } from "../../providers/ChatProvider";
import axios from "axios";
import { getChats } from "../../apis/chats.api";
import { getUsersFriends } from "../../apis/users.api";
import ChatListItem from "./items/ChatListItem";

function ChatList({ fetchAgain, setFetchAgain }) {
  const { user, chats, setChats } = ChatState();

  const [friends, setFriends] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchChats();
    fetchFriends();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  const fetchChats = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      if (user) getChats().then((res) => setChats(res.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else {
        console.log(error);

        toast({
          title: "Error Occured",
          description:
            "Failed to load chats. Auto-refreshing in 2 seconds to fix the issue.",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom-left",
        });
        
        setTimeout(() => {
          window.location.reload();
          return () => {
            // cancel the request before component unmounts
            source.cancel();
          };
        }, 2000);
      }
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  const fetchFriends = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      getUsersFriends().then((res) => setFriends(res.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("successfully aborted");
      } else {
        console.log(error);
        toast({
          title: "Error Occured",
          description: "Failed to load friends list",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  return (
    <VStack zIndex={1} mb={5} spacing="0">
      {user
        ? chats.map((chat, index) => (
            <Fragment key={index}>
              <ChatListItem chat={chat} index={index} friends={friends} />
              <Divider w="95%" />
            </Fragment>
          ))
        : null}
    </VStack>
  );
}

export default memo(ChatList);
