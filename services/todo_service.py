#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Todo服务实现
实现Todo业务逻辑
"""

import uuid
from datetime import datetime
from typing import List, Optional
from core.interfaces import ITodoService, ITaskRepository, Task


class TodoService(ITodoService):
    """Todo服务实现"""
    
    def __init__(self, task_repository: ITaskRepository):
        self.repository = task_repository
    
    def create_task(self, text: str) -> Optional[Task]:
        """创建任务"""
        if not text or not text.strip():
            return None
        
        task = Task(
            id=f"task-{uuid.uuid4().hex[:8]}",
            text=text.strip(),
            completed=False,
            created_at=datetime.now()
        )
        
        try:
            self.repository.save_task(task)
            return task
        except Exception as e:
            print(f"创建任务失败: {e}")
            return None
    
    def toggle_task(self, task_id: str) -> Optional[Task]:
        """切换任务状态"""
        task = self.repository.get_task(task_id)
        if not task:
            return None
        
        task.completed = not task.completed
        task.updated_at = datetime.now()
        
        try:
            success = self.repository.update_task(task)
            return task if success else None
        except Exception as e:
            print(f"切换任务状态失败: {e}")
            return None
    
    def delete_task(self, task_id: str) -> bool:
        """删除任务"""
        try:
            return self.repository.delete_task(task_id)
        except Exception as e:
            print(f"删除任务失败: {e}")
            return False
    
    def get_all_tasks(self) -> List[Task]:
        """获取所有任务"""
        try:
            return self.repository.get_all_tasks()
        except Exception as e:
            print(f"获取任务列表失败: {e}")
            return []
    
    def update_task_text(self, task_id: str, text: str) -> Optional[Task]:
        """更新任务文本"""
        if not text or not text.strip():
            return None
        
        task = self.repository.get_task(task_id)
        if not task:
            return None
        
        task.text = text.strip()
        task.updated_at = datetime.now()
        
        try:
            success = self.repository.update_task(task)
            return task if success else None
        except Exception as e:
            print(f"更新任务文本失败: {e}")
            return None
    
    def get_completed_tasks(self) -> List[Task]:
        """获取已完成任务"""
        all_tasks = self.get_all_tasks()
        return [task for task in all_tasks if task.completed]
    
    def get_pending_tasks(self) -> List[Task]:
        """获取待完成任务"""
        all_tasks = self.get_all_tasks()
        return [task for task in all_tasks if not task.completed]
    
    def get_task_stats(self) -> dict:
        """获取任务统计"""
        all_tasks = self.get_all_tasks()
        completed = len([t for t in all_tasks if t.completed])
        pending = len(all_tasks) - completed
        
        return {
            "total": len(all_tasks),
            "completed": completed,
            "pending": pending,
            "completion_rate": completed / len(all_tasks) if all_tasks else 0
        }