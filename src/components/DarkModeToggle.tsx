import React from 'react';
import { Button } from 'react-bootstrap';

export interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode, className }) => {
  return (
    <Button
      variant={darkMode ? 'dark' : 'light'}
      className={className}
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
    >
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </Button>
  );
};

export default DarkModeToggle;
