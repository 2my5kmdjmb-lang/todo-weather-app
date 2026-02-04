import React, { useState } from 'react';
import { getCountries, getCitiesByCountry } from '../data/locations';

interface LocationSelectorProps {
  onLocationSelect: (country: string, city: string) => void;
  onLocationRequest: () => void;
  loading: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationSelect, 
  onLocationRequest, 
  loading 
}) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showSelector, setShowSelector] = useState(false);

  const countries = getCountries();

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity(''); // 重置城市选择
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (selectedCountry && city) {
      onLocationSelect(selectedCountry, city);
      setShowSelector(false);
    }
  };

  const handleLocationRequest = () => {
    onLocationRequest();
    setShowSelector(false);
  };

  const cities = selectedCountry ? getCitiesByCountry(selectedCountry) : [];

  return (
    <div className="location-selector">
      <div className="location-buttons">
        <button 
          className="location-btn manual-location-btn"
          onClick={() => setShowSelector(!showSelector)}
          disabled={loading}
          title="选择地区"
        >
          🌍 {loading ? '正在查询...' : '选择地区'}
        </button>
        <button 
          className="location-btn auto-location-btn"
          onClick={handleLocationRequest}
          disabled={loading}
          title="使用当前位置"
        >
          📍 {loading ? '正在查询...' : '当前位置'}
        </button>
      </div>

      {showSelector && (
        <div className="location-dropdown">
          <div className="location-dropdown-content">
            <div className="location-step">
              <label className="location-label">选择国家：</label>
              <select 
                className="location-select"
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
              >
                <option value="">请选择国家</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {selectedCountry && (
              <div className="location-step">
                <label className="location-label">选择城市：</label>
                <select 
                  className="location-select"
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  <option value="">请选择城市</option>
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="location-actions">
              <button 
                className="location-cancel-btn"
                onClick={() => setShowSelector(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;