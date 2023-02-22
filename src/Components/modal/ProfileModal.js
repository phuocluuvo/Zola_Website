import {
  Avatar,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { memo } from "react";
import ChangeInfoForm from "../form/ChangeInfoForm";

function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen} style={{ cursor: "pointer" }}>
          {children}
        </span>
      ) : null}
      <Modal
        size={{ base: "full", md: "md" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="whiteAlpha.900"
            fontSize="40px"
            display="flex"
            justifyContent="center"
            pos={"relative"}
            borderTopRadius={"10"}
          >
            <Box
              bg={"black"}
              w="full"
              top="0"
              h="80px"
              pos="absolute"
              zIndex={0}
              borderTopRadius={"5"}
            ></Box>
            <Avatar
              size="2xl"
              name={user?.fullname}
              pos="relative"
              zIndex={10}
              src={user?.pic}
            />
          </ModalHeader>
          <ModalCloseButton _hover={{ color: "white" }} />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems={"center"}
            justifyContent="space-around"
          >
            <Box display={"flex"} flexDir="column" alignItems="center">
              <Text>@{user?.username}</Text>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                {user?.fullname}
              </Text>
              <Text>Email: {user?.email}</Text>
            </Box>

            <ChangeInfoForm userUpdate={user} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default memo(ProfileModal);
