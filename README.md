# AI食事管理アプリ

Ruby on Rails 7 (API mode) + React (Vite / TypeScript) + MySQL による食事記録Webアプリです。

## 機能

- ユーザー登録・ログイン・ログアウト（セッション認証）
- 食事記録の作成・一覧・削除（CRUD）
- バリデーションエラーの日本語表示
- フラッシュメッセージ（画面上部）
- パスワード表示/非表示トグル

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| バックエンド | Ruby on Rails 7.2 (API mode) |
| フロントエンド | React 18 + Vite + TypeScript |
| 認証 | Devise + セッションCookie |
| DB | MySQL 8.0 |
| 開発環境 | Docker / Docker Compose |

## ディレクトリ構成

```
rails-react-app/
├── docker-compose.yml
├── api/                          # Rails API
│   ├── Dockerfile
│   ├── Dockerfile.prod           # 本番用（ECSデプロイ向け）
│   ├── app/
│   │   └── controllers/api/
│   │       ├── sessions_controller.rb      # ログイン・ログアウト
│   │       ├── registrations_controller.rb # 新規登録
│   │       ├── meals_controller.rb         # 食事記録CRUD
│   │       └── users_controller.rb         # ログイン状態確認
│   └── db/schema.rb
└── front/                        # React + Vite
    └── src/
        ├── App.tsx
        ├── components/
        │   ├── LoginPage.tsx
        │   ├── SignupPage.tsx
        │   ├── MealList.tsx
        │   ├── MealForm.tsx
        │   └── Header.tsx
        └── api/
            ├── auth.ts
            └── meals.ts
```

## ローカル開発環境のセットアップ

### 前提条件

- Docker
- Docker Compose

### 手順

```bash
# 1. リポジトリをクローン
git clone <リポジトリURL>
cd rails-react-app

# 2. セットアップスクリプトを実行（初回のみ）
bash setup.sh
```

コンテナのビルド・起動・DBマイグレーションまで自動で行います。

### アクセス先

| サービス | URL |
|---------|-----|
| React (フロント) | http://localhost:5173 |
| Rails API | http://localhost:3000 |

## よく使うコマンド

```bash
# コンテナ起動
docker compose up

# バックグラウンド起動
docker compose up -d

# 停止
docker compose down

# DBデータごと削除
docker compose down -v

# マイグレーション
docker compose exec api rails db:migrate

# Railsコンソール
docker compose exec api rails console

# ログ確認
docker compose logs -f api
docker compose logs -f front
```

## 環境変数

docker-compose.yml にデフォルト値が設定されているため、ローカル開発では追加設定不要です。

| 変数 | デフォルト値 | 説明 |
|------|-------------|------|
| `DATABASE_HOST` | `db` | MySQLホスト |
| `DATABASE_PASSWORD` | `password` | MySQLパスワード |
| `CORS_ORIGINS` | `http://localhost:5173` | CORS許可オリジン |
| `FRONTEND_URL` | `http://localhost:5173` | フロントエンドURL |
| `VITE_API_URL` | `http://localhost:3000` | APIのベースURL |

## トラブルシューティング

### DBに接続できない

```bash
docker compose up db
# dbが起動してからapiを起動する
docker compose up api front
```

### `server.pid` エラーで Rails が起動しない

```bash
rm api/tmp/pids/server.pid
docker compose up
```

### node_modules が壊れている

```bash
docker compose down -v
docker compose build front
docker compose up
```
