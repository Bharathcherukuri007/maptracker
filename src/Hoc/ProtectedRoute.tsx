import React, { useContext, useEffect, useRef} from 'react';
import { Props, UserContext } from '../Context/Context';
import User from '../models/User';
import '../App.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import useServiceLayer from '../serviceLayer/servicelayer';


export default function ProtectedRoute(props: Props) {
	// eslint-disable-next-line @typescript-eslint/ban-types
	const [user] = useContext<[User, Function, string|undefined, Function]>(UserContext);
	let latitude = 0;
	let longitude = 0;
	const navigate = useNavigate();
	const lastSavedLatitude = useRef<number>();
	const lastSavedLongitude = useRef<number>();
	const {addLocation} = useServiceLayer();

	useEffect(() => {
		if (localStorage.getItem('user') != undefined && localStorage.getItem('user')!.trim().length > 1) {
			console.log('logged in');
		} else {
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		}

		const successCallback = async (position: GeolocationPosition) => {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			if (user != undefined && (lastSavedLatitude.current != latitude || lastSavedLongitude.current != longitude)) {
				lastSavedLatitude.current = latitude;
				lastSavedLongitude.current = longitude;
				console.log(user);


				const res = await addLocation(user.name!, latitude, longitude);
				if(res.success){
					console.log('success');
				}
				else{
					console.log('err');
				}
				
				
			}
		};

		const errorCallback = (error: any) => {
			navigate('/error');
			console.log(error);
		};

		async function getCoords() {
			navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
     
		}
		setInterval(getCoords, 1000 * 60 *5);
	}, [user]);
	return (
		<div>
			{user === undefined ? (
				<div className="spinner">
					<CircularProgress />
				</div>
			) : (
				props.children
			)}
		</div>
	);
}
