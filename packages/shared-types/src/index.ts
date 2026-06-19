export type StarVaultResourceType = "identity" | "document" | "health" | "finance" | "education" | "ai-memory";

export type AccessScope = "read" | "write" | "prove" | "license" | "delete";

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  resourceId?: string;
  purpose?: string;
  createdAt: string;
};
