import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  
} from 'chart.js';
import type { ChartOptions } from 'chart.js'; 
import 'chartjs-adapter-date-fns';
import { useCurrency } from '../../context/CurrencyContext';
import styles from './priceHistory.module.css';

ChartJS.register(
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

interface MarketChart {
  prices: [number, number][];
}

const PriceHistoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currency } = useCurrency();
  const [data, setData] = useState<MarketChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=30&interval=daily`
        );
        if (!res.ok) throw new Error('Failed to fetch price history');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id, currency]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <div>Loading price history...</div>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">{error || 'No data'}</Alert>
      </Container>
    );
  }

  const chartData = {
    labels: data.prices.map(([timestamp]) => new Date(timestamp)),
    datasets: [
      {
        label: `${id} Price (${currency.toUpperCase()})`,
        data: data.prices.map(([_, price]) => price),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        pointRadius: 0,
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM d',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: '#eee',
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <Container fluid="md" className={styles.historyContainer}>
      <h2 className="my-4 text-center">Last 30 Days Price</h2>
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    </Container>
  );
};

export default PriceHistoryPage;
