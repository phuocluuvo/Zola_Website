import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import { ChatState } from "../../providers/ChatProvider";
import { sendMedia } from "../../apis/messages.api";
import { updateUserInfomation } from "../../apis/users.api";

// const ENDPOINT = process.env.REACT_APP_PORT;
function ChangeInfoForm({ userUpdate }) {
  const toast = useToast();

  const { user, setUser } = ChatState();
  const [pic, setPic] = useState(user.pic);
  function postDetails(pics) {
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
      sendMedia(pics, "image")
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
        })
        .catch((err) => {});
    } else {
      toast({
        title: "Please select a (another) picture",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  }
  const handleSubmitChangeInfo = async (values) => {
    setUser({
      ...user,
      _id: user._id,
      fullname: values.fullname,
      username: values.username,
      pic: pic,
    });
    try {
      await updateUserInfomation({
        _id: values._id,
        fullname: values.fullname,
        username: values.username,
        pic: pic,
      }).then((res) => {
        setUser(res.data);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        console.log(res.data);
      });
    } catch (e) {
      toast({
        title: "Error Occured",
        description: "Failed to change your infomation",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleSubmitChangePassword = async (values) => {};
  async function validateUserName(value) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let error;
    if (!value) {
      error = "Username must be filled";
    } else if (
      /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/.test(value)
    )
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
          cancelToken: source.token,
        };
        // await axios
        //   .post(
        //     ENDPOINT + "/api/user/checkusername/:username",
        //     { username: value },
        //     config
        //   )
        //   .then((data) => {
        //     console.log(data.data.username);
        //     if (data.data.username) error = "Username already exist";
        //   });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("successfully aborted");
        }
      }
    else
      error =
        "Password is contain 5-18 characters and not include special characters";
    return error;
  }
  function validateFullName(value) {
    let error;
    if (!value.trim()) {
      error = "Full name must be filled";
    }
    return error;
  }
  return (
    user._id === userUpdate._id && (
      <>
        <Tabs
          variant="soft-rounded"
          colorScheme="telegram"
          mt={4}
          w="full"
          flex={1}
        >
          <TabList>
            <Tab>Change infomation</Tab>
            <Tab>Change Password</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Formik
                initialValues={{
                  _id: user._id,
                  fullname: user.fullname,
                  username: user.username,
                  pic: user.pic,
                }}
                onSubmit={(values, actions) => {
                  handleSubmitChangeInfo(values);
                  actions.setSubmitting(false);
                }}
              >
                {(props) => (
                  <Form className="flex">
                    <Box w="full" flex={0.3}>
                      <Field name="pic">
                        {({ field, form }) => (
                          <FormControl className="justify-center flex flex-col items-center w-full">
                            <Input
                              id="newAvatar"
                              type="file"
                              hidden
                              accept="image/*"
                              p="1.5"
                              onChange={(e) => postDetails(e.target.files[0])}
                            />

                            <label htmlFor="newAvatar">
                              <Tooltip label="Change Avatar">
                                <Box pos="relative" cursor={"pointer"}>
                                  <Avatar
                                    name={user.fullname}
                                    src={pic}
                                    size="xl"
                                  />
                                  <Box
                                    _hover={{
                                      border: "2px solid white",
                                      rounded: "full",
                                      bgColor: "whiteAlpha.500",
                                      opacity: "1",
                                    }}
                                    opacity="0"
                                    w="full"
                                    h="full"
                                    className="absolute z-10 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 transition-all"
                                  >
                                    <AiFillEdit
                                      fontSize={"40"}
                                      color="white"
                                      className="absolute z-10 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 "
                                    />
                                  </Box>
                                </Box>
                              </Tooltip>
                            </label>
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <VStack w="full" flex={0.7} className="mx-2">
                      <Field
                        name="username"
                        validate={validateUserName}
                        className="w-full"
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.username && form.touched.username
                            }
                          >
                            <InputGroup>
                              <InputLeftElement>
                                <Text fontWeight={"bold"}>@</Text>
                              </InputLeftElement>
                              <Input
                                {...field}
                                isInvalid={form.errors.username === null}
                                rounded={"lg"}
                                placeholder={"Enter your user name"}
                              />
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.username}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field
                        name="fullname"
                        validate={validateFullName}
                        className="w-full"
                      >
                        {({ field, form }) => (
                          <FormControl>
                            <InputGroup>
                              <InputLeftElement>
                                <Text fontWeight={"bold"}>n</Text>
                              </InputLeftElement>
                              <Input
                                {...field}
                                isInvalid={form.errors.fullname === null}
                                rounded={"lg"}
                                placeholder={"Enter your new full name"}
                              />
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.fullname}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Box display="flex" w="full">
                        <Spacer />
                        <Button
                          colorScheme="teal"
                          isLoading={props.isSubmitting}
                          type="submit"
                        >
                          Apply
                        </Button>
                      </Box>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </TabPanel>
            <TabPanel>
              <VStack>
                <Input
                  type="text"
                  rounded={"lg"}
                  placeholder={"Enter your new name"}
                />
                <Input
                  type="text"
                  rounded={"lg"}
                  placeholder={"Enter your username"}
                />
                <Input
                  type="text"
                  rounded={"lg"}
                  placeholder={"Enter your new name"}
                />
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    )
  );
}

export default ChangeInfoForm;
