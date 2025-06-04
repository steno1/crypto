import { FormControl, InputGroup } from 'react-bootstrap';
import styles from '../styles/Header.module.css';
import { useSearch } from '../context/SearchContext';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const { searchTerm, setSearchTerm } = useSearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <InputGroup className={className}>
      <FormControl
        type="text"
        placeholder="Search crypto..."
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
      />
    </InputGroup>
  );
};

export default SearchBar;
