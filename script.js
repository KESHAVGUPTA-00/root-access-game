// ================= USER SESSION DATA (FROM LOGIN FORM) =================
let playerInfo = {
  name: "Admin",
  pcName: "DESKTOP-USER01",
  uniqueCode: "NX-4829"
};

function generateUniqueCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const tag = letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
  const code = `NX-${num}-${tag}`;
  document.getElementById("uniqueCodeInput").value = code;
  playerInfo.uniqueCode = code;
}

// ================= SOUND ENGINE (WEB AUDIO API) =================
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}

function playTone(freq, duration = 0.05, type = "square", volume = 0.04) {
  if (!soundEnabled) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playKeyClick() { playTone(500 + Math.random() * 180, 0.025, "triangle", 0.03); }

function playAlarmSfx() {
  playTone(250, 0.14, "sawtooth", 0.06);
  setTimeout(() => playTone(165, 0.22, "sawtooth", 0.06), 150);
}

function playBreachSiren() {
  playTone(700, 0.12, "sawtooth", 0.07);
  setTimeout(() => playTone(400, 0.16, "sawtooth", 0.07), 140);
  setTimeout(() => playTone(700, 0.12, "sawtooth", 0.07), 320);
  setTimeout(() => playTone(310, 0.28, "sawtooth", 0.07), 460);
}

function playSuccessSfx() {
  playTone(523, 0.09, "square", 0.05);
  setTimeout(() => playTone(659, 0.09, "square", 0.05), 90);
  setTimeout(() => playTone(784, 0.09, "square", 0.05), 180);
  setTimeout(() => playTone(1046, 0.28, "square", 0.06), 270);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById("soundToggleBtn").textContent = `SFX: ${soundEnabled ? "ON" : "OFF"}`;
}

function exitFullscreenSafe() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

// ================= TRIGGER THE TRAP ON FORM SUBMIT =================
let takeoverActive = false;
let encryptedFilesCount = 42;

function triggerHackTrap(e) {
  e.preventDefault();

  const name = document.getElementById("playerNameInput").value.trim() || "Admin";
  const pc = document.getElementById("pcNameInput").value.trim().toUpperCase() || "DESKTOP-01";
  const code = document.getElementById("uniqueCodeInput").value.trim();

  playerInfo = { name, pcName: pc, uniqueCode: code };

  // 1. Force Fullscreen immediately (allowed because it's triggered by the submit click!)
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  }

  // 2. Inject the user's real details into every scary screen
  document.title = `CRITICAL BREACH // ${pc}`;
  document.getElementById("popupPcName").textContent = pc;
  document.getElementById("popupCode").textContent = code;
  document.getElementById("stripPcName").textContent = pc;
  document.getElementById("stripCode").textContent = code;
  document.getElementById("victimName").textContent = name.toUpperCase();
  document.getElementById("victimPc").textContent = pc;
  document.getElementById("victimCode").textContent = code;
  document.getElementById("headlineName").textContent = name.toUpperCase();
  document.getElementById("headlinePc").textContent = pc;
  document.getElementById("ransomPc").textContent = pc;
  document.getElementById("ransomCode").textContent = code;
  document.getElementById("ransomUser").textContent = name.replace(/\s+/g, "");
  document.getElementById("hudPcName").textContent = pc;
  document.getElementById("hudCode").textContent = code;

  // 3. Switch from innocent login page to terrifying hijack screen
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("matrixCanvas").classList.remove("hidden");
  document.getElementById("crtOverlay").classList.remove("hidden");
  document.getElementById("breachTakeover").classList.remove("hidden");
  document.getElementById("osWarningPopup").classList.remove("hidden");
  document.body.classList.add("infected");

  takeoverActive = true;
  playBreachSiren();

  setTimeout(() => {
    document.getElementById("osWarningPopup").classList.add("hidden");
  }, 4000);
}

// ================= MATRIX RAIN & RADAR =================
const matrixCanvas = document.getElementById("matrixCanvas");
const mCtx = matrixCanvas.getContext("2d");
let matrixDrops = [];
const matrixChars = "アイウエオカキクケコ0123456789ABCDEF#$%&@";

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  matrixDrops = Array(Math.floor(matrixCanvas.width / 16)).fill(1);
}

function getThemePrimary() {
  return getComputedStyle(document.body).getPropertyValue("--primary").trim() || "#ff1e42";
}

function drawMatrix() {
  if (matrixCanvas.classList.contains("hidden")) return;
  mCtx.fillStyle = "rgba(0, 0, 0, 0.08)";
  mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  mCtx.fillStyle = getThemePrimary();
  mCtx.font = "15px monospace";

  for (let i = 0; i < matrixDrops.length; i++) {
    const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    mCtx.fillText(ch, i * 16, matrixDrops[i] * 16);
    if (matrixDrops[i] * 16 > matrixCanvas.height && Math.random() > 0.975) matrixDrops[i] = 0;
    matrixDrops[i]++;
  }
}

const radarCanvas = document.getElementById("radarCanvas");
const rCtx = radarCanvas.getContext("2d");
let radarAngle = 0;

function drawRadar() {
  const w = radarCanvas.width, h = radarCanvas.height, cx = w / 2, cy = h / 2, r = w * 0.44;
  const color = getThemePrimary();

  rCtx.clearRect(0, 0, w, h);
  rCtx.strokeStyle = color;
  rCtx.globalAlpha = 0.3;
  [0.33, 0.66, 1].forEach(s => { rCtx.beginPath(); rCtx.arc(cx, cy, r * s, 0, Math.PI * 2); rCtx.stroke(); });

  rCtx.save();
  rCtx.translate(cx, cy);
  rCtx.rotate(radarAngle);
  rCtx.fillStyle = color;
  rCtx.globalAlpha = 0.24;
  rCtx.beginPath();
  rCtx.moveTo(0, 0);
  rCtx.arc(0, 0, r, -0.45, 0);
  rCtx.closePath();
  rCtx.fill();
  rCtx.restore();

  radarAngle += systemInfected ? 0.055 : 0.03;
  requestAnimationFrame(drawRadar);
}

// Personalized Fake File Encryption Stream
const FAKE_SUBPATHS = [
  "Desktop\\passwords.txt",
  "Documents\\personal_notes.pdf",
  "Pictures\\IMG_2026_091.jpg",
  "AppData\\Local\\Chrome\\LoginData",
  "Downloads\\backup_keys.zip",
  "Videos\\camera_clip.mp4",
  "Documents\\college_project.docx"
];

function updateTakeoverFeeds() {
  if (!takeoverActive) return;
  const feed = document.getElementById("takeoverFileFeed");
  const sub = FAKE_SUBPATHS[Math.floor(Math.random() * FAKE_SUBPATHS.length)];
  const safeUser = playerInfo.name.replace(/\s+/g, "");

  encryptedFilesCount = Math.min(4820, encryptedFilesCount + Math.floor(Math.random() * 19 + 5));
  document.getElementById("encryptedCounter").textContent = `${encryptedFilesCount.toLocaleString()} / 4,820`;

  const row = document.createElement("div");
  row.textContent = `[LOCKED] C:\\Users\\${safeUser}\\${sub}.enc`;
  feed.appendChild(row);
  while (feed.children.length > 14) feed.removeChild(feed.firstChild);
}

// ================= TERMINAL & KILL-SWITCH GAME =================
const outputEl = document.getElementById("terminalOutput");
const cmdInput = document.getElementById("cmdInput");
const modeBadge = document.getElementById("modeBadge");
const promptLabel = document.getElementById("promptLabel");

let systemInfected = true;
let totalTime = 120;
let timeLeft = 120;
let countdownInterval = null;
let virusSecretPin = generateSecretPin();
let revealedHintIndices = [];
let crackGame = null;
let typerActive = false;
let typerCursor = 0;

const FAKE_CODE = `
void purge_trojan_sector(const char* pc) {
    printf("[+] Isolating TROJAN.NEURAL_X on %s...\\n", pc);
    for (int i = 0; i < 64; i++) decrypt_block(i ^ 0xCAFEBABE);
    restore_firewall_ring0();
    printf("[OK] Rootkit neutralised. System restored.\\n");
}
`;

function generateSecretPin() {
  const digits = ["0","1","2","3","4","5","6","7","8","9"];
  let pin = "";
  for (let i = 0; i < 4; i++) pin += digits.splice(Math.floor(Math.random() * digits.length), 1)[0];
  return pin;
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

function printLine(text, className = "") {
  const div = document.createElement("div");
  div.className = `line ${className}`;
  div.textContent = text;
  outputEl.appendChild(div);
  outputEl.scrollTop = outputEl.scrollHeight;
  return div;
}

function triggerShake() {
  const panel = document.getElementById("terminalPanel");
  panel.classList.remove("shake");
  void panel.offsetWidth;
  panel.classList.add("shake");
}

function focusInput() { if (!typerActive && !takeoverActive) cmdInput.focus(); }

function setTheme(name) {
  const isInf = document.body.classList.contains("infected");
  document.body.className = `theme-${name}` + (isInf ? " infected" : "");
}

function enterEmergencyTerminal() {
  takeoverActive = false;
  document.getElementById("breachTakeover").classList.add("hidden");
  document.getElementById("osWarningPopup").classList.add("hidden");
  document.getElementById("hudShell").classList.remove("hidden");
  startVirusCountdown();
}

async function startVirusCountdown() {
  clearInterval(countdownInterval);
  systemInfected = true;
  timeLeft = totalTime;
  virusSecretPin = generateSecretPin();
  revealedHintIndices = [];
  crackGame = null;

  document.body.className = "theme-red infected";
  document.getElementById("byeByeOverlay").classList.add("hidden");
  promptLabel.textContent = `alert@${playerInfo.pcName.toLowerCase()}:~$`;
  modeBadge.textContent = "VIRUS ACTIVE";
  outputEl.innerHTML = "";

  const lines = [
    [`[CRITICAL] ${playerInfo.pcName} HAS BEEN HACKED (CODE: ${playerInfo.uniqueCode})`, "line-danger"],
    [`[!] USER '${playerInfo.name.toUpperCase()}' — FILES ARE BEING ENCRYPTED!`, "line-danger"],
    ["-------------------------------------------------------------------", "line-muted"],
    ["[HINT] TYPE 'help' OR 'crack' TO CRACK THE 4-DIGIT KILL-SWITCH PIN", "line-accent"],
    ["       AND SAVE YOUR PC BEFORE 00:00 — OTHERWISE BYE BYE!", "line-accent"],
    ["-------------------------------------------------------------------\n", "line-muted"]
  ];
  for (const [t, c] of lines) { printLine(t, c); await sleep(110); }

  updateCountdownUI();
  countdownInterval = setInterval(() => {
    if (!systemInfected) return;
    timeLeft--;
    updateCountdownUI();
    if (timeLeft <= 15 && timeLeft > 0) playTone(880, 0.04, "sawtooth", 0.04);
    if (timeLeft <= 0) triggerByeBye(`TIME EXPIRED! ${playerInfo.pcName} HAS BEEN WIPED.`);
  }, 1000);

  focusInput();
}

function updateCountdownUI() {
  const m = String(Math.floor(Math.max(0, timeLeft) / 60)).padStart(2, "0");
  const s = String(Math.max(0, timeLeft) % 60).padStart(2, "0");
  document.getElementById("countdownTimer").textContent = `WIPE IN: ${m}:${s}`;
  document.getElementById("takeoverClock").textContent = `${m}:${s}`;

  const pct = Math.min(100, Math.round(((totalTime - timeLeft) / totalTime) * 100));
  document.getElementById("virusVal").textContent = `${pct}%`;
  document.getElementById("virusBar").style.width = `${pct}%`;
}

function purgeVirusSuccess() {
  clearInterval(countdownInterval);
  systemInfected = false;
  crackGame = null;

  document.body.className = "theme-green";
  document.getElementById("brandTitle").textContent = "NEURAL_OS // SECURED";
  document.getElementById("radarStatus").textContent = "CLEAN";
  document.getElementById("threatLevel").textContent = "SECURED";
  document.getElementById("threatLevel").className = "threat-ok";
  modeBadge.textContent = "SYSTEM SAVED";
  promptLabel.textContent = `root@${playerInfo.pcName.toLowerCase()}:~$`;

  const strip = document.getElementById("virusAlertStrip");
  strip.classList.add("secured");
  document.getElementById("alertStripMsg").textContent =
    `✔ ${playerInfo.pcName} SAVED! ALL FILES RESTORED FOR ${playerInfo.name.toUpperCase()}.`;
  document.getElementById("countdownTimer").textContent = "STATUS: SAFE";
  document.getElementById("virusVal").textContent = "0%";
  document.getElementById("virusBar").style.width = "0%";
  document.getElementById("shieldVal").textContent = "100%";
  document.getElementById("shieldBar").style.width = "100%";

  printLine(`\n[✔] KILL-SWITCH ACCEPTED! ${playerInfo.pcName} IS SAFE!`, "line-safe");
  showBanner("SYSTEM SAVED!", `PIN ${virusSecretPin} CRACKED // ${playerInfo.pcName} RESTORED`);
}

function triggerByeBye(reason) {
  clearInterval(countdownInterval);
  crackGame = null;
  playAlarmSfx();
  document.getElementById("byeByeMsg").innerHTML =
    `${reason}<br /><br />KILL-SWITCH PIN WAS: <strong style="color:#ffcc00;">${virusSecretPin}</strong>`;
  document.getElementById("byeByeOverlay").classList.remove("hidden");
}

function rebootAndRetry() {
  document.getElementById("byeByeOverlay").classList.add("hidden");
  startVirusCountdown();
}

function showBanner(title, sub) {
  document.getElementById("accessTitle").textContent = title;
  document.getElementById("accessSub").textContent = sub;
  document.getElementById("accessBanner").classList.remove("hidden");
  playSuccessSfx();
}

function hideBanner() {
  document.getElementById("accessBanner").classList.add("hidden");
  focusInput();
}

// ================= COMMANDS =================
function runQuick(cmd) {
  if (typerActive) exitTyperMode();
  cmdInput.value = "";
  handleCommand(cmd);
  focusInput();
}

async function handleCommand(raw) {
  const input = raw.trim();
  if (!input) return;

  if (crackGame) {
    printLine(`killswitch-pin> ${input}`, "line-cmd");
    handleCrackGuess(input);
    return;
  }

  printLine(`${promptLabel.textContent} ${input}`, "line-cmd");
  const cmd = input.split(/\s+/)[0].toLowerCase();

  switch (cmd) {
    case "help":
      printLine("================ EMERGENCY RECOVERY MENU ================", "line-accent");
      printLine("  crack     -> Crack the 4-digit Kill-Switch PIN to SAVE YOUR PC!", "line-safe");
      printLine("  hint      -> Reveal 1 secret PIN digit (-15s penalty)", "line-accent");
      printLine("  scan      -> Scan compromised ports");
      printLine("  trace     -> Trace attacker IP");
      printLine("  typer     -> Hollywood Hacker Typer mode (mash any keys!)");
      printLine("  safeexit  -> Exit fullscreen & pause timer");
      printLine("  clear     -> Clear terminal");
      printLine("=========================================================", "line-accent");
      break;
    case "crack": startCrackGame(); break;
    case "hint": givePinHint(); break;
    case "clear": outputEl.innerHTML = ""; break;
    case "safeexit":
      exitFullscreenSafe();
      clearInterval(countdownInterval);
      printLine("[SAFE EXIT] Exited fullscreen & paused timer.", "line-safe");
      break;
    case "scan":
      printLine(`Scanning ${playerInfo.pcName}... [LOCKED] PORT 9999 -> KILL-SWITCH (USE 'crack')`, "line-accent");
      playSuccessSfx();
      break;
    case "trace":
      printLine(`Tracing attacker... LOCKED ON 185.220.101.44 (SESSION ${playerInfo.uniqueCode})`, "line-accent");
      break;
    case "typer":
      typerActive = true;
      cmdInput.disabled = true;
      printLine("[TYPER MODE] Mash any keys! Press ESC to exit.", "line-accent");
      break;
    default:
      playAlarmSfx();
      printLine(`Unknown command '${cmd}'. Type 'help' or 'crack' to save your PC!`, "line-danger");
  }
}

function givePinHint() {
  const secret = crackGame ? crackGame.secret : virusSecretPin;
  const unrevealed = [0, 1, 2, 3].filter(i => !revealedHintIndices.includes(i));
  if (!unrevealed.length) { printLine(`ALL DIGITS REVEALED: ${secret}`, "line-accent"); return; }

  const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
  revealedHintIndices.push(pick);
  if (systemInfected) { timeLeft = Math.max(5, timeLeft - 15); updateCountdownUI(); }

  const masked = [0, 1, 2, 3].map(i => (revealedHintIndices.includes(i) ? secret[i] : "_")).join(" ");
  playTone(900, 0.08, "triangle", 0.05);
  printLine(`[HINT] Digit #${pick + 1} is '${secret[pick]}' -> PIN: ${masked} (-15s)`, "line-accent");
}

function startCrackGame() {
  crackGame = { secret: systemInfected ? virusSecretPin : generateSecretPin(), attemptsLeft: 7 };
  modeBadge.textContent = "CRACKING PIN";
  promptLabel.textContent = "killswitch-pin>";
  printLine("ENTER 4 UNIQUE DIGITS (e.g. 1234, 5678). 7 TRIES. TYPE 'hint' FOR A CLUE.", "line-accent");
}

function handleCrackGuess(input) {
  if (input.toLowerCase() === "exit") {
    crackGame = null;
    promptLabel.textContent = `alert@${playerInfo.pcName.toLowerCase()}:~$`;
    return;
  }
  if (input.toLowerCase() === "hint") { givePinHint(); return; }
  if (!/^\d{4}$/.test(input)) { printLine("Enter exactly 4 digits (e.g. 4829).", "line-danger"); return; }

  let exact = 0, misplaced = 0;
  for (let i = 0; i < 4; i++) {
    if (input[i] === crackGame.secret[i]) exact++;
    else if (crackGame.secret.includes(input[i])) misplaced++;
  }
  crackGame.attemptsLeft--;

  if (exact === 4) { purgeVirusSuccess(); return; }

  triggerShake();
  playAlarmSfx();
  printLine(`  [DENIED] ${input} -> EXACT: ${exact} | MISPLACED: ${misplaced} | TRIES LEFT: ${crackGame.attemptsLeft}`, "line-danger");

  if (crackGame.attemptsLeft <= 0) {
    triggerByeBye(`0 TRIES LEFT! ${playerInfo.pcName} HAS BEEN LOCKED!`);
  }
}

function exitTyperMode() {
  typerActive = false;
  cmdInput.disabled = false;
  focusInput();
}

// ================= TELEMETRY & KEYBOARD =================
function updateTelemetry() {
  const cpu = systemInfected ? Math.floor(80 + Math.random() * 19) : Math.floor(15 + Math.random() * 20);
  document.getElementById("cpuVal").textContent = `${cpu}%`;
  document.getElementById("cpuBar").style.width = `${cpu}%`;
  document.getElementById("hudClock").textContent = new Date().toTimeString().slice(0, 8);
}

function pushPacket() {
  const log = document.getElementById("packetLog");
  if (!log) return;
  const msg = systemInfected ? `LOCKING ${playerInfo.pcName} SECTOR` : "FIREWALL :: CLEAN";
  const row = document.createElement("div");
  row.textContent = `[0x${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")}] ${msg}`;
  log.appendChild(row);
  while (log.children.length > 14) log.removeChild(log.firstChild);
}

cmdInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const val = cmdInput.value;
    cmdInput.value = "";
    handleCommand(val);
  } else if (e.key.length === 1) playKeyClick();
});

document.addEventListener("keydown", e => {
  if (takeoverActive && e.key === "Enter") { e.preventDefault(); enterEmergencyTerminal(); return; }
  if (!document.getElementById("accessBanner").classList.contains("hidden")) { hideBanner(); return; }
  if (!typerActive) return;
  if (e.key === "Escape") { exitTyperMode(); return; }

  e.preventDefault();
  playKeyClick();
  const chunk = FAKE_CODE.slice(typerCursor, typerCursor + 7);
  typerCursor = (typerCursor + 7) % FAKE_CODE.length;
  let block = document.getElementById("typerBlock");
  if (!block) { block = document.createElement("div"); block.id = "typerBlock"; block.className = "line line-accent"; outputEl.appendChild(block); }
  block.textContent += chunk;
  outputEl.scrollTop = outputEl.scrollHeight;
});

// ================= INIT =================
generateUniqueCode();
window.addEventListener("resize", resizeMatrix);
resizeMatrix();
setInterval(drawMatrix, 45);
requestAnimationFrame(drawRadar);
setInterval(updateTelemetry, 1000);
setInterval(pushPacket, 550);
setInterval(updateTakeoverFeeds, 180);