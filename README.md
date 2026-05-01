# Rails API + React + Vite (Docker)

Ruby on Rails 7 (API mode) + React + Vite + MySQL 8.0 の開発環境です。

## ディレクトリ構成

```
rails-react-app/
├── docker-compose.yml
├── setup.sh          # 初回セットアップスクリプト
├── api/              # Rails API
│   ├── Dockerfile
│   ├── Gemfile
│   ├── Gemfile.lock
│   └── entrypoint.sh
└── front/            # React + Vite
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        └── App.jsx
```

## ポート

| サービス | ポート |
|---------|--------|
| Rails API | http://localhost:3000 |
| React (Vite) | http://localhost:5173 |
| MySQL | localhost:3306 |

---

## 初回セットアップ（初めて起動するとき）

### 方法1: セットアップスクリプトを使う（推奨）

```bash
cd rails-react-app
bash setup.sh
```

スクリプトが以下を自動実行します:
1. Dockerイメージのビルド
2. `rails new` で Rails API アプリを作成
3. `database.yml` の設定（Docker向け）
4. `rack-cors` の有効化
5. `cors.rb` の設定
6. データベースの作成

### 方法2: 手動でセットアップ

```bash
# 1. イメージをビルド
docker compose build

# 2. Rails アプリを作成
docker compose run --no-deps --rm api rails new . --force --database=mysql --api --skip-git

# 3. database.yml を編集（以下の内容に書き換え）
```

`api/config/database.yml` を以下の内容にする:

```yaml
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
```

```bash
# 4. Gemfile の rack-cors を有効化
# api/Gemfile の下記行のコメントを外す
#   # gem "rack-cors"  →  gem "rack-cors"

# 5. cors.rb を設定（api/config/initializers/cors.rb）
```

`api/config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('CORS_ORIGINS', 'http://localhost:5173')

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

```bash
# 6. 再ビルドしてDBを作成
docker compose build api
docker compose run --rm api rails db:create
```

---

## 通常の起動・停止

```bash
# 起動
docker compose up

# バックグラウンドで起動
docker compose up -d

# 停止
docker compose down

# 停止 + DBデータも削除
docker compose down -v
```

---

## よく使うコマンド

### Rails

```bash
# マイグレーション
docker compose run --rm api rails db:migrate

# コンソール
docker compose run --rm api rails console

# ジェネレーター
docker compose run --rm api rails generate model User name:string

# Bundleインストール（Gemfile変更後）
docker compose run --rm api bundle install
docker compose build api
```

### React / Vite

```bash
# パッケージ追加（例: axios）
docker compose run --rm front npm install axios

# フロント側のログ確認
docker compose logs -f front
```

---

## ヘルスチェックエンドポイント（任意）

フロントから API に疎通確認する場合、Rails 側に以下を追加する:

`api/config/routes.rb`:

```ruby
Rails.application.routes.draw do
  namespace :api do
    get 'health', to: proc { [200, { 'Content-Type' => 'application/json' }, ['{"status":"ok"}']] }
  end
end
```

確認:
```bash
curl http://localhost:3000/api/health
# => {"status":"ok"}
```

---

## 環境変数

| 変数 | デフォルト値 | 説明 |
|------|-------------|------|
| `DATABASE_HOST` | `db` | MySQL ホスト |
| `DATABASE_PASSWORD` | `password` | MySQL rootパスワード |
| `CORS_ORIGINS` | `http://localhost:5173` | CORS許可オリジン |
| `VITE_API_URL` | `http://localhost:3000` | フロントからのAPI URL |

---

## トラブルシューティング

### DB接続エラーが出る場合

```bash
# DB コンテナが起動しているか確認
docker compose ps

# ヘルスチェックが通るまで待ってから再試行
docker compose up db
```

### `server.pid` エラーで Rails が起動しない場合

```bash
rm api/tmp/pids/server.pid
docker compose up api
```

### node_modules が古い場合

```bash
docker compose down -v
docker compose build front
docker compose up
```
