import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import Register from './Components/Register';
import Demo from './Components/demo';
import { render, screen } from '@testing-library/react';

// jest.mock('@material/')

test('test', () => {
	render(<Demo></Demo>);
	expect(screen.getByText('demo')).toBeInTheDocument();
})