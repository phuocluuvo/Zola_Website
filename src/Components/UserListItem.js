import { Avatar, Box, Divider, Text, VStack } from "@chakra-ui/react";
import React from "react";

function UserListItem({ user, handleFunction }) {
  console.log("UserListIem is rendered");
  return (
    <VStack spacing={0} cursor="pointer" opacity={0.8} width="100%">
      <Box
        onClick={handleFunction}
        className="transition-opacity pullRight"
        cursor="pointer"
        position="relative"
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        flex={1}
        py="7px"
        px="15px"
        w="full"
      >
        <Avatar
          mr={2}
          size="md"
          cursor="pointer"
          name={user.username}
          src={user.pic}
        />
        <Box flex="1">
          <Text fontWeight={"bold"}>@{user.username}</Text>
          <Text fontSize="xs" className="truncate">
            Email: {user.email}
          </Text>
        </Box>
      </Box>
      <Divider w="95%" p="0" m="0" />
    </VStack>
  );
}

export default UserListItem;
