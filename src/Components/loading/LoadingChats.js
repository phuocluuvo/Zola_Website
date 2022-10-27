import { Box, SkeletonCircle, SkeletonText, VStack } from "@chakra-ui/react";
import React from "react";

function LoadingChats() {
  return (
    <VStack zIndex={1} mb={5} overflow={"hidden"}>
      <Box
        padding="6"
        boxShadow="lg"
        bg="whiteAlpha.500"
        position="relative"
        display="flex"
        alignItems={"center"}
        borderRadius={"full"}
        mt={3}
        w={"95%"}
        p={"8px"}
        mx={3}
      >
        <SkeletonCircle size="14" />
        <SkeletonText noOfLines={1} spacing="4" />
        <SkeletonText w="30%" noOfLines={2} mx={3} />
      </Box>
      <Box
        padding="6"
        boxShadow="lg"
        bg="whiteAlpha.500"
        position="relative"
        display="flex"
        alignItems={"center"}
        borderRadius={"full"}
        mt={3}
        w={"95%"}
        p={"8px"}
        mx={3}
        opacity="0.8"
      >
        <SkeletonCircle size="14" />
        <SkeletonText noOfLines={1} spacing="4" />
        <SkeletonText w="30%" noOfLines={2} mx={3} />
      </Box>
      <Box
        padding="6"
        boxShadow="lg"
        bg="whiteAlpha.500"
        position="relative"
        display="flex"
        alignItems={"center"}
        borderRadius={"full"}
        mt={3}
        w={"95%"}
        p={"8px"}
        mx={3}
        opacity="0.6"
      >
        <SkeletonCircle size="14" />
        <SkeletonText noOfLines={1} spacing="4" />
        <SkeletonText w="30%" noOfLines={2} mx={3} />
      </Box>
      <Box
        padding="6"
        boxShadow="lg"
        bg="whiteAlpha.500"
        position="relative"
        display="flex"
        alignItems={"center"}
        borderRadius={"full"}
        mt={3}
        w={"95%"}
        p={"8px"}
        mx={3}
        opacity="0.4"
      >
        <SkeletonCircle size="14" />
        <SkeletonText noOfLines={1} spacing="4" />
        <SkeletonText w="30%" noOfLines={2} mx={3} />
      </Box>
      <Box
        padding="6"
        boxShadow="lg"
        bg="whiteAlpha.500"
        position="relative"
        display="flex"
        alignItems={"center"}
        borderRadius={"full"}
        mt={3}
        w={"95%"}
        p={"8px"}
        mx={3}
        opacity="0.2"
      >
        <SkeletonCircle size="14" />
        <SkeletonText noOfLines={1} spacing="4" />
        <SkeletonText w="30%" noOfLines={2} mx={3} />
      </Box>
      <Box
        padding="6"
        boxShadow="lg"
        bg="whiteAlpha.500"
        position="relative"
        display="flex"
        alignItems={"center"}
        borderRadius={"full"}
        opacity="0.1"
        mt={3}
        w={"95%"}
        p={"8px"}
        mx={3}
      >
        <SkeletonCircle size="14" />
        <SkeletonText noOfLines={1} spacing="4" />
        <SkeletonText w="30%" noOfLines={2} mx={3} />
      </Box>
    </VStack>
  );
}

export default LoadingChats;
