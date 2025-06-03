import { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import SearchBar from './SearchBar';
import CurrencySelector from './CurrencySelector';
import DarkModeToggle from './DarkModeToggle';
import LiveTicker from './LiveTicker';
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const [currency, setCurrency] = useState('usd');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Handler for SearchBar onChange: accepts event and extracts string


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
};

  // Handler for CurrencySelector onChange: accepts event and extracts string
 const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  setCurrency(e.target.value);
};

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <>
      <LiveTicker />

      <Navbar expand="lg" className={styles.navbar} sticky="top">
        <Container fluid className={styles.navWrapper}>
          <Navbar.Brand href="/" className={styles.brand}>
            <span className={styles.logoIcon}>📈</span> CryptoCap
          </Navbar.Brand>

          {/* Desktop SearchBar */}
          <div className="d-none d-lg-flex">
          <SearchBar value={searchTerm} onChange={handleSearchChange} />
          </div>

          {/* Desktop Currency Selector */}
          <div className="ms-3 me-3 d-none d-lg-block">
          <CurrencySelector value={currency} onChange={handleCurrencyChange} />
          </div>

          {/* Desktop DarkMode Toggle */}
          <div className="d-none d-lg-block">
            <DarkModeToggle
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              className={styles.modeToggleBtn}
            />
          </div>

          <Navbar.Toggle aria-controls="navbar-nav" className={styles.toggle} />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-lg-center">
              <Nav.Link href="/" className={styles.navLink}>Home</Nav.Link>
              <Nav.Link href="/markets" className={styles.navLink}>Markets</Nav.Link>
              <Nav.Link href="/portfolio" className={styles.navLink}>Portfolio</Nav.Link>
              <Nav.Link href="/trending" className={styles.navLink}>Trending</Nav.Link>
              <Nav.Link href="/price-history" className={styles.navLink}>Price History</Nav.Link>

              {/* Mobile SearchBar */}
              <div className="mt-3 d-lg-none">
                <SearchBar
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Mobile Currency Selector */}
              <div className="mt-3 d-lg-none">
                <CurrencySelector
                  value={currency}
                  onChange={handleCurrencyChange}
                />
              </div>

              {/* Mobile DarkMode Toggle */}
              <div className="mt-3 d-lg-none">
                <DarkModeToggle
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  className={styles.modeToggleBtn}
                />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
