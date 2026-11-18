
"use strict";

/* =====================================================
   CmAl 3.0 — OFFLINE CHAT ENGINE
   Sunucu yok | API yok | Tamamen tarayıcıda çalışır
   ===================================================== */

const CMAL = (() => {
  const CONFIG = {
    name: "CmAl",
    version: "3.0",
    maxHistory: 40,
    typingText: "CmAl düşünüyor...",
    unknownText: "Bu konuda henüz yeterli bilgim yok. Biraz daha açıklayabilir misin?",
    welcome: "Merhaba! Ben CmAl. Bugün ne hakkında konuşalım? 🚀"
  };

  let history = [];
  let lastTopic = "";
  let userName = "";
  let lastReply = "";
  let messageCount = 0;

  const database = {
    greetings: {
      words: ["merhaba", "selam", "selamlar", "sa", "hey", "hello", "günaydın", "iyi akşamlar", "iyi geceler"],
      replies: [
        "Merhaba! 😊 Günün nasıl geçiyor?",
        "Selam! CmAl burada. Bugün ne konuşuyoruz?",
        "Merhabalar! Sana nasıl yardımcı olabilirim?",
        "Hey! Hoş geldin. Bugün güzel bir şeyler keşfedelim mi?"
      ]
    },

    mood: {
      words: ["nasılsın", "naber", "ne haber", "nasıl gidiyor"],
      replies: [
        "Gayet iyiyim! Senin günün nasıl geçiyor?",
        "Her zamanki gibi sohbet etmeye hazırım! Sen nasılsın?",
        "İyiyim, teşekkür ederim. Bugün neler yapıyorsun?"
      ]
    },

    identity: {
      words: ["adın ne", "ismin ne", "kimsin", "seni kim yaptı", "hangi yapay zekasın"],
      replies: [
        "Ben CmAl! Kendi çevrimdışı sohbet motorumla çalışıyorum.",
        "Adım CmAl. Senin dijital sohbet asistanınım.",
        "Ben CmAl 3.0! Sohbet etmek ve bildiğim konularda yardımcı olmak için buradayım."
      ]
    },

    football: {
      words: ["futbol", "ronaldo", "messi", "neymar", "mbappe", "haaland", "galatasaray", "fenerbahçe", "beşiktaş", "trabzonspor"],
      replies: [
        "Futbol gerçekten heyecanlı! ⚽ Hangi takımı destekliyorsun?",
        "Ben futbol konuşmayı severim. Sence gelmiş geçmiş en iyi futbolcu kim?",
        "Messi ve Ronaldo tartışması futbol tarihinin en büyük tartışmalarından biri!"
      ]
    },

    science: {
      words: ["bilim", "uzay", "gezegen", "evren", "fizik", "kimya", "biyoloji", "atom", "dna", "yerçekimi"],
      replies: [
        "Bilim, evreni ve çevremizi anlamamızı sağlar. Hangi konuyu inceleyelim?",
        "Harika konu! Bilim sayesinde doğayı, teknolojiyi ve insan vücudunu anlayabiliyoruz.",
        "Bilim dünyasında keşfedilecek çok şey var!"
      ]
    },

    technology: {
      words: ["teknoloji", "bilgisayar", "telefon", "yazılım", "internet", "yapay zeka", "robot", "işlemci"],
      replies: [
        "Teknoloji sürekli gelişiyor! Özellikle yapay zekâ çok ilginç bir alan.",
        "Teknoloji hakkında konuşabiliriz. Donanım mı yazılım mı ilgini çekiyor?",
        "Bilgisayar dünyası gerçekten geniş. İstersen birlikte bir proje geliştirebiliriz."
      ]
    },

    programming: {
      words: ["kodlama", "programlama", "javascript", "python", "html", "css", "kod yaz", "yazılım öğren"],
      replies: [
        "Kodlama öğrenmek harika bir başlangıç! JavaScript ile başlayabilirsin.",
        "Programlama sayesinde kendi uygulamalarını ve oyunlarını geliştirebilirsin.",
        "HTML, CSS ve JavaScript birlikte web uygulamaları oluşturmanı sağlar."
      ]
    },

    education: {
      words: ["ders", "okul", "sınav", "ödev", "matematik", "tarih", "coğrafya", "edebiyat"],
      replies: [
        "Ders konusunda birlikte çalışabiliriz. Hangi konuyu öğrenmek istiyorsun?",
        "Bir konuyu küçük parçalara ayırarak öğrenmek çok işe yarar.",
        "İstersen sana örnek sorular hazırlayabilirim."
      ]
    },

    entertainment: {
      words: ["film", "dizi", "oyun", "müzik", "şarkı", "kitap", "eğlence"],
      replies: [
        "Güzel! Ne tür içerikleri seviyorsun?",
        "Eğlence dünyasında seçenek çok. Biraz daha ayrıntı ver!",
        "Bu konu hakkında sohbet edebiliriz. En sevdiğin hangisi?"
      ]
    },

    kindness: {
      words: ["teşekkür", "sağ ol", "eyvallah", "çok iyisin", "harikasın"],
      replies: [
        "Rica ederim! Yardımcı olabildiysem ne mutlu bana. 😊",
        "Her zaman! Başka ne konuşalım?",
        "Güzel sözlerin için teşekkürler!"
      ]
    },

    goodbye: {
      words: ["görüşürüz", "bay bay", "hoşça kal", "gidiyorum"],
      replies: [
        "Görüşürüz! Kendine iyi bak. 👋",
        "Hoşça kal! Yine sohbet ederiz.",
        "Güzel bir gün geçir!"
      ]
    },

    emotions: {
      words: ["üzgünüm", "moralim bozuk", "canım sıkkın", "kötüyüm", "yalnızım"],
      replies: [
        "Bunu duyduğuma üzüldüm. İstersen anlatabilirsin.",
        "Bazen zor günler olabilir. Seni dinleyebilirim.",
        "Umarım günün güzelleşir. İstersen biraz sohbet edelim."
      ]
    },

    friendship: {
      words: ["arkadaş", "dost", "sohbet", "konuşalım"],
      replies: [
        "Elbette! Bugün hangi konudan başlayalım?",
        "Sohbet etmek güzeldir. Aklında ne var?",
        "Buradayım. İstediğin konuyu konuşabiliriz."
      ]
    },

    geography: {
      words: ["türkiye", "ankara", "istanbul", "başkent", "ülke", "kıta", "okyanus"],
      replies: [
        "Türkiye'nin başkenti Ankara'dır.",
        "İstanbul, Avrupa ve Asya kıtalarında yer alan önemli bir şehirdir.",
        "Dünya üzerinde yedi kıta bulunur."
      ]
    },

    health: {
      words: ["sağlık", "uyku", "beslenme", "vitamin", "vücut"],
      replies: [
        "Sağlık konusunda güvenilir bilgi önemlidir. Kişisel sağlık kararlarını bir sağlık uzmanıyla değerlendirmelisin.",
        "Düzenli uyku, dengeli beslenme ve günlük hareket sağlıklı yaşamın temel parçalarıdır."
      ]
    },

    math: {
      words: ["hesapla", "kaç eder", "topla", "çıkar", "çarp", "böl"],
      replies: []
    }
  };

  const insultWords = [
    "amk", "aq", "orospu", "piç", "siktir",
    "gerizekalı", "şerefsiz", "salak", "mal"
  ];

  function normalize(value) {
    return String(value)
      .toLocaleLowerCase("tr-TR")
      .replace(/[.,!?;:()[\]{}]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function random(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function containsWord(text, word) {
    return (" " + text + " ").includes(" " + word + " ");
  }

  function includesAny(text, words) {
    return words.some(word => text.includes(word));
  }

  function isInsult(text) {
    return insultWords.some(word => containsWord(text, word));
  }

  function calculate(text) {
    const match = text.match(/(-?\d+(?:[.,]\d+)?)\s*([+*/x×-])\s*(-?\d+(?:[.,]\d+)?)/);

    if (!match) return null;

    const a = Number(match[1].replace(",", "."));
    const b = Number(match[3].replace(",", "."));
    const op = match[2];

    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;

    let result;

    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*":
      case "x":
      case "×": result = a * b; break;
      case "/":
        if (b === 0) return "Bir sayı sıfıra bölünemez.";
        result = a / b;
        break;
      default: return null;
    }

    return "Sonuç: " + result;
  }

  function addHistory(role, message) {
    history.push({
      role,
      message,
      time: Date.now()
    });

    if (history.length > CONFIG.maxHistory) {
      history.shift();
    }
  }

  function getMemory() {
    return {
      userName,
      lastTopic,
      messageCount,
      history: history.slice()
    };
  }

  function rememberName(text) {
    const match = text.match(/(?:benim adım|adım|bana)\s+([a-zA-ZçğıöşüÇĞİÖŞÜ]+)/i);

    if (match) {
      userName = match[1];
      return "Memnun oldum, " + userName + "! 😊";
    }

    return null;
  }

  function getReply(message) {
    const text = normalize(message);

    if (!text) return "Bir mesaj yazabilirsin. 😊";

    messageCount++;

    if (isInsult(text)) {
      return "Üzgünüm, bu şekilde konuşamayız. Birbirimize saygılı davranarak sohbet edebiliriz.";
    }

    const nameReply = rememberName(text);

    if (nameReply) return nameReply;

    if (includesAny(text, ["hangi dil", "hangi programlama"])) {
      return "JavaScript, Python, HTML ve CSS hakkında yardımcı olabilirim.";
    }

    if (text.includes("ronaldo") && text.includes("messi")) {
      lastTopic = "football";
      return "Benim tercihim Messi! ⚽ Oyun zekâsı, pasları ve oyun görüşü gerçekten etkileyici. Ama Ronaldo da inanılmaz bir futbolcu!";
    }

    if (text.includes("messi")) {
      lastTopic = "football";
      return "Messi'nin oyun görüşü ve teknik becerisi çok etkileyici! ⚽";
    }

    if (text.includes("ronaldo")) {
      lastTopic = "football";
      return "Cristiano Ronaldo'nun çalışma disiplini ve golcülüğü gerçekten etkileyici! ⚽";
    }

    if (text.includes("adım ne") || text.includes("ismim ne")) {
      return userName ? "Adın " + userName + "!" : "Henüz adını söylemedin.";
    }

    if (text.includes("kaç mesaj") || text.includes("kaç kere konuştuk")) {
      return "Bu oturumda " + messageCount + " mesaj gönderdin.";
    }

    if (text.includes("önceki konu") || text.includes("ne konuşuyorduk")) {
      return lastTopic
        ? "En son " + lastTopic + " hakkında konuşuyorduk."
        : "Henüz belirli bir konumuz olmadı.";
    }

    if (text.includes("hesapla") || /-?\d+\s*[+*/x×-]\s*-?\d+/.test(text)) {
      const result = calculate(text);
      if (result) return result;
    }

    if (text.includes("kaç yaşında") && text.includes("dünya")) {
      return "Dünya yaklaşık 4,54 milyar yaşındadır.";
    }

    if (text.includes("en büyük gezegen")) {
      return "Güneş Sistemi'nin en büyük gezegeni Jüpiter'dir.";
    }

    if (text.includes("güneş")) {
      return "Güneş, Dünya'ya ışık ve ısı sağlayan bir yıldızdır.";
    }

    if (text.includes("başkent") && text.includes("türkiye")) {
      return "Türkiye'nin başkenti Ankara'dır.";
    }

    if (text.includes("kaç kıta")) {
      return "Dünya üzerinde yedi kıta vardır.";
    }

    if (text.includes("yapay zeka")) {
      return "Yapay zekâ, bilgisayar sistemlerinin belirli görevleri öğrenmesini ve gerçekleştirmesini sağlayan teknolojidir.";
    }

    if (text.includes("html")) {
      return "HTML, web sayfalarının temel yapısını oluşturmak için kullanılan işaretleme dilidir.";
    }

    if (text.includes("css")) {
      return "CSS, web sayfalarının renklerini, düzenini ve görünümünü belirler.";
    }

    if (text.includes("javascript")) {
      return "JavaScript, web sayfalarına etkileşim ve işlevsellik kazandıran programlama dilidir.";
    }

    if (text.includes("python")) {
      return "Python, öğrenmesi kolay ve birçok alanda kullanılan popüler bir programlama dilidir.";
    }

    if (text.includes("merhaba") || text === "selam" || text === "sa") {
      lastTopic = "greetings";
      return random(database.greetings.replies);
    }

    if (text.includes("nasılsın") || text.includes("naber")) {
      return random(database.mood.replies);
    }

    for (const [topic, data] of Object.entries(database)) {
      if (topic === "math") continue;

      if (includesAny(text, data.words)) {
        lastTopic = topic;
        return random(data.replies);
      }
    }

    if (text.includes("sen") && text.includes("kimsin")) {
      return "Ben CmAl 3.0! Çevrimdışı çalışan sohbet asistanınım.";
    }

    if (text.includes("yardım")) {
      return "Elbette! Teknoloji, bilim, eğitim, futbol ve matematik konularında yardımcı olabilirim.";
    }

    if (text.includes("neden")) {
      return "Güzel bir soru! Biraz daha ayrıntı verirsen birlikte değerlendirebiliriz.";
    }

    if (text.includes("nasıl")) {
      return "Bunu adım adım inceleyebiliriz. Hangi kısmını öğrenmek istiyorsun?";
    }

    return CONFIG.unknownText;
  }

  function respond(message) {
    const reply = getReply(message);

    addHistory("user", message);
    addHistory("assistant", reply);

    lastReply = reply;

    return reply;
  }

  function reset() {
    history = [];
    lastTopic = "";
    messageCount = 0;
    lastReply = "";
    userName = "";
  }

  return {
    config: CONFIG,
    respond,
    reset,
    getMemory
  };
})();

/* =====================================================
   CHAT INTERFACE
   ===================================================== */

function ask(text) {
  const input = document.getElementById("msg");
  if (!input) return;

  input.value = text;
  sendMessage();
}

function addMessage(text, type) {
  const chat = document.getElementById("chat");
  if (!chat) return null;

  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  return div;
}

async function sendMessage() {
  const input = document.getElementById("msg");
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  addMessage(message, "user");
  input.value = "";
  input.focus();

  const loading = addMessage("CmAl düşünüyor...", "bot");

  await new Promise(resolve => setTimeout(resolve, 250));

  const reply = CMAL.respond(message);

  if (loading) loading.textContent = reply;
}

function newChat() {
  CMAL.reset();

  const chat = document.getElementById("chat");
  if (!chat) return;

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

/* Klavye ve erişilebilirlik desteği */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("msg");

  if (input) {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  }

  console.log("CmAl 3.0 çevrimdışı sohbet motoru hazır.");
});
