import React from "react";
import {
  Container,
  Box,
  Text,
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from '../components/Login';
import Signup from '../components/Signup';

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Center
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          AdminVault
        </Text>
      </Center>
      <Center
        p={3}
        bg="white"
        w="100%"
        mb={4}  // Margin below the text for spacing
      >
        <Text fontSize="md" color="gray.500">
          Please click on guest credentials to login
        </Text>
      </Center>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
