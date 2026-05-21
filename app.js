const STORAGE_KEY = "starvault.encrypted.v1";
const SALT_KEY = "starvault.salt.v1";

const seedState = {
  identity: {
    name: "",
    email: "",
    phone: "",
    country: "",
    idStatus: "Not verified",
    consentTerm: "Ask every time"
  },
  vault: [
    {
      id: crypto.randomUUID(),
      title: "Passport backup",
      category: "Identity",
      details: "Encrypted copy reference and renewal reminder.",
      createdAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: "AI chat export",
      category: "AI Training",
      details: "Contains private project notes, personal preferences, and contact mentions.",
      createdAt: new Date().toISOString()
    }
  ],
  permissions: [
    {
      id: crypto.randomUUID(),
      company: "Wellnest Health",
      scope: "Fitness, sleep, and health trend data",
      purpose: "Personalized health recommendations",
      status: "Active",
      risk: "Medium",
      expiresAt: "2026-08-21"
    },
    {
      id: crypto.randomUUID(),
      company: "Credora Finance",
      scope: "Income verification and transaction summaries",
      purpose: "Loan eligibility checks",
      status: "Pending",
      risk: "Low",
      expiresAt: "2026-06-20"
    },
    {
      id: crypto.randomUUID(),
      company: "ModelForge AI",
      scope: "Chat exports and writing samples",
      purpose: "AI training permission request",
      status: "Active",
      risk: "High",
      expiresAt: "2026-07-05"
    }
  ],
  imports: [],
  findings: [],
  logs: []
};

let vaultKey;
let state;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function base64ToBytes(base64) {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

async function getSalt() {
  const existing = localStorage.getItem(SALT_KEY);
  if (existing) return base64ToBytes(existing);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, bytesToBase64(salt));
  return salt;
}

async function deriveKey(passphrase) {
  const material = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: await getSalt(), iterations: 210000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptState() {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const payload = enc.encode(JSON.stringify(state));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, vaultKey, payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ iv: bytesToBase64(iv), data: bytesToBase64(ciphertext) }));
}

async function decryptState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return structuredClone(seedState);
  const parsed = JSON.parse(stored);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(parsed.iv) },
    vaultKey,
    base64ToBytes(parsed.data)
  );
  return JSON.parse(dec.decode(plaintext));
}

async function persist(action) {
  addLog(action);
  await encryptState();
  render();
}

function addLog(action) {
  state.logs.unshift({
    id: crypto.randomUUID(),
    action,
    at: new Date().toISOString()
  });
  state.logs = state.logs.slice(0, 40);
}

function riskClass(risk) {
  return `risk-${risk.toLowerCase()}`;
}

function privacyScore() {
  const activeHighRisk = state.permissions.filter((item) => item.status === "Active" && item.risk === "High").length;
  const findings = state.findings.filter((item) => item.risk !== "Low").length;
  const score = 96 - activeHighRisk * 16 - findings * 7 - Math.max(0, state.permissions.length - 4) * 3;
  return Math.max(35, score);
}

function render() {
  $("#privacy-score").textContent = privacyScore();
  $("#vault-count").textContent = state.vault.length;
  $("#permission-count").textContent = state.permissions.filter((item) => item.status === "Active").length;
  $("#risk-count").textContent = state.findings.filter((item) => item.risk !== "Low").length;

  renderVault();
  renderIdentity();
  renderPermissions();
  renderImports();
  renderScanner();
  renderLogs();
  renderDashboard();
}

function renderDashboard() {
  const active = state.permissions.filter((item) => item.status === "Active").slice(0, 3);
  $("#permission-preview").innerHTML = active.length
    ? active.map((item) => `
      <div class="stack-item">
        <div>
          <strong>${item.company}</strong>
          <div class="permission-meta">${item.scope}</div>
        </div>
        <strong class="${riskClass(item.risk)}">${item.risk}</strong>
      </div>
    `).join("")
    : `<div class="stack-item"><strong>No active permissions</strong><span>Clean slate</span></div>`;

  $("#finding-preview").innerHTML = state.findings.length
    ? state.findings.slice(0, 3).map((item) => `
      <div class="stack-item">
        <div>
          <strong>${item.title}</strong>
          <div class="permission-meta">${item.source}</div>
        </div>
        <strong class="${riskClass(item.risk)}">${item.risk}</strong>
      </div>
    `).join("")
    : `<div class="stack-item"><strong>No scan yet</strong><span>Run the scanner</span></div>`;
}

function renderVault() {
  $("#vault-list").innerHTML = state.vault.map((item) => `
    <article class="record-card">
      <span>${item.category}</span>
      <h3>${item.title}</h3>
      <p>${item.details}</p>
      <div class="card-actions">
        <button class="danger-button" data-delete-record="${item.id}">Delete</button>
      </div>
    </article>
  `).join("");
}

function renderIdentity() {
  const form = $("#identity-form");
  Object.entries(state.identity).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
}

function renderPermissions() {
  $("#permission-list").innerHTML = state.permissions.map((item) => `
    <article class="permission-card">
      <div class="permission-head">
        <div>
          <span class="permission-meta">${item.status} until ${item.expiresAt}</span>
          <h3>${item.company}</h3>
        </div>
        <strong class="${riskClass(item.risk)}">${item.risk}</strong>
      </div>
      <p><strong>Scope:</strong> ${item.scope}</p>
      <p><strong>Purpose:</strong> ${item.purpose}</p>
      <div class="card-actions">
        ${item.status !== "Active" ? `<button class="approve-button" data-approve="${item.id}">Approve</button>` : ""}
        ${item.status !== "Revoked" ? `<button class="danger-button" data-revoke="${item.id}">Revoke</button>` : ""}
      </div>
    </article>
  `).join("");
}

function renderImports() {
  $("#import-list").innerHTML = state.imports.length
    ? state.imports.map((item) => `
      <div class="timeline-item">
        <div>
          <strong>${item.source}</strong>
          <div class="permission-meta">${item.summary}</div>
        </div>
        <span>${new Date(item.at).toLocaleString()}</span>
      </div>
    `).join("")
    : `<div class="timeline-item"><strong>No imports yet</strong><span>Connect a source above</span></div>`;
}

function renderScanner() {
  $("#scanner-list").innerHTML = state.findings.length
    ? state.findings.map((item) => `
      <article class="finding-card">
        <span class="${riskClass(item.risk)}">${item.risk} risk</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p><strong>Source:</strong> ${item.source}</p>
      </article>
    `).join("")
    : `<article class="finding-card"><span>Ready</span><h3>No findings yet</h3><p>Run the scanner to inspect vault records and permissions for exposure risks.</p></article>`;
}

function renderLogs() {
  $("#log-list").innerHTML = state.logs.length
    ? state.logs.map((item) => `
      <div class="timeline-item">
        <strong>${item.action}</strong>
        <span>${new Date(item.at).toLocaleString()}</span>
      </div>
    `).join("")
    : `<div class="timeline-item"><strong>No activity yet</strong><span>Unlock and use the vault</span></div>`;
}

function scanPrivacy() {
  const findings = [];
  state.vault.forEach((item) => {
    const text = `${item.title} ${item.details}`.toLowerCase();
    if (text.includes("passport") || text.includes("government") || text.includes("id")) {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "Government identity data detected",
        source: item.title,
        description: "Keep this encrypted and only share through time-limited verified consent."
      });
    }
    if (text.includes("chat") || text.includes("ai") || text.includes("preferences")) {
      findings.push({
        id: crypto.randomUUID(),
        risk: "Medium",
        title: "AI training-sensitive text found",
        source: item.title,
        description: "This record may reveal preferences, writing style, contacts, or private project details."
      });
    }
  });
  state.permissions.forEach((permission) => {
    if (permission.status === "Active" && permission.risk === "High") {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "High-risk active permission",
        source: permission.company,
        description: "Review this permission and revoke it if the purpose no longer serves you."
      });
    }
  });
  state.findings = findings.length ? findings : [{
    id: crypto.randomUUID(),
    risk: "Low",
    title: "No sensitive exposure found",
    source: "StarVault scanner",
    description: "Current vault records and permissions look low risk."
  }];
}

function setActiveView(viewId) {
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
}

async function unlock(passphrase) {
  vaultKey = await deriveKey(passphrase);
  state = await decryptState();
  addLog("Vault unlocked");
  await encryptState();
  $("#unlock-panel").classList.add("hidden");
  $("#app-content").classList.remove("hidden");
  $("#lock-status").textContent = "Unlocked";
  $("#lock-status").className = "status-pill unlocked";
  render();
}

function lock() {
  vaultKey = undefined;
  state = undefined;
  $("#unlock-panel").classList.remove("hidden");
  $("#app-content").classList.add("hidden");
  $("#lock-status").textContent = "Locked";
  $("#lock-status").className = "status-pill locked";
  $("#passphrase").value = "";
}

$("#unlock-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("#unlock-error").textContent = "";
  try {
    await unlock($("#passphrase").value);
  } catch {
    $("#unlock-error").textContent = "Could not unlock vault. Check your passphrase.";
  }
});

$("#lock-button").addEventListener("click", lock);

$$(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !state) return;

  if (target.dataset.viewJump) setActiveView(target.dataset.viewJump);

  if (target.dataset.deleteRecord) {
    const record = state.vault.find((item) => item.id === target.dataset.deleteRecord);
    state.vault = state.vault.filter((item) => item.id !== target.dataset.deleteRecord);
    await persist(`Deleted vault record: ${record?.title ?? "Unknown"}`);
  }

  if (target.dataset.revoke) {
    const permission = state.permissions.find((item) => item.id === target.dataset.revoke);
    permission.status = "Revoked";
    await persist(`Revoked permission: ${permission.company}`);
  }

  if (target.dataset.approve) {
    const permission = state.permissions.find((item) => item.id === target.dataset.approve);
    permission.status = "Active";
    await persist(`Approved permission: ${permission.company}`);
  }

  if (target.classList.contains("connector")) {
    state.imports.unshift({
      id: crypto.randomUUID(),
      source: target.dataset.source,
      summary: "Imported metadata and prepared records for encrypted storage.",
      at: new Date().toISOString()
    });
    await persist(`Imported data from ${target.dataset.source}`);
  }
});

$("#vault-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.vault.unshift({
    id: crypto.randomUUID(),
    title: form.get("title").trim(),
    category: form.get("category"),
    details: form.get("details").trim(),
    createdAt: new Date().toISOString()
  });
  event.currentTarget.reset();
  await persist(`Added vault record: ${state.vault[0].title}`);
});

$("#identity-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.identity = Object.fromEntries(form.entries());
  await persist("Updated identity vault");
});

$("#seed-permissions").addEventListener("click", async () => {
  state.permissions.unshift({
    id: crypto.randomUUID(),
    company: "HireSignal",
    scope: "Verified identity, work history, and education claims",
    purpose: "Hiring platform verification",
    status: "Pending",
    risk: "Medium",
    expiresAt: "2026-07-21"
  });
  await persist("Loaded sample B2B consent request");
});

$("#run-scan").addEventListener("click", async () => {
  scanPrivacy();
  await persist("Ran AI privacy scanner");
});
