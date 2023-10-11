import React, { useContext, useEffect, useMemo, useState } from "react";
import { Props, UserContext } from "../Context/Context";
import Context from "../Context/Context";
import User from "../models/User";
import "../App.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function ProtectedRoute(props: Props) {
  const [state, setState, username] =
    useContext<[User, Function, string]>(UserContext);
  const [loading, setLoading] = useState(true);
  var latitude = 0;
  var longitude = 0;
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user") != undefined) {
      setLoading(false);
    } else {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    const successCallback = async (position: GeolocationPosition) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      if (username != undefined) {
        try {
          let res = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/Location/addLocation`,
            {
              "username": username,
              "location": {
                "id": 0,
                "longitude": longitude,
                "latitude": latitude,
                "timestamp": new Date().toISOString(),
                
              },
            }
          );
          if (res.status == 200) {
            console.log(res.data);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    const errorCallback = (error: any) => {
      navigate("/error");
      console.log(error);
    };

    async function getCoords() {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      console.log(username);
     
    }
    setInterval(getCoords, 60 * 1000);
  }, [username]);
  return (
    <div>
      {username == undefined ? (
        <div className="spinner">
          {" "}
          <CircularProgress />
        </div>
      ) : (
        props.children
      )}
    </div>
  );
}
