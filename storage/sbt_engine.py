#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SBT存储引擎封装
将原有的SBT存储引擎封装为标准接口
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sbt_storage_engine import SBTStorageEngine
from core.interfaces import IStorageEngine
from typing import Any, Optional, List, Tuple


class SBTEngineAdapter(IStorageEngine):
    """SBT存储引擎适配器"""
    
    def __init__(self, data_file: str = "app_storage.dat"):
        self.engine = SBTStorageEngine(data_file)
    
    def insert(self, key: str, value: Any) -> None:
        """插入数据"""
        self.engine.insert(key, value)
    
    def delete(self, key: str) -> bool:
        """删除数据"""
        return self.engine.delete(key)
    
    def search(self, key: str) -> Optional[Any]:
        """查询数据"""
        return self.engine.search(key)
    
    def update(self, key: str, value: Any) -> bool:
        """更新数据"""
        return self.engine.update(key, value)
    
    def get_all(self) -> List[Tuple[str, Any]]:
        """获取所有数据"""
        return self.engine.get_all()
    
    def size(self) -> int:
        """获取数据量"""
        return self.engine.size()
    
    def clear(self) -> None:
        """清空数据"""
        self.engine.clear()
    
    def backup(self, backup_file: str) -> bool:
        """备份数据"""
        try:
            import shutil
            shutil.copy2(self.engine.data_file, backup_file)
            return True
        except Exception as e:
            print(f"备份失败: {e}")
            return False
    
    def restore(self, backup_file: str) -> bool:
        """恢复数据"""
        try:
            import shutil
            shutil.copy2(backup_file, self.engine.data_file)
            # 重新加载数据
            self.engine = SBTStorageEngine(self.engine.data_file)
            return True
        except Exception as e:
            print(f"恢复失败: {e}")
            return False