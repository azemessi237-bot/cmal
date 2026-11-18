
const CHAT_MODEL = "gpt-5.4-nano";

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

  if (!window.puter || !puter.ai) {
    addMessage(
      "Puter bağlantısı yüklenemedi. İnternet bağlantını kontrol et.",
      "bot"
    );
    return;
  }

  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  addMessage(text, "user");
  input.value = "";

  const loading = addMessage("CmAl düşünüyor...", "bot");
  isSending = true;

  try {
    const messages = [
      {
        role: "system",
        content:
          "Sen CmAl adında Türkçe konuşan, bilgili, doğal ve yardımcı bir yapay zekâ asistanısın. Soruları açık ve doğru cevapla. Emin olmadığın bilgileri uydurma. Kullanıcı başka dil isterse o dilde konuş."
      },
      ...conversationHistory,
      {
        role: "user",
        content: text
      }
    ];

    const response = await puter.ai.chat(messages, {
      model: CHAT_MODEL
    });

    let reply = "";

    if (typeof response === "string") {
      reply = response;
    } else if (response?.message?.content) {
      const content = response.message.content;

      reply = Array.isArray(content)
        ? content.map(part => part.text || "").join("")
        : String(content);
    } else {
      reply = "CmAl cevap oluşturamadı. Tekrar deneyebilirsin.";
    }

    loading.textContent = reply;

    conversationHistory.push(
      { role: "user", content: text },
      { role: "assistant", content: reply }
    );

    conversationHistory = conversationHistory.slice(-20);

  } catch (error) {
    console.error("CmAl AI:", error);

    loading.textContent =
      "CmAl şu anda cevap alamadı. Puter hesabını, model erişimini ve internet bağlantını kontrol et.";
  } finally {
    isSending = false;
    input.focus();
  }
}

function newChat() {
  conversationHistory = [];

  const chat = document.getElementById("chat");

  chat.innerHTML = `
    <div id="welcome">
      <h1>Merhaba.</h1>
      <p>Ben CmAl. Sana nasıl yardımcı olabilirim?</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("msg");

  if (input) {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  }
});
