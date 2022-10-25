import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders greeting', () => {
  render(<App />);
  const linkElement = screen.getByText(/Greetings/i);
  expect(linkElement).toBeInTheDocument();
});
