const express = require("express");
const app = express();

// หน้าแรกตอบกลับว่า bot ยังทำงาน
app.get("/", (req, res) => {
  res.send("Bot is running 24/7!");
});

// ใช้พอร์ตจาก Replit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is live on port ${PORT}`));
