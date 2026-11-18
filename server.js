
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("CmAl AI Server aktif! 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    name: "CmAl",
    ai: "Gemini"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Lütfen bir mesaj yaz."
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
        error: "API anahtarı bulunamadı."
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
          system_instruction: {
            parts: [{
              text: "Sen CmAl adında yardımcı, samimi ve bilgili bir yapay zekâ asistanısın. Kullanıcıyla Türkçe konuş. Açık, anlaşılır ve faydalı cevaplar ver. Kullanıcıya saygılı davran."
            }]
          },
          contents: [
            {
              role: "user",
              parts: [
                { text: message }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API hatası:", data);

      return res.status(502).json({
        error: "Gemini şu anda cevap veremiyor. Biraz sonra tekrar dene."
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({
        error: "CmAl cevap oluşturamadı."
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("CmAl hatası:", error.message);

    res.status(500).json({
      error: "Sunucuda bir hata oluştu."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("CmAl AI Server çalışıyor: " + PORT);
});
