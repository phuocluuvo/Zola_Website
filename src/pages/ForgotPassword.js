import { Button, Input, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import { useIsPresent } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
const link = "https://zolachatapp-sever.onrender.com";
function ForgotPage({ setShow }) {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const { id } = useParams();
  const isPresent = useIsPresent();
  let navigate = useNavigate();
  const handleSubmit = async () => {
    const data = await axios.post(
      `${link}}/api/user/forgot-password/${id}/reset`,
      {
        password: password,
      }
    );
    navigate("/");
  };
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

  return (
    <section className="overflow-hidden relative max-w-full transition-transform bg-gradient-to-b from-dark-blue to-deep-blue h-[100vh]">
      <div className="w-full" style={{ marginTop: "14%" }}>
        <h1
          style={{ color: "Blu" }}
          className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-7"
        >
          Forgot Password
        </h1>
        <form className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5">
          <Input
            label="New Password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
          />
          <Input
            label="Confirm Password"
            name="passwordConfirm"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmpassword}
            placeholder="Confirm Password"
          />
          <Button textColor="text-ct-blue-600" onClick={handleSubmit}>
            Reset Password
          </Button>
        </form>
        <Box id="square1"></Box>
        <Box id="square2"></Box>
      </div>
    </section>
  );
}

export default ForgotPage;
