from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from hashlib import sha256
from uuid import uuid4


@dataclass
class BarrierLedgerEvent:
    transaction_id: str
    user_hash: str
    requester_app_id: str
    requester_name: str
    resource_type: str
    purpose: str
    scope: str
    consent_id: str
    token_id: str | None
    decision: str
    previous_event_hash: str | None
    event_hash: str
    created_at: str


class StarVaultBarrierContract:
    """Reference chaincode shape for StarVault barrier ledger events.

    Production Fabric chaincode should implement this transaction shape in the
    chosen Fabric runtime. Raw user data must never be written to the ledger.
    """

    def __init__(self) -> None:
        self.events: list[dict] = []

    def record_transaction(
        self,
        user_id: str,
        requester_app_id: str,
        requester_name: str,
        resource_type: str,
        purpose: str,
        scope: str,
        consent_id: str,
        decision: str,
        token_id: str | None = None,
    ) -> dict:
        previous_hash = self.events[0]["event_hash"] if self.events else None
        base_event = {
            "transaction_id": f"svtx_{uuid4().hex[:16]}",
            "user_hash": sha256(user_id.encode("utf-8")).hexdigest(),
            "requester_app_id": requester_app_id,
            "requester_name": requester_name,
            "resource_type": resource_type,
            "purpose": purpose,
            "scope": scope,
            "consent_id": consent_id,
            "token_id": token_id,
            "decision": decision,
            "previous_event_hash": previous_hash,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        event_hash = sha256(str(base_event).encode("utf-8")).hexdigest()
        event = BarrierLedgerEvent(event_hash=event_hash, **base_event)
        self.events.insert(0, asdict(event))
        return asdict(event)

    def verify_chain(self) -> bool:
        for index, event in enumerate(self.events):
            expected_previous = self.events[index + 1]["event_hash"] if index + 1 < len(self.events) else None
            if event["previous_event_hash"] != expected_previous:
                return False
        return True
