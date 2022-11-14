import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
  VStack,
  InputRightElement,
  HStack,
  Avatar,
} from "@chakra-ui/react";

import axios from "axios";
import OtpInput from "react-otp-input";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AtSignIcon, EmailIcon } from "@chakra-ui/icons";
import { HiCheck } from "react-icons/hi";
import { FcCancel } from "react-icons/fc";
import { MdPassword } from "react-icons/md";
function SignUp({ setShow }) {
  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [OTP, setOTP] = useState({ otp: "" });
  function handleChange(otp) {
    setOTP({ otp: otp });
  }
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  function postDetails(pics) {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select a picture",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-chit");
      data.append("cloud_name", "voluu");
      fetch("https://api.cloudinary.com/v1_1/voluu/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select a (another) picture",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  }
  const submitHandler = async () => {
    setLoading(true);
    if (!fullname || !email || !password || !confirmpassword || !username) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "The passwords do not match",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    inputRef.current.value = null;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "https://zolachatapp.herokuapp.com/api/user",
        { username, fullname, email, password, pic },
        config
      );
      if (data.verify === false) {
        toast({
          title: "Account not verify. Please account verification",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      }

      if (data.verify === true) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
      }
    } catch (error) {
      toast({
        title: "Sign up failed " + error,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const submitOTP = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    await axios
      .post(
        "https://zolachatapp.herokuapp.com/api/user/:email",
        {
          email: email,
        },
        config
      )
      .then((data) => {
        axios
          .post("https://zolachatapp.herokuapp.com/api/user/verify", {
            userId: data.data._id,
            otp: OTP.otp,
          })
          .then((data1) => {
            console.log(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
          })
          .catch((err) => console.log(err));

        toast({
          title: "Verification successfully",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      })
      .catch((err) => console.log(err));
  };

  const [emailExist, setEmailExist] = useState(true);
  async function handlerSearchEmail(query) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setEmail(query);
    if (!query) {
      setEmailExist(true);
      return;
    }
    if (
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        query
      )
    )
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
          cancelToken: source.token,
        };
        await axios
          .post(
            "https://zolachatapp.herokuapp.com/api/user/checkemail/:email",
            { email: query },
            config
          )
          .then((data) => {
            if (data.data.email) setEmailExist(true);
            else setEmailExist(false);
          });
      } catch (error) {
        if (axios.isCancel(error)) console.log("successfully aborted");
      }
    else setEmailExist(true);
    return () => {
      source.cancel();
    };
  }
  const [usernameExist, setUsernameExist] = useState(true);

  async function handlerSearchUsername(query) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setUsername(query);
    if (!query) {
      setUsernameExist(true);
      return;
    }
    if (
      /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/.test(
        username
      )
    )
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
          cancelToken: source.token,
        };
        await axios
          .post(
            "https://zolachatapp.herokuapp.com/api/user/checkusername/:username",
            { username: username },
            config
          )
          .then((data) => {
            console.log(data.data.username);
            if (data.data.username) setUsernameExist(true);
            else setUsernameExist(false);
          });
      } catch (error) {
        if (axios.isCancel(error)) console.log("successfully aborted");
      }
    else {
      setUsernameExist(true);
    }
    return () => {
      source.cancel();
    };
  }

  return (
    <ScaleFade initialScale={0.9} in={!isOpen}>
      <HStack align="stretch" marginY={"1.5rem"}>
        <VStack>
          <Avatar size="xl" name={fullname} src={pic} />
          <Input
            type="file"
            accept="image/*"
            hidden
            ref={inputRef}
            id="avatar"
            onChange={(e) => postDetails(e.target.files[0])}
          />
          <Box as="label" htmlFor="avatar" cursor="pointer">
            <Button as="span">
              {pic || fullname ? "Change" : "Select"} Avatar
            </Button>
          </Box>
        </VStack>
        <VStack zIndex={10} spacing={2} align="stretch">
          <HStack align="stretch">
            <Box>
              <InputGroup size="md" mb={0} h={45}>
                <InputLeftElement
                  display={"flex"}
                  justifyContent="center"
                  alignItems={"center"}
                >
                  <AtSignIcon color={"blackAlpha.900"} />
                </InputLeftElement>
                <Input
                  type={"name"}
                  value={username}
                  isInvalid={usernameExist || !username}
                  errorBorderColor="crimson"
                  placeholder="Enter your username"
                  onChange={(e) => {
                    handlerSearchUsername(e.target.value);
                  }}
                  bgColor={"whiteAlpha.900"}
                  borderRadius="lg"
                  textColor={username ? "blackAlpha.800" : "gray.500"}
                />{" "}
                <InputRightElement>
                  {usernameExist || !username ? (
                    <FcCancel color="red" />
                  ) : (
                    <HiCheck color="green" />
                  )}
                </InputRightElement>
              </InputGroup>
              {(usernameExist || !username) && (
                <Text color={"red.500"}>username not availible</Text>
              )}
            </Box>
            <InputGroup size="md" mb={0} h={45}>
              <InputLeftElement
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <Text fontWeight={"bold"}>n</Text>
              </InputLeftElement>
              <Input
                type={"name"}
                value={fullname}
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
                bgColor={"whiteAlpha.900"}
                borderRadius="lg"
                textColor={fullname ? "blackAlpha.800" : "gray.500"}
              />
            </InputGroup>
          </HStack>
          <Box>
            <InputGroup size="md" mb={0} h={45}>
              <InputLeftElement
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <EmailIcon color={"blackAlpha.900"} />
              </InputLeftElement>
              <Input
                type={"email"}
                value={email}
                placeholder="Enter your Email"
                isInvalid={emailExist}
                color={emailExist ? "tomato" : "black"}
                errorBorderColor="crimson"
                onChange={(e) => {
                  handlerSearchEmail(e.target.value);
                }}
                bgColor={"whiteAlpha.900"}
                borderRadius="lg"
                textColor={email ? "blackAlpha.800" : "gray.500"}
              />{" "}
              <InputRightElement>
                {emailExist ? (
                  <FcCancel color="red" />
                ) : (
                  <HiCheck color="green" />
                )}
              </InputRightElement>
            </InputGroup>
            {(emailExist || !email) && (
              <Text color={"red.500"}>email not availible</Text>
            )}
          </Box>
          <VStack>
            <InputGroup size="md" mb={0} h={45}>
              <InputLeftElement
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <MdPassword />
              </InputLeftElement>
              <Input
                type={"password"}
                placeholder="Enter your Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                isInvalid={password !== confirmpassword || !password}
                color={password !== confirmpassword ? "tomato" : "black"}
                errorBorderColor="crimson"
                bgColor={"whiteAlpha.900"}
                borderRadius="lg"
                textColor={password ? "blackAlpha.800" : "gray.500"}
              />
              <InputRightElement>
                {password !== confirmpassword || !password ? (
                  <FcCancel color="red" />
                ) : (
                  <HiCheck color="green" />
                )}
              </InputRightElement>
            </InputGroup>
          </VStack>
          <Box>
            <InputGroup size="md" mb={0} h={45}>
              <InputLeftElement
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <MdPassword />
              </InputLeftElement>
              <Input
                type={"password"}
                placeholder="Confirm your Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmpassword}
                isInvalid={password !== confirmpassword || !password}
                color={
                  password !== confirmpassword || !password ? "tomato" : "black"
                }
                bgColor={"whiteAlpha.900"}
                borderRadius="lg"
                textColor={password ? "blackAlpha.800" : "gray.500"}
              />
              <InputRightElement>
                {password !== confirmpassword || !password ? (
                  <FcCancel color="red" />
                ) : (
                  <HiCheck color="green" />
                )}
              </InputRightElement>
            </InputGroup>
            {password !== confirmpassword ||
              ((!password || !confirmpassword) && (
                <Text color={"red.500"}>
                  Password and Password to confirm must be the same
                </Text>
              ))}
          </Box>
        </VStack>{" "}
      </HStack>
      <Box zIndex={10}>
        <Button
          variant={"link"}
          colorScheme={"yellow"}
          fontWeight={"bold"}
          transition="ease-in-out"
          transitionDuration={150}
          fontSize={32}
          _hover={{
            bgClip: "text",
            bgGradient: "linear(to-br,red.600,yellow.600)",
          }}
          w="full"
          mb="5"
          onClick={onOpen}
          isLoading={loading}
          isDisabled={
            !email ||
            emailExist ||
            usernameExist ||
            !confirmpassword ||
            !password ||
            !username
          }
        >
          Sign Up
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify your email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OtpInput
              value={OTP.otp}
              onChange={handleChange}
              numInputs={4}
              separator={<span>-</span>}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={submitOTP}>
              Confirm
            </Button>
            <Button onClick={submitHandler}>Send code</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScaleFade>
  );
}

export default SignUp;
