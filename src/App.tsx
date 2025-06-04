import Header from './components/Header';
import Home from "./components/Home/Home";
import { SearchProvider } from './context/SearchContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { DarkModeProvider } from './context/DarkModeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <SearchProvider>
      <CurrencyProvider>
        <DarkModeProvider>
          <Header />
          <main className="p-3">
            <Home />
          </main>
        </DarkModeProvider>
      </CurrencyProvider>
    </SearchProvider>
  );
}

export default App;
