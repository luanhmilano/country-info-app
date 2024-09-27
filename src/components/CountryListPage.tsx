import { SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ipdev = import.meta.env.VITE_API_URL;

interface Country {
    countryCode: string;
    name: string;
  }

export const CountryListPage = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const response = await fetch(`${ipdev}/api/countries`);
          const data: Country[] = await response.json();
        setCountries(data);
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      };
      fetchCountries();
    }, []);
  
    const handleCountryChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedCountryCode(event.target.value);
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (selectedCountryCode) {
          navigate(`/country/${selectedCountryCode}`);
        }
    };
  
    return (
        <div>
      <h1>Select a Country</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="country-select">Choose a country:</label>
        <select
          id="country-select"
          value={selectedCountryCode}
          onChange={handleCountryChange}
        >
          <option value="">--Please choose a country--</option>
          {countries.map((country) => (
            <option key={country.countryCode} value={country.countryCode}>
              {country.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!selectedCountryCode}>
          Submit
        </button>
      </form>
    </div>
      );
  };
  
export default CountryListPage;
