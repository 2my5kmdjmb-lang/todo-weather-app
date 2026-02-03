#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
主应用程序
整合所有组件的主入口
"""

import asyncio
from datetime import datetime

# 导入核心组件
from storage.sbt_engine import SBTEngineAdapter
from core.storage_adapter import TaskStorageAdapter
from services.todo_service import TodoService
from services.weather_service import MockWeatherService


class Application:
    """主应用程序类"""
    
    def __init__(self):
        # 初始化存储引擎
        self.storage_engine = SBTEngineAdapter("app_data.dat")
        
        # 初始化任务存储适配器
        self.task_repository = TaskStorageAdapter(self.storage_engine)
        
        # 初始化服务
        self.todo_service = TodoService(self.task_repository)
        self.weather_service = MockWeatherService()
    
    async def run_demo(self):
        """运行演示程序"""
        print("=== 集成应用演示 ===\n")
        
        # 1. 天气服务演示
        print("1. 获取天气信息:")
        try:
            weather = await self.weather_service.get_current_weather()
            print(f"   位置: {weather.location}")
            print(f"   温度: {weather.temperature}°C")
            print(f"   天气: {weather.description} {weather.icon}")
            print(f"   湿度: {weather.humidity}%")
            print(f"   风速: {weather.wind_speed}km/h")
            print(f"   气压: {weather.pressure}hPa")
        except Exception as e:
            print(f"   获取天气失败: {e}")
        
        print()
        
        # 2. Todo服务演示
        print("2. Todo功能演示:")
        
        # 创建任务
        tasks_to_create = [
            "完成项目文档",
            "测试SBT存储引擎",
            "优化天气服务",
            "编写单元测试"
        ]
        
        print("   创建任务:")
        for task_text in tasks_to_create:
            task = self.todo_service.create_task(task_text)
            if task:
                print(f"   ✓ {task.text} (ID: {task.id})")
        
        print()
        
        # 获取所有任务
        all_tasks = self.todo_service.get_all_tasks()
        print(f"   当前任务数量: {len(all_tasks)}")
        
        # 完成一些任务
        if len(all_tasks) >= 2:
            print("   完成任务:")
            for i in [0, 2]:  # 完成第1和第3个任务
                task = self.todo_service.toggle_task(all_tasks[i].id)
                if task:
                    print(f"   ✓ 已完成: {task.text}")
        
        print()
        
        # 显示任务统计
        stats = self.todo_service.get_task_stats()
        print("   任务统计:")
        print(f"   总任务: {stats['total']}")
        print(f"   已完成: {stats['completed']}")
        print(f"   待完成: {stats['pending']}")
        print(f"   完成率: {stats['completion_rate']:.1%}")
        
        print()
        
        # 3. 存储引擎演示
        print("3. 存储引擎状态:")
        print(f"   存储的数据项: {self.storage_engine.size()}")
        print(f"   存储文件: app_data.dat")
        
        # 显示存储的原始数据
        all_data = self.storage_engine.get_all()
        print(f"   数据键: {[key for key, _ in all_data]}")
        
        print()
        
        # 4. 持久化测试
        print("4. 持久化测试:")
        print("   重新创建应用实例...")
        
        # 创建新的应用实例
        new_app = Application()
        restored_tasks = new_app.todo_service.get_all_tasks()
        
        print(f"   恢复的任务数量: {len(restored_tasks)}")
        print("   恢复的任务:")
        for task in restored_tasks:
            status = "✓" if task.completed else "○"
            print(f"   {status} {task.text}")
        
        print("\n=== 演示完成 ===")
    
    def cleanup(self):
        """清理资源"""
        print("清理应用数据...")
        self.storage_engine.clear()


async def main():
    """主函数"""
    app = Application()
    
    try:
        await app.run_demo()
    except KeyboardInterrupt:
        print("\n程序被用户中断")
    except Exception as e:
        print(f"程序运行出错: {e}")
    finally:
        # 询问是否清理数据
        try:
            choice = input("\n是否清理测试数据? (y/N): ").strip().lower()
            if choice == 'y':
                app.cleanup()
        except:
            pass


def cli_main():
    """命令行入口点"""
    asyncio.run(main())


if __name__ == "__main__":
    cli_main()