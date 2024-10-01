import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";
import loading from "../Images/loading.gif";
import ToggleSwitch from "./toggleSwitch";
import { Flex, Text, Box, Button, Input } from "@chakra-ui/react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export const Chatbot = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [chooseName, setChooseName] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [chatResult, setChatResult] = useState([]);
  const [isChatFormVisible, setIsChatFormVisible] = useState(true);
  const [visibleName, setVisibleName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [useDocBot, setUseDocBot] = useState(false);
  const [docBotChatHistory, setDocBotChatHistory] = useState([]);
  const [dsaBotChatHistory, setDsaBotChatHistory] = useState([]);
  const audioRef = useRef(null);

  const { transcript, resetTranscript } = useSpeechRecognition();
  const handleStartRecording = () => {
    setIsLoading(true);
    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopRecording = () => {
    setIsLoading(false);
    setIsRecording(false);
    SpeechRecognition.stopListening();
    setUserMessage(transcript); // Set userMessage to transcript
  };

  const clearChat = () => {
    setChatResult([]);
    setUserMessage("");
  };

  // Update chat history based on toggle switch change
  useEffect(() => {
    setChatResult(useDocBot ? docBotChatHistory : dsaBotChatHistory);
  }, [useDocBot]);

  const handleToggle = (isChecked) => {
    setUseDocBot(isChecked);
    if (!isChecked) {
      setIsChatFormVisible(true);
      setVisibleName(null);
      setChatResult(dsaBotChatHistory);
    } else {
      if(!selectedFile){
      setIsChatFormVisible(false);
      }
      setVisibleName(chooseName);
      setChatResult(docBotChatHistory);
    }
    clearChat();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile && useDocBot) {
      setIsAnimationActive(true); // Activate animation
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const { original_filename, file_path } = res.data;
        setSelectedFile(file_path);
        setChooseName(original_filename);
        setTimeout(() => {
          setChooseName("File Uploaded");
          setIsChatFormVisible(true);
          setChooseName(original_filename)
          setVisibleName(chooseName);
          setIsAnimationActive(false); // Deactivate animation
        }, 7000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setChooseName(file.name);
  };

  const handleSubmitChat = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUserMessage("");

    try {
      let res;
      if (useDocBot) {
        res = await axios.post("http://127.0.0.1:5000/chatDoc", {
          query: userMessage,
          file_path: selectedFile ? `${selectedFile}` : null,
        });
        setDocBotChatHistory([...docBotChatHistory, { role: "user", content: userMessage }, { role: "bot", content: res.data.result }]);
      } else {
        res = await axios.post("http://127.0.0.1:5002/chatDsa", {
          query: userMessage
        });
        setDsaBotChatHistory([...dsaBotChatHistory, { role: "user", content: userMessage }, { role: "bot", content: res.data.result }]);
      }
      const chatReply = await res.data.result;

      const updatedConversation = [
        ...chatResult,
        { role: "user", content: userMessage },
        { role: "bot", content: chatReply },
      ];

      setChatResult(updatedConversation);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Flex h="100vh" bg="#8DA9C4">
      <Flex
        pos="relative"
        bg="#0F2C59"
        p="20px"
        w="30%"
        direction={"column"}
        align={"center"}
        shadow=" rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;"
      >
        <Text
          fontSize={"6xl"}
          color="#EEF4ED"
          fontFamily={"'Lilita One', cursive"}
        >
          Chat Assistant
        </Text>

        <ToggleSwitch checked={useDocBot} onChange={handleToggle} clearChat={clearChat} />

        {useDocBot && (
          <form action="" onSubmit={handleSubmit} style={{ margin: "auto" }}>
            <Text
              pos="absolute"
              left="50%"
              top="50%"
              transform={"translate(-50%)"}
              zIndex="3"
              fontSize={"xl"}
              fontFamily={"'Lilita One', cursive"}
            >
              {chooseName ? chooseName : "Choose File"}
            </Text>
            <LoadingStyle isAnimationActive={isAnimationActive}>
              <Box
                pos={"absolute"}
                left="50%"
                top="5%"
                transform="translate(-50%)"
                borderRadius="30%"
                border="2px dashed #0F2C59"
                w="90%"
                h="90%"
                m="auto"
              ></Box>
              <Input
                // border="1px solid red"
                opacity="0"
                type="file"
                w="100%"
                h="100%"
                borderRadius={"50%"}
                accept=".pdf"
                onChange={handleFileChange}
                cursor="pointer"
              />
            </LoadingStyle>
            <Button bg="#8DA9C4" mt="10px" type="submit">
              Upload
            </Button>
          </form>
        )}
      </Flex>

      <Flex direction={"column"} w="60%" m="auto" gap="5">
        <Box textAlign={"left"} pl="25px" fontSize={"xl"} fontFamily={"'Lilita One', cursive"}>
          {visibleName}
        </Box>
        <Box bg="#EEF4ED" h="80vh" borderRadius="30px" pos="relative" boxShadow="rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;">
        

        {isChatFormVisible && (
    <form onSubmit={handleSubmitChat} action="" style={{ padding: "20px", height: "30%" }}>
      <Input
        border="1px solid black"
        h="50px"
        fontSize={"xl"}
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        textAlign="center"
        placeholder="Enter your query here"
        fontWeight={"semibold"}
      />
      <Flex justify="space-between" mt="15px">
        <ButtonStyled
          onClick={handleStartRecording}
          disabled={isLoading}
          _hover={{ bg: "#0F2C59" }}
          color="white"
          bg="#0F2C59"
          flexBasis="30%"
        >
          Start Recording
          {isRecording && <RecordingAnimation />}
        </ButtonStyled>
        <ButtonStyled
          onClick={handleStopRecording}
          disabled={!isLoading}
          _hover={{ bg: "#0F2C59" }}
          color="white"
          bg="#0F2C59"
          flexBasis="30%"
        >
          Stop Recording
        </ButtonStyled>
        <ButtonStyled _hover={{ bg: "#0F2C59" }} color="white" bg="#0F2C59" type="submit" flexBasis="30%">
          Submit
        </ButtonStyled>
      </Flex>
    </form>
  )}

          <Box h="70%" overflowY="scroll">
            {chatResult.map((message, index) => (
              <div
                key={index}
                className={`message-container ${
                  message.role === "user" ? "user-message" : "bot-message"
                  }`}
                style={{
                  display: "flex",
                  justifyContent: `${
                    message.role === "user" ? "flex-end" : "flex-start"
                    }`,
                  width: "100%",
                  padding: "10px 30px 10px 30px",
                }}
              >
                <div
                  className={`message-container ${
                    message.role === "user" ? "user-message" : "bot-message"
                    }`}
                  style={{
                    width: `${message.role === "user" ? "30%" : "70%"}`,
                    backgroundColor: "#0F2C59",
                    color: "white",
                    padding: "10px",
                    borderRadius: "30px",
                    boxShadow:
                      "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                    textAlign : "left",
                  }}
                >
                  {/* <strong>{message.role === "user" ? "You" : "Bot"}:</strong>{" "}
                  {message.content} */}
                   <strong>{message.role === "user" ? "You" : "Bot"}:</strong>{" "}
        {/* Check if the message role is bot, then split the content by lines and add proper indentation */}
        {message.role === "bot" ? (
          message.content.split('\n').map((line, i) => (
            <div key={i} style={{ marginLeft: "10px" }}>{line}<br /></div> // Added left indentation
          ))
        ) : (
          message.content
        )}
                </div>
              </div>
            ))}
            <Box>
              {isLoading && (
                <div className="loader" style={{ textAlign: "center" }}>
                  <img
                    style={{ mixBlendMode: "multiply", width: "15%", position: "relative", left: "20px" }}
                    src={loading}
                    alt=""
                  />
                </div>
              )}
            </Box>
          </Box>

        </Box>
      </Flex>
    </Flex>
  );
};

const fill = keyframes`
  from {
    top: 200px;
    transform: translateX(-50%) rotate(0deg);
  }

  to {
    top: -50px;
    transform: translateX(-50%) rotate(360deg);
  }
`;

const LoadingStyle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 30%;
  margin: auto;
  position: relative;
  overflow: hidden;
  background-color: #8da9c4;
  z-index: 2;

  &:before {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    background-color: #eef4ed;
    border-radius: 40%;
    transform: translateX(-50%);
    left: 50%;
    top: 200px;
    z-index: -2;
    animation: ${(props) =>
      props.isAnimationActive
        ? css`
            ${fill} 7s ease-in-out
          `
        : "none"};
  }
`;

const ButtonStyled = styled(Button)`
  background-color: #0f2c59;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background-color: #1e4f8b;
  }

  &:disabled {
    background-color: #0f2c59;
    cursor: not-allowed;
  }
`;

const RecordingAnimation = styled.div`
  width: 10px;
  height: 10px;
  background-color: red;
  animation: pulse 1s infinite alternate;
  border-radius: 50%;
  margin-left: 10px;
  position: relative;

  @keyframes pulse {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.2);
    }
  }
`;

export default Chatbot;
