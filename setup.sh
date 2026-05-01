#!/bin/bash
set -e

echo "================================================"
echo " Rails API + React + Vite セットアップ開始"
echo "================================================"

# 1. イメージのビルド
echo ""
echo "[1/6] Dockerイメージをビルド..."
docker compose build

# 2. Rails アプリを新規作成
echo ""
echo "[2/6] Railsアプリを初期化 (API mode)..."
docker compose run --no-deps --rm api rails new . --force --database=mysql --api --skip-git

# 3. database.yml を上書き設定
echo ""
echo "[3/6] database.yml をDocker向けに設定..."
cat > api/config/database.yml << 'YAML'
default: &default
  adapter: mysql2
  encoding: utf8mb4
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password: <%= ENV['DATABASE_PASSWORD'] %>
  host: <%= ENV.fetch('DATABASE_HOST') { 'db' } %>

development:
  <<: *default
  database: app_development

test:
  <<: *default
  database: app_test

production:
  <<: *default
  database: app_production
  password: <%= ENV['DATABASE_PASSWORD'] %>
YAML

# 4. rack-cors を有効化（Rails API mode では Gemfile にコメントアウトで含まれる）
echo ""
echo "[4/6] rack-cors を有効化..."
if grep -q '# gem "rack-cors"' api/Gemfile; then
  sed -i.bak 's/# gem "rack-cors"/gem "rack-cors"/' api/Gemfile
  rm -f api/Gemfile.bak
else
  echo 'gem "rack-cors"' >> api/Gemfile
fi

# 5. cors.rb を設定
echo ""
echo "[5/6] CORS設定を作成..."
cat > api/config/initializers/cors.rb << 'RUBY'
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('CORS_ORIGINS', 'http://localhost:5173')

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
RUBY

# 6. Gemfile更新後に再ビルド → DB作成
echo ""
echo "[6/6] 再ビルドしてデータベースを作成..."
docker compose build api
docker compose run --rm api rails db:create

echo ""
echo "================================================"
echo " セットアップ完了!"
echo "================================================"
echo ""
echo "次のコマンドで起動できます:"
echo "  docker compose up"
echo ""
echo "アクセス先:"
echo "  Rails API : http://localhost:3000"
echo "  React/Vite: http://localhost:5173"
echo "  MySQL     : localhost:3306"
echo ""
