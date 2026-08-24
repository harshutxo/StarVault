export interface CapabilityToken {
  tokenId: string;
  subjectId: string;
  clientId: string;
  scopes: string[];
  purpose: string;
  issuedAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export function tokenAllows(token: CapabilityToken, scope: string, now = new Date()): boolean {
  return !token.revokedAt && token.scopes.includes(scope) && new Date(token.expiresAt).getTime() > now.getTime();
}
