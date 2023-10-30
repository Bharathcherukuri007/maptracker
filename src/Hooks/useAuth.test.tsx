import { renderHook } from "@testing-library/react";
import UseAuth from "./useAuth";
import User from "../models/User";

test('testing useAuth Hook', () => {
    const {result} = renderHook(() => UseAuth());
    
    const [signIn, signOut] = result.current;
    signIn(new User("Bharath", "12345678"));
    expect(localStorage.getItem('user')).toBe("Bharath");

    

});