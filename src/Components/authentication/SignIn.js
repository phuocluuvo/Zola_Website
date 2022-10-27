import {
  Box,
  Button,
  Input,
  ScaleFade,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import GoogleButton from "react-google-button";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../providers/ChatProvider";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCcsQTDiunGMp0qFDfG5L2Zq_yXgA3RCb4",
  authDomain: "authen-server-zola.firebaseapp.com",
  projectId: "authen-server-zola",
  storageBucket: "authen-server-zola.appspot.com",
  messagingSenderId: "514728568830",
  appId: "1:514728568830:web:eba8144d502e759045c2af",
  measurementId: "G-XYCVGGYCK3",
};

function SignIn({ setShow, isOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = ChatState();
  let navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: user.displayName,
          fullname: user.displayName,
          authProvider: "google",
          email: user.email,
          pic: user.photoURL,
          verify: true,
        });
      }

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const use = await axios
        .post(
          "https://zolachatapp.herokuapp.com/api/user/:email",
          {
            email: user.email,
          },
          config
        )
        .catch((err) => console.log(err));

      if (use.data === "a") {
        const { data } = await axios.post(
          "https://zolachatapp.herokuapp.com/api/user",
          {
            username: user.displayName,
            fullname: user.displayName,
            email: user.email,
            password: user.uid,
            pic: user.photoURL,
            verify: true,
          },
          config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
        toast({
          title: "Sign up successfully",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      } else if (use) {
        const { data } = await axios.post(
          "https://zolachatapp.herokuapp.com/api/user/login",
          {
            email: user.email,
            password: user.uid,
          },
          config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setLoading(false);
        setUser(userInfo);
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
      alert(error.message);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "https://zolachatapp.herokuapp.com/api/user/login",
        { email, password },
        config
      );
      const verify = await axios.post(
        "https://zolachatapp.herokuapp.com/api/user/:email",
        {
          email: email,
        },
        config
      );
      if (verify.data.verify === true) {
        toast({
          title: "Sign in successfully",
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setLoading(false);
        setUser(userInfo);
        navigate("/chats");
      }
      if (verify.data.verify === false) {
        setLoading(false);
        toast({
          title: "Account is not verify",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      toast({
        title:
          "Sign in failed!Email isn't verify. Your password or email address is invalid!  ",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <ScaleFade initialScale={0.9} in={isOpen}>
      <VStack marginY={"2.5rem"} zIndex={10}>
        <Input
          type={"email"}
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          bgColor={"whiteAlpha.900"}
          borderRadius="lg"
          w="400px"
          h={45}
          marginBottom={"1.25rem"}
          padding="3"
          textColor={"gray.500"}
        />
        <Input
          type={"password"}
          placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          bgColor={"whiteAlpha.900"}
          borderRadius="lg"
          w="400px"
          h={45}
          marginBottom={"1.25rem"}
          padding="3"
          textColor={"gray.500"}
        />
      </VStack>
      <Text
        transitionDuration={"150ms"}
        textAlign="right"
        textColor={"whiteAlpha.900"}
        _hover={{
          bgClip: "text",
          bgGradient: "linear(to-br,blue.300, pink.400)",
        }}
      >
        forgot password, eh? Press here, bro.
      </Text>
      <Box zIndex={10}>
        <Button
          variant={"link"}
          colorScheme={"yellow"}
          fontWeight={"bold"}
          transition="all 0.25s ease-in-out"
          fontSize={32}
          _hover={{
            bgClip: "text",
            bgGradient: "linear(to-br,red.600,yellow.600)",
          }}
          mb="5"
          onClick={submitHandler}
          isLoading={loading}
          isDisabled={!password || !email}
        >
          Sign In
        </Button>
      </Box>
      <Box zIndex={10}>
        <GoogleButton
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
          mb="5"
          onClick={signInWithGoogle}
          isLoading={loading}
        >
          Sign In GG
        </GoogleButton>
      </Box>
    </ScaleFade>
  );
}
export default SignIn;
