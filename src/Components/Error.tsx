import { Alert } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error() {
	const navigate = useNavigate();
	useEffect(() => {
		const successCallback = (position: GeolocationPosition) => {
			console.log(position);
			navigate('/home');
		};

		const errorCallback = (error: any) => {
			console.log(error);
		};

		navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
	}, []);
	return (
		<Alert variant="filled" severity="error">
      Please allow location to use maps
		</Alert>
	);
}
