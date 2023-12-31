import tt from "@tomtom-international/web-sdk-maps";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as ttapi from "@tomtom-international/web-sdk-services";
import "../App.css";
import {
  Alert,
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import { UserContext } from "../Context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import User from "../models/User";
import Location from "../models/Locations";
import { resData } from "../models/Locations";
import Navbar from "../Components/Navbar";
import config from "../config";

export interface CalculateRoute {
  lat: number;
  lng: number;
}
export default function Maps() {
  const mapElement = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<tt.Map>();
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [user, SetUser, username] = useContext(UserContext);
  const [location, setLocation] = useState(true);
  const [signIn, signOut] = useAuth();
  const navigate = useNavigate();
  const [latlng, setLantlng] = useState<CalculateRoute[]>();
  const [locations, setLocations] = useState<Location[]>([]);
  const sortedCoords = [
    {
      lat: 17.4577589,
      lng: 78.3606787,
    },
    {
      lat: 17.4221342,
      lng: 78.3368342,
    },
    {
      lat: 17.3609535,
      lng: 78.4717478,
    },
  ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {
    setTimeout(async () => {
      try {
        let res = await axios.get(
          `${config.API_KEY}/Location/getLocation/${username}`
        );
        if (res.status == 200) {
          let data: Location[] = [];
          res.data.map((d: resData) => {
            data.push(new Location(d.longitude, d.latitude, d.timestamp));
          });
          setLocations(data);
          let routingLocations: CalculateRoute[] = [];
          data.map((a) => {
            routingLocations = [
              ...routingLocations,
              {
                lat: a.latitude,
                lng: a.longitude,
              },
            ];
            //`${new Date((a.timestamp)).getHours().toString().padStart(2, '0')}: ${new Date((a.timestamp)).getMinutes().toString().padStart(2, '0')}: ${new Date((a.timestamp)).getSeconds().toString().padStart(2, '0')}`
            addMarker(
              [a.longitude, a.latitude],
              new Date(a.timestamp).toUTCString()
            );
          });
          // setLantlng(routingLocations);
        }
      } catch (e) {}
      recalculateRoutes();
    }, 0);

    const successCallback = (position: GeolocationPosition) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const errorCallback = (error: any) => {
      navigate("/error");
      setLocation(false);
      console.log(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    const map = tt.map({
      key: process.env.REACT_APP_API_KEY!,
      container: mapElement.current ?? "",
      center: [longitude, latitude],
      zoom: 15,
      stylesVisibility: {
        trafficFlow: true,
        trafficIncidents: true,
      },
    });

    const addMarker = (loc: [number, number], date: string) => {
      const popupOffset = {
        bottom: [0, -15],
      };
      const popup = new tt.Popup({ offset: { bottom: [0, -15] } }).setHTML(
        date
      );
      const element = document.createElement("div");
      element.className = "marker";

      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
        .setLngLat(loc)
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setLongitude(lngLat.lng);
        setLatitude(lngLat.lat);
      });

      marker.setPopup(popup).togglePopup();
    };
    const addCurrentMarker = () => {
      const popupOffset = {
        bottom: [0, -15],
      };
      const popup = new tt.Popup({ offset: { bottom: [0, -15] } }).setHTML(
        "This is you!"
      );
      const element = document.createElement("div");
      element.className = "marker";

      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setLongitude(lngLat.lng);
        setLatitude(lngLat.lat);
      });

      marker.setPopup(popup).togglePopup();
    };

    const drawRoute = (geoJson: any, map: tt.Map) => {
      if (map.getLayer("route")) {
        map.removeLayer("route");
        map.removeSource("route");
      }
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geoJson,
        },
        paint: {
          "line-color": "#4a90e2",
          "line-width": 6,
        },
      });
    };

    const recalculateRoutes = () => {
      let routingLocations: CalculateRoute[] = [];
      locations.map((a) => {
        routingLocations = [
          ...routingLocations,
          {
            lat: a.latitude,
            lng: a.longitude,
          },
        ];
        //`${new Date((a.timestamp)).getHours().toString().padStart(2, '0')}: ${new Date((a.timestamp)).getMinutes().toString().padStart(2, '0')}: ${new Date((a.timestamp)).getSeconds().toString().padStart(2, '0')}`
        addMarker(
          [a.longitude, a.latitude],
          new Date(a.timestamp).toUTCString()
        );
      });
      ttapi.services
        .calculateRoute({
          key: process.env.REACT_APP_API_KEY!,
          locations: routingLocations,
        })
        .then((routeData: ttapi.CalculateRouteResponse) => {
          const geoJson = routeData.toGeoJson();
          drawRoute(geoJson, map);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    // locations.map((a) => {
    //   addMarker([a.longitude, a.latitude], new Date(a.timestamp).toString());
    // })
    setMap(map);
    addCurrentMarker();
    recalculateRoutes();
  }, [latitude]);

  return (
    <div>
      {location ? (
        <div ref={mapElement} className="map">
          <Navbar/>
        </div>
      ) : (
        <div>
          <Alert variant="filled" severity="error">
            This is an error alert — check it out!
          </Alert>
        </div>
      )}
    </div>
  );
}
