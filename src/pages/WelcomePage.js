import React, { useEffect, useState } from "react";
import gsap from "gsap";
import SignIn from "../Components/authentication/SignIn";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SignUp from "../Components/authentication/SignUp";
import { motion, useIsPresent } from "framer-motion";
function WelcomePage() {
  const { isOpen, onToggle } = useDisclosure();
  const isPresent = useIsPresent();
  const navigator = useNavigate();
  useEffect(() => {
    isPresent &&
      gsap.fromTo(
        "#square1",
        { y: -200, x: 200 },
        { y: 0, x: 0, duration: 1.25, zIndex: 1, rotation: 45 }
      );
    isPresent &&
      gsap.fromTo(
        "#square2",
        { y: 200, x: 200 },
        { y: 0, x: 0, duration: 1.5, zIndex: 2, rotation: -45 }
      );
    isPresent &&
      gsap.fromTo(
        "#picture_login",
        { y: 0, x: 400, rotation: 0, zIndex: 3, scale: 1.5 },
        { y: 0, x: 0, duration: 1.75, zIndex: 3, scale: 1.5 }
      );
  }, [isPresent]);
  useEffect(() => {
    //fecth local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) navigator("/chats");
  }, [navigator]);
  const [show, setShow] = useState(false);
  //Animation
  console.log("WelcomePage is rendered");
  return (
    <div
      onMouseLeave={(e) => {
        document.documentElement.style.setProperty("--mouseX8", 0);
        document.documentElement.style.setProperty("--mouseY8", 0);
      }}
      onMouseMove={(e) => {
        let wh = window.innerHeight / 3,
          ww = window.innerWidth / 3;
        document.documentElement.style.setProperty(
          "--mouseX8",
          (e.clientX - ww) / 50
        );
        document.documentElement.style.setProperty(
          "--mouseY8",
          (e.clientY - wh) / 50
        );
        document.querySelectorAll(".parallax").forEach((move) => {
          let moving_vl = move.getAttribute("data-value");
          let x = (e.clientX * moving_vl) / 100;
          let y = (e.clientY * moving_vl) / 100;

          move.style.transform =
            "translateX(" + x + "px) translateY(" + y + "px)";
        });
      }}
      className="overflow-hidden relative max-w-full transition-transform bg-gradient-to-b from-dark-blue to-deep-blue h-[100vh]"
    >
      <Box
        id="login_form"
        position="relative"
        w={{ base: "full", md: "fit-content" }}
        h={{ base: "full", md: "fit-content" }}
        m="0"
        borderRadius={{ base: "none", md: "xl" }}
        top={{ base: "0", md: "50%" }}
        left={{ base: "0", md: "50%" }}
        transform={{ base: "unset", md: "translate(-50%, -50%)" }}
        zIndex={10}
        className="card card--8 transition-transform"
      >
        <Box m={0} zIndex={10}>
          <Text
            fontSize={48}
            fontWeight="bold"
            textAlign={"center"}
            textColor="whiteAlpha.900"
            className="parallax"
            data-value="2"
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-pink-700">
              Zola
            </span>
          </Text>
          <Text
            fontSize={16}
            fontWeight="bold"
            textAlign="center"
            textColor={"whiteAlpha.900"}
            className="parallax"
            data-value="3"
          >
            "Zo" a room then "la" together
          </Text>
        </Box>
        {!show ? (
          <SignIn setShow={setShow} isOpen={!isOpen} />
        ) : (
          <SignUp setShow={setShow} isOpen={!isOpen} />
        )}
        {!show ? (
          <Text textColor={"whiteAlpha.900"} align="center">
            don't have an account?{" "}
            <span className="font-bold">
              <Button
                variant="link"
                colorScheme={"whiteAlpha.900"}
                _hover={{
                  bgClip: "text",
                  bgGradient: "linear(to-br,blue.300,red.300)",
                }}
                onClick={() => {
                  setShow(!show);
                  onToggle(false);
                }}
              >
                Sign Up
              </Button>
            </span>
          </Text>
        ) : (
          <Text textColor={"whiteAlpha.900"} align="center">
            already have an account?{" "}
            <span className="font-bold">
              <Button
                variant="link"
                colorScheme={"whiteAlpha.900"}
                _hover={{
                  bgClip: "text",
                  bgGradient: "linear(to-br,blue.300,red.300)",
                }}
                onClick={() => {
                  setShow(!show);
                  onToggle(true);
                }}
              >
                Sign In
              </Button>
            </span>
          </Text>
        )}
      </Box>
      <Box id="picture_login"></Box>
      <Box id="square1"></Box>
      <Box id="square2"></Box>
      <div class="area">
        <ul class="circles parallax" data-value="5">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.5, ease: "circOut" } }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="fixed top-0 bottom-0 left-0 right-0 bg-indigo-700 z-40 overflow-hidden"
      />
    </div>
  );
}

export default WelcomePage;
