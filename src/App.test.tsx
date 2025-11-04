import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sembarks in footer', () => {
  render(<App />);
  const heading = screen.getByText(/Sembarks/i);
  expect(heading).toBeInTheDocument();
});
