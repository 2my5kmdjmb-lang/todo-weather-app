#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
存储适配器
将SBT存储引擎适配为任务存储接口
"""

import json
from datetime import datetime
from typing import List, Optional
from .interfaces import ITaskRepository, IStorageEngine, Task


class TaskStorageAdapter(ITaskRepository):
    """任务存储适配器"""
    
    def __init__(self, storage_engine: IStorageEngine):
        self.storage = storage_engine
        self.task_prefix = "task:"
    
    def _task_key(self, task_id: str) -> str:
        """生成任务存储键"""
        return f"{self.task_prefix}{task_id}"
    
    def _serialize_task(self, task: Task) -> dict:
        """序列化任务对象"""
        return {
            "id": task.id,
            "text": task.text,
            "completed": task.completed,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat() if task.updated_at else None
        }
    
    def _deserialize_task(self, data: dict) -> Task:
        """反序列化任务对象"""
        return Task(
            id=data["id"],
            text=data["text"],
            completed=data["completed"],
            created_at=datetime.fromisoformat(data["created_at"]),
            updated_at=datetime.fromisoformat(data["updated_at"]) if data["updated_at"] else None
        )
    
    def save_task(self, task: Task) -> None:
        """保存任务"""
        key = self._task_key(task.id)
        data = self._serialize_task(task)
        self.storage.insert(key, data)
    
    def delete_task(self, task_id: str) -> bool:
        """删除任务"""
        key = self._task_key(task_id)
        return self.storage.delete(key)
    
    def get_task(self, task_id: str) -> Optional[Task]:
        """获取任务"""
        key = self._task_key(task_id)
        data = self.storage.search(key)
        if data:
            return self._deserialize_task(data)
        return None
    
    def get_all_tasks(self) -> List[Task]:
        """获取所有任务"""
        all_data = self.storage.get_all()
        tasks = []
        
        for key, data in all_data:
            if key.startswith(self.task_prefix):
                try:
                    task = self._deserialize_task(data)
                    tasks.append(task)
                except Exception as e:
                    print(f"反序列化任务失败: {e}")
        
        # 按创建时间排序
        tasks.sort(key=lambda t: t.created_at)
        return tasks
    
    def update_task(self, task: Task) -> bool:
        """更新任务"""
        task.updated_at = datetime.now()
        key = self._task_key(task.id)
        data = self._serialize_task(task)
        return self.storage.update(key, data)


class ConfigStorageAdapter:
    """配置存储适配器"""
    
    def __init__(self, storage_engine: IStorageEngine):
        self.storage = storage_engine
        self.config_key = "app:config"
    
    def save_config(self, config: dict) -> None:
        """保存配置"""
        self.storage.insert(self.config_key, config)
    
    def load_config(self) -> dict:
        """加载配置"""
        config = self.storage.search(self.config_key)
        return config if config else {}
    
    def update_config(self, key: str, value: any) -> None:
        """更新配置项"""
        config = self.load_config()
        config[key] = value
        self.save_config(config)