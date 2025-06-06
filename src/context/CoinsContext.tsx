import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  
}

interface CoinsContextType {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
}

const CoinsContext = createContext<CoinsContextType | undefined>(undefined);

export const CoinsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState('usd');  

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false`
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
  }, [currency]);

  return (
    <CoinsContext.Provider value={{ coins, loading, error, currency, setCurrency }}>
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = (): CoinsContextType => {
  const context = useContext(CoinsContext);
  if (!context) {
    throw new Error('useCoins must be used within a CoinsProvider');
  }
  return context;
};
