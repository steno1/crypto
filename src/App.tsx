import Header from './components/Header';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home/Home";
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <SearchProvider>
      <Header />
      <main className="p-3">
        <Home />
      </main>
    </SearchProvider>
  );
}

export default App;
