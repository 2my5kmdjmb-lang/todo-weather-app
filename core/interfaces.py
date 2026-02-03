#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
核心接口定义
定义项目中所有组件的标准接口
"""

from abc import ABC, abstractmethod
from typing import Any, Optional, List, Tuple, Dict
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Task:
    """任务数据模型"""
    id: str
    text: str
    completed: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


@dataclass
class WeatherData:
    """天气数据模型"""
    location: str
    temperature: float
    description: str
    icon: str
    humidity: int
    wind_speed: float
    pressure: float
    timestamp: datetime


class IStorageEngine(ABC):
    """存储引擎接口"""
    
    @abstractmethod
    def insert(self, key: str, value: Any) -> None:
        """插入数据"""
        pass
    
    @abstractmethod
    def delete(self, key: str) -> bool:
        """删除数据"""
        pass
    
    @abstractmethod
    def search(self, key: str) -> Optional[Any]:
        """查询数据"""
        pass
    
    @abstractmethod
    def update(self, key: str, value: Any) -> bool:
        """更新数据"""
        pass
    
    @abstractmethod
    def get_all(self) -> List[Tuple[str, Any]]:
        """获取所有数据"""
        pass
    
    @abstractmethod
    def size(self) -> int:
        """获取数据量"""
        pass
    
    @abstractmethod
    def clear(self) -> None:
        """清空数据"""
        pass


class ITaskRepository(ABC):
    """任务存储接口"""
    
    @abstractmethod
    def save_task(self, task: Task) -> None:
        """保存任务"""
        pass
    
    @abstractmethod
    def delete_task(self, task_id: str) -> bool:
        """删除任务"""
        pass
    
    @abstractmethod
    def get_task(self, task_id: str) -> Optional[Task]:
        """获取任务"""
        pass
    
    @abstractmethod
    def get_all_tasks(self) -> List[Task]:
        """获取所有任务"""
        pass
    
    @abstractmethod
    def update_task(self, task: Task) -> bool:
        """更新任务"""
        pass


class IWeatherService(ABC):
    """天气服务接口"""
    
    @abstractmethod
    async def get_current_weather(self, lat: float = None, lon: float = None) -> WeatherData:
        """获取当前天气"""
        pass
    
    @abstractmethod
    async def get_location(self) -> Tuple[float, float]:
        """获取当前位置"""
        pass


class ITodoService(ABC):
    """Todo服务接口"""
    
    @abstractmethod
    def create_task(self, text: str) -> Optional[Task]:
        """创建任务"""
        pass
    
    @abstractmethod
    def toggle_task(self, task_id: str) -> Optional[Task]:
        """切换任务状态"""
        pass
    
    @abstractmethod
    def delete_task(self, task_id: str) -> bool:
        """删除任务"""
        pass
    
    @abstractmethod
    def get_all_tasks(self) -> List[Task]:
        """获取所有任务"""
        pass
    
    @abstractmethod
    def update_task_text(self, task_id: str, text: str) -> Optional[Task]:
        """更新任务文本"""
        pass


class IUIRenderer(ABC):
    """UI渲染接口"""
    
    @abstractmethod
    def render_tasks(self, tasks: List[Task]) -> None:
        """渲染任务列表"""
        pass
    
    @abstractmethod
    def render_weather(self, weather: WeatherData) -> None:
        """渲染天气信息"""
        pass
    
    @abstractmethod
    def show_loading(self, message: str = "加载中...") -> None:
        """显示加载状态"""
        pass
    
    @abstractmethod
    def show_error(self, message: str) -> None:
        """显示错误信息"""
        pass


class IEventHandler(ABC):
    """事件处理接口"""
    
    @abstractmethod
    def on_task_add(self, text: str) -> None:
        """处理添加任务事件"""
        pass
    
    @abstractmethod
    def on_task_toggle(self, task_id: str) -> None:
        """处理切换任务事件"""
        pass
    
    @abstractmethod
    def on_task_delete(self, task_id: str) -> None:
        """处理删除任务事件"""
        pass
    
    @abstractmethod
    def on_weather_refresh(self) -> None:
        """处理刷新天气事件"""
        pass


class IConfiguration(ABC):
    """配置接口"""
    
    @abstractmethod
    def get_storage_config(self) -> Dict[str, Any]:
        """获取存储配置"""
        pass
    
    @abstractmethod
    def get_weather_config(self) -> Dict[str, Any]:
        """获取天气配置"""
        pass
    
    @abstractmethod
    def get_ui_config(self) -> Dict[str, Any]:
        """获取UI配置"""
        pass