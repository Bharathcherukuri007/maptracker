import { useContext } from "react";
import User from "../models/User";
import { UserContext } from "../Context/Context";


function useAuth(){
    //  const useUserContext = () => useContext(UserContext);

    const [user, SetUser, username, setUsername] = useContext(UserContext);

    function signIn(user: User){
        localStorage.setItem("user", user.name!);
        setUsername(user.name);
        SetUser(user);
    }
    function signOut(){
        localStorage.removeItem("user");
        SetUser(new User("", ""));
        setUsername(undefined);
    }
    return [
        signIn, signOut
    ];
    
}
export default useAuth;