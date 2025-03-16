# 画像分類 API

## 1. 概要

- このプロジェクトは、画像分類 API(モックサーバー) を通じて画像を分類し、その結果をデータベースに保存します。

## 2. 前提条件

以下のソフトウェアがインストールされていることが前提となります：

- Node.js がインストールされていること
- PostgreSQL がインストールされており、動作していること

## 3. 仕様技術

- Node.js
- Express.js
- PostgreSQL

## 4. インストール手順

① 依存関係をインストールします。

```bash
npm install
```

② DB 接続先を修正します。

```bash
DATABASE_URL="postgresql://{user-name}:{password}@localhost:{port}/{db-name}?schema=public"
```

③ マイグレーションファイルを実行します。

```bash
npx prisma migrate deploy
```

## 5. API リクエスト例

以下のように curl を使って画像を分類するリクエストを送信します。

```bash
curl -X POST http://localhost:3000/classify -H "Content-Type: application/json"  -d '{"image_path": "test_image.jpg"}'
```

## 6. 出力例

リクエストが成功した場合の出力例は以下の通りです。

```json
{
  "success": true,
  "message": "Data saved",
  "data": {
    "id": 1,
    "imagePath": "test_image.jpg",
    "success": true,
    "message": "success",
    "class": 4,
    "confidence": 0.0536,
    "requestTimestamp": "2025-03-16T13:42:09.640Z",
    "responseTimestamp": "2025-03-16T13:42:09.640Z"
  }
}
```

image_path を指定しなかった場合の出力例は以下の通りです。

```json
{ "success": false, "message": "image_path is required" }
```

## 7. AiAnalysisLog テーブル

AiAnalysisLog テーブルのスキーマは以下の通りです：
| 列名 | タイプ | 制約 |
| ----------------- | ---------------- | ----------------------------------- |
| id | SERIAL | NOT NULL, PRIMARY KEY |
| imagePath | TEXT | NOT NULL |
| success | BOOLEAN | NOT NULL |
| message | TEXT | NULL |
| class | INTEGER | NULL |
| confidence | DOUBLE PRECISION | NULL |
| requestTimestamp | TIMESTAMP(3) | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| responseTimestamp | TIMESTAMP(3) | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
