import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Snackbar } from "@mui/material";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Input,
} from "@mui/material";
import "./signUp.css";
import { signup } from "../api/apiService";

interface FormValues {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
}

const SignUp = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const formik = useFormik<FormValues>({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("User Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("userName", values.userName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (values.profileImage) {
        formData.append("profileImage", values.profileImage);
      }

      try {
        const response = await signup(formData);
        console.log("Signup successful:", response);
        setOpenSnackbar(true);
        //setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.log("Signup failed:", error);
        // Handle errors (e.g., show error message)
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      formik.setFieldValue("profileImage", event.target.files[0]);
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setImageUrl(imageUrl);
    }
  };
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message="Signup successful!"
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
        <Typography variant="h5" component="h1">
          Sign Up
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="User Name"
            name="userName"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />
          <Input
            inputProps={{
              accept: "image/*",
            }}
            type="file"
            onChange={handleImageChange}
          />
          {imageUrl && <img src={imageUrl} className="user-img" />}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          <Link to="/" style={{ textDecoration: "none" }}>
            Already registered? Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
