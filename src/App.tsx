
import Header from './components/Header';
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home/Home"


function App() {
  return (
    <>
      <Header />
      <main className="p-3">
      <Home/>
      </main>
    </>
  );
}

export default App;
