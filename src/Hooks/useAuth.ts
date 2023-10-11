import { useContext } from "react";
import {UserContext} from '../Context/Context';
import User from "../models/User";

function UseAuth(){
    const [user, SetUser] = useContext(UserContext);

    function signIn(user: User){
        localStorage.setItem("user", user.name!);
        SetUser(user);
    }
    function signOut(){
        localStorage.removeItem("user");
        SetUser(new User("", ""));
    }
    return [
        signIn, signOut
    ];
    
}
export default UseAuth;