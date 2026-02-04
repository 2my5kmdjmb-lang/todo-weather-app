import type { WeatherData, WeatherService } from '../types';

export class MockWeatherService implements WeatherService {
  private cities = [
    // 中国城市
    { name: '北京', country: '中国', temp: 22, desc: '晴朗', icon: '☀️', humidity: 45, wind: 12, pressure: 1013 },
    { name: '上海', country: '中国', temp: 26, desc: '多云', icon: '⛅', humidity: 68, wind: 8, pressure: 1015 },
    { name: '广州', country: '中国', temp: 29, desc: '小雨', icon: '🌧️', humidity: 78, wind: 15, pressure: 1008 },
    { name: '深圳', country: '中国', temp: 28, desc: '阴天', icon: '☁️', humidity: 72, wind: 10, pressure: 1012 },
    { name: '杭州', country: '中国', temp: 24, desc: '晴朗', icon: '☀️', humidity: 55, wind: 6, pressure: 1016 },
    { name: '成都', country: '中国', temp: 20, desc: '雾', icon: '🌫️', humidity: 85, wind: 4, pressure: 1010 },
    
    // 国际城市
    { name: '纽约', country: '美国', temp: 18, desc: '多云', icon: '⛅', humidity: 60, wind: 14, pressure: 1012 },
    { name: '伦敦', country: '英国', temp: 15, desc: '小雨', icon: '🌧️', humidity: 80, wind: 18, pressure: 1008 },
    { name: '东京', country: '日本', temp: 23, desc: '晴朗', icon: '☀️', humidity: 65, wind: 8, pressure: 1015 },
    { name: '巴黎', country: '法国', temp: 19, desc: '阴天', icon: '☁️', humidity: 70, wind: 12, pressure: 1010 },
    { name: '悉尼', country: '澳大利亚', temp: 25, desc: '晴朗', icon: '☀️', humidity: 55, wind: 10, pressure: 1018 }
  ];

  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理定位'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('用户拒绝了地理定位请求'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('位置信息不可用'));
              break;
            case error.TIMEOUT:
              reject(new Error('获取位置超时'));
              break;
            default:
              reject(new Error('获取位置时发生未知错误'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分钟缓存
        }
      );
    });
  }

  async getCurrentWeather(): Promise<WeatherData> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 随机选择城市
    const cityData = this.cities[Math.floor(Math.random() * this.cities.length)];
    
    return this.generateWeatherData(cityData);
  }

  async getWeatherByLocation(country: string, city: string): Promise<WeatherData> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // 安全性检查
    const sanitizedCountry = this.sanitizeInput(country);
    const sanitizedCity = this.sanitizeInput(city);
    
    if (!sanitizedCountry || !sanitizedCity) {
      throw new Error('请选择有效的国家和城市');
    }

    // 模拟网络错误（15%概率）
    if (Math.random() < 0.15) {
      throw new Error('网络连接失败，请检查网络后重试');
    }

    // 模拟加载超时（5%概率）
    if (Math.random() < 0.05) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      throw new Error('请求超时，服务器响应缓慢');
    }

    // 查找匹配的城市
    const matchedCity = this.cities.find(c => 
      c.name === sanitizedCity && c.country === sanitizedCountry
    );

    if (matchedCity) {
      return this.generateWeatherData(matchedCity);
    }

    // 如果没找到精确匹配，生成模拟数据
    const mockCity = {
      name: sanitizedCity,
      country: sanitizedCountry,
      temp: Math.floor(Math.random() * 30) + 5, // 5-35度
      desc: ['晴朗', '多云', '阴天', '小雨'][Math.floor(Math.random() * 4)],
      icon: ['☀️', '⛅', '☁️', '🌧️'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
      wind: Math.floor(Math.random() * 15) + 3, // 3-18 km/h
      pressure: Math.floor(Math.random() * 20) + 1005 // 1005-1025 hPa
    };

    return this.generateWeatherData(mockCity);
  }

  async searchWeatherByCity(cityName: string): Promise<WeatherData> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 安全性检查：防止XSS攻击
    const sanitizedCityName = this.sanitizeInput(cityName);
    
    if (!sanitizedCityName || sanitizedCityName.length < 2) {
      throw new Error('请输入有效的城市名称');
    }

    // 模拟网络错误（10%概率）
    if (Math.random() < 0.1) {
      throw new Error('网络连接失败，请稍后重试');
    }

    // 查找匹配的城市
    const matchedCity = this.cities.find(city => 
      city.name.toLowerCase().includes(sanitizedCityName.toLowerCase()) ||
      sanitizedCityName.toLowerCase().includes(city.name.toLowerCase())
    );

    if (!matchedCity) {
      // 如果没找到，返回一个模拟的城市数据
      const mockCity = {
        name: sanitizedCityName,
        country: '未知',
        temp: Math.floor(Math.random() * 30) + 5, // 5-35度
        desc: ['晴朗', '多云', '阴天', '小雨'][Math.floor(Math.random() * 4)],
        icon: ['☀️', '⛅', '☁️', '🌧️'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
        wind: Math.floor(Math.random() * 15) + 3, // 3-18 km/h
        pressure: Math.floor(Math.random() * 20) + 1005 // 1005-1025 hPa
      };
      return this.generateWeatherData(mockCity);
    }

    return this.generateWeatherData(matchedCity);
  }

  async getWeatherByGeolocation(): Promise<WeatherData> {
    try {
      // 获取地理位置
      await this.getCurrentPosition();
      
      // 模拟根据坐标获取天气（实际应用中会调用地理编码API）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟网络错误（8%概率）
      if (Math.random() < 0.08) {
        throw new Error('定位服务暂时不可用，请稍后重试');
      }

      // 根据坐标模拟返回附近城市的天气
      const nearbyCity = this.cities[Math.floor(Math.random() * 6)]; // 前6个是中国城市
      
      return this.generateWeatherData({
        ...nearbyCity,
        name: nearbyCity.name + ' (当前位置)'
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('获取位置信息失败');
    }
  }

  private sanitizeInput(input: string): string {
    // 移除HTML标签和特殊字符，防止XSS
    return input
      .replace(/<[^>]*>/g, '') // 移除HTML标签
      .replace(/[<>'"&]/g, '') // 移除危险字符
      .trim()
      .substring(0, 50); // 限制长度
  }

  private generateWeatherData(cityData: any): WeatherData {
    // 添加随机变化
    const tempVariation = Math.random() * 6 - 3; // -3 到 +3
    const windVariation = Math.random() * 4 - 2; // -2 到 +2
    const currentTemp = Math.round((cityData.temp + tempVariation) * 10) / 10;
    
    // 生成7天预报
    const forecast = this.generateForecast(cityData);
    
    return {
      location: cityData.name,
      temperature: currentTemp,
      description: cityData.desc,
      icon: cityData.icon,
      windDirection: this.getWindDirection(),
      windSpeed: Math.max(0, Math.round((cityData.wind + windVariation) * 10) / 10),
      clothingRecommendation: this.getClothingRecommendation(currentTemp, cityData.desc),
      timestamp: new Date(),
      forecast
    };
  }

  private getWindDirection(): string {
    const directions = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private getClothingRecommendation(temperature: number, weather: string): string {
    if (temperature >= 30) {
      return weather.includes('雨') ? '短袖+雨具' : '短袖短裤';
    } else if (temperature >= 25) {
      return weather.includes('雨') ? '薄长袖+雨具' : '短袖长裤';
    } else if (temperature >= 20) {
      return weather.includes('雨') ? '长袖+外套+雨具' : '长袖衬衫';
    } else if (temperature >= 15) {
      return weather.includes('雨') ? '薄外套+雨具' : '薄外套';
    } else if (temperature >= 10) {
      return weather.includes('雨') ? '厚外套+雨具' : '厚外套';
    } else if (temperature >= 5) {
      return weather.includes('雨') ? '棉衣+雨具' : '棉衣毛衣';
    } else {
      return weather.includes('雪') ? '羽绒服+防滑鞋' : '羽绒服';
    }
  }

  private generateForecast(cityData: any): any[] {
    const forecast = [];
    const weatherTypes = [
      { desc: '晴朗', icon: '☀️' },
      { desc: '多云', icon: '⛅' },
      { desc: '阴天', icon: '☁️' },
      { desc: '小雨', icon: '🌧️' },
      { desc: '雷雨', icon: '⛈️' },
      { desc: '雪', icon: '❄️' },
      { desc: '雾', icon: '🌫️' }
    ];

    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      const baseTemp = cityData.temp;
      const tempVariation = Math.random() * 10 - 5; // -5 到 +5
      const highTemp = Math.round(baseTemp + tempVariation + Math.random() * 3);
      const lowTemp = Math.round(highTemp - Math.random() * 8 - 3); // 比最高温低3-11度
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: weekdays[date.getDay()],
        temperature: {
          high: highTemp,
          low: lowTemp
        },
        description: weather.desc,
        icon: weather.icon,
        windDirection: this.getWindDirection(),
        windSpeed: Math.floor(Math.random() * 15) + 3, // 3-18 km/h
        clothingRecommendation: this.getClothingRecommendation(highTemp, weather.desc)
      });
    }
    
    return forecast;
  }
}