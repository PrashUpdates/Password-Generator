const lengthInput = document.getElementById("length");
const lengthLabel = document.getElementById("lengthLabel");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const passwordText = document.getElementById("passwordText");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const copyMsg = document.getElementById("copyMsg");
const strengthBar = document.getElementById("strengthBar");
const strengthLabel = document.getElementById("strengthLabel");

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

lengthInput.addEventListener("input", () => {
  lengthLabel.textContent = lengthInput.value;
});

function generatePassword(length) {
  let pool = "";
  if (uppercaseCheck.checked) pool += CHARS.uppercase;
  if (lowercaseCheck.checked) pool += CHARS.lowercase;
  if (numbersCheck.checked) pool += CHARS.numbers;
  if (symbolsCheck.checked) pool += CHARS.symbols;

  if (!pool) {
    return null;
  }

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += pool[array[i] % pool.length];
  }
  return password;
}

function updateStrength(password) {
  if (!password) {
    strengthBar.style.width = "0%";
    strengthBar.style.background = "transparent";
    strengthLabel.textContent = "";
    return;
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 14) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { width: "20%", color: "#ef4444", label: "Very weak" },
    { width: "40%", color: "#f97316", label: "Weak" },
    { width: "60%", color: "#eab308", label: "Fair" },
    { width: "80%", color: "#22c55e", label: "Strong" },
    { width: "100%", color: "#16a34a", label: "Very strong" }
  ];

  const level = levels[Math.min(score, levels.length - 1)];
  strengthBar.style.width = level.width;
  strengthBar.style.background = level.color;
  strengthLabel.textContent = level.label;
}

generateBtn.addEventListener("click", () => {
  const length = parseInt(lengthInput.value, 10);
  const password = generatePassword(length);

  if (!password) {
    passwordText.textContent = "Select at least one option";
    updateStrength(null);
    return;
  }

  passwordText.textContent = password;
  updateStrength(password);
  copyMsg.textContent = "";
});

copyBtn.addEventListener("click", () => {
  const text = passwordText.textContent;
  if (!text || text === "Click generate" || text === "Select at least one option") return;

  navigator.clipboard.writeText(text).then(() => {
    copyMsg.textContent = "Copied!";
    setTimeout(() => (copyMsg.textContent = ""), 1500);
  });
});

// Generate one on load
generateBtn.click();
