import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import SideBar from "../Components/SideBar";
import ChatZone from "../Components/ChatZone";
import SideBarClosed from "../Components/SideBarClosed";
import { ChatState } from "../providers/ChatProvider";
import { motion, useIsPresent } from "framer-motion";
import { ErrorBoundary } from "../errors/ErrorBoundary";
import NavigationSideBar from "./NavigationSideBar";

function ChatPage() {
  const { closeSideBar, selectedChat, user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false); // cờ hiệu refresh
  const isPresent = useIsPresent();
  console.log("ChatPage is rendered");
  return (
    <ErrorBoundary>
      <div className=" max-w-[100vw] h-[100vh] flex flex-row p-0 relative overflow-hidden">
        {user && (
          <>
            <NavigationSideBar />
            <>
              <Box
                display={{
                  base: !selectedChat ? "flex" : "none",
                  md: closeSideBar ? "none" : "flex",
                }}
                flex={{ base: "1", md: "0.3" }}
              >
                <SideBar
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </Box>
              <Box
                w={"fit-content"}
                display={{ base: "none", md: closeSideBar ? "flex" : "none" }}
                flex={{ base: "1", md: "0" }}
              >
                <SideBarClosed />
              </Box>
              <Box
                display={{ base: !selectedChat ? "none" : "flex", md: "flex" }}
                flex={{ base: closeSideBar ? "1" : "auto", md: "1" }}
              >
                <ChatZone
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </Box>
            </>
          </>
        )}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{
            scaleX: 0,
            transition: { duration: 0.5, ease: "circOut" },
          }}
          exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
          style={{ originX: isPresent ? 0 : 1 }}
          className="fixed top-0 bottom-0 left-0 right-0 bg-indigo-700 z-40 overflow-hidden"
        />
      </div>
    </ErrorBoundary>
  );
}

export default ChatPage;
