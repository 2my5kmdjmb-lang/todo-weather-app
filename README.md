# 项目结构说明

## 项目概述
集成了Todo应用、天气预览和SBT存储引擎的完整项目。

## 文件结构
```
├── README.md                    # 项目说明
├── index.html                   # Todo & 天气应用 (单文件架构)
├── sbt_storage_engine.py        # SBT存储引擎
├── core/                        # 核心接口模块
│   ├── __init__.py
│   ├── interfaces.py            # 核心接口定义
│   ├── storage_adapter.py       # 存储适配器
│   └── weather_service.py       # 天气服务接口
├── storage/                     # 存储实现
│   ├── __init__.py
│   ├── sbt_engine.py           # SBT引擎封装
│   └── local_storage.py        # 浏览器存储封装
├── services/                    # 服务层
│   ├── __init__.py
│   ├── todo_service.py         # Todo业务逻辑
│   └── weather_service.py      # 天气服务实现
└── tests/                       # 测试文件
    ├── __init__.py
    ├── test_sbt_engine.py
    ├── test_todo_service.py
    └── test_weather_service.py
```

## 核心特性
- 黑白极简UI设计
- SBT算法存储引擎
- 天气预览功能
- 数据持久化
- 模块化架构