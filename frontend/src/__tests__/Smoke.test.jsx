import React from 'react';
import { render, screen } from '@testing-library/react';

test('renderiza correctamente', () => {
  render(<h1>Hola Mundo</h1>);
  expect(screen.getByText(/hola mundo/i)).toBeInTheDocument();
});