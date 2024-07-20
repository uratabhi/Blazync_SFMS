import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  VStack,
  Input,
  InputGroup,
  Button,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => {
      setShow(!show);
    };

    const submitHandler = async () => {
      if (!email || !password) {
        toast({
          title: "Please Fill all the Fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );

        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        history.push("/admin");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }

    return (
      <VStack spacing="5px">
        <FormControl id="emailID" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            value={email}  // Make sure the input value is controlled
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="passwordId" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={password}  // Make sure the input value is controlled
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
        >
          Login
        </Button>
        <Button
          variant="solid"
          colorScheme="red"
          width="100%"
          onClick={() => {
            setEmail("admin@test");  // Set the guest user email
            setPassword("admin123");     // Set the guest user password
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
    );
}

export default Login;
