/* =========================================================
   MARVEL CHALLENGE - script.js
   Logique du jeu : reconnaissance vocale, score, niveaux,
   chronomètre, synthèse vocale, sauvegarde du meilleur score
   ========================================================= */

(function () {
  "use strict";

  /* ---------- CONSTANTES ---------- */
  const GAME_DURATION = 120; // 2 minutes en secondes
  const LEVEL_UP_EVERY = 10; // niveau supérieur tous les 10 personnages
  const STORAGE_KEY = "marvelChallenge_bestScore";

  /* ---------- ÉTAT DU JEU ---------- */
  let currentMode = "all";
  let characterPool = [];       // tableau des noms disponibles pour le mode choisi
  let normalizedPool = new Map(); // normalisé -> nom original
  let foundCharacters = new Set(); // noms originaux déjà trouvés
  let score = 0;
  let level = 1;
  let timeLeft = GAME_DURATION;
  let timerInterval = null;
  let recognition = null;
  let isListening = false;

  /* ---------- ÉLÉMENTS DOM ---------- */
  const screens = {
    menu: document.getElementById("screen-menu"),
    game: document.getElementById("screen-game"),
    end: document.getElementById("screen-end"),
  };

  const bestScoreValueEl = document.getElementById("best-score-value");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const btnStart = document.getElementById("btn-start");
  const voiceWarning = document.getElementById("voice-warning");

  const hudScore = document.getElementById("hud-score");
  const hudLevel = document.getElementById("hud-level");
  const hudTimer = document.getElementById("hud-timer");
  const hudTimerBox = hudTimer.closest(".hud-timer");
  const levelFlash = document.getElementById("level-flash");

  const btnMic = document.getElementById("btn-mic");
  const micIcon = document.getElementById("mic-icon");
  const liveTranscript = document.getElementById("live-transcript");
  const feedbackMessage = document.getElementById("feedback-message");

  const foundListEl = document.getElementById("found-list");
  const foundCountEl = document.getElementById("found-count");
  const btnQuit = document.getElementById("btn-quit");

  const endScore = document.getElementById("end-score");
  const endLevel = document.getElementById("end-level");
  const endBest = document.getElementById("end-best");
  const endNewRecord = document.getElementById("end-new-record");
  const btnReplay = document.getElementById("btn-replay");
  const btnMenu = document.getElementById("btn-menu");

  /* ---------- NAVIGATION ENTRE ÉCRANS ---------- */
  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
  }

  /* ---------- OUTILS DE NORMALISATION ---------- */
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // enlève les accents
      .replace(/[^a-z0-9]/g, "");      // enlève espaces, tirets, points, apostrophes
  }

  function buildPool(mode) {
    const data = window.MARVEL_DATABASE || {};
    const list = data[mode] || data.all || [];
    characterPool = list;
    normalizedPool = new Map();
    list.forEach((name) => normalizedPool.set(normalize(name), name));
  }

  /* ---------- MEILLEUR SCORE (localStorage) ---------- */
  function getBestScore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  }

  function setBestScore(value) {
    localStorage.setItem(STORAGE_KEY, String(value));
  }

  function refreshBestScoreDisplay() {
    bestScoreValueEl.textContent = getBestScore();
  }

  /* ---------- SYNTHÈSE VOCALE ---------- */
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      /* silencieux si la synthèse échoue */
    }
  }

  /* ---------- SÉLECTION DU MODE (MENU) ---------- */
  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMode = btn.dataset.mode;
    });
  });

  /* ---------- RECONNAISSANCE VOCALE (Web Speech API) ---------- */
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

  // true tant que l'utilisateur veut que le micro reste actif en continu
  let shouldListen = false;

  function setupRecognition() {
    if (!SpeechRecognitionAPI) return null;
    const rec = new SpeechRecognitionAPI();
    rec.lang = "fr-FR";
    rec.continuous = true;      // écoute en continu, pas d'arrêt après un seul mot
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => {
      isListening = true;
      setListeningUI(true);
      liveTranscript.textContent = "Je t'écoute...";
    };

    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPart;
        } else {
          interimText += transcriptPart;
        }
      }
      liveTranscript.textContent = finalText || interimText;
      if (finalText) {
        handleSpokenCharacter(finalText);
      }
    };

    rec.onerror = (event) => {
      // ces erreurs sont normales en mode continu (silence, coupure réseau brève)
      // le moteur va se relancer tout seul via onend, donc on ne casse rien ici
      if (event.error === "no-speech" || event.error === "aborted") {
        return;
      }
      // erreur bloquante (micro refusé, etc.) : on arrête vraiment
      shouldListen = false;
      isListening = false;
      setListeningUI(false);
      showFeedback("⚠️ Erreur micro, réessaie", "warn");
    };

    rec.onend = () => {
      isListening = false;
      if (shouldListen) {
        // le moteur vocal s'arrête tout seul au bout d'un moment (limite navigateur) :
        // on le relance automatiquement tant que l'utilisateur n'a pas ré-appuyé
        setTimeout(() => {
          if (shouldListen) {
            try {
              recognition.start();
            } catch (e) {
              /* déjà démarré, on ignore */
            }
          }
        }, 250);
      } else {
        setListeningUI(false);
      }
    };

    return rec;
  }

  function setListeningUI(active) {
    btnMic.classList.toggle("listening", active);
    micIcon.textContent = active ? "🔴" : "🎤";
  }

  function stopListeningUI() {
    shouldListen = false;
    isListening = false;
    setListeningUI(false);
  }

  btnMic.addEventListener("click", () => {
    if (!recognition) {
      showFeedback("⚠️ Reconnaissance vocale indisponible", "warn");
      return;
    }

    if (shouldListen) {
      // deuxième appui : on arrête complètement l'écoute continue
      shouldListen = false;
      recognition.stop();
      return;
    }

    // premier appui : on démarre l'écoute continue
    shouldListen = true;
    liveTranscript.textContent = "";
    try {
      recognition.start();
    } catch (e) {
      // évite l'erreur "already started"
    }
  });

  /* ---------- TRAITEMENT D'UN PERSONNAGE PRONONCÉ ---------- */
  function handleSpokenCharacter(rawText) {
    const cleaned = normalize(rawText);
    if (!cleaned) return;

    // Cherche une correspondance exacte, sinon une correspondance partielle
    let matchedName = normalizedPool.get(cleaned);

    if (!matchedName) {
      for (const [norm, original] of normalizedPool) {
        if (cleaned.includes(norm) || norm.includes(cleaned)) {
          matchedName = original;
          break;
        }
      }
    }

    if (!matchedName) {
      showFeedback("⚠️ Personnage inconnu", "warn");
      speak("Personnage inconnu");
      return;
    }

    if (foundCharacters.has(matchedName)) {
      showFeedback("❌ Déjà cité !", "err");
      speak("Déjà cité");
      return;
    }

    // Nouveau personnage valide
    foundCharacters.add(matchedName);
    score += 1;
    addCharacterToList(matchedName);
    updateHud();
    showFeedback("✅ Bravo ! " + matchedName, "ok");
    speak("Bravo");
    checkLevelUp();
  }

  function showFeedback(text, type) {
    feedbackMessage.textContent = text;
    feedbackMessage.className = "feedback-message " + type;
  }

  function addCharacterToList(name) {
    const li = document.createElement("li");
    li.textContent = name;
    foundListEl.prepend(li);
    foundCountEl.textContent = foundCharacters.size;
  }

  function checkLevelUp() {
    const newLevel = Math.floor(foundCharacters.size / LEVEL_UP_EVERY) + 1;
    if (newLevel > level) {
      level = newLevel;
      hudLevel.textContent = level;
      levelFlash.classList.remove("hidden");
      // relance l'animation
      levelFlash.style.animation = "none";
      void levelFlash.offsetWidth;
      levelFlash.style.animation = "";
      setTimeout(() => levelFlash.classList.add("hidden"), 1400);
    }
  }

  function updateHud() {
    hudScore.textContent = score;
    hudLevel.textContent = level;
  }

  /* ---------- CHRONOMÈTRE ---------- */
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function startTimer() {
    timeLeft = GAME_DURATION;
    hudTimer.textContent = formatTime(timeLeft);
    hudTimerBox.classList.remove("time-low");

    timerInterval = setInterval(() => {
      timeLeft -= 1;
      hudTimer.textContent = formatTime(timeLeft);
      if (timeLeft <= 20) {
        hudTimerBox.classList.add("time-low");
      }
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  /* ---------- DÉMARRAGE / FIN DE PARTIE ---------- */
  function startGame() {
    buildPool(currentMode);
    foundCharacters = new Set();
    score = 0;
    level = 1;
    foundListEl.innerHTML = "";
    foundCountEl.textContent = "0";
    feedbackMessage.textContent = "";
    liveTranscript.textContent = "";
    updateHud();
    showScreen("game");
    startTimer();
  }

  function endGame() {
    stopTimer();
    if (recognition) {
      shouldListen = false;
      recognition.stop();
    }

    const best = getBestScore();
    const isNewRecord = score > best;
    if (isNewRecord) {
      setBestScore(score);
    }

    endScore.textContent = score;
    endLevel.textContent = level;
    endBest.textContent = getBestScore();
    endNewRecord.classList.toggle("hidden", !isNewRecord);

    refreshBestScoreDisplay();
    showScreen("end");
  }

  function quitGame() {
    stopTimer();
    if (recognition) {
      shouldListen = false;
      recognition.stop();
    }
    refreshBestScoreDisplay();
    showScreen("menu");
  }

  /* ---------- ÉVÉNEMENTS BOUTONS ---------- */
  btnStart.addEventListener("click", startGame);
  btnQuit.addEventListener("click", quitGame);
  btnReplay.addEventListener("click", startGame);
  btnMenu.addEventListener("click", () => showScreen("menu"));

  /* ---------- INITIALISATION ---------- */
  function init() {
    refreshBestScoreDisplay();

    if (!SpeechRecognitionAPI) {
      voiceWarning.classList.remove("hidden");
      btnMic.disabled = true;
    } else {
      recognition = setupRecognition();
    }

    showScreen("menu");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
