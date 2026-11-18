
const API_URL = "https://cmal.onrender.com/chat";

function ask(text) {
  const input = document.getElementById("msg");
  input.value = text;
  sendMessage();
}

function addMessage(text, type) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");

  div.className = "message " + type;
  div.textContent = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  return div;
}

async function sendMessage() {
  const input = document.getElementById("msg");
  const text = input.value.trim();

  if (!text) return;

  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  addMessage(text, "user");
  input.value = "";

  const loading = addMessage("CmAl düşünüyor...", "bot");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Sunucu hatası: " + response.status);
    }

    loading.textContent = data.reply || "Cevap alınamadı.";

  } catch (error) {
    loading.textContent = "Hata: " + error.message;
    console.error("CmAl:", error);
  }
}

function newChat() {
  const chat = document.getElementById("chat");

  chat.innerHTML = `
    <section class="welcome" id="welcome">
      <div class="symbol">C</div>
      <h1>Nasıl yardımcı olabilirim?</h1>
      <p>Merhaba! Ben CmAl. Birlikte düşünelim, keşfedelim ve üretelim.</p>

      <div class="suggestions">
        <button class="suggestion" onclick="ask('Bana bir fikir ver')">✦ Bana bir fikir ver</button>
        <button class="suggestion" onclick="ask('Kodlama öğrenmek istiyorum')">◈ Kodlama öğren</button>
        <button class="suggestion" onclick="ask('Bir hikaye anlat')">✧ Bir hikâye anlat</button>
        <button class="suggestion" onclick="ask('Bilim hakkında konuşalım')">◎ Bilimi keşfet</button>
      </div>
    </section>
  `;
}
