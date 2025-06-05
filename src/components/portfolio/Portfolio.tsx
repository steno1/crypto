import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import styles from './portfolio.module.css'; 

interface CoinOption {
  id: string;
  symbol: string;
  name: string;
}

interface Holding {
  coinId: string;
  investedUSD: number;
  price?: number;
  coinAmount?: number;
  totalValue?: number;
}

const Portfolio: React.FC = () => {
  const [coinOptions, setCoinOptions] = useState<CoinOption[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load holdings and selectedCoin from localStorage on mount
  useEffect(() => {
    const storedHoldings = localStorage.getItem('holdings');
    if (storedHoldings) {
      try {
        setHoldings(JSON.parse(storedHoldings));
      } catch {
        console.warn('Failed to parse holdings from localStorage');
      }
    }

    const storedSelectedCoin = localStorage.getItem('selectedCoin');
    if (storedSelectedCoin) {
      try {
        setSelectedCoin(JSON.parse(storedSelectedCoin));
        setSearchTerm(JSON.parse(storedSelectedCoin).name || '');
      } catch {
        console.warn('Failed to parse selectedCoin from localStorage');
      }
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('holdings', JSON.stringify(holdings));
  }, [holdings]);

  
  useEffect(() => {
    if (selectedCoin) {
      localStorage.setItem('selectedCoin', JSON.stringify(selectedCoin));
    } else {
      localStorage.removeItem('selectedCoin');
    }
  }, [selectedCoin]);

  // Fetch coin options
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1')
      .then(res => res.json())
      .then(data => {
        const options = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
        }));
        setCoinOptions(options);
      })
      .catch(() => setError('Failed to load coin list'));
  }, []);

  // Detect coin from URL ?coinId=
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const coinIdFromUrl = queryParams.get('coinId');

    if (coinIdFromUrl && coinOptions.length > 0) {
      const coin = coinOptions.find(c => c.id === coinIdFromUrl);
      if (coin) {
        setSelectedCoin(coin);
        setSearchTerm(coin.name);
        navigate('/portfolio', { replace: true }); 
      } else {
        setError('Coin not found.');
      }
    }
  }, [coinOptions, location.search, navigate]);

  
  useEffect(() => {
    if (holdings.length === 0) return;

    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const coinIds = holdings.map(h => h.coinId).join(',');
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );
        const priceData = await res.json();

        const updatedHoldings = holdings.map(h => {
          const price = priceData[h.coinId]?.usd ?? 0;
          const coinAmount = price ? h.investedUSD / price : 0;
          return {
            ...h,
            price,
            coinAmount,
            totalValue: h.investedUSD,
          };
        });

        setHoldings(updatedHoldings);
      } catch {
        setError('Failed to fetch prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [holdings.length]);

  // Filter coins in dropdown
  const filteredOptions = coinOptions.filter(
    coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show dropdown only if user is typing (searchTerm) and no coin is selected
  const showDropdown = searchTerm.length > 0 && !selectedCoin;

  // Add coin to portfolio
  const addHolding = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCoin || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please select a coin and enter a valid amount in USD.');
      return;
    }

    if (holdings.find(h => h.coinId === selectedCoin.id)) {
      alert('Coin already in portfolio. Update amount instead.');
      return;
    }

    setHoldings(prev => [...prev, { coinId: selectedCoin.id, investedUSD: Number(amount) }]);
    setSelectedCoin(null);
    setAmount('');
    setSearchTerm('');
  };

  const totalPortfolioValue = holdings.reduce(
    (sum, h) => sum + (h.totalValue ?? 0),
    0
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Portfolio</h2>

      <form onSubmit={addHolding} className={styles.form} style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search coin..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedCoin(null); 
          }}
          className={styles.searchInput}
          autoComplete="off"
        />

        {showDropdown && (
          <ul className={styles.dropdownList}>
            {filteredOptions.slice(0, 10).map((coin) => (
              <li
                key={coin.id}
                className={styles.dropdownItem}
                onClick={() => {
                  setSelectedCoin(coin);
                  setSearchTerm(coin.name); 
                }}
              >
                {coin.name} ({coin.symbol.toUpperCase()})
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className={styles.dropdownItem}>No coins found</li>
            )}
          </ul>
        )}

        <input
          type="number"
          step="any"
          placeholder="Amount in USD"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className={styles.amountInput}
        />

        <button type="submit" className={styles.button}>
          Add Holding
        </button>
      </form>

      {loading && <p className={styles.loading}>Loading prices...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Amount (Coins)</th>
            <th>Price (USD)</th>
            <th>Invested (USD)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => (
            <tr key={h.coinId}>
              <td>{coinOptions.find(c => c.id === h.coinId)?.symbol.toUpperCase() || h.coinId}</td>
              <td>{h.coinAmount?.toFixed(6)}</td>
              <td>${h.price?.toFixed(2)}</td>
              <td>${h.investedUSD.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className={styles.totalValue} style={{ textAlign: 'center', marginTop: '1rem' }}>
        Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
      </h3>
    </div>
  );
};

export default Portfolio;
