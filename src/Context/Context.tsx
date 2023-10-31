import React, { ReactNode, useContext, useEffect, useState } from "react";
import User from "../models/User";
export const UserContext = React.createContext<[User, Function, string|undefined, Function]>([
  new User("", ""),
  Function,
  undefined,
  Function
]);
export interface Props {
  children: ReactNode[] | ReactNode;
}
export default function Context(props: Props) {
  const [user, SetUser] = useState<User>(new User("", ""));
  const [username, setUsername] = useState<string |undefined>(undefined);
  useEffect(() => {
      if(localStorage.getItem("user") != undefined && localStorage.getItem("user")!.trim().length > 1){
        setUsername(localStorage.getItem("user")!);
      }
      else{
        setUsername(undefined)
      }
  },[])
  return (
    <UserContext.Provider value={[user, SetUser, username!, setUsername]}>
      {props.children}
    </UserContext.Provider>
  );
}
