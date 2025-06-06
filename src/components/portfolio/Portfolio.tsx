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
        const parsed = JSON.parse(storedSelectedCoin);
        setSelectedCoin(parsed);
        setSearchTerm(parsed.name || '');
      } catch {
        console.warn('Failed to parse selectedCoin from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      localStorage.setItem('selectedCoin', JSON.stringify(selectedCoin));
    } else {
      localStorage.removeItem('selectedCoin');
    }
  }, [selectedCoin]);

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

  // ✅ Corrected: Fetch prices, then update and persist holdings
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
        localStorage.setItem('holdings', JSON.stringify(updatedHoldings)); // ✅ Save after update
      } catch {
        setError('Failed to fetch prices');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [holdings.length]); // use length to trigger only on add/delete

  const filteredOptions = coinOptions.filter(
    coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showDropdown = searchTerm.length > 0 && !selectedCoin;

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

    const newHolding = { coinId: selectedCoin.id, investedUSD: Number(amount) };
    const updated = [...holdings, newHolding];
    setHoldings(updated);
    setSelectedCoin(null);
    setAmount('');
    setSearchTerm('');
  };

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
    const updated = holdings.map(h =>
      h.coinId === editingCoinId
        ? { ...h, investedUSD: Number(editAmount) }
        : h
    );
    setHoldings(updated);
    localStorage.setItem('holdings', JSON.stringify(updated)); // ✅ Save on edit
    cancelEdit();
  };

  const deleteHolding = (coinId: string) => {
    if (window.confirm('Are you sure you want to remove this holding?')) {
      const updated = holdings.filter(h => h.coinId !== coinId);
      setHoldings(updated);
      localStorage.setItem('holdings', JSON.stringify(updated)); // ✅ Save on delete
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

      <form onSubmit={addHolding} className={`${styles.form} ${styles.positionRelative}`}>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map(h => {
            const coin = coinOptions.find(c => c.id === h.coinId);
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
                      className={styles.amountInput}
                    />
                  ) : (
                    `$${h.investedUSD.toFixed(2)}`
                  )}
                </td>
                <td>
                  {editingCoinId === h.coinId ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.saveButton}`}
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => startEdit(h.coinId, h.investedUSD)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => deleteHolding(h.coinId)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className={`${styles.totalValue} ${styles.textCenter} ${styles.marginTop}`}>
        Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}
      </h3>
    </div>
  );
};

export default Portfolio;
