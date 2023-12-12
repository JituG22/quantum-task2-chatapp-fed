import React, { ReactNode, useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Box,
  Container,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { format } from "date-fns"; // You can install date-fns for easy date formatting
import { User, loginResponce } from "../interface/interface";
import { useNavigate } from "react-router-dom";
import { getMessages } from "../api/apiService";
interface Message {
  userId: string;
  userName: string;
  userProfileImage: string;
  text: string;
  timestamp: Date;
}

interface ChatRoomProps {
  loginUser: loginResponce | null;
}
const socket = io("http://localhost:5000");

export default function ChatRoom({ loginUser }: ChatRoomProps) {
  const [message, setMessage] = useState("Hi how are you ?");
  const [messages, setMessages] = useState<Message[]>([]); // Dummy messages array
  const navigate = useNavigate();
  useEffect(() => {
    if (!loginUser) {
      setTimeout(() => navigate("/"), 2000);
    }
    getMessages()
      .then((fetchedMessages) => {
        // Sort messages in descending order
        const sortedMessages = fetchedMessages.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    // Listen for incoming messages
    socket.on("chat message", (incomingMessage) => {
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [navigate, loginUser]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
      event.preventDefault(); // Prevent the default action to avoid newline in the text field
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (!loginUser) {
      navigate("/");
      return; // Stop execution if there is no logged-in user
    }
    console.log("loginUser", loginUser);
    if (loginUser && message) {
      const newMessage = {
        userId: loginUser.userId,
        userName: loginUser.userName,
        text: message,
        userProfileImage: "http://localhost:5000/" + loginUser.userProfileImage,
        timestamp: new Date(),
      };
      socket.emit("chat message", newMessage);

      // Update the messages state to include the new message at the start
      //setMessages((prevMessages) => [...prevMessages, newMessage]);

      setMessage(""); // Clear the input field after sending the message
    } else {
      console.error("User details not available");
    }
  };
  const isOwnMessage = (messageUsername: string) => {
    return loginUser && messageUsername === loginUser.userName;
  };
  const handleMsg = (msgText: string): ReactNode => {
    return msgText.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < msgText.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Container maxWidth="sm">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Chat Application</Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          my: 3,
          mx: 2,
          height: 500,
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              style={{
                justifyContent: isOwnMessage(msg.userName)
                  ? "flex-end"
                  : "flex-start",
                alignItems: "center",
              }}
            >
              {msg.userProfileImage && !isOwnMessage(msg.userName) && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    flexDirection: "column",
                    marginRight: "10px",
                  }}
                >
                  <img
                    src={msg.userProfileImage}
                    alt={msg.userName}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ fontSize: "10px" }}
                  >
                    {msg.userName}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  bgcolor: isOwnMessage(msg.userName)
                    ? "primary.light"
                    : "secondary.light",
                  color: isOwnMessage(msg.userName)
                    ? "primary.contrastText"
                    : "secondary.contrastText",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                <Typography variant="body1">{handleMsg(msg.text)}</Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ fontSize: "9px", marginTop: "4px" }}
                >
                  {format(new Date(msg.timestamp), "p")}
                </Typography>
              </Box>

              {msg.userProfileImage && isOwnMessage(msg.userName) && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    flexDirection: "column",
                    marginLeft: "10px",
                  }}
                >
                  <img
                    src={msg.userProfileImage}
                    alt={msg.userName}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />

                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ fontSize: "10px" }}
                  >
                    You
                  </Typography>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box display="flex">
        <TextField
          fullWidth
          variant="outlined"
          value={message}
          onKeyPress={handleKeyPress}
          onChange={handleMessageChange}
          placeholder="Type a message..."
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          sx={{ ml: 1 }}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
}
