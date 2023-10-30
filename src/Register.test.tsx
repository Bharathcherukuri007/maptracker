import React from 'react';
import Register from './Components/Register';
import { fireEvent, getByLabelText, render, screen } from '@testing-library/react';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
test('checking register component', () => {
    let mock = new MockAdapter(axios);
    render(<Register/>, {wrapper: BrowserRouter});
    const text = document.querySelector('h1');
    expect(text?.textContent).toBe('SignUp');
    
});

test('checking the signup', () => {
    let mock = new MockAdapter(axios);
    mock.onPost("/User/user", {
        username: "bharath",
        password: "12345678"
    },).reply(200);
    render(<Register/>, {wrapper: BrowserRouter});
    const text = document.querySelector('h1');
    fireEvent.change(document.querySelector('[type = text]')!, {target: {value: 'Bharath'}});
    // expect(document.querySelector('[type = text]')?.textContent).toBe(/Bharath/i);
    // expect(document.querySelector('[type = button]')).toBeDisabled();
    fireEvent.click(document.querySelector('[type = button]')!);
})

