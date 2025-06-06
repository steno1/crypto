
import Header from './components/Header';
import Home from "./components/Home/Home";
import { SearchProvider } from './context/SearchContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { DarkModeProvider } from './context/DarkModeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import CoinDetail from './components/coinDetails/CoinDetails';
import Portfolio from './components/portfolio/Portfolio';
import TrendingPage from './components/Trending/TrendingPage';
import { CoinsProvider } from './context/CoinsContext';
import PriceHistoryPage from './components/priceHistory/PriceHistory';

import './App.css';

function App() {
  return (
    <SearchProvider>
      <CurrencyProvider>
        <DarkModeProvider>
          <CoinsProvider>
            <Header />
            <main className="p-3">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/coin/:id" element={<CoinDetail />} />
                <Route path="/history/:id" element={<PriceHistoryPage />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/trending" element={<TrendingPage />} />
              </Routes>
            </main>
          </CoinsProvider>
        </DarkModeProvider>
      </CurrencyProvider>
    </SearchProvider>
  );
}

export default App;
