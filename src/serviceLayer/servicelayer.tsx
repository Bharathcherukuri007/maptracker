import axios from 'axios';
import User from '../models/User';
import config from '../config';
import {RegisterResponseBody} from '../types/types';
import {resData} from '../types/types';
import Location from '../models/Locations';

export default function useServiceLayer(){

	async function postUser(user: User): Promise<RegisterResponseBody>{
		try {
			const res = await axios.post(
				`${config.API_KEY}/User/user`,
				{
					userName: user.name,
					userPassword: user.password,
				}
			);
			if (res.status === 200) {
				return {
					success: true,
					err: 'no err'

				};
			} else {
				return {
					success: false,
					err: 'Registration Failed'

				};
				
			}
		} catch (e: any) {
			return{
				success: false,
				err: e.toString()
			};
			
		}

	}
	async function checkUser(user: User): Promise<RegisterResponseBody>{
		try {
			const res = await axios.post(`${config.API_KEY}/User/checkuser`, {
				userName: user.name,
				userPassword: user.password,
			});
			if (res.status === 200 && res.data['isValid']) {
				return {
					success: true,
					err: 'no error'
				};
				
			} else {
				return {
					success: false,
					err: 'username or password is incorrect please check again'
				};
			
				
			
			} 
		}
		catch (e: any) {
			return {
				success: false,
				err: e.toString()
			};
			
		}

	}
    
	async function getLocationsByUsername(username: string): Promise<Location[]>{
		const data: Location[] = [];
		try {
			const res = await axios.get(
				`${config.API_KEY}/Location/getLocation/${username}`
			);
			if (res.status === 200) {
				res.data.forEach((d: resData) => {
					data.push(new Location(d.longitude, d.latitude, d.timestamp));
				});
				return data;
				
				
			}
			return [];
		} catch (e) {
			return [];
		}

	}
	async function addLocation(username: string, latitude: number, longitude: number): Promise<RegisterResponseBody>{
		try {
			const res = await axios.post(
				`${config.API_KEY}/Location/addLocation`,
				{
					'username': username,
					'location': {
						'id': 0,
						'longitude': longitude,
						'latitude': latitude,
						'timestamp': new Date().toISOString(),
        
					},
				}
			);
			if (res.status === 200) {
				return {
					success: true,
					err: 'no error'
				};
			}
			return {
				success: false,
				err: 'something went wrong'
			};
		} catch (e: any) {
			return {
				success: false,
				err: e.toString()
			};
		}
	}
	return {
		postUser,
		checkUser,
		addLocation,
		getLocationsByUsername
	};




}