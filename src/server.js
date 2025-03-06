require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json()); // JSON パース用ミドルウェア

// 画像分類 API のエンドポイント
const AI_API_URL = process.env.AI_API_URL;

// 画像分類のリクエストとデータ保存のエンドポイント
app.post("/classify", async (req, res) => {
  const { image_path } = req.body;

  if (!image_path) {
    return res.status(400).json({ success: false, message: "image_path is required" });
  }

  try {
    // AI API にリクエスト送信
    const response = await axios.post(AI_API_URL, { image_path });
    const result = response.data;

    // 成功・失敗の判定
    const success = result.success;
    const message = result.message || "Unknown error";
    const classId = result.estimated_data?.class || null;
    const confidence = result.estimated_data?.confidence || null;

    // データベースに保存
    const logEntry = await prisma.aiAnalysisLog.create({
      data: {
        imagePath: image_path,
        success: success,
        message: message,
        class: classId,
        confidence: confidence,
        requestTimestamp: new Date(),
        responseTimestamp: new Date(),
      },
    });

    res.json({ success: true, message: "Data saved", data: logEntry });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
