"""Ledger entries and entry hashing.

An entry commits to its own contents and to its predecessor:

    entry_hash = SHA256(DOMAIN || prev_hash_bytes || canonical(payload))

``payload`` deliberately excludes ``entry_hash`` — a hash cannot commit
to itself — but does include ``prev_hash``, so that tampering with the
chain linkage is detected by recomputation alone.
"""

from dataclasses import dataclass, replace
from hashlib import sha256

from .canonical import canonicalize

__all__ = [
    "DECISIONS",
    "EVENT_TYPES",
    "GENESIS_PREV_HASH",
    "LedgerEntry",
    "compute_entry_hash",
    "make_entry",
]

_DOMAIN = b"starvault.ledger.entry.v1"

GENESIS_PREV_HASH = "0" * 64

EVENT_TYPES = frozenset(
    {
        "device.enrolled",
        "grant.created",
        "grant.revoked",
        "grant.expired",
        "access.granted",
        "access.denied",
        "key.rotated",
        "recovery.used",
        "item.created",
    }
)

DECISIONS = frozenset({"allow", "deny", "n/a"})


@dataclass(frozen=True)
class LedgerEntry:
    seq: int
    event_type: str
    subject: str
    audience: str
    scope: tuple[str, ...]
    decision: str
    timestamp: str
    prev_hash: str
    entry_hash: str
    grant_id: str | None = None
    grant_version: int | None = None
    reason_code: str | None = None
    notice_hash: str | None = None

    def payload(self) -> dict:
        """Return every field except ``entry_hash``, ready to canonicalize."""
        return {
            "seq": self.seq,
            "event_type": self.event_type,
            "subject": self.subject,
            "audience": self.audience,
            "scope": list(self.scope),
            "decision": self.decision,
            "timestamp": self.timestamp,
            "prev_hash": self.prev_hash,
            "grant_id": self.grant_id,
            "grant_version": self.grant_version,
            "reason_code": self.reason_code,
            "notice_hash": self.notice_hash,
        }


def compute_entry_hash(payload: dict, prev_hash: str) -> str:
    """Return the hex entry hash for ``payload`` chained to ``prev_hash``."""
    digest = sha256()
    digest.update(_DOMAIN)
    digest.update(bytes.fromhex(prev_hash))
    digest.update(canonicalize(payload))
    return digest.hexdigest()


def make_entry(
    *,
    seq: int,
    event_type: str,
    subject: str,
    audience: str,
    scope: tuple[str, ...],
    decision: str,
    timestamp: str,
    prev_hash: str,
    grant_id: str | None = None,
    grant_version: int | None = None,
    reason_code: str | None = None,
    notice_hash: str | None = None,
) -> LedgerEntry:
    """Build a `LedgerEntry` with its hash computed."""
    if event_type not in EVENT_TYPES:
        raise ValueError(f"unknown event_type: {event_type!r}")
    if decision not in DECISIONS:
        raise ValueError(f"unknown decision: {decision!r}")

    entry = LedgerEntry(
        seq=seq,
        event_type=event_type,
        subject=subject,
        audience=audience,
        scope=tuple(scope),
        decision=decision,
        timestamp=timestamp,
        prev_hash=prev_hash,
        entry_hash="",
        grant_id=grant_id,
        grant_version=grant_version,
        reason_code=reason_code,
        notice_hash=notice_hash,
    )
    return replace(entry, entry_hash=compute_entry_hash(entry.payload(), prev_hash))
