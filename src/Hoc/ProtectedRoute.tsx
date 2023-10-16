import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Props, UserContext } from "../Context/Context";
import Context from "../Context/Context";
import User from "../models/User";
import "../App.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
export default function ProtectedRoute(props: Props) {
  const [state, setState, username] =
    useContext<[User, Function, string|undefined, Function]>(UserContext);
  const [loading, setLoading] = useState(true);
  var latitude = 0;
  var longitude = 0;
  const navigate = useNavigate();
  const lastSavedLatitude = useRef<number>();
  const lastSavedLongitude = useRef<number>();
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
      if (username != undefined && (lastSavedLatitude.current != latitude || lastSavedLongitude.current != longitude)) {
        lastSavedLatitude.current = latitude;
        lastSavedLongitude.current = longitude;
        console.log(username);
        try {
          let res = await axios.post(
            `${config.API_KEY}/Location/addLocation`,
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
     
    }
    setInterval(getCoords, 1000 * 60 *5);
  }, [username]);
  return (
    <div>
      {username == undefined ? (
        <div className="spinner">
          <CircularProgress />
        </div>
      ) : (
        props.children
      )}
    </div>
  );
}
