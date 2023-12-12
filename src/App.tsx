import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatRoom from "./chat-room/chat-room";
import { User, loginResponce } from "./interface/interface";
import Login from "./login/login";
import SignUp from "./signUp/signUp";
function App() {
  const [loginUser, setLoginUser] = useState<loginResponce | null>(null);
  const handleLogin = (user: loginResponce) => {
    console.log("LoginUser", user);
    setLoginUser(user);
    // Further logic
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login handleLoginUser={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chatroom" element={<ChatRoom loginUser={loginUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
