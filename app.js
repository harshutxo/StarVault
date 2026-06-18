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
      extractionType: "behavioral profiling",
      userBenefit: "Health insights",
      expiresAt: "2026-08-21"
    },
    {
      id: crypto.randomUUID(),
      company: "Credora Finance",
      scope: "Income verification and transaction summaries",
      purpose: "Loan eligibility checks",
      status: "Pending",
      risk: "Low",
      extractionType: "verification",
      userBenefit: "Credit application",
      expiresAt: "2026-06-20"
    },
    {
      id: crypto.randomUUID(),
      company: "ModelForge AI",
      scope: "Chat exports and writing samples",
      purpose: "AI training permission request",
      status: "Active",
      risk: "High",
      extractionType: "AI model training",
      userBenefit: "None disclosed",
      expiresAt: "2026-07-05"
    }
  ],
  network: {
    nodeId: `SVN-${crypto.randomUUID().slice(0, 8)}`,
    apiRequests: [
      {
        id: crypto.randomUUID(),
        requester: "TrialMed AI",
        category: "AI health research",
        scope: "Anonymized sleep trend proof",
        purpose: "Research cohort matching",
        status: "Pending",
        risk: "Medium",
        expiryHours: 24,
        tokenId: null
      },
      {
        id: crypto.randomUUID(),
        requester: "HireSignal",
        category: "Hiring verification",
        scope: "Identity and employment proof",
        purpose: "Candidate verification",
        status: "Pending",
        risk: "Low",
        expiryHours: 72,
        tokenId: null
      }
    ],
    tokens: [
      {
        id: `svt_${crypto.randomUUID().slice(0, 12)}`,
        requester: "Wellnest Health",
        scope: "Fitness trend summary",
        status: "Active",
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
      }
    ]
  },
  protocol: {
    layers: [
      { name: "Identity Layer", priority: "Critical", status: "Started", api: "POST /users, POST /login, GET /me" },
      { name: "Consent Layer", priority: "Critical", status: "Started", api: "POST /consent/request, POST /consent/approve, POST /consent/revoke" },
      { name: "Access Gateway", priority: "Critical", status: "Started", api: "POST /tokens/issue, POST /tokens/revoke" },
      { name: "Vault Layer", priority: "Critical", status: "Started", api: "POST /vault/upload, GET /vault/resource, DELETE /vault/resource" },
      { name: "Policy Engine", priority: "High", status: "Planned", api: "POST /policies/evaluate" },
      { name: "Audit Layer", priority: "Critical", status: "Started", api: "GET /audit/events" },
      { name: "Discovery Layer", priority: "High", status: "Planned", api: "GET /.well-known/starvault" },
      { name: "Federation Layer", priority: "Medium", status: "Planned", api: "POST /federation/handshake" },
      { name: "Cryptography Layer", priority: "Critical", status: "Started", api: "POST /keys/rotate" },
      { name: "Governance Layer", priority: "Medium", status: "Planned", api: "GET /svips" }
    ],
    components: [
      ["Identity Layer", "Critical", "Started"],
      ["Vault Layer", "Critical", "Started"],
      ["Encryption Service", "Critical", "Started"],
      ["Consent Engine", "Critical", "Started"],
      ["Access Gateway", "Critical", "Started"],
      ["Audit Layer", "Critical", "Started"],
      ["Resource Registry", "Critical", "Planned"],
      ["Database Layer", "Critical", "Planned"],
      ["API Gateway", "High", "Planned"],
      ["Developer SDK", "High", "Planned"],
      ["Application Registry", "High", "Planned"],
      ["Event Bus", "High", "Planned"],
      ["DID Support", "Medium", "Planned"],
      ["Distributed Storage", "Medium", "Planned"],
      ["Federation", "Medium", "Planned"],
      ["Blockchain Anchoring", "Low", "Optional"],
      ["AI Context Gateway", "High", "Planned"],
      ["Policy Engine", "High", "Planned"],
      ["Compliance Engine", "High", "Planned"],
      ["Governance", "Medium", "Planned"],
      ["Documentation", "Critical", "Started"]
    ],
    svips: [
      { id: "SVIP-0001", title: "Core consent request format", status: "Draft" },
      { id: "SVIP-0002", title: "Scoped token claims", status: "Draft" },
      { id: "SVIP-0003", title: "Audit event schema", status: "Draft" }
    ]
  },
  roadmap: {
    phases: [
      {
        phase: "Phase 1",
        title: "Core Protocol MVP",
        status: "In progress",
        objective: "Prove the local vault, consent, token, audit, and scanner loop works for normal users.",
        milestones: [
          { title: "Encrypted browser vault", status: "Done" },
          { title: "Identity vault and resource registry", status: "In progress" },
          { title: "Consent request and revoke flow", status: "In progress" },
          { title: "Scoped token simulation", status: "Done" },
          { title: "Audit log and privacy scanner", status: "Done" }
        ],
        metric: "Users can understand and control who accesses their data in under 3 minutes."
      },
      {
        phase: "Phase 2",
        title: "Developer Platform",
        status: "Planned",
        objective: "Let external apps request permission through a stable API and SDK.",
        milestones: [
          { title: "Application registry", status: "Planned" },
          { title: "REST API gateway", status: "Planned" },
          { title: "JavaScript SDK", status: "Planned" },
          { title: "Webhook event system", status: "Planned" },
          { title: "Developer docs and examples", status: "Planned" }
        ],
        metric: "First 3 partner apps can request, receive, and revoke scoped access."
      },
      {
        phase: "Phase 3",
        title: "AI Context Gateway",
        status: "Planned",
        objective: "Make AI agents ask for context through StarVault instead of silently ingesting data.",
        milestones: [
          { title: "AI agent identity", status: "Planned" },
          { title: "Memory permission modes", status: "Planned" },
          { title: "Session-only context grants", status: "Planned" },
          { title: "AI training license requests", status: "Planned" }
        ],
        metric: "AI apps can request calendar, notes, documents, and memory with explicit consent."
      },
      {
        phase: "Phase 4",
        title: "Enterprise and Compliance",
        status: "Planned",
        objective: "Give regulated companies consent, audit, and policy infrastructure they can trust.",
        milestones: [
          { title: "Policy engine", status: "Planned" },
          { title: "Compliance templates", status: "Planned" },
          { title: "Trust score and app reputation", status: "Planned" },
          { title: "SOC 2 readiness checklist", status: "Planned" }
        ],
        metric: "A healthcare, finance, or hiring pilot can pass internal privacy review."
      },
      {
        phase: "Phase 5",
        title: "Federation and Decentralization",
        status: "Planned",
        objective: "Allow multiple StarVault nodes and storage providers to interoperate.",
        milestones: [
          { title: "Discovery document", status: "Planned" },
          { title: "Federation handshake", status: "Planned" },
          { title: "DID and verifiable credential support", status: "Planned" },
          { title: "Optional audit anchoring", status: "Optional" }
        ],
        metric: "Independent StarVault nodes can exchange consent and audit proofs."
      },
      {
        phase: "Phase 6",
        title: "Ecosystem and Marketplace",
        status: "Planned",
        objective: "Turn StarVault into a developer ecosystem with connectors, policies, and governance.",
        milestones: [
          { title: "Connector marketplace", status: "Planned" },
          { title: "Policy marketplace", status: "Planned" },
          { title: "SVIP governance workflow", status: "Planned" },
          { title: "Reference SDKs for Python, Go, Swift, and Java", status: "Planned" }
        ],
        metric: "Developers can build on StarVault without the core team."
      }
    ],
    sprints: [
      ["Weeks 1-2", "Harden MVP state model, resource registry, and consent schema."],
      ["Weeks 3-4", "Create mock REST API contract, SDK examples, and app registry screens."],
      ["Weeks 5-6", "Build first partner demo: hiring or AI training consent workflow."],
      ["Weeks 7-8", "Add policy rules, trust scoring, and erasure request exports."],
      ["Weeks 9-10", "Write whitepaper, SVIP-0001, API docs, and developer quickstart."],
      ["Weeks 11-12", "Recruit pilot users and 2-3 developer partners for feedback."]
    ]
  },
  brokers: [
    {
      id: crypto.randomUUID(),
      name: "AdGraph Exchange",
      category: "Ad-tech profile broker",
      data: "Location, device IDs, browsing interests",
      status: "Unverified",
      risk: "High"
    },
    {
      id: crypto.randomUUID(),
      name: "PeopleSearch Index",
      category: "Identity lookup site",
      data: "Address, phone, relatives, public records",
      status: "Opt-out needed",
      risk: "High"
    },
    {
      id: crypto.randomUUID(),
      name: "Retail Signal Co",
      category: "Purchase analytics network",
      data: "Shopping behavior and loyalty signals",
      status: "Monitoring",
      risk: "Medium"
    }
  ],
  erasureRequests: [],
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
  const brokerRisk = getBrokers().filter((item) => item.risk === "High" && item.status !== "Suppressed").length;
  const activeTokens = getTokens().filter((item) => item.status === "Active").length;
  const score = 96 - activeHighRisk * 16 - findings * 7 - brokerRisk * 6 - Math.max(0, activeTokens - 3) * 3 - Math.max(0, state.permissions.length - 4) * 3;
  return Math.max(35, score);
}

function render() {
  migrateState();
  $("#privacy-score").textContent = privacyScore();
  $("#vault-count").textContent = state.vault.length;
  $("#permission-count").textContent = state.permissions.filter((item) => item.status === "Active").length;
  $("#risk-count").textContent = state.findings.filter((item) => item.risk !== "Low").length;
  $("#extraction-count").textContent = extractionAttempts().length;
  $("#token-count").textContent = getTokens().filter((item) => item.status === "Active").length;

  renderVault();
  renderIdentity();
  renderPermissions();
  renderProtocol();
  renderRoadmap();
  renderNetwork();
  renderSurveillance();
  renderImports();
  renderScanner();
  renderLogs();
  renderDashboard();
}

function migrateState() {
  state.network ??= structuredClone(seedState.network);
  state.network.nodeId ??= `SVN-${crypto.randomUUID().slice(0, 8)}`;
  state.network.apiRequests ??= [];
  state.network.tokens ??= [];
  state.protocol ??= structuredClone(seedState.protocol);
  state.protocol.layers ??= structuredClone(seedState.protocol.layers);
  state.protocol.components ??= structuredClone(seedState.protocol.components);
  state.protocol.svips ??= structuredClone(seedState.protocol.svips);
  state.roadmap ??= structuredClone(seedState.roadmap);
  state.roadmap.phases ??= structuredClone(seedState.roadmap.phases);
  state.roadmap.sprints ??= structuredClone(seedState.roadmap.sprints);
  state.brokers ??= structuredClone(seedState.brokers);
  state.erasureRequests ??= [];
  state.permissions.forEach((permission) => {
    permission.extractionType ??= permission.risk === "High" ? "data extraction" : "verification";
    permission.userBenefit ??= permission.risk === "High" ? "None disclosed" : "Service access";
  });
}

function getNetwork() {
  return state.network;
}

function getTokens() {
  return getNetwork().tokens;
}

function getProtocol() {
  return state.protocol;
}

function getRoadmap() {
  return state.roadmap;
}

function getBrokers() {
  return state.brokers ?? [];
}

function extractionAttempts() {
  return state.permissions.filter((item) => {
    const noBenefit = item.userBenefit === "None disclosed";
    const extraction = /training|profiling|advertising|extraction/i.test(item.extractionType);
    return item.status !== "Revoked" && (item.risk === "High" || noBenefit || extraction);
  });
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
      <p><strong>Extraction type:</strong> ${item.extractionType}</p>
      <p><strong>User benefit:</strong> ${item.userBenefit}</p>
      <div class="card-actions">
        ${item.status !== "Active" ? `<button class="approve-button" data-approve="${item.id}">Approve</button>` : ""}
        ${item.status !== "Revoked" ? `<button class="danger-button" data-revoke="${item.id}">Revoke</button>` : ""}
      </div>
    </article>
  `).join("");
}

function renderProtocol() {
  const priorityClass = (priority) => `priority-${priority.toLowerCase()}`;
  const statusClass = (status) => `status-${status.toLowerCase()}`;

  $("#protocol-layer-list").innerHTML = getProtocol().layers.map((layer) => `
    <article class="layer-card">
      <div>
        <span class="${priorityClass(layer.priority)}">${layer.priority}</span>
        <strong>${layer.name}</strong>
      </div>
      <p>${layer.api}</p>
      <em class="${statusClass(layer.status)}">${layer.status}</em>
    </article>
  `).join("");

  $("#component-matrix").innerHTML = getProtocol().components.map(([component, priority, status]) => `
    <div class="component-row">
      <strong>${component}</strong>
      <span class="${priorityClass(priority)}">${priority}</span>
      <em class="${statusClass(status)}">${status}</em>
    </div>
  `).join("");

  $("#svip-list").innerHTML = getProtocol().svips.map((svip) => `
    <div class="stack-item">
      <div>
        <strong>${svip.id}</strong>
        <div class="permission-meta">${svip.title}</div>
      </div>
      <span>${svip.status}</span>
    </div>
  `).join("");
}

function advanceNextProtocolLayer() {
  const plannedLayer = getProtocol().layers.find((layer) => layer.status === "Planned");
  if (plannedLayer) {
    plannedLayer.status = "Started";
    const component = getProtocol().components.find(([name]) => name === plannedLayer.name || name.includes(plannedLayer.name.split(" ")[0]));
    if (component && component[2] === "Planned") component[2] = "Started";
    return plannedLayer.name;
  }
  return "All MVP protocol layers";
}

function registerProtocolRequest(request) {
  getProtocol().svips.unshift({
    id: `SVIP-${String(getProtocol().svips.length + 1).padStart(4, "0")}`,
    title: `${request.category} access profile for ${request.requester}`,
    status: "Draft"
  });
}

function renderRoadmap() {
  const statusClass = (status) => `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
  $("#roadmap-phase-list").innerHTML = getRoadmap().phases.map((phase) => `
    <article class="roadmap-card">
      <div class="roadmap-head">
        <div>
          <span>${phase.phase}</span>
          <h3>${phase.title}</h3>
        </div>
        <em class="${statusClass(phase.status)}">${phase.status}</em>
      </div>
      <p>${phase.objective}</p>
      <div class="milestone-list">
        ${phase.milestones.map((milestone) => `
          <div class="milestone">
            <strong>${milestone.title}</strong>
            <em class="${statusClass(milestone.status)}">${milestone.status}</em>
          </div>
        `).join("")}
      </div>
      <div class="roadmap-metric">${phase.metric}</div>
    </article>
  `).join("");

  $("#sprint-list").innerHTML = getRoadmap().sprints.map(([period, task]) => `
    <div class="sprint-row">
      <strong>${period}</strong>
      <p>${task}</p>
    </div>
  `).join("");
}

function completeNextRoadmapMilestone() {
  for (const phase of getRoadmap().phases) {
    const milestone = phase.milestones.find((item) => item.status !== "Done" && item.status !== "Optional");
    if (milestone) {
      milestone.status = "Done";
      const unfinished = phase.milestones.some((item) => item.status !== "Done" && item.status !== "Optional");
      phase.status = unfinished ? "In progress" : "Done";
      return `${phase.title}: ${milestone.title}`;
    }
  }
  return "All roadmap milestones";
}

function syncRoadmapWithProtocol(layerName) {
  const phase = getRoadmap().phases.find((item) => item.title === "Core Protocol MVP");
  const match = phase?.milestones.find((milestone) => layerName.toLowerCase().includes(milestone.title.split(" ")[0].toLowerCase()));
  if (match && match.status !== "Done") match.status = "In progress";
}

function renderNetwork() {
  $("#node-id").textContent = getNetwork().nodeId;
  $("#api-request-list").innerHTML = getNetwork().apiRequests.length
    ? getNetwork().apiRequests.map((request) => `
      <div class="stack-item network-item">
        <div>
          <strong>${request.requester}</strong>
          <div class="permission-meta">${request.category} · ${request.status}</div>
          <p>${request.scope}</p>
          <p><strong>Purpose:</strong> ${request.purpose}</p>
        </div>
        <div class="broker-actions">
          <strong class="${riskClass(request.risk)}">${request.risk}</strong>
          ${request.status === "Pending" ? `<button class="approve-button" data-issue-token="${request.id}">Issue token</button>` : ""}
          ${request.status !== "Denied" && request.status !== "Token issued" ? `<button class="danger-button" data-deny-request="${request.id}">Deny</button>` : ""}
        </div>
      </div>
    `).join("")
    : `<div class="stack-item"><strong>No pending API requests</strong><span>Gateway idle</span></div>`;

  $("#token-list").innerHTML = getTokens().length
    ? getTokens().map((token) => `
      <div class="stack-item network-item">
        <div>
          <strong>${token.id}</strong>
          <div class="permission-meta">${token.requester} · ${token.status}</div>
          <p>${token.scope}</p>
          <p><strong>Expires:</strong> ${new Date(token.expiresAt).toLocaleString()}</p>
        </div>
        <div class="broker-actions">
          <button class="danger-button" data-revoke-token="${token.id}">${token.status === "Revoked" ? "Revoked" : "Revoke"}</button>
        </div>
      </div>
    `).join("")
    : `<div class="stack-item"><strong>No network tokens</strong><span>Issue a scoped grant</span></div>`;
}

function issueNetworkToken(request) {
  const token = {
    id: `svt_${crypto.randomUUID().slice(0, 12)}`,
    requester: request.requester,
    scope: request.scope,
    status: "Active",
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * request.expiryHours).toISOString()
  };
  request.status = "Token issued";
  request.tokenId = token.id;
  getTokens().unshift(token);
  state.permissions.unshift({
    id: crypto.randomUUID(),
    company: request.requester,
    scope: request.scope,
    purpose: request.purpose,
    status: "Active",
    risk: request.risk,
    extractionType: request.category,
    userBenefit: "Network-mediated access with revocation",
    expiresAt: token.expiresAt.slice(0, 10)
  });
  return token;
}

function renderSurveillance() {
  $("#broker-list").innerHTML = getBrokers().map((broker) => `
    <div class="stack-item broker-item">
      <div>
        <strong>${broker.name}</strong>
        <div class="permission-meta">${broker.category}</div>
        <p>${broker.data}</p>
      </div>
      <div class="broker-actions">
        <strong class="${riskClass(broker.risk)}">${broker.risk}</strong>
        <button class="danger-button" data-suppress-broker="${broker.id}">${broker.status === "Suppressed" ? "Suppressed" : "Opt out"}</button>
      </div>
    </div>
  `).join("");

  const rights = [
    ["Deny by default", "Companies cannot access sensitive vault data until a request is explicitly approved."],
    ["Purpose limitation", "Every permission must name why data is requested and what benefit the user receives."],
    ["One-click revoke", "Active permissions can be withdrawn and recorded in the audit trail."],
    ["Erasure queue", `${state.erasureRequests.length} broker opt-out or deletion requests prepared.`]
  ];

  $("#rights-list").innerHTML = rights.map(([title, body]) => `
    <article class="right-card">
      <strong>${title}</strong>
      <p>${body}</p>
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
    if (permission.status !== "Revoked" && permission.userBenefit === "None disclosed") {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "Extraction without user benefit",
        source: permission.company,
        description: "This request asks for valuable personal data without disclosing a meaningful benefit to the user."
      });
    }
  });
  getBrokers().forEach((broker) => {
    if (broker.status !== "Suppressed" && broker.risk === "High") {
      findings.push({
        id: crypto.randomUUID(),
        risk: "High",
        title: "Possible broker exposure",
        source: broker.name,
        description: `${broker.category} may expose ${broker.data.toLowerCase()}. Prepare an opt-out or deletion request.`
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

  if (target.dataset.issueToken) {
    const request = getNetwork().apiRequests.find((item) => item.id === target.dataset.issueToken);
    const token = issueNetworkToken(request);
    registerProtocolRequest(request);
    await persist(`Issued scoped network token: ${token.id}`);
  }

  if (target.dataset.denyRequest) {
    const request = getNetwork().apiRequests.find((item) => item.id === target.dataset.denyRequest);
    request.status = "Denied";
    await persist(`Denied network request: ${request.requester}`);
  }

  if (target.dataset.revokeToken) {
    const token = getTokens().find((item) => item.id === target.dataset.revokeToken);
    token.status = "Revoked";
    state.permissions
      .filter((permission) => permission.company === token.requester && permission.scope === token.scope)
      .forEach((permission) => {
        permission.status = "Revoked";
      });
    await persist(`Revoked network token: ${token.id}`);
  }

  if (target.dataset.suppressBroker) {
    const broker = getBrokers().find((item) => item.id === target.dataset.suppressBroker);
    broker.status = "Suppressed";
    state.erasureRequests.unshift({
      id: crypto.randomUUID(),
      target: broker.name,
      data: broker.data,
      at: new Date().toISOString()
    });
    await persist(`Prepared broker opt-out request: ${broker.name}`);
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
    extractionType: "employment screening",
    userBenefit: "Job application verification",
    expiresAt: "2026-07-21"
  });
  await persist("Loaded sample B2B consent request");
});

$("#run-scan").addEventListener("click", async () => {
  scanPrivacy();
  await persist("Ran AI privacy scanner");
});

$("#generate-erasure").addEventListener("click", async () => {
  getBrokers().filter((broker) => broker.status !== "Suppressed").forEach((broker) => {
    state.erasureRequests.unshift({
      id: crypto.randomUUID(),
      target: broker.name,
      data: broker.data,
      at: new Date().toISOString()
    });
    broker.status = "Opt-out drafted";
  });
  await persist("Generated data broker erasure requests");
});

$("#simulate-api-request").addEventListener("click", async () => {
  const samples = [
    {
      requester: "ModelForge Labs",
      category: "AI model training",
      scope: "Writing samples and preference signals",
      purpose: "Training dataset licensing request",
      risk: "High",
      expiryHours: 12
    },
    {
      requester: "Credora Finance",
      category: "Financial verification",
      scope: "Income proof without transaction history",
      purpose: "Loan underwriting",
      risk: "Low",
      expiryHours: 48
    },
    {
      requester: "Civic Research Cloud",
      category: "Public-interest research",
      scope: "Anonymized mobility pattern proof",
      purpose: "Urban planning study",
      risk: "Medium",
      expiryHours: 24
    }
  ];
  getNetwork().apiRequests.unshift({
    id: crypto.randomUUID(),
    status: "Pending",
    tokenId: null,
    ...samples[Math.floor(Math.random() * samples.length)]
  });
  await persist("Received network API consent request");
});

$("#advance-protocol").addEventListener("click", async () => {
  const layerName = advanceNextProtocolLayer();
  syncRoadmapWithProtocol(layerName);
  await persist(`Advanced protocol layer: ${layerName}`);
});

$("#complete-roadmap-item").addEventListener("click", async () => {
  const milestone = completeNextRoadmapMilestone();
  await persist(`Completed roadmap milestone: ${milestone}`);
});
