import { Box } from "@chakra-ui/react";
import React, { memo, useCallback, useRef, useState } from "react";
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
    <ScrollableFeed className="pb-32 pt-16 px-4 w-full scrollbar-thin scroll-smooth">
      <div>{loadingMessage && "Loading..."}</div>
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
