import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

function UserBadgeItem({ _user, handleFunction, isAdmin }) {
  console.log("UserBadgeItem is rendered");
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      display="flex"
      alignItems="center"
      justifyItems="center"
      variant="solid"
      fontSize={12}
      textColor="whiteAlpha.900"
      cursor="pointer"
      onClick={handleFunction}
      opacity="0.7"
      bg={`${isAdmin ? "yellow" : "red"}`}
      transition="all 0.25s ease-in-out"
      _hover={{ opacity: "1", textDecor: "line-through" }}
    >
      @{_user?.username}
      {!isAdmin && <CloseIcon pl={1} />}
    </Box>
  );
}

export default UserBadgeItem;
