"""Append-only per-user hash chain.

Verification recomputes every hash from entry contents. Comparing stored
linkage fields alone is not verification: it detects a broken chain but
not an edited one, which is the failure mode this module is written to
prevent.
"""

from collections.abc import Sequence

from .entry import GENESIS_PREV_HASH, LedgerEntry, compute_entry_hash, make_entry

__all__ = ["ChainVerificationError", "HashChain", "verify_chain"]


class ChainVerificationError(Exception):
    """Raised when a chain fails verification."""

    def __init__(self, index: int, reason: str) -> None:
        super().__init__(f"entry {index}: {reason}")
        self.index = index
        self.reason = reason


class HashChain:
    """An append-only sequence of ledger entries."""

    def __init__(self, entries: Sequence[LedgerEntry] = ()) -> None:
        self._entries: list[LedgerEntry] = list(entries)

    @property
    def entries(self) -> tuple[LedgerEntry, ...]:
        return tuple(self._entries)

    @property
    def head(self) -> str:
        """Hex hash of the last entry, or the genesis value if empty."""
        return self._entries[-1].entry_hash if self._entries else GENESIS_PREV_HASH

    def append(
        self,
        *,
        event_type: str,
        subject: str,
        audience: str,
        scope: tuple[str, ...],
        decision: str,
        timestamp: str,
        grant_id: str | None = None,
        grant_version: int | None = None,
        reason_code: str | None = None,
        notice_hash: str | None = None,
    ) -> LedgerEntry:
        entry = make_entry(
            seq=len(self._entries),
            event_type=event_type,
            subject=subject,
            audience=audience,
            scope=scope,
            decision=decision,
            timestamp=timestamp,
            prev_hash=self.head,
            grant_id=grant_id,
            grant_version=grant_version,
            reason_code=reason_code,
            notice_hash=notice_hash,
        )
        self._entries.append(entry)
        return entry


def verify_chain(entries: Sequence[LedgerEntry]) -> None:
    """Raise `ChainVerificationError` unless every entry is intact.

    Checks, per entry: the sequence number matches its position, the
    linkage matches the predecessor's recomputed hash, and the stored
    hash equals the hash recomputed from contents.
    """
    expected_prev = GENESIS_PREV_HASH
    for index, entry in enumerate(entries):
        if entry.seq != index:
            raise ChainVerificationError(index, f"seq is {entry.seq}, expected {index}")
        if entry.prev_hash != expected_prev:
            raise ChainVerificationError(index, "prev_hash does not match predecessor")
        recomputed = compute_entry_hash(entry.payload(), entry.prev_hash)
        if recomputed != entry.entry_hash:
            raise ChainVerificationError(index, "entry_hash does not match contents")
        expected_prev = entry.entry_hash
