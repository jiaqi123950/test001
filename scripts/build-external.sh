#!/usr/bin/env bash
# 外部环境构建脚本（Vercel / 自有服务器等）
# 不依赖妙搭平台内部工具
set -euo pipefail

ROOT_DIR="$(pwd)"
DIST_DIR="$ROOT_DIR/dist"

echo "=== 构建开始 ==="

# 清理 dist
rm -rf "$DIST_DIR"

# 构建 server
echo "→ 构建服务端 (NestJS)..."
NODE_OPTIONS="--max-old-space-size=8192" npm run build:server

# 构建 client
echo "→ 构建客户端 (Vite)..."
NODE_OPTIONS="--max-old-space-size=8192" npm run build:client

# 准备产物结构
echo "→ 准备构建产物..."

# 将 client 的 HTML 移到 dist/dist/client，保证视图路径正确
if [ -d "$DIST_DIR/client" ]; then
  mkdir -p "$DIST_DIR/dist/client"
  # 复制 public 资源
  if [ -d "$ROOT_DIR/client/public" ]; then
    cp -R "$ROOT_DIR/client/public/." "$DIST_DIR/dist/client/"
  fi
  # 移动 HTML 入口文件
  find "$DIST_DIR/client" -maxdepth 1 -name "*.html" -exec mv {} "$DIST_DIR/dist/client/" \;
fi

# 拷贝 .env（如果存在）
if [ -f "$ROOT_DIR/.env" ]; then
  cp "$ROOT_DIR/.env" "$DIST_DIR/"
fi

echo ""
echo "=== 构建完成 ==="
echo "产物目录: $DIST_DIR"
du -sh "$DIST_DIR"
