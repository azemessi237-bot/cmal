
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
}

function sendMessage() {
    const input = document.getElementById("msg");
    const text = input.value.trim();

    if (!text) return;

    const welcome = document.getElementById("welcome");

    if (welcome) {
        welcome.remove();
    }

    addMessage(text, "user");
    input.value = "";

    setTimeout(() => {
        addMessage(
            "Merhaba! Ben CmAl. Şu anda sohbet sistemim hazırlanıyor. Yakında gerçek yapay zekâ bağlantımla cevap vereceğim! 🚀",
            "bot"
        );
    }, 500);
}

function newChat() {
    const chat = document.getElementById("chat");

    chat.innerHTML = `
        <section class="welcome" id="welcome">
            <div class="symbol">C</div>
            <h1>Nasıl yardımcı olabilirim?</h1>
            <p>Merhaba! Ben CmAl. Birlikte düşünelim, keşfedelim ve üretelim.</p>
        </section>
    `;
}
