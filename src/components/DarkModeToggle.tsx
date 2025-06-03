
import { Button } from 'react-bootstrap';
import styles from '../styles/Header.module.css';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode, className }) => (
  <Button
    variant={darkMode ? 'dark' : 'light'}
    className={className}
    onClick={toggleDarkMode}
  >
    {darkMode ? '🌙 Dark' : '☀️ Light'}
  </Button>
);

export default DarkModeToggle;
