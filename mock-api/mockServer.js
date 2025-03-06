const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.json());

app.post("/analyze", (req, res) => {
  const { image_path } = req.body;
  if (!image_path) {
    return res.status(400).json({ success: false, message: "image_path is required", estimated_data: {} });
  }

  // ランダムに成功 or 失敗を返す
  if (Math.random() < 0.2) {
    return res.status(500).json({ success: false, message: "Error:E50012", estimated_data: {} });
  }

  res.json({
    success: true,
    message: "success",
    estimated_data: { class: Math.floor(Math.random() * 10), confidence: Math.random().toFixed(4) }
  });
});

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
