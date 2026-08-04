// src/__tests__/App.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('affiche le loader au chargement initial', () => {
    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Bat-Construction/i)).toBeInTheDocument();
  });

  it('contient le conteneur principal', () => {
    render(<App />);
    const container = document.querySelector('.min-h-screen');
    expect(container).toHaveClass('bg-gray-50');
  });
});
