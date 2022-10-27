import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="45px" opacity={"1"} />
      <Skeleton height="45px" opacity={"0.8"} />
      <Skeleton height="45px" opacity={"0.7"} />
      <Skeleton height="45px" opacity={"0.6"} />
      <Skeleton height="45px" opacity={"0.4"} />
      <Skeleton height="45px" opacity={"0.25"} />
    </Stack>
  );
};

export default ChatLoading;
