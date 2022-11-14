import React from "react";
import { RiVideoUploadFill } from "react-icons/ri";
import { MdFileUpload } from "react-icons/md";
import {
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";

function UploadMenuButton({ inputRef, selectVideoChange, selectFileChange }) {
  const { colorMode } = useColorMode();

  return (
    <Menu>
      <Input
        size="sm"
        ref={inputRef}
        multiple={true}
        onChange={selectFileChange}
        accept="file_extension/*"
        type="file"
        hidden
        id="icon-button-file"
      ></Input>
      <Input
        size="sm"
        ref={inputRef}
        multiple={true}
        onChange={selectVideoChange}
        accept="video/*"
        type="file"
        hidden
        id="icon-button-video"
      ></Input>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        variant="outline"
        icon={<AttachmentIcon />}
        h={{ base: "6", md: "8" }}
        w={{ base: "6", md: "8" }}
        border="none"
        rounded="full"
        bgGradient={
          colorMode !== "light"
            ? "linear-gradient(to top right, #1E2B6F, #193F5F)"
            : "unset"
        }
        _hover={{ opacity: 0.8 }}
      />
      <MenuList
        bgGradient={
          colorMode !== "light"
            ? "linear-gradient(to top right, #1E2B6F, #193F5F)"
            : "unset"
        }
      >
        <MenuItem htmlFor="icon-button-video" as="label" bg="none">
          <IconButton
            icon={
              <Icon
                color={
                  colorMode === "light" ? "blackAlpha.800" : "whiteAlpha.800"
                }
                as={RiVideoUploadFill}
                w={{ base: "4", md: "6" }}
                h={{ base: "4", md: "6" }}
              />
            }
            bg="none"
            as={"span"}
          ></IconButton>{" "}
          Upload video
        </MenuItem>{" "}
        <MenuItem as="label" htmlFor="icon-button-file">
          <IconButton
            icon={
              <Icon
                color={
                  colorMode === "light" ? "blackAlpha.800" : "whiteAlpha.800"
                }
                as={MdFileUpload}
                w={{ base: "4", md: "6" }}
                h={{ base: "4", md: "6" }}
              />
            }
            bg="none"
            as={"span"}
          ></IconButton>{" "}
          Upload File
        </MenuItem>{" "}
      </MenuList>
    </Menu>
  );
}

export default UploadMenuButton;
