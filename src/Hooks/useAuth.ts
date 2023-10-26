import { useContext } from 'react';
import {UserContext} from '../Context/Context';
import User from '../models/User';

function UseAuth(){
	const [, SetUser, , setUsername] = useContext(UserContext);

	function signIn(user: User){
		localStorage.setItem('user', user.name!);
		setUsername(user.name);
		SetUser(user);
	}
	function signOut(){
		localStorage.removeItem('user');
		SetUser(new User('', ''));
		setUsername(undefined);
	}
	return [
		signIn, signOut
	];
    
}
export default UseAuth;