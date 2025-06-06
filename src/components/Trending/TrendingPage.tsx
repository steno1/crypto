import { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import styles from './TrendingPage.module.css';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  sparkline_in_7d: { price: number[] };
  market_cap_rank: number;
}

const TrendingPage: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
        if (!res.ok) throw new Error('Failed to fetch trending IDs');
        const { coins: trending } = await res.json();
        const ids = trending.map((c: any) => c.item.id).join(',');

        const marketsRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d`
        );
        if (!marketsRes.ok) throw new Error('Failed to fetch market data');
        const data = await marketsRes.json();
        setCoins(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [currency]);

  const formatNumber = (value: number | null, options?: Intl.NumberFormatOptions) =>
    value == null ? 'N/A' : value.toLocaleString(undefined, options);

  const formatPrice = (value: number | null) =>
    value == null ? 'N/A' : `${currency === 'usd' ? '$' : ''}${formatNumber(value)}`;

  const formatPercentage = (value: number | null) =>
    value == null ? 'N/A' : `${value.toFixed(2)}%`;

  return (
    <Container className={styles.homeContainer} fluid="md">
      <h1 className="my-4 text-center">Trending Coins</h1>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <div>Loading trending coins...</div>
        </div>
      )}
      {error && <Alert variant="danger" className="text-center">{error}</Alert>}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table className={`table table-striped table-hover ${styles.cryptoTable}`}>
            <thead className="table-dark">
              <tr>
                <th>#</th><th>Logo</th><th>Name</th><th>Symbol</th>
                <th>Price</th><th>1h %</th><th>24h %</th><th>7d %</th>
                <th>Market Cap</th><th>Volume (24h)</th>
                <th>Circulating Supply</th><th>Last 7 Days</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((c, idx) => (
                <tr key={c.id}>
                  <td>{idx + 1}</td>
                  <td><img src={c.image} alt={`${c.name} logo`} width={24} height={24} /></td>
                  <td><Link to={`/coin/${c.id}`} className={styles.coinLink}>{c.name}</Link></td>
                  <td>{c.symbol.toUpperCase()}</td>
                  <td>{formatPrice(c.current_price)}</td>
                  <td style={{ color: c.price_change_percentage_1h_in_currency >= 0 ? 'green' : 'red' }}>
                    {formatPercentage(c.price_change_percentage_1h_in_currency)}
                  </td>
                  <td style={{ color: c.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                    {formatPercentage(c.price_change_percentage_24h)}
                  </td>
                  <td style={{ color: c.price_change_percentage_7d_in_currency >= 0 ? 'green' : 'red' }}>
                    {formatPercentage(c.price_change_percentage_7d_in_currency)}
                  </td>
                  <td>{formatPrice(c.market_cap)}</td>
                  <td>{formatPrice(c.total_volume)}</td>
                  <td>{formatNumber(c.circulating_supply)}</td>
                  <td style={{ width: 100, minWidth: 100 }}>
                    {c.sparkline_in_7d?.price ? (
                      <Sparklines data={c.sparkline_in_7d.price} width={100} height={30} margin={5}>
                        <SparklinesLine color={c.price_change_percentage_7d_in_currency >= 0 ? 'green' : 'red'} />
                      </Sparklines>
                    ) : 'N/A'}
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

export default TrendingPage;
