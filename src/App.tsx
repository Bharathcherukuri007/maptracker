import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Maps from './Components/Maps';
import Register from './Components/Register';
import Context from './Context/Context';
import ProtectedRoute from './Hoc/ProtectedRoute';
import Error from './Components/Error';
import Charts from './Components/Charts';
function App() {
	return (
		<Context>
			<Routes>
				<Route path="/login" element={<Login />}></Route>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Maps />
						</ProtectedRoute>
					}
				></Route>
				<Route path="/register" element={<Register />}></Route>
				<Route
					path="/report"
					element={
						<ProtectedRoute>
							<Charts />
						</ProtectedRoute>
					}
				></Route>
				<Route path="/error" element = {<Error/>}></Route>
			</Routes>
		</Context>
	);
}

export default App;
