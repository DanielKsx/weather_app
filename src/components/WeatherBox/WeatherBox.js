import PickCity from '../PickCity/PickCity';
import WeatherSummary from '../WeatherSummary/WeatherSummary';
import Loader from '../Loader/Loader';
import { useCallback, useState } from 'react';
import ErrorBox from '../ErrorBox/ErrorBox';

const WeatherBox = props => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const API_KEY = process.env.REACT_APP_OWM_KEY;
 

  const handleCityChange = useCallback((cityName) => {
    setIsLoading(true);
    setError(null);
  
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error('CITY_NOT_FOUND');
        }
        if (!res.ok) {
          throw new Error('API_ERROR');
        }
        return res.json();
      })
      .then((data) => {
        setWeatherData({
          city: data.name,
          temp: data.main.temp,
          icon: data.weather[0].icon,
          description: data.weather[0].main,
        });
      })
      .catch((err) => {
        setWeatherData(null);

        if (err.message === 'CITY_NOT_FOUND') {
          setError('No such city. Please check the name and try again.');
        } else {
          setError('Something went wrong. Please try again later.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      <PickCity onPickCity={handleCityChange} />
      {weatherData && ( <WeatherSummary city={weatherData.city} temp={weatherData.temp} icon={weatherData.icon} description={weatherData.description} /> )}
      {isLoading && <Loader /> }
      {error && <ErrorBox> {error} </ErrorBox>}
    </section>
  )
};

export default WeatherBox;