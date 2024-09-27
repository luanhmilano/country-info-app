import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CountryListPage from './components/CountryListPage';
import CountryInfoPage from './components/CountryInfoPage';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountryListPage />} />
        <Route path="/country/:countryCode" element={<CountryInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App
