import React, { useState } from "react";
import "../App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import User from "../models/User";
import { use } from "chai";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Typography } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
export default function Register() {
  const [user, setUser] = useState<User>(new User("", ""));
  const [valid, SetValid] = useState<boolean>(true);
  const [showSnackBar, SetShowSnackBar] = useState(false);
  const [err, setErr] = useState<any>("");
  const navigate = useNavigate();

  function isValid(user: User) {
    if (user?.password?.length! >= 8 && user!.name!.trim().length > 1) {
      return true;
    }
    return false;
  }
  async function postUser() {
    try {
      var res = await axios.post(
        `${config.API_KEY}/User/user`,
        {
          userName: user.name,
          userPassword: user.password,
        }
      );
      if (res.status == 200) {
        SetShowSnackBar(true);
        SetValid(true);
        setTimeout(() => {
          navigate('/login');
        }, 200);
      } else {
        SetShowSnackBar(false);
        SetValid(false);
      }
    } catch (e) {
      SetShowSnackBar(true);
      SetValid(false);
      setErr("username must be unique");
    }
  }

  return (
    <div className="loginpage">
      <div className="maincontainer">
        <h1>SignUp</h1>
        <div className="form">
        <Typography variant="h6">
            Already a user? {' '}  
            
            <span>
              <Link to="/login">Login</Link>
            </span>
          </Typography>
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
            placeholder="password"
            onChange={(e) => {
              setUser(new User(user.name!, e.target.value));
            }}
          />
          {user!.password!.trim().length >= 1 && user.password!.length < 8 ? (
            <Typography
              variant="h6"
              noWrap
              component="div"
              color={"error"}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              password should 8 characters long
            </Typography>
          ) : (
            ""
          )}
          {isValid(user) ? (
            <Button
              size="large"
              variant="contained"
              className="loginbutton"
              onClick={postUser}
            >
              Signup
            </Button>
          ) : (
            <Button
              size="large"
              variant="contained"
              className="loginbutton"
              disabled
            >
              SignUp
            </Button>
          )}
          <Snackbar open={showSnackBar} autoHideDuration={6000}>
            <Alert
              severity={valid ? "success" : "error"}
              sx={{ width: "100%" }}
            >
              {valid ? "Registration Successful" : err}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}
