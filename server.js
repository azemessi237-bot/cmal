const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("CmAl AI Server aktif! 🚀");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Mesaj gerekli."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Mesaj çok uzun."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "AI sunucu anahtarı ayarlanmamış."
      });
    }

    const model =
      process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("AI servis hatası:", data);
      return res.status(502).json({
        error: "AI şu anda cevap veremiyor."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "Cevap oluşturulamadı.";

    res.json({ reply });

  } catch (error) {
    console.error("CmAl sunucu hatası:", error.message);

    res.status(500).json({
      error: "Sunucuda bir hata oluştu."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("CmAl AI Server çalışıyor: " + PORT);
});
