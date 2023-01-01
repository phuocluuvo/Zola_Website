import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useDisclosure,
  Avatar,
  Box,
  Text,
  IconButton,
  useColorMode,
  useToast,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { ChatState } from "../providers/ChatProvider";
import axios from "axios";
import { GalleryPhoto } from "./GalleryPhotoChat";

export default function DrawerInfoUser({ _user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const btnRef = React.useRef();
  const [pics, setPics] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedChat, user } = ChatState();
  const [photoIndex, setPhotoIndex] = useState(1);
  const [openGallery, setOpenGallery] = useState(false);
  const toast = useToast();

  const fetchPictures = async () => {
    if (!selectedChat) return;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        cancelToken: source.token,
      };
      setLoading(true);
      await axios
        .get(
          `https://zolachatapp-sever.onrender.com/api/message/${selectedChat._id}`,
          config
        )
        .then((data) => {
          for (const element of data.data.reverse()) {
            if (element.multiMedia) {
              setPics((pics) => [
                ...pics,
                {
                  photo: element.multiMedia,
                  caption: element.sender.username,
                  subcaption: element.content,
                },
              ]);
            }
          }
        });
      setLoading(false);
    } catch (error) {
      if (axios.isCancel(error)) console.log("successfully aborted");
      else
        toast({
          title: "Error Occured",
          description: "Failed to load pic",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
    }
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  };
  return !selectedChat.isGroupChat ? (
    <>
      <IconButton
        ref={btnRef}
        variant={"ghost"}
        className="transition-opacity"
        borderRadius="full"
        onClick={() => {
          onOpen();
          fetchPictures();
        }}
        transform="unset"
        ml={3}
        _hover={{
          color: "black",
          bgGradient:
            colorMode === "light"
              ? "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
              : "linear(to-b,#1E2B6F,#193F5F)",
        }}
        icon={
          colorMode === "light" ? (
            <InfoIcon textColor={"whiteAlpha.900"} />
          ) : (
            <InfoIcon textColor={"yellow"} />
          )
        }
      ></IconButton>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose();
          setPics([]);
        }}
        size={{ base: "full", md: "sm" }}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton
            top={{ base: 5, md: 7 }}
            right={{ base: 5, md: 10 }}
            zIndex={1}
            color="white"
          />
          <DrawerHeader
            bg="whiteAlpha.900"
            fontSize="40px"
            display="flex"
            justifyContent="center"
            pos={"relative"}
          >
            <Box
              bg={"black"}
              w="full"
              top="0"
              h="80px"
              pos="absolute"
              zIndex={0}
            ></Box>
            <Avatar
              size="2xl"
              name={_user?.fullname}
              pos="relative"
              zIndex={10}
              src={_user?.pic}
            />
          </DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} flexDir="column" alignItems="center">
              <Text>@{_user?.username}</Text>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                {_user?.fullname}
              </Text>
              <Text>Email: {_user?.email}</Text>
            </Box>
            <Text>Gallery</Text>
            {pics.length > 0 ? (
              <>
                <Grid
                  overflowY={"scroll"}
                  h="400px"
                  gridGap={3}
                  templateColumns={{
                    base: "repeat(4, 1fr)",
                    md: "repeat(3, 1fr)",
                  }}
                  gap={1}
                  className="scrollbar-thin hover:scrollbar-thumb-slate-600 scrollbar-thumb-slate-300 scroll-smooth"
                >
                  {pics?.map((pic, i) => (
                    <GridItem
                      key={i}
                      w="100%"
                      onClick={() => {
                        setPhotoIndex(i);
                        setOpenGallery(true);
                      }}
                      h="120px"
                      bg="blackAlpha.900"
                      bgImage={pic.photo}
                      bgPos="center"
                      bgRepeat={"no-repeat"}
                      bgSize={"cover"}
                      bgClip={"border-box"}
                    ></GridItem>
                  ))}
                </Grid>
                <GalleryPhoto
                  PHOTOS={pics}
                  index={photoIndex}
                  isOpen={openGallery}
                  setIsOpen={setOpenGallery}
                />
              </>
            ) : (
              <Text fontSize={"2xl"} m="auto" textAlign={"center"}>
                Send some pictures to show in here 😺📸
              </Text>
            )}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  ) : null;
}
