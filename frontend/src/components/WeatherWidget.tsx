import React, { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import LocationSelector from './LocationSelector';

const WeatherWidget: React.FC = () => {
  const { 
    weather, 
    loading, 
    error, 
    searchQuery, 
    locationMethod,
    searchWeather, 
    clearSearch, 
    loadWeatherByLocation,
    loadWeatherByGeolocation,
    refetch 
  } = useWeather();
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      searchWeather(input.value.trim());
      setShowSearch(false);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowSearch(false);
  };

  const handleLocationSelect = (country: string, city: string) => {
    loadWeatherByLocation(country, city);
  };

  const handleGeolocationRequest = () => {
    loadWeatherByGeolocation();
  };

  const getLocationLabel = () => {
    switch (locationMethod) {
      case 'search':
        return searchQuery ? ` (搜索: ${searchQuery})` : '';
      case 'manual':
        return ' (手动选择)';
      case 'geolocation':
        return ' (当前位置)';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="weather-loading">
          正在获取天气信息...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget">
        <div className="weather-error">
          {error}
          <br />
          <button 
            onClick={refetch}
            className="retry-button"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="weather-widget">
      <LocationSelector
        onLocationSelect={handleLocationSelect}
        onLocationRequest={handleGeolocationRequest}
        loading={loading}
      />

      <div className="weather-header">
        <div className="weather-location">
          {weather.location}
          <span className="location-method-indicator">
            {getLocationLabel()}
          </span>
        </div>
        <div className="weather-actions">
          <button 
            className="search-toggle-btn"
            onClick={() => setShowSearch(!showSearch)}
            title="搜索城市"
          >
            🔍
          </button>
          {(searchQuery || locationMethod !== 'default') && (
            <button 
              className="clear-search-btn"
              onClick={handleClearSearch}
              title="重置为默认"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {showSearch && (
        <form className="weather-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="weather-search-input"
            placeholder="输入城市名称..."
            autoFocus
            maxLength={50}
          />
          <button type="submit" className="weather-search-btn">
            搜索
          </button>
        </form>
      )}

      <div className="weather-main">
        <div className="weather-temp">{weather.temperature}°C</div>
        <div className="weather-icon">{weather.icon}</div>
      </div>
      <div className="weather-description">{weather.description}</div>
      <div className="weather-details">
        <div className="weather-detail">
          <div className="weather-detail-label">湿度</div>
          <div className="weather-detail-value">{weather.humidity}%</div>
        </div>
        <div className="weather-detail">
          <div className="weather-detail-label">风速</div>
          <div className="weather-detail-value">{weather.windSpeed}km/h</div>
        </div>
        <div className="weather-detail">
          <div className="weather-detail-label">气压</div>
          <div className="weather-detail-value">{weather.pressure}hPa</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;