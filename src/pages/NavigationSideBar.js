import {
  ArrowForwardIcon,
  ChatIcon,
  EditIcon,
  HamburgerIcon,
  InfoIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../providers/ChatProvider";
import { motion, useAnimation } from "framer-motion";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import ProfileModal from "../Components/ProfileModal";
export default function NavigationSideBar() {
  const { user } = ChatState();
  const [isHover, setHover] = useState(false);
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigator("/");
  };
  const { colorMode } = useColorMode();

  const bg = useColorModeValue(
    "linear(to-b,#C39A9E,#808293)",
    "linear(to-t,blue.900,purple.900)"
  );
  const divAnimationControls = useAnimation();
  const divAnimationControlsImage = useAnimation();

  const divAnimationVariants = {
    init: {
      width: "50px",
    },
    anim: {
      width: "150px",
      transition: {
        type: "circOut",
        duration: 0.25,
      },
    },
    exit: {
      width: "50px",
      transition: {
        type: "circIn",
        duration: 0.25,
      },
    },
  };

  const divAnimationImage = {
    init: {
      width: "25px",
      height: "50px",
      paddingTop: 0,
    },
    anim: {
      width: "120px",
      height: "120px",
      paddingTop: 5,
      transition: {
        type: "circOut",
        duration: 0.25,
      },
    },
    exit: {
      width: "25px",
      height: "25px",
      paddingTop: 0,

      transition: {
        type: "circIn",
        duration: 0.25,
      },
    },
  };
  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 8,
        justifyContent: "center",
        width: "40px",
      }}
      initial={divAnimationVariants.init}
      animate={divAnimationControls}
      onHoverStart={() => {
        setHover(true);
        divAnimationControls.start(divAnimationVariants.anim);
        divAnimationControlsImage.start(divAnimationImage.anim);
      }}
      onHoverEnd={() => {
        setHover(false);
        divAnimationControlsImage.start(divAnimationImage.exit);
        divAnimationControls.start(divAnimationVariants.exit);
      }}
    >
      <motion.div
        initial={divAnimationImage.init}
        style={{
          width: "25px",
          height: "25px",
          margin: "auto",
        }}
        animate={divAnimationControlsImage}
      >
        <Avatar
          size={"full"}
          maxBlockSize={"28"}
          name={user.fullname}
          transition="all 0.25 ease-in-out"
          src={user.pic}
          m="auto"
        />
        <Text noOfLines={1} textAlign="center">
          @{isHover && user.username}
        </Text>
      </motion.div>
      <Spacer />
      <Button
        className="pullRight"
        _hover={{
          textColor: colorMode === "dark" ? "whiteAlpha.900" : "grayAlpha.500",
          rounded: "none",
        }}
        _active={{ rounded: "none" }}
        variant={"ghost"}
        leftIcon={
          <Icon
            as={MdOutlineFeaturedPlayList}
            w={5}
            h={5}
            transition={"transform 0.6s"}
            transform={isHover && "rotateY(180deg)"}
          />
        }
        w="full"
      >
        <Text noOfLines={1} w="full" textAlign={"left"}>
          Friends List
        </Text>
      </Button>
      <Button
        _active={{ rounded: "none" }}
        className="pullRight"
        _hover={{
          textColor: colorMode === "dark" ? "whiteAlpha.900" : "grayAlpha.500",
          rounded: "none",
        }}
        variant={"ghost"}
        leftIcon={
          <ChatIcon
            transition={"transform 0.6s"}
            transform={isHover && "rotateY(180deg)"}
          />
        }
        w="full"
      >
        <Text noOfLines={1} w="full" textAlign={"left"}>
          Chats
        </Text>
      </Button>
      <Menu>
        <MenuButton
          as={Button}
          className="pullRight"
          aria-label="Options"
          _active={{ rounded: "none", bgGradient: bg }}
          variant={"ghost"}
          leftIcon={
            <SettingsIcon
              transition={"transform 0.6s"}
              transform={isHover && "rotateY(180deg)"}
            />
          }
          w="full"
          _hover={{
            textColor:
              colorMode === "dark" ? "whiteAlpha.900" : "grayAlpha.500",
            rounded: "none",
          }}
        >
          <Text noOfLines={1} w="full" textAlign={"left"}>
            Setting
          </Text>
        </MenuButton>

        <MenuList pos="relative" zIndex="50">
          <ProfileModal user={user}>
            <MenuItem icon={<InfoIcon />}>
              <Text textAlign={"left"} w="full">
                Infomation
              </Text>
            </MenuItem>
          </ProfileModal>
          <MenuDivider />
          <MenuItem icon={<ArrowForwardIcon />} onClick={logoutHandler}>
            <Text textAlign={"left"} w="full">
              Logout
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </motion.div>
  );
}
