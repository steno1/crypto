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

  const [editingCoinId, setEditingCoinId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();

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
        const coin = JSON.parse(storedSelectedCoin);
        setSelectedCoin(coin);
        setSearchTerm(coin.name || '');
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

  // Fetch coin options from CoinGecko API
  useEffect(() => {
    fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1'
    )
      .then((res) => res.json())
      .then((data) => {
        const options = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
        }));
        setCoinOptions(options);
      })
      .catch(() => setError('Failed to load coin list'));
  }, []);

  // Detect coinId in URL query and select coin
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const coinIdFromUrl = queryParams.get('coinId');

    if (coinIdFromUrl && coinOptions.length > 0) {
      const coin = coinOptions.find((c) => c.id === coinIdFromUrl);
      if (coin) {
        setSelectedCoin(coin);
        setSearchTerm(coin.name);
        navigate('/portfolio', { replace: true });
      } else {
        setError('Coin not found.');
      }
    }
  }, [coinOptions, location.search, navigate]);

  // Fetch prices for holdings
  useEffect(() => {
    if (holdings.length === 0) return;

    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const coinIds = holdings.map((h) => h.coinId).join(',');
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
        );
        const priceData = await res.json();

        const updatedHoldings = holdings.map((h) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdings.length]);

  // Filter coins for dropdown
  const filteredOptions = coinOptions.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showDropdown = searchTerm.length > 0 && !selectedCoin;

  // Add new holding
  const addHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please select a coin and enter a valid amount in USD.');
      return;
    }
    if (holdings.find((h) => h.coinId === selectedCoin.id)) {
      alert('Coin already in portfolio. Update amount instead.');
      return;
    }
    setHoldings((prev) => [...prev, { coinId: selectedCoin.id, investedUSD: Number(amount) }]);
    setSelectedCoin(null);
    setAmount('');
    setSearchTerm('');
  };

  // Editing functions
  const startEdit = (coinId: string, currentAmount: number) => {
    setEditingCoinId(coinId);
    setEditAmount(currentAmount.toString());
  };

  const cancelEdit = () => {
    setEditingCoinId(null);
    setEditAmount('');
  };

  const saveEdit = () => {
    if (!editAmount || isNaN(Number(editAmount)) || Number(editAmount) <= 0) {
      alert('Please enter a valid amount in USD.');
      return;
    }
    setHoldings((prev) =>
      prev.map((h) =>
        h.coinId === editingCoinId ? { ...h, investedUSD: Number(editAmount) } : h
      )
    );
    setEditingCoinId(null);
    setEditAmount('');
  };

  const deleteHolding = (coinId: string) => {
    if (window.confirm('Are you sure you want to remove this holding?')) {
      setHoldings((prev) => prev.filter((h) => h.coinId !== coinId));
      if (editingCoinId === coinId) {
        cancelEdit();
      }
    }
  };

  const totalPortfolioValue = holdings.reduce(
    (sum, h) => sum + (h.totalValue ?? 0),
    0
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Portfolio</h2>

      <form onSubmit={addHolding} className={styles.form}>
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

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Amount (Coins)</th>
              <th>Price (USD)</th>
              <th>Invested (USD)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const coin = coinOptions.find((c) => c.id === h.coinId);
              return (
                <tr key={h.coinId}>
                  <td>{coin?.symbol.toUpperCase() || h.coinId}</td>
                  <td>{h.coinAmount?.toFixed(6)}</td>
                  <td>${h.price?.toFixed(2)}</td>
                  <td>
                    {editingCoinId === h.coinId ? (
                      <input
                        type="number"
                        step="any"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className={styles.editInput}
                      />
                    ) : (
                      `$${h.investedUSD.toFixed(2)}`
                    )}
                  </td>
                  <td className={styles.actionsCell}>
                    {editingCoinId === h.coinId ? (
                      <>
                        <button onClick={saveEdit} className={styles.saveBtn}>
                          Save
                        </button>
                        <button onClick={cancelEdit} className={styles.cancelBtn}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(h.coinId, h.investedUSD)}
                          className={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteHolding(h.coinId)}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {holdings.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.noHoldings}>
                  No holdings added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className={styles.totalValue}>
        Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
      </p>
    </div>
  );
};

export default Portfolio;
