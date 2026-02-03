#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SBT存储引擎测试
"""

import unittest
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from storage.sbt_engine import SBTEngineAdapter


class TestSBTEngine(unittest.TestCase):
    """SBT存储引擎测试"""
    
    def setUp(self):
        """测试前准备"""
        self.test_file = "test_sbt.dat"
        self.engine = SBTEngineAdapter(self.test_file)
    
    def tearDown(self):
        """测试后清理"""
        self.engine.clear()
        if os.path.exists(self.test_file):
            os.remove(self.test_file)
    
    def test_insert_and_search(self):
        """测试插入和查询"""
        self.engine.insert("key1", "value1")
        self.engine.insert("key2", {"name": "test", "value": 123})
        
        self.assertEqual(self.engine.search("key1"), "value1")
        self.assertEqual(self.engine.search("key2"), {"name": "test", "value": 123})
        self.assertIsNone(self.engine.search("nonexistent"))
    
    def test_update(self):
        """测试更新"""
        self.engine.insert("key1", "original")
        self.assertTrue(self.engine.update("key1", "updated"))
        self.assertEqual(self.engine.search("key1"), "updated")
        
        # 更新不存在的键
        self.assertFalse(self.engine.update("nonexistent", "value"))
    
    def test_delete(self):
        """测试删除"""
        self.engine.insert("key1", "value1")
        self.assertTrue(self.engine.delete("key1"))
        self.assertIsNone(self.engine.search("key1"))
        
        # 删除不存在的键
        self.assertFalse(self.engine.delete("nonexistent"))
    
    def test_get_all(self):
        """测试获取所有数据"""
        test_data = [("key1", "value1"), ("key2", "value2"), ("key3", "value3")]
        
        for key, value in test_data:
            self.engine.insert(key, value)
        
        all_data = self.engine.get_all()
        self.assertEqual(len(all_data), 3)
        
        # 检查数据是否按键排序
        keys = [item[0] for item in all_data]
        self.assertEqual(keys, sorted(keys))
    
    def test_size(self):
        """测试大小统计"""
        self.assertEqual(self.engine.size(), 0)
        
        self.engine.insert("key1", "value1")
        self.assertEqual(self.engine.size(), 1)
        
        self.engine.insert("key2", "value2")
        self.assertEqual(self.engine.size(), 2)
        
        self.engine.delete("key1")
        self.assertEqual(self.engine.size(), 1)
    
    def test_clear(self):
        """测试清空"""
        self.engine.insert("key1", "value1")
        self.engine.insert("key2", "value2")
        
        self.engine.clear()
        self.assertEqual(self.engine.size(), 0)
        self.assertIsNone(self.engine.search("key1"))


if __name__ == "__main__":
    unittest.main()