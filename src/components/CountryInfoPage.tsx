import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ipdev = import.meta.env.VITE_API_URL;

interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
}

interface PopulationData {
  year: number;
  value: number;
}

interface CountryInfo {
  borderCountries: BorderCountry[];
  population: PopulationData[];
  flagUrl: string;
  name: string;
}

const CountryInfoPage = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await fetch(`${ipdev}/api/countryInformation/${countryCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch country information');
        }
        const data = await response.json();

        const formattedData: CountryInfo = {
          name: data.borderCountries.commonName,
          flagUrl: data.flag.data.flag,
          borderCountries: data.borderCountries.borders,
          population: data.population.data.populationCounts,
        };

        setCountryInfo(formattedData);
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (countryCode) {
      fetchCountryInfo();
    }
  }, [countryCode]);

  if (loading) {
    return <div>Loading country information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!countryInfo) {
    return <div>No country information available</div>;
  }

  const populationData = {
    labels: countryInfo.population.map((pop) => pop.year),
    datasets: [
      {
        label: 'Population over time',
        data: countryInfo.population.map((pop) => pop.value),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h1>{countryInfo.name}</h1>
      <img src={countryInfo.flagUrl} alt={`${countryInfo.name} flag`} style={{ width: '200px', height: 'auto' }} />

      <h2>Border Countries</h2>
      <ul>
        {countryInfo.borderCountries.length > 0 ? (
          countryInfo.borderCountries.map((borderCountry) => (
            <li key={borderCountry.countryCode}>
              {borderCountry.commonName} ({borderCountry.officialName})
            </li>
          ))
        ) : (
          <li>No bordering countries available</li>
        )}
      </ul>

      <h2>Population Chart</h2>
      <Line data={populationData} />
    </div>
  );
};

export default CountryInfoPage;
