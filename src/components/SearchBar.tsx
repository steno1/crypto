
import { FormControl, InputGroup } from 'react-bootstrap';
import styles from '../styles/Header.module.css';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, className }) => (
  <InputGroup className={className}>
    <FormControl
      type="text"
      placeholder="Search crypto..."
      value={searchTerm}
      onChange={onSearchChange}
      className={styles.searchInput}
    />
  </InputGroup>
);

export default SearchBar;
