import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './coinDetail.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: { [key: string]: number };
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    circulating_supply: number;
  };
  description: { en: string };
}

interface PricePoint {
  time: number;
  price: number;
}

const CoinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await res.json();
        setCoin(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    const fetchChart = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );
        const data = await res.json();
        const formattedData = data.prices.map(
          ([timestamp, price]: [number, number]) => ({
            time: timestamp,
            price,
          })
        );
        setPriceHistory(formattedData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCoin(), fetchChart()]);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!coin) return <div className={styles.container}>Coin not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={coin.image.large} alt={coin.name} className={styles.coinImage} />
        <h1 className={styles.title}>
          {coin.name} ({coin.symbol.toUpperCase()})
        </h1>
      </div>

      <p
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: coin.description.en || 'No description available.',
        }}
      />

      <ul className={styles.stats}>
        <li>
          <span>Current Price:</span>
          <span>${coin.market_data.current_price.usd.toLocaleString()}</span>
        </li>
        <li>
          <span>Market Cap:</span>
          <span>${coin.market_data.market_cap.usd.toLocaleString()}</span>
        </li>
        <li>
          <span>Total Volume:</span>
          <span>${coin.market_data.total_volume.usd.toLocaleString()}</span>
        </li>
        <li>
          <span>Circulating Supply:</span>
          <span>{coin.market_data.circulating_supply.toLocaleString()}</span>
        </li>
      </ul>

      <h3 className={styles.chartTitle}>7-Day Price History</h3>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceHistory}>
            <XAxis
              dataKey="time"
              tickFormatter={(time) =>
                new Date(time).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                })
              }
              stroke="#8884d8"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#8884d8"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              labelFormatter={(label: number) =>
                new Date(label).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#007bff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoinDetail;
