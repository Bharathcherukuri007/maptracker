import tt from '@tomtom-international/web-sdk-maps';
import React, { useContext, useEffect, useState } from 'react';
import '../App.css';
import {
	Alert,
} from '@mui/material';
import { UserContext } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import Location from '../models/Locations';
import Navbar from '../Components/Navbar';
import useServiceLayer from '../serviceLayer/servicelayer';

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
	const {getLocationsByUsername} = useServiceLayer();
	

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
		const res = await getLocationsByUsername(username.name!);
		const data: Location[] = [];
		if(res.length > 0){
			res.map((d) => {
				data.push(new Location(d.longitude, d.latitude, d.timestamp));
			});
			setLocations(data);

		}
		else{
			console.log('error');
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
