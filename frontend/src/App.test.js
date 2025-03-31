import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main page and navbar', () => {
  render(<App />);
  
  // Check if the navbar is rendered
  const navbarElement = screen.getByRole('navigation'); // Assuming your Navbar has a role of 'navigation'
  expect(navbarElement).toBeInTheDocument();

  // Check if the footer is rendered
  const footerElement = screen.getByText(/footer text/i); // Replace with actual footer text
  expect(footerElement).toBeInTheDocument();

  // Check if the homepage is rendered
  const homepageElement = screen.getByText(/welcome to the homepage/i); // Replace with actual text from your homepage
  expect(homepageElement).toBeInTheDocument();
});