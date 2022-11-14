import {
  ArrowForwardIcon,
  ChatIcon,
  InfoIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
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
import DrawerSearchUser from "../Components/DrawerSearchUser";
export default function NavigationSideBar({ display, setIsDisplay }) {
  const { user } = ChatState();
  const toggleSwitch = () => setIsOn(!isOn);
  const [isOn, setIsOn] = useState(false);

  const [isHover, setHover] = useState(false);
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };
  const bg = useColorModeValue(
    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
    "linear(to-t,blue.900,purple.900)"
  );
  const divAnimationControls = useAnimation();
  const divAnimationControlsImage = useAnimation();
  const { colorMode, toggleColorMode } = useColorMode();

  const divAnimationVariants = {
    init: {
      width: "40px",
    },
    anim: {
      width: "150px",
      transition: {
        type: "circOut",
        duration: 0.25,
      },
    },
    exit: {
      width: "40px",
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
    },
    exit: {
      width: "25px",
      height: "25px",
      paddingTop: 0,
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
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 20,
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
          maxBlockSize={"32"}
          name={user.fullname}
          transition="all 0.25 ease-in-out"
          src={user.pic}
          m="auto"
        />
        <Text noOfLines={1} textAlign="center">
          @{isHover && user.username}
        </Text>
      </motion.div>

      <HStack mx={isHover ? 5 : 1} my="8">
        <Box
          className={`${
            isOn ? "justify-end" : "justify-start"
          } w-[50px] h-[30px] bg-slate-400 flex rounded-full p-1 cursor-pointer 
                    `}
          onClick={() => {
            toggleSwitch();
            toggleColorMode();
          }}
        >
          <motion.div
            className={`handle w-[25px] h-[20px] flex justify-center items-center  ${
              isHover && "rounded-full"
            }`}
            layout
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 20,
            }}
            onClick={toggleColorMode}
          >
            <IconButton
              variant={"ghost"}
              className="transition-opacity"
              borderRadius="full"
              transform="unset"
              _hover={{
                transform: "rotate(40deg)",
              }}
              color="black"
              bgGradient={
                colorMode === "light"
                  ? "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
                  : "linear(to-b,#1E2B6F,#193F5F)"
              }
              icon={
                colorMode === "light" ? (
                  <MoonIcon textColor={"whiteAlpha.900"} />
                ) : (
                  <SunIcon textColor={"yellow"} />
                )
              }
            />
          </motion.div>
        </Box>
        <Text fontWeight={"bold"}>
          {colorMode === "light" ? "Light" : "Dark"}
        </Text>
      </HStack>
      <Spacer />

      <DrawerSearchUser>
        <Button
          className="pullRight"
          _hover={{
            textColor:
              colorMode === "dark" ? "whiteAlpha.900" : "grayAlpha.500",
            rounded: "none",
          }}
          leftIcon={
            <SearchIcon
              w={5}
              h={5}
              transition={"transform 0.6s"}
              transform={isHover && "rotateY(180deg)"}
            />
          }
          _active={{ rounded: "none" }}
          variant={"ghost"}
          rounded="none"
          w="100%"
        >
          <Text noOfLines={1} w="full" textAlign={"left"}>
            Search
          </Text>
        </Button>
      </DrawerSearchUser>

      <Button
        className="pullRight"
        _hover={{
          textColor: colorMode === "dark" ? "whiteAlpha.900" : "grayAlpha.500",
          rounded: "none",
        }}
        _active={{ rounded: "none" }}
        bgGradient={display && bg}
        variant={"ghost"}
        rounded="none"
        leftIcon={
          <Icon
            as={MdOutlineFeaturedPlayList}
            w={5}
            h={5}
            transition={"transform 0.6s"}
            transform={isHover && "rotateY(180deg)"}
          />
        }
        onClick={() => setIsDisplay(true)}
        w="full"
      >
        <Text noOfLines={1} w="full" textAlign={"left"}>
          Friends List
        </Text>
      </Button>
      <Button
        _active={{ rounded: "none" }}
        rounded="none"
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
        bgGradient={!display && bg}
        onClick={() => setIsDisplay(false)}
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
          <MenuItem
            icon={<ArrowForwardIcon />}
            _hover={{ color: "red.500" }}
            onClick={() => logoutHandler()}
          >
            <Text textAlign={"left"} w="full">
              Logout
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </motion.div>
  );
}
