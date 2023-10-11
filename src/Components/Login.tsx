import React, { useState } from "react";
import "../App.css";
import Button from "@mui/material/Button/Button";
import TextField from "@mui/material/TextField";
import User from "../models/User";
import { use } from "chai";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
export default function Login() {
  const [user, setUser] = useState<User>(new User("", ""));
  const [valid, SetValid] = useState<boolean>(true);
  const [showSnackBar, SetShowSnackBar] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [signIn, signOut] = useAuth();
  function isValid(user: User) {
    if (user?.password?.length! >= 8 && user!.name!.trim().length > 1) {
      return true;
    }
    return false;
  }
  async function validateUser() {
    try {
      var res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/User/checkuser`,
        {
          userName: user.name,
          userPassword: user.password,
        }
      );
      if (res.status == 200  && res.data["isValid"]) {
        SetShowSnackBar(true);
        SetValid(true);
        signIn(user);
        navigate("/home");
      } else {
        SetShowSnackBar(false);
        SetValid(false);
      }
      setTimeout(() => {
        SetShowSnackBar(false);
      }, 1000);
    } catch (e) {
      SetShowSnackBar(true);
      SetValid(false);
      setErr("username must be unique");
      setTimeout(() => {
        SetShowSnackBar(false);
      }, 1000);
    }
  }

  return (
    <div className="loginpage">
      <div className="maincontainer">
        <h1>Login</h1>
        <div className="form">
          <TextField
            required
            id="outlined-required"
            label="Username"
            onChange={(e) => {
              setUser(new User(e.target.value, user.password!));
            }}
          />
          <TextField
            required
            id="outlined-required"
            label="Password"
            type="password"
            onChange={(e) => {
              setUser(new User(user.name!, e.target.value));
            }}
          />
          {isValid(user) ? (
            <Button size="large" variant="contained" className="loginbutton" onClick={validateUser}>
              Login
            </Button>
          ) : (
            <Button
              size="large"
              variant="contained"
              className="loginbutton"
              disabled
            >
              Login
            </Button>
          )}
          <Snackbar open={showSnackBar} autoHideDuration={6000}>
            <Alert
              severity= {valid ? "success" : "error"}
              sx={{ width: "100%" }}
            >
              {valid ? "Login Success" : err}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}
