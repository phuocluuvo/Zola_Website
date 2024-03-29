import { Box, Spinner, Text } from "@chakra-ui/react";
import React, { useCallback, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";

import MessageItem from "./MessageItem";

function MessageList({
  loadingMessage,
  error,
  messages,
  hasMore,
  setPageNumber,
}) {
  const observer = useRef();
  const lastMessageElementRef = useCallback(
    (node) => {
      if (loadingMessage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadingMessage, hasMore]
  );
  return (
    <ScrollableFeed className="pt-16 px-4 w-full scrollbar-thin scroll-smooth scrollbar-thumb-slate-600">
      {loadingMessage ? (
        <Box
          w={"full"}
          textAlign="center"
          justifyContent={"center"}
          alignItems="center"
          display="flex"
        >
          <Text>Loading...</Text>
          <Spinner size={"sm"}></Spinner>
        </Box>
      ) : null}
      <div>{error && "Error"}</div>
      {messages.map((m, i) =>
        i === 0 ? (
          <Box ref={lastMessageElementRef}>
            <MessageItem key={i} messages={messages} m={m} i={i} />
          </Box>
        ) : (
          <MessageItem messages={messages} m={m} i={i} key={i} />
        )
      )}
    </ScrollableFeed>
  );
}
export default MessageList;
