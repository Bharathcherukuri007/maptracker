import React, { useContext, useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import '../App.css';
import Navbar from './Navbar';
import config from '../config';
import axios from 'axios';
import { UserContext } from '../Context/Context';
import CircularProgress from '@mui/material/CircularProgress';

// const data = [
//   ["Location", "Number of times visited"],
//   ["Nanakramguda", 11],
//   ["Singapore", 2],
//   ["Financial District", 2],
//   ["Gachibowli", 2],
// ];

export const options = {
	title: 'Location Data',
};

export default function Charts() {
	const [data, setData] = useState<any>([
		['Location', 'Number of times visited'],
	]);
	const [username] = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		setTimeout(async () => {
			try {
				const res = await axios.get(
					`${config.API_KEY}/Location/visualizerData/${username}`
				);
				const temp: any = [['Location', 'Number of times visited']];
				res.data.map((address: any) => {
					temp.push([address.streetName, address.visits]);
					// temp.push([address.address[0], address.count])
				});

				setData(temp);
				setIsLoading(false);
				console.log(data);
			} catch (e) {
				console.log(e);
			}
		}, 0);
	}, []);

	return (
		<>
			{isLoading ? (
				<div className="spinner">
					<CircularProgress />
				</div>
			) : (
				<div className="chart">
					<Navbar />
					<Chart
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						chartType="PieChart"
						data={data}
						options={options}
						width={'100%'}
						height={'100%'}
					/>
				</div>
			)}
		</>
	);
}
