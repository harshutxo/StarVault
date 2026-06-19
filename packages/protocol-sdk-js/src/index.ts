import type { AuthorizationRequest, ConsentRequest } from "@starvault/protocol";

export class StarVaultClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string
  ) {}

  async requestConsent(request: ConsentRequest) {
    const response = await fetch(`${this.baseUrl}/consent/request`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`StarVault consent request failed: ${response.status}`);
    }

    return response.json();
  }

  async requestAccess(request: Omit<AuthorizationRequest, "clientId" | "responseType">) {
    const response = await fetch(`${this.baseUrl}/oauth/authorize`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        ...request,
        clientId: this.apiKey,
        responseType: "code"
      })
    });

    if (!response.ok) {
      throw new Error(`StarVault access request failed: ${response.status}`);
    }

    return response.json();
  }
}
