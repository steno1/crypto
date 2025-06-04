import { useEffect, useState } from 'react';
import styles from '../styles/Header.module.css';
import { useCurrency } from '../context/CurrencyContext';

interface TickerPrices {
  [key: string]: number;
}

const LiveTicker: React.FC = () => {
  const [prices, setPrices] = useState<TickerPrices>({});
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = ['bitcoin', 'ethereum', 'solana'].join(',');
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currency}`
        );
        if (!res.ok) throw new Error('Failed to fetch ticker prices');
        const data = await res.json();

        setPrices({
          BTC: data.bitcoin[currency],
          ETH: data.ethereum[currency],
          SOL: data.solana[currency],
        });
      } catch (error) {
        console.error('LiveTicker fetch error:', error);
      }
    };

    fetchPrices();

  
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [currency]);

  const formatPrice = (value: number | undefined) => {
    if (value == null) return 'N/A';
    return currency.toLowerCase() === 'usd'
      ? `$${value.toLocaleString()}`
      : `${value.toLocaleString()} ${currency.toUpperCase()}`;
  };

  return (
    <div className={styles.ticker}>
      BTC: {formatPrice(prices.BTC)} &nbsp; | &nbsp;
      ETH: {formatPrice(prices.ETH)} &nbsp; | &nbsp;
      SOL: {formatPrice(prices.SOL)}
    </div>
  );
};

export default LiveTicker;
