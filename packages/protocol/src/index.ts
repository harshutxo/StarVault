export const protocolLayers = [
  { name: "Identity Layer", priority: "Critical", api: "POST /users, POST /login, GET /me" },
  { name: "Consent Layer", priority: "Critical", api: "POST /consent/request, POST /consent/approve, POST /consent/revoke" },
  { name: "Access Gateway", priority: "Critical", api: "POST /tokens/issue, POST /tokens/revoke, POST /tokens/introspect" },
  { name: "Vault Layer", priority: "Critical", api: "POST /vault/upload, GET /vault/resource, DELETE /vault/resource" },
  { name: "Policy Engine", priority: "High", api: "POST /policies/evaluate" },
  { name: "Audit Layer", priority: "Critical", api: "GET /audit/events" },
  { name: "Discovery Layer", priority: "High", api: "GET /.well-known/starvault" },
  { name: "Federation Layer", priority: "Medium", api: "POST /federation/handshake" },
  { name: "Cryptography Layer", priority: "Critical", api: "POST /keys/rotate" },
  { name: "Governance Layer", priority: "Medium", api: "GET /svips" }
] as const;

export const roadmapPhases = [
  { phase: "Phase 1", title: "Core Protocol MVP", objective: "Prove the local vault, consent, token, audit, and scanner loop." },
  { phase: "Phase 2", title: "Developer Platform", objective: "Let external apps request permission through APIs and SDKs." },
  { phase: "Phase 3", title: "AI Context Gateway", objective: "Make AI agents ask for context and memory through StarVault." },
  { phase: "Phase 4", title: "Enterprise and Compliance", objective: "Support regulated consent, policy, audit, and compliance workflows." },
  { phase: "Phase 5", title: "Federation and Decentralization", objective: "Let independent StarVault nodes interoperate." },
  { phase: "Phase 6", title: "Ecosystem and Marketplace", objective: "Enable connectors, policies, SDKs, and governance through SVIPs." }
] as const;

export type ConsentRequest = {
  requesterAppId: string;
  requesterName: string;
  resourceType: string;
  purpose: string;
  scope: string[];
  durationSeconds: number;
  exportAllowed: boolean;
  userBenefit: string;
  retention: string;
  revocationEndpoint: string;
};

export type ApplicationRegistration = {
  name: string;
  redirectUris: string[];
  publicKey: string;
  rateLimitTier: "sandbox" | "standard" | "enterprise";
};

export type AuthorizationRequest = {
  clientId: string;
  redirectUri: string;
  responseType: "code";
  state: string;
  resourceType: string;
  capabilities: DataCapability[];
};

export type DataCapability = {
  action: "read" | "prove" | "license" | "write";
  resource: string;
  fields?: string[];
  oneTime: boolean;
  expiresInSeconds: number;
  exportAllowed: boolean;
  resharingAllowed: boolean;
};

export type CapabilityTokenClaims = {
  iss: "starvault";
  sub: string;
  aud: string;
  resource: string;
  capabilities: DataCapability[];
  purpose: string;
  exp: number;
  jti: string;
};
