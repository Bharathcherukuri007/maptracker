import React from 'react';
import {
	AppBar,
	Avatar,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import useAuth from '../Hooks/useAuth';
import User from '../models/User';
import { useLocation, useNavigate } from 'react-router-dom';
export default function Navbar() {
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
		null
	); 
	
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};
	const [signOut] = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<AppBar color="default" className="nav">
			<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="open drawer"
					sx={{ mr: 4 }}
				>
					<MapIcon />
				</IconButton>
				<Typography
					variant="h6"
					noWrap
					component="div"
					sx={{ display: { xs: 'flex', sm: 'block' } }}
				>
                MapTracker
				</Typography>
				<div
					className="avatar"
					style={{
						position: 'absolute',
						right: '0',
						display: 'flex',
						float: 'right',
						justifyContent: 'space-between'
                  
					}}
				>
					{location.pathname === '/' ? 
						<Button onClick={() => {
							navigate('/report');
						}}>View History</Button> : '' }
					<Tooltip title="Open settings">
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar
								alt="Remy Sharp"
								src="https://i.imgur.com/oz3r3Wq.png"
							/>
						</IconButton>
					</Tooltip>
					<Menu
						sx={{ mt: '45px' }}
						id="menu-appbar"
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						anchorEl={anchorElUser}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={Boolean(anchorElUser)}
					>
						<MenuItem
							key={'setting'}
							onClick={() => {
								signOut(new User('', ''));
							}}
						>
							<Typography textAlign="center">{'Logout'}</Typography>
						</MenuItem>
					</Menu>
				</div>
			</Toolbar>
		</AppBar>
	);
}
