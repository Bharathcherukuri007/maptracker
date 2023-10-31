import { renderHook } from "@testing-library/react";
import User from "../models/User";
import sinon, {stub} from "sinon";
import React from "react";
import  useAuth, * as useAuthModule from "./useAuth";
test('testing useAuth Hook', () => {
    const mocksignIn = jest.fn();
    const mocksignOutspy = jest.fn();
    jest.spyOn(useAuthModule, 'default').mockReturnValue([
        mocksignIn, mocksignOutspy
    ])
    const {result} = renderHook(() => useAuth());
    console.log(result.current[0](new User("bharath", "12345678")));
    expect(mocksignIn).toBeCalled();
});

test('testing signOut', () => {
    const mocksignIn = jest.fn();
    const mocksignOutspy = jest.fn();
    jest.spyOn(useAuthModule, 'default').mockReturnValue([
        mocksignIn, mocksignOutspy
    ])
    const {result} = renderHook(() => useAuth());
    console.log(result.current[1](new User("bharath", "12345678")));
    expect(mocksignOutspy).toBeCalled();

});