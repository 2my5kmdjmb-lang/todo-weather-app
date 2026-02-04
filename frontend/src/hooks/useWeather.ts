import { useState, useEffect, useCallback, useMemo } from 'react';
import type { WeatherData } from '../types';
import { MockWeatherService } from '../services/weatherService';
import { useDebounce } from './useDebounce';

interface WeatherState {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  locationMethod: 'default' | 'search' | 'manual' | 'geolocation';
}

export const useWeather = () => {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    loading: true,
    error: null,
    searchQuery: '',
    locationMethod: 'default'
  });

  const weatherService = useMemo(() => new MockWeatherService(), []);
  const debouncedSearchQuery = useDebounce(state.searchQuery, 500);

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setWeather = (weather: WeatherData | null) => {
    setState(prev => ({ ...prev, weather }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery, locationMethod: 'search' }));
  };

  const setLocationMethod = (method: 'default' | 'search' | 'manual' | 'geolocation') => {
    setState(prev => ({ ...prev, locationMethod: method }));
  };

  const showErrorModal = useCallback((message: string) => {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
      <div class="error-modal-content">
        <div class="error-modal-header">
          <h3>网络错误</h3>
          <button class="error-modal-close">&times;</button>
        </div>
        <div class="error-modal-body">
          <p>${message}</p>
        </div>
        <div class="error-modal-footer">
          <button class="error-modal-retry">重试</button>
          <button class="error-modal-cancel">取消</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 绑定事件
    const closeModal = () => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    };

    const retryBtn = modal.querySelector('.error-modal-retry');
    const cancelBtn = modal.querySelector('.error-modal-cancel');
    const closeBtn = modal.querySelector('.error-modal-close');

    retryBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // 5秒后自动关闭
    setTimeout(closeModal, 5000);
  }, []);

  const loadWeather = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const weatherData = query 
        ? await weatherService.searchWeatherByCity(query)
        : await weatherService.getCurrentWeather();

      setWeather(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取天气信息失败';
      setError(errorMessage);
      
      if (errorMessage.includes('超时') || errorMessage.includes('网络') || errorMessage.includes('缓慢')) {
        showErrorModal(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [weatherService, showErrorModal]);

  const loadWeatherByLocation = useCallback(async (country: string, city: string) => {
    try {
      setLoading(true);
      setError(null);
      setLocationMethod('manual');
      
      const weatherData = await weatherService.getWeatherByLocation(country, city);
      setWeather(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取天气信息失败';
      setError(errorMessage);
      
      if (errorMessage.includes('超时') || errorMessage.includes('网络') || errorMessage.includes('缓慢')) {
        showErrorModal(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [weatherService, showErrorModal]);

  const loadWeatherByGeolocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setLocationMethod('geolocation');
      
      const weatherData = await weatherService.getWeatherByGeolocation();
      setWeather(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取位置天气失败';
      setError(errorMessage);
      
      if (errorMessage.includes('超时') || errorMessage.includes('网络') || errorMessage.includes('定位')) {
        showErrorModal(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [weatherService, showErrorModal]);

  const refetch = useCallback(() => {
    if (state.locationMethod === 'search') {
      loadWeather(state.searchQuery || undefined);
    } else if (state.locationMethod === 'geolocation') {
      loadWeatherByGeolocation();
    } else {
      loadWeather();
    }
  }, [state.locationMethod, state.searchQuery, loadWeather, loadWeatherByGeolocation]);

  // 防抖搜索
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      loadWeather(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, loadWeather]);

  // 初始加载
  useEffect(() => {
    const initialLoad = async () => {
      try {
        setLoading(true);
        setError(null);
        const weatherData = await weatherService.getCurrentWeather();
        setWeather(weatherData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取天气信息失败';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    initialLoad();
  }, [weatherService]);

  const searchWeather = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLocationMethod('default');
    loadWeather();
  };

  return {
    weather: state.weather,
    loading: state.loading,
    error: state.error,
    searchQuery: state.searchQuery,
    locationMethod: state.locationMethod,
    searchWeather,
    clearSearch,
    loadWeatherByLocation,
    loadWeatherByGeolocation,
    refetch
  };
};