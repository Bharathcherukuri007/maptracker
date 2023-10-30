import { render } from "@testing-library/react"
import React from "react";
import Maps from './Components/Maps';
import { BrowserRouter } from "react-router-dom";
jest.mock('@tomtom-international/web-sdk-services', () => {
    return {
        tt: "hello"
    }
});
test('tesing maps component', () => {
    render(<Maps></Maps>, {wrapper: BrowserRouter});

})