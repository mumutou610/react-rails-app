#!/bin/bash
set -e

echo "================================================"
echo " セットアップ開始"
echo "================================================"

echo ""
echo "[1/2] コンテナを起動..."
docker compose up -d

echo ""
echo "[2/2] DBのマイグレーションを実行..."
# dbのヘルスチェックが通るまで待機
echo "DB起動待ち..."
until docker compose exec db mysqladmin ping -u root -ppassword --silent 2>/dev/null; do
  sleep 2
done

docker compose exec api rails db:create db:migrate

echo ""
echo "================================================"
echo " セットアップ完了!"
echo "================================================"
echo ""
echo "アクセス先:"
echo "  React (フロント): http://localhost:5173"
echo "  Rails API       : http://localhost:3000"
echo ""
echo "停止するには: docker compose down"
echo ""
