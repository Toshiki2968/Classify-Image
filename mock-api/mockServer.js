const express = require("express");
const app = express();
const PORT = 4000;

// リクエストボディの解析
app.use(express.json());

app.post("/analyze", (req, res) => {
  const { image_path } = req.body;

  // 画像ファイルPathがなければエラーを返す
  if (!image_path) {
    return res.status(400).json({
      success: false,
      message: "image_path is required",
      estimated_data: {},
    });
  }

  // レスポンス返却
  // ※class → 0～10までのランダム値
  // ※confidence → 0から1未満のランダム値(小数4桁へ丸める)
  res.json({
    success: true,
    message: "success",
    estimated_data: {
      class: Math.floor(Math.random() * 10),
      confidence: parseFloat(Math.random().toFixed(4)),
    },
  });
});

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
