import { FormControl, InputGroup } from 'react-bootstrap';
import styles from '../styles/Header.module.css';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, className }) => (
  <InputGroup className={className}>
    <FormControl
      type="text"
      placeholder="Search crypto..."
      value={value}
      onChange={onChange}
      className={styles.searchInput}
    />
  </InputGroup>
);

export default SearchBar;
