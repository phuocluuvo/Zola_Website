import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import React from "react";
import GroupChatModal from "../modal/GroupChatModal";

function CreateGroupChatButton() {
  return (
    <GroupChatModal>
      <Button
        display="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon fontSize={"25px"} />}
      >
        New Group Chat
      </Button>
    </GroupChatModal>
  );
}

export default CreateGroupChatButton;
