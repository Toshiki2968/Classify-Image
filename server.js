require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');  // PostgreSQL 用のライブラリ
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // JSON パース用ミドルウェア

// PostgreSQL 接続プール
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// 画像分類 API のエンドポイント
const AI_API_URL = 'http://example.com/';

// 画像分類のリクエストとデータ保存のエンドポイント
app.post('/classify', async (req, res) => {
  const { image_path } = req.body;

  if (!image_path) {
    return res.status(400).json({ success: false, message: 'image_path is required' });
  }

  try {
    // AI API にリクエスト送信
    const response = await axios.post(AI_API_URL, { image_path });
    const result = response.data;

    // 成功・失敗の判定
    const success = result.success ? 1 : 0;
    const message = result.message || 'Unknown error';
    const classId = result.estimated_data?.class || null;
    const confidence = result.estimated_data?.confidence || null;
    
    // 現在のタイムスタンプ取得
    const requestTimestamp = new Date();
    const responseTimestamp = new Date();

    // データベースに保存
    const query = `
      INSERT INTO ai_analysis_log (image_path, success, message, class, confidence, request_timestamp, response_timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await pool.query(query, [image_path, success, message, classId, confidence, requestTimestamp, responseTimestamp]);

    res.json({ success: true, message: 'Data saved', data: result });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
