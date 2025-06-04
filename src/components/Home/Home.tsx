import { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useSearch } from '../../context/SearchContext';
import styles from './home.module.css';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap_rank: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
  circulating_supply?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

const Home: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h,7d'
        );
        if (!res.ok) throw new Error('Failed to fetch coins');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className={styles.homeContainer} fluid="md">
      <h1 className="my-4 text-center">Top 50 Cryptocurrencies</h1>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <div>Loading coins...</div>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table className={`table table-striped table-hover ${styles.cryptoTable}`}>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Logo</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>1h %</th>
                <th>24h %</th>
                <th>7d %</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
                <th>Circulating Supply</th>
                <th>Last 7 Days</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.market_cap_rank}</td>
                  <td>
                    <img
                      src={coin.image}
                      alt={`${coin.name} logo`}
                      width={24}
                      height={24}
                      style={{ verticalAlign: 'middle' }}
                    />
                  </td>
                  <td>{coin.name}</td>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td
                    style={{
                      color: (coin.price_change_percentage_1h_in_currency ?? 0) >= 0 ? 'green' : 'red',
                    }}
                  >
                    {(coin.price_change_percentage_1h_in_currency ?? 0).toFixed(2)}%
                  </td>
                  <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td
                    style={{
                      color: (coin.price_change_percentage_7d_in_currency ?? 0) >= 0 ? 'green' : 'red',
                    }}
                  >
                    {(coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)}%
                  </td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                  <td>
                    {coin.circulating_supply
                      ? `${coin.circulating_supply.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })} ${coin.symbol.toUpperCase()}`
                      : 'N/A'}
                  </td>
                  <td style={{ width: 100, minWidth: 100 }}>
                    {coin.sparkline_in_7d && coin.sparkline_in_7d.price.length > 0 ? (
                      <Sparklines data={coin.sparkline_in_7d.price} width={100} height={30} margin={5}>
                        <SparklinesLine
                          color={
                            coin.price_change_percentage_7d_in_currency &&
                            coin.price_change_percentage_7d_in_currency >= 0
                              ? 'green'
                              : 'red'
                          }
                          style={{ strokeWidth: 2, fill: 'none' }}
                        />
                      </Sparklines>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
};

export default Home;
