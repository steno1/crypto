import { useState } from 'react';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import CurrencySelector from './CurrencySelector';
import DarkModeToggle from './DarkModeToggle';
import LiveTicker from './LiveTicker';
import styles from "../styles/Header.module.css";
import { useCurrency } from '../context/CurrencyContext';
import { useCoins } from '../context/CoinsContext'; 

const Header: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const { coins } = useCoins();  
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const navigate = useNavigate();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleCoinSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const coinId = e.target.value;
    setSelectedCoin(coinId);
    if (coinId) {
      navigate(`/history/${coinId}`);
    }
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
            <SearchBar />
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

          {/* Desktop Coin Selector */}
          <div className="d-none d-lg-block ms-3">
            <Form.Select
              value={selectedCoin}
              onChange={handleCoinSelect}
              aria-label="Select coin for price history"
            >
              <option value="">Price History</option>
              {coins.map(coin => (
                <option key={coin.id} value={coin.id}>
                  {coin.name}
                </option>
              ))}
            </Form.Select>
          </div>

          <Navbar.Toggle aria-controls="navbar-nav" className={styles.toggle} />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-lg-center">
            
              <Nav.Link href="/" className={styles.navLink}>Market</Nav.Link>
              <Nav.Link href="/portfolio" className={styles.navLink}>Portfolio</Nav.Link>
              <Nav.Link href="trending" className={styles.navLink}>Trending</Nav.Link>

              {/* Mobile SearchBar */}
              <div className="mt-3 d-lg-none">
                <SearchBar />
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

              {/* Mobile Coin Selector */}
              <div className="mt-3 d-lg-none">
                <Form.Select
                  value={selectedCoin}
                  onChange={handleCoinSelect}
                  aria-label="Select coin for price history"
                >
                  <option value="">Price History</option>
                  {coins.map(coin => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
