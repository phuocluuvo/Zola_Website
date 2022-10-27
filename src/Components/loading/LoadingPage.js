import { Box, Image } from "@chakra-ui/react";
import React, { memo } from "react";

const LoadingPage = memo(() => {
  return (
    <Box
      display={"flex"}
      justifyContent="center"
      alignItems={"center"}
      w="100vw"
      h="100vh"
      bgColor={"#0b1424"}
    >
      <Image
        src="https://static.collectui.com/shots/2800819/slidin-squares-loader-large"
        w="fit-content"
        h="fit-content"
        m="auto"
      />
    </Box>
  );
});

export default LoadingPage;
