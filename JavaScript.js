let speech = new SpeechSynthesisUtterance();
let voices = [];
let isSpeaking = false;

const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speakBtn");
const icon = document.getElementById("hu");
const textarea = document.querySelector("textarea");
const micBtn = document.getElementById("micBtn");
const hero = document.querySelector(".hero");
const loveAudio = document.getElementById("loveAudio");

// ✅ Voice Handling
function populateVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach((voice, i) => {
    voiceSelect.add(new Option(voice.name, i));
  });
  if (voices[0]) speech.voice = voices[0];
}

// Try populating immediately
populateVoices();

// Ensure voices are loaded (especially on mobile)
speechSynthesis.onvoiceschanged = populateVoices;

// Force load on user interaction (mobile workaround)
document.body.addEventListener("click", () => {
  if (!voices.length) {
    populateVoices();
  }
}, { once: true });

// Change selected voice
voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

// ✅ Text-to-Speech button
speakBtn.addEventListener("click", () => {
  const text = textarea.value.trim();
  if (!text) return;

  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    icon.src = "image/play.svg";
    isSpeaking = false;
  } else if (speechSynthesis.paused) {
    speechSynthesis.resume();
    icon.src = "image/pause.svg";
    isSpeaking = true;
  } else {
    speech.text = text;
    speechSynthesis.cancel();
    speechSynthesis.speak(speech);
    icon.src = "image/pause.svg";
    isSpeaking = true;
  }
});

speech.onend = () => {
  icon.src = "image/play.svg";
  isSpeaking = false;
};

// ✅ Mic (Speech-to-Text)
let recognition;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    textarea.value += transcript + ' ';
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
  };

  micBtn.addEventListener("click", () => {
    recognition.start();
  });
} else {
  alert("Speech Recognition not supported on this device/browser.");
  micBtn.disabled = true;
}

// ✅ Love audio logic (pause if .hero clicked)
document.body.addEventListener("click", (e) => {
  const clickedInsideHero = hero.contains(e.target);
  const isInput = [micBtn, voiceSelect, speakBtn, textarea].some(el => el === e.target);

  if (clickedInsideHero || isInput) {
    loveAudio.pause();
    loveAudio.currentTime = 0;
  } else {
    loveAudio.currentTime = 0;
    loveAudio.play();
    setTimeout(() => {
      loveAudio.pause();
      loveAudio.currentTime = 0;
    }, 12000);
  }
});
recognition.onerror = (event) => {
  if (event.error === "not-allowed") {
    alert("Microphone access was denied. Please allow it in your browser settings.");
  } else {
    alert("Speech recognition error: " + event.error);
  }
};
