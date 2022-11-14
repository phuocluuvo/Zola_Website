import React from "react";
import { ArrowForwardIcon, HamburgerIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../providers/ChatProvider";
function DrawerMenuUser() {
  const bg = useColorModeValue(
    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
    "linear(to-t,blue.900,purple.900)"
  );
  const { colorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const navigator = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigator("/");
  };
  const { user } = ChatState();
  return (
    <>
      <IconButton
        placement="left"
        borderRadius={"full"}
        w={{ base: "17px", md: "10px", lg: "17px" }}
        mx={1}
        mt={1}
        position="relative"
        border="none"
        aria-label="Options"
        icon={
          <HamburgerIcon
            fontSize={25}
            textColor={colorMode === "light" ? "black" : "whiteAlpha.900"}
          />
        }
        bg="none"
        ref={btnRef}
        onClick={onOpen}
      ></IconButton>
      <Drawer
        isOpen={isOpen}
        placement={"left"}
        onClose={onClose}
        size={{ base: "full", md: "xs" }}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader textAlign={"center"}>Menu</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} flexDir="column">
              <ProfileModal user={user}>
                <Button w={"full"} leftIcon={<InfoIcon />} variant="ghost">
                  <Text>Infomation</Text>
                </Button>
              </ProfileModal>
              <Button
                w={"full"}
                leftIcon={<ArrowForwardIcon />}
                variant="ghost"
                onClick={logoutHandler}
              >
                Logout
              </Button>
            </Box>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DrawerMenuUser;
