import { render, screen } from "@testing-library/react"
import { UserContext } from "../Context/Context"
import User from "../models/User"
import Demo from "../Components/demo";
import React from "react";

test('checking the  Component is rendering when the user is loggedin', () => {
    render(<UserContext.Provider value={[new User("Bharath", "1234"), jest.fn, "Bharath", jest.fn]}>
        <Demo></Demo>
    </UserContext.Provider>);

    expect(screen.getByText("demo")).toBeInTheDocument();
})

test('checking the  Component is rendering when the user is not loggedin', async () => {
    render(<UserContext.Provider value={[new User("Bharath", "1234"), jest.fn, undefined, jest.fn]}>
        <Demo></Demo>
    </UserContext.Provider>);
    setTimeout(() => {
    expect(document.querySelector("h1")?.textContent).toBe(/Login/i);

    }, 2000)
})