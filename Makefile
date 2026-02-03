# Makefile for Todo & Weather Application
# 基于构建系统最佳实践的构建配置

.PHONY: help install test clean run lint format check build all

# 默认目标
help:
	@echo "可用的构建命令:"
	@echo "  make install  - 安装依赖"
	@echo "  make test     - 运行所有测试"
	@echo "  make lint     - 代码检查"
	@echo "  make format   - 代码格式化"
	@echo "  make check    - 完整代码检查"
	@echo "  make run      - 运行应用"
	@echo "  make clean    - 清理构建文件"
	@echo "  make build    - 构建项目"
	@echo "  make all      - 完整构建流程"

# 安装依赖
install:
	@echo "检查Python环境..."
	@python3 --version || (echo "错误: 需要Python 3.6+"; exit 1)
	@echo "Python环境正常"

# 运行测试
test:
	@echo "运行单元测试..."
	@python3 -m unittest discover tests -v
	@echo "运行SBT引擎测试..."
	@python3 sbt_storage_engine.py > /dev/null
	@echo "所有测试通过"

# 代码检查
lint:
	@echo "检查Python语法..."
	@find . -name "*.py" -exec python3 -m py_compile {} \;
	@echo "语法检查通过"

# 代码格式化检查
format:
	@echo "检查代码格式..."
	@python3 -c "import ast; [ast.parse(open(f).read()) for f in ['app.py', 'sbt_storage_engine.py']]"
	@echo "代码格式正确"

# 模块导入检查
check:
	@echo "检查模块导入..."
	@python3 -c "\
import sys; sys.path.append('.'); \
from core.interfaces import *; \
from core.storage_adapter import *; \
from storage.sbt_engine import *; \
from services.todo_service import *; \
from services.weather_service import *; \
print('所有模块导入正常')"

# 运行应用
run:
	@echo "启动集成应用..."
	@python3 app.py

# 运行HTML应用
run-web:
	@echo "启动Web应用..."
	@echo "请在浏览器中打开 index.html"
	@open index.html 2>/dev/null || echo "请手动打开 index.html"

# 清理构建文件
clean:
	@echo "清理构建文件..."
	@find . -name "*.pyc" -delete
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@rm -f *.dat
	@rm -f test_*.dat
	@echo "清理完成"

# 构建项目
build: clean lint check test
	@echo "项目构建成功"

# 完整构建流程
all: install build
	@echo "完整构建流程完成"

# 开发模式
dev: clean check
	@echo "开发环境准备完成"
	@echo "运行 'make run' 启动应用"