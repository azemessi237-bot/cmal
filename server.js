
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "30kb" }));

const MODEL = "gemini-3.8-flash";

const SYSTEM_PROMPT = `
Sen CmAl adında Türkçe konuşan, yardımcı, doğal ve
samimi bir yapay zekâ asistanısın.

Kurallar:
- Kullanıcıya açık, anlaşılır ve doğru cevaplar ver.
- Türkçe konuş; kullanıcı başka dil isterse o dile geç.
- Matematik, bilim, tarih, teknoloji, yazılım ve günlük
  sohbet konularında yardımcı ol.
- Emin olmadığın bilgileri kesinmiş gibi sunma.
- Kullanıcı kaba konuşursa sakin ve saygılı cevap ver.
- Kendini CmAl olarak tanıt.
- Gereksiz yere aynı cümleleri tekrarlama.
`;

app.get("/", (req, res) => {
  res.send("CmAl AI Server aktif! 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", ai: "CmAl" });
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
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
        error: "Gemini API anahtarı sunucuda bulunamadı."
      });
    }

    const previous = Array.isArray(req.body.history)
      ? req.body.history.slice(-12)
      : [];

    const history = previous
      .filter(item =>
        item &&
        ["user", "model"].includes(item.role) &&
        typeof item.text === "string"
      )
      .map(item => ({
        role: item.role,
        parts: [{ text: item.text.slice(0, 4000) }]
      }));

    const contents = [
      ...history,
      {
        role: "user",
        parts: [{ text: message.trim() }]
      }
    ];

    console.log("CmAl mesaj aldı.");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API hatası:", data);

      return res.status(502).json({
        error: "Gemini cevap veremedi. Sunucu loglarını kontrol et."
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({
        error: "Gemini boş cevap döndürdü."
      });
    }

    console.log("CmAl cevap oluşturdu.");

    res.json({ reply });

  } catch (error) {
    console.error("CmAl sunucu hatası:", error);

    res.status(500).json({
      error: "Sunucuda bir hata oluştu."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("CmAl AI çalışıyor: " + PORT);
});
