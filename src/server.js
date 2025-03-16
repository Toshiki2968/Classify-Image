require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// リクエストボディの解析
app.use(express.json());

// 画像分類 API のエンドポイント
const AI_API_URL = process.env.AI_API_URL;

app.post("/classify", async (req, res) => {
  const { image_path } = req.body;

  // 画像ファイルPathがなければエラーを返す
  if (!image_path) {
    return res
      .status(400)
      .json({ success: false, message: "image_path is required" });
  }

  try {
    // 画像分類 API にリクエスト送信
    const response = await axios.post(AI_API_URL, { image_path });
    const result = response.data;

    const success = result.success;
    const message = result.message || "Unknown error";
    const classId = result.estimated_data?.class || null;
    const confidence = result.estimated_data?.confidence || null;

    const aiAnalysisLog = await prisma.aiAnalysisLog.create({
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

    res.json({ success: true, message: "Data saved", data: aiAnalysisLog });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
