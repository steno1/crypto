import Header from './components/Header';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home/Home";
import { SearchProvider } from './context/SearchContext';
import { CurrencyProvider } from './context/CurrencyContext';
function App() {
  return (
    <SearchProvider>
      <CurrencyProvider>
      <Header />
      <main className="p-3">
        <Home />
      </main>
       </CurrencyProvider>
    </SearchProvider>
     
  );
}

export default App;
