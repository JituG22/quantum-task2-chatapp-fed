import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MUILink from "@mui/material/Link";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Input,
} from "@mui/material";

import { login } from "../api/apiService"; // Import the login service
import { loginResponce } from "../interface/interface";

interface LoginProps {
  handleLoginUser: (user: loginResponce) => void;
}
const Login: React.FC<LoginProps> = ({ handleLoginUser }) => {
  const [email, setEmail] = useState("jitu@gmail.com");
  const [password, setPassword] = useState("jitu@123");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      handleLoginUser(response);
      setOpenSnackbar(true);
      setTimeout(() => navigate("/chatroom"), 2000);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const imageUrlss = "http://localhost:5000/uploads/1702294888339.jpg";
  return (
    <Container maxWidth="xs">
      <div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={`Login successful`}
        />
      </div>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Join Chat
        </Typography>
        <img src={imageUrlss} alt="" />
        <TextField
          margin="normal"
          fullWidth
          label="Email Address"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
      <MUILink component={Link} to="/signup" sx={{ textDecoration: "none" }}>
        New user ? signup
      </MUILink>
    </Container>
  );
};

export default Login;
