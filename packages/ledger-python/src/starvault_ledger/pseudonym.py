"""Salted pseudonymous identifiers for ledger entries.

Ledger entries never carry a raw user identifier. A bare digest is not
enough: user identifiers come from a small, enumerable space, so an
unsalted hash is reversed by brute force in seconds. HMAC with a
per-user secret salt removes that attack.
"""

import hmac
import secrets
from hashlib import sha256

__all__ = ["generate_salt", "pseudonym", "SALT_BYTES"]

SALT_BYTES = 32


def generate_salt() -> bytes:
    """Return a fresh 32-byte salt. Store this alongside the user record."""
    return secrets.token_bytes(SALT_BYTES)


def pseudonym(user_id: str, salt: bytes) -> str:
    """Return the salted pseudonymous identifier for ``user_id``."""
    if len(salt) < SALT_BYTES:
        raise ValueError(f"salt must be at least {SALT_BYTES} bytes, got {len(salt)}")
    return hmac.new(salt, user_id.encode("utf-8"), sha256).hexdigest()
