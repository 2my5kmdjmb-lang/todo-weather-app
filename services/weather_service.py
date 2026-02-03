#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
天气服务实现
实现天气数据获取功能
"""

import asyncio
import random
from datetime import datetime
from typing import Tuple, Optional
from core.interfaces import IWeatherService, WeatherData


class MockWeatherService(IWeatherService):
    """模拟天气服务"""
    
    def __init__(self):
        self.cities = [
            {"name": "北京", "temp": 22, "desc": "晴朗", "icon": "☀️", "humidity": 45, "wind": 12, "pressure": 1013},
            {"name": "上海", "temp": 26, "desc": "多云", "icon": "⛅", "humidity": 68, "wind": 8, "pressure": 1015},
            {"name": "广州", "temp": 29, "desc": "小雨", "icon": "🌧️", "humidity": 78, "wind": 15, "pressure": 1008},
            {"name": "深圳", "temp": 28, "desc": "阴天", "icon": "☁️", "humidity": 72, "wind": 10, "pressure": 1012},
            {"name": "杭州", "temp": 24, "desc": "晴朗", "icon": "☀️", "humidity": 55, "wind": 6, "pressure": 1016},
            {"name": "成都", "temp": 20, "desc": "雾", "icon": "🌫️", "humidity": 85, "wind": 4, "pressure": 1010}
        ]
    
    async def get_location(self) -> Tuple[float, float]:
        """模拟获取位置"""
        # 模拟网络延迟
        await asyncio.sleep(0.5)
        
        # 返回随机位置（中国范围内）
        lat = random.uniform(18.0, 53.0)  # 中国纬度范围
        lon = random.uniform(73.0, 135.0)  # 中国经度范围
        
        return lat, lon
    
    async def get_current_weather(self, lat: float = None, lon: float = None) -> WeatherData:
        """获取当前天气"""
        # 模拟网络延迟
        await asyncio.sleep(1.0)
        
        # 如果没有提供坐标，先获取位置
        if lat is None or lon is None:
            lat, lon = await self.get_location()
        
        # 根据位置选择城市（简化处理）
        city_data = random.choice(self.cities)
        
        # 添加一些随机变化
        temp_variation = random.uniform(-3, 3)
        humidity_variation = random.randint(-10, 10)
        wind_variation = random.uniform(-2, 2)
        
        return WeatherData(
            location=city_data["name"],
            temperature=round(city_data["temp"] + temp_variation, 1),
            description=city_data["desc"],
            icon=city_data["icon"],
            humidity=max(0, min(100, city_data["humidity"] + humidity_variation)),
            wind_speed=max(0, round(city_data["wind"] + wind_variation, 1)),
            pressure=city_data["pressure"],
            timestamp=datetime.now()
        )


class RealWeatherService(IWeatherService):
    """真实天气服务（需要API密钥）"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.openweathermap.org/data/2.5"):
        self.api_key = api_key
        self.base_url = base_url
    
    async def get_location(self) -> Tuple[float, float]:
        """获取当前位置（需要实现地理定位API）"""
        # 这里应该调用地理定位API
        # 暂时返回北京坐标
        return 39.9042, 116.4074
    
    async def get_current_weather(self, lat: float = None, lon: float = None) -> WeatherData:
        """获取真实天气数据"""
        import aiohttp
        
        if lat is None or lon is None:
            lat, lon = await self.get_location()
        
        url = f"{self.base_url}/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric",
            "lang": "zh_cn"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._parse_weather_data(data)
                else:
                    raise Exception(f"天气API请求失败: {response.status}")
    
    def _parse_weather_data(self, data: dict) -> WeatherData:
        """解析天气API响应"""
        main = data["main"]
        weather = data["weather"][0]
        wind = data.get("wind", {})
        
        # 天气图标映射
        icon_map = {
            "01d": "☀️", "01n": "🌙",
            "02d": "⛅", "02n": "☁️",
            "03d": "☁️", "03n": "☁️",
            "04d": "☁️", "04n": "☁️",
            "09d": "🌧️", "09n": "🌧️",
            "10d": "🌦️", "10n": "🌧️",
            "11d": "⛈️", "11n": "⛈️",
            "13d": "❄️", "13n": "❄️",
            "50d": "🌫️", "50n": "🌫️"
        }
        
        return WeatherData(
            location=data["name"],
            temperature=round(main["temp"], 1),
            description=weather["description"],
            icon=icon_map.get(weather["icon"], "🌤️"),
            humidity=main["humidity"],
            wind_speed=round(wind.get("speed", 0) * 3.6, 1),  # m/s to km/h
            pressure=main["pressure"],
            timestamp=datetime.now()
        )