import httpx


class StarVaultClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key

    def request_consent(self, payload: dict) -> dict:
        response = httpx.post(
            f"{self.base_url}/consent/request",
            json=payload,
            headers={"Authorization": f"Bearer {self.api_key}"},
            timeout=15,
        )
        response.raise_for_status()
        return response.json()
