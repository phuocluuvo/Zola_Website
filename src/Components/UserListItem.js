import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

function UserListItem({ user, handleFunction }) {
  console.log("UserListIem is rendered");
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "whiteAlpha.900",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.username}
        src={user.pic}
      />
      <Box>
        <Text>{user.username}</Text>
        <Box>
          <Text fontSize="xs" className="font-bold">
            Email :
          </Text>
          <Text fontSize="xs" className="truncate">
            {user.email}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default UserListItem;
