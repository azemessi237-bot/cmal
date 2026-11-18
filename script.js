
const API_URL = "https://cmal.onrender.com/chat";

let conversationHistory = [];
let isSending = false;

function addMessage(text, type) {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  return div;
}

function ask(text) {
  const input = document.getElementById("msg");
  input.value = text;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById("msg");
  const text = input.value.trim();

  if (!text || isSending) return;

  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  addMessage(text, "user");
  input.value = "";

  const loading = addMessage("CmAl düşünüyor...", "bot");

  isSending = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        history: conversationHistory
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Sunucu hatası");
    }

    const reply = data.reply || "Cevap alınamadı.";

    loading.textContent = reply;

    conversationHistory.push(
      { role: "user", text: text },
      { role: "model", text: reply }
    );

    conversationHistory = conversationHistory.slice(-12);

  } catch (error) {
    loading.textContent =
      "CmAl şu anda bağlantı kuramıyor. Biraz sonra tekrar dene.";

    console.error("CmAl bağlantı hatası:", error);

  } finally {
    isSending = false;
  }
}

function newChat() {
  conversationHistory = [];

  const chat = document.getElementById("chat");

  chat.innerHTML = `
    <div id="welcome">
      <h2>Merhaba, ben CmAl.</h2>
      <p>Sana nasıl yardımcı olabilirim?</p>
    </div>
  `;
}
