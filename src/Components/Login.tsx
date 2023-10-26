import React, { useState } from 'react';
import '../App.css';
import Button from '@mui/material/Button/Button';
import TextField from '@mui/material/TextField';
import User from '../models/User';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {  useNavigate, Link } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import { Typography } from '@mui/material';
import useServiceLayer from '../serviceLayer/servicelayer';

export default function Login() {
	const [user, setUser] = useState<User>(new User('', ''));
	const [valid, SetValid] = useState<boolean>(true);
	const [showSnackBar, SetShowSnackBar] = useState(false);
	const [err, setErr] = useState('');
	const navigate = useNavigate();
	const [signIn] = useAuth();
	const {checkUser} = useServiceLayer();


	function isValid(user: User) {
		if (user!.password!.length! >= 8 && user!.name!.trim().length > 1) {
			return true;
		}
		return false;
	}
  
	async function validateUser() {
		const res = await checkUser(user);
		if(res.success){
			SetShowSnackBar(true);
			SetValid(true);
			signIn(user);
			navigate('/');
		}
		else {
			SetShowSnackBar(true);
			SetValid(false);
			setErr('invalid');
		}
		setTimeout(() => {
			SetShowSnackBar(false);
		}, 1000);	
	}

	return (
		<div className="loginpage">
			<div className="maincontainer">
				<h1>Login</h1>
				<div className="form">
					<Typography variant="h6">
            Create Your Account{' '}
						<span>
							<Link to="/register">Register</Link>
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
						onChange={(e) => {
							setUser(new User(user.name!, e.target.value));
						}}
					/>
					{isValid(user) ? (
						<Button
							size="large"
							variant="contained"
							className="loginbutton"
							onClick={validateUser}
						>
              Login
						</Button>
					) : (
						<Button
							size="large"
							variant="contained"
							className="loginbutton"
							disabled
						>
              Login
						</Button>
					)}
					<Snackbar open={showSnackBar} autoHideDuration={6000}>
						<Alert
							severity={valid ? 'success' : 'error'}
							sx={{ width: '100%' }}
						>
							{valid ? 'Login Success' : err}
						</Alert>
					</Snackbar>
				</div>
			</div>
		</div>
	);
}
