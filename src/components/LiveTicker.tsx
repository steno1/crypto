// components/Header/LiveTicker.tsx
import React from 'react';
import styles from '../styles/Header.module.css';

const LiveTicker: React.FC = () => {
  return (
    <div className={styles.ticker}>
      BTC: $68,500 &nbsp; | &nbsp; ETH: $3,600 &nbsp; | &nbsp; SOL: $150
    </div>
  );
};

export default LiveTicker;
