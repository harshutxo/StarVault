"""RFC 8785 JSON Canonicalization.

Every hash in the ledger is taken over canonical bytes. If two
implementations disagree on serialization by a single byte, every proof
they exchange fails to verify, so this module is deliberately thin: it
delegates to a maintained JCS implementation rather than reproducing the
specification by hand.
"""

import rfc8785

__all__ = ["canonicalize", "CanonicalizationError"]


class CanonicalizationError(ValueError):
    """Raised when a value cannot be canonically serialized."""


def canonicalize(obj: dict) -> bytes:
    """Serialize ``obj`` to canonical JSON bytes per RFC 8785."""
    try:
        return rfc8785.dumps(obj)
    except Exception as exc:  # rfc8785 raises several unrelated types
        raise CanonicalizationError(str(exc)) from exc
