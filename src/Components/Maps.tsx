import tt from '@tomtom-international/web-sdk-maps';
import React, { useContext, useEffect, useRef, useState } from 'react';
import * as ttapi from '@tomtom-international/web-sdk-services';
import '../App.css';
import {
	Alert,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { UserContext } from '../Context/Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Location from '../models/Locations';
import { resData } from '../models/Locations';
import Navbar from '../Components/Navbar';
import config from '../config';

export interface CalculateRoute {
  lat: number;
  lng: number;
}
export default function Maps() {
	const mapElement = React.useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<tt.Map>();
	const [latitude, setLatitude] = useState<number>(0);
	const [longitude, setLongitude] = useState<number>(0);
	
	const [username] = useContext(UserContext);
	const [location, setLocation] = useState(true);
	const navigate = useNavigate();
	const [locations, setLocations] = useState<Location[]>([]);
	

	const addMarker = (loc: [number, number], date: string, map: any) => {
		const popup = new tt.Popup({ offset: { bottom: [0, -15] } }).setHTML(date);
		const element = document.createElement('div');
		element.className = 'marker';

		const marker = new tt.Marker({
			draggable: true,
			element: element,
		})
			.setLngLat(loc)
			.addTo(map);

		marker.setPopup(popup).togglePopup();
	};

	async function getLocation() {
		try {
			const res = await axios.get(
				`${config.API_KEY}/Location/getLocation/${username}`
			);
			if (res.status === 200) {
				const data: Location[] = [];
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
				});
				// setLantlng(routingLocations);
			}
		} catch (e) {
			console.log(e);
		}
	}

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
				new Date(a.timestamp).toUTCString(),
				map
			);
		});
	};

	const addCurrentMarker = (map: any) => {
		const popup = new tt.Popup({ offset: { bottom: [0, -15] } }).setHTML(
			'This is you!'
		);
		const element = document.createElement('div');
		element.className = 'marker';

		const marker = new tt.Marker({
			draggable: true,
			element: element,
		})
			.setLngLat([longitude, latitude])
			.addTo(map);

		marker.setPopup(popup).togglePopup();
	};
	const successCallback = (position: GeolocationPosition) => {
		setLatitude(position.coords.latitude);
		setLongitude(position.coords.longitude);
	};

	const errorCallback = (error: any) => {
		navigate('/error');
		setLocation(false);
		console.log(error);
	};

	useEffect(() => {
		setTimeout(async () => {
			await getLocation();
			recalculateRoutes();
		}, 0);
		navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

		const map = tt.map({
			key: process.env.REACT_APP_API_KEY!,
			container: mapElement.current ?? '',
			center: [longitude, latitude],
			zoom: 15,
			stylesVisibility: {
				trafficFlow: true,
				trafficIncidents: true,
			},
		});

		setMap(map);
		addCurrentMarker(map);
		recalculateRoutes();
	}, [latitude]);

	return (
		<div>
			{location ? (
				<div ref={mapElement} className="map">
					<Navbar />
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
