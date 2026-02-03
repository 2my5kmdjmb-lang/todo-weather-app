#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
项目安装配置
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="todo-weather-app",
    version="1.0.0",
    author="Developer",
    description="基于SBT算法的Todo和天气应用",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
    python_requires=">=3.6",
    install_requires=[
        # 当前无外部依赖
    ],
    extras_require={
        "dev": [
            "pytest>=6.0.0",
            "black>=22.0.0",
            "flake8>=4.0.0",
        ],
        "weather": [
            "aiohttp>=3.8.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "todo-app=app:cli_main",
        ],
    },
)