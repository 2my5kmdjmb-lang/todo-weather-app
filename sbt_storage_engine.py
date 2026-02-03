#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
基于SBT算法的简化存储引擎
支持基础的增删改查操作和磁盘持久化
"""

import json
import os
import pickle
from typing import Any, Optional, List, Tuple


class SBTNode:
    """SBT树节点"""
    
    def __init__(self, key: str, value: Any):
        self.key = key
        self.value = value
        self.left: Optional['SBTNode'] = None
        self.right: Optional['SBTNode'] = None
        self.size = 1  # 子树大小


class SBTTree:
    """Size Balanced Tree实现"""
    
    def __init__(self):
        self.root: Optional[SBTNode] = None
    
    def _get_size(self, node: Optional[SBTNode]) -> int:
        """获取节点子树大小"""
        return node.size if node else 0
    
    def _update_size(self, node: SBTNode) -> None:
        """更新节点子树大小"""
        node.size = 1 + self._get_size(node.left) + self._get_size(node.right)
    
    def _left_rotate(self, node: SBTNode) -> SBTNode:
        """左旋转"""
        right_child = node.right
        node.right = right_child.left
        right_child.left = node
        
        self._update_size(node)
        self._update_size(right_child)
        
        return right_child
    
    def _right_rotate(self, node: SBTNode) -> SBTNode:
        """右旋转"""
        left_child = node.left
        node.left = left_child.right
        left_child.right = node
        
        self._update_size(node)
        self._update_size(left_child)
        
        return left_child
    
    def _maintain(self, node: SBTNode) -> SBTNode:
        """维护SBT性质"""
        if not node:
            return node
        
        left_size = self._get_size(node.left)
        right_size = self._get_size(node.right)
        
        # 左子树过大的情况
        if node.left and self._get_size(node.left.left) > right_size:
            node = self._right_rotate(node)
        elif node.left and self._get_size(node.left.right) > right_size:
            node.left = self._left_rotate(node.left)
            node = self._right_rotate(node)
        
        # 右子树过大的情况
        elif node.right and self._get_size(node.right.right) > left_size:
            node = self._left_rotate(node)
        elif node.right and self._get_size(node.right.left) > left_size:
            node.right = self._right_rotate(node.right)
            node = self._left_rotate(node)
        
        return node
    
    def _insert(self, node: Optional[SBTNode], key: str, value: Any) -> SBTNode:
        """插入节点"""
        if not node:
            return SBTNode(key, value)
        
        if key < node.key:
            node.left = self._insert(node.left, key, value)
        elif key > node.key:
            node.right = self._insert(node.right, key, value)
        else:
            # 更新已存在的键
            node.value = value
            return node
        
        self._update_size(node)
        return self._maintain(node)
    
    def _find_min(self, node: SBTNode) -> SBTNode:
        """找到最小节点"""
        while node.left:
            node = node.left
        return node
    
    def _delete(self, node: Optional[SBTNode], key: str) -> Optional[SBTNode]:
        """删除节点"""
        if not node:
            return None
        
        if key < node.key:
            node.left = self._delete(node.left, key)
        elif key > node.key:
            node.right = self._delete(node.right, key)
        else:
            # 找到要删除的节点
            if not node.left:
                return node.right
            elif not node.right:
                return node.left
            else:
                # 有两个子节点，找到右子树的最小节点替换
                min_node = self._find_min(node.right)
                node.key = min_node.key
                node.value = min_node.value
                node.right = self._delete(node.right, min_node.key)
        
        self._update_size(node)
        return self._maintain(node)
    
    def _search(self, node: Optional[SBTNode], key: str) -> Optional[Any]:
        """搜索节点"""
        if not node:
            return None
        
        if key == node.key:
            return node.value
        elif key < node.key:
            return self._search(node.left, key)
        else:
            return self._search(node.right, key)
    
    def _inorder(self, node: Optional[SBTNode], result: List[Tuple[str, Any]]) -> None:
        """中序遍历"""
        if node:
            self._inorder(node.left, result)
            result.append((node.key, node.value))
            self._inorder(node.right, result)
    
    def insert(self, key: str, value: Any) -> None:
        """插入键值对"""
        self.root = self._insert(self.root, key, value)
    
    def delete(self, key: str) -> bool:
        """删除键值对"""
        old_root = self.root
        self.root = self._delete(self.root, key)
        return old_root != self.root or (old_root and self._search(old_root, key) is not None)
    
    def search(self, key: str) -> Optional[Any]:
        """搜索键值对"""
        return self._search(self.root, key)
    
    def update(self, key: str, value: Any) -> bool:
        """更新键值对"""
        if self.search(key) is not None:
            self.insert(key, value)
            return True
        return False
    
    def get_all(self) -> List[Tuple[str, Any]]:
        """获取所有键值对"""
        result = []
        self._inorder(self.root, result)
        return result
    
    def size(self) -> int:
        """获取树的大小"""
        return self._get_size(self.root)


class SBTStorageEngine:
    """基于SBT的存储引擎"""
    
    def __init__(self, data_file: str = "sbt_storage.dat"):
        self.data_file = data_file
        self.tree = SBTTree()
        self.load_from_disk()
    
    def insert(self, key: str, value: Any) -> None:
        """插入数据"""
        self.tree.insert(key, value)
        self.save_to_disk()
    
    def delete(self, key: str) -> bool:
        """删除数据"""
        success = self.tree.delete(key)
        if success:
            self.save_to_disk()
        return success
    
    def search(self, key: str) -> Optional[Any]:
        """查询数据"""
        return self.tree.search(key)
    
    def update(self, key: str, value: Any) -> bool:
        """更新数据"""
        success = self.tree.update(key, value)
        if success:
            self.save_to_disk()
        return success
    
    def get_all(self) -> List[Tuple[str, Any]]:
        """获取所有数据"""
        return self.tree.get_all()
    
    def size(self) -> int:
        """获取数据量"""
        return self.tree.size()
    
    def save_to_disk(self) -> None:
        """保存数据到磁盘"""
        try:
            data = self.tree.get_all()
            with open(self.data_file, 'wb') as f:
                pickle.dump(data, f)
        except Exception as e:
            print(f"保存数据失败: {e}")
    
    def load_from_disk(self) -> None:
        """从磁盘加载数据"""
        if not os.path.exists(self.data_file):
            return
        
        try:
            with open(self.data_file, 'rb') as f:
                data = pickle.load(f)
                for key, value in data:
                    self.tree.insert(key, value)
        except Exception as e:
            print(f"加载数据失败: {e}")
    
    def clear(self) -> None:
        """清空所有数据"""
        self.tree = SBTTree()
        if os.path.exists(self.data_file):
            os.remove(self.data_file)


def main():
    """测试存储引擎"""
    print("=== SBT存储引擎测试 ===")
    
    # 创建存储引擎实例
    engine = SBTStorageEngine("test_storage.dat")
    
    # 测试插入
    print("\n1. 测试插入操作:")
    test_data = [
        ("user1", {"name": "张三", "age": 25}),
        ("user2", {"name": "李四", "age": 30}),
        ("user3", {"name": "王五", "age": 28}),
        ("product1", {"name": "笔记本电脑", "price": 5999}),
        ("product2", {"name": "手机", "price": 3999}),
    ]
    
    for key, value in test_data:
        engine.insert(key, value)
        print(f"插入: {key} -> {value}")
    
    print(f"当前数据量: {engine.size()}")
    
    # 测试查询
    print("\n2. 测试查询操作:")
    for key in ["user1", "product1", "nonexistent"]:
        result = engine.search(key)
        print(f"查询 {key}: {result}")
    
    # 测试更新
    print("\n3. 测试更新操作:")
    success = engine.update("user1", {"name": "张三", "age": 26})
    print(f"更新 user1: {'成功' if success else '失败'}")
    print(f"更新后 user1: {engine.search('user1')}")
    
    # 测试删除
    print("\n4. 测试删除操作:")
    success = engine.delete("user2")
    print(f"删除 user2: {'成功' if success else '失败'}")
    print(f"删除后查询 user2: {engine.search('user2')}")
    print(f"删除后数据量: {engine.size()}")
    
    # 测试获取所有数据
    print("\n5. 获取所有数据:")
    all_data = engine.get_all()
    for key, value in all_data:
        print(f"{key}: {value}")
    
    # 测试持久化
    print("\n6. 测试持久化:")
    print("创建新的存储引擎实例...")
    engine2 = SBTStorageEngine("test_storage.dat")
    print(f"新实例数据量: {engine2.size()}")
    print("新实例中的数据:")
    for key, value in engine2.get_all():
        print(f"{key}: {value}")
    
    # 清理测试文件
    engine.clear()
    print("\n测试完成，已清理测试数据")


if __name__ == "__main__":
    main()