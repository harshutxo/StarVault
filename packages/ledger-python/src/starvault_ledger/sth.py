"""Signed Tree Head.

The STH is what makes the log externally checkable: it is the only
artifact published each epoch, and it commits the operator to one
history. Once published, a divergent history is detectable by anyone
holding a prior STH.
"""

from dataclasses import dataclass

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)

from .canonical import canonicalize

__all__ = ["SignedTreeHead", "sign_tree_head", "verify_tree_head"]

_DOMAIN = b"starvault.ledger.sth.v1"


@dataclass(frozen=True)
class SignedTreeHead:
    tree_size: int
    root_hash: str
    timestamp: str
    signature: str

    def signing_payload(self) -> dict:
        """The canonicalized fields the signature covers."""
        return {
            "tree_size": self.tree_size,
            "root_hash": self.root_hash,
            "timestamp": self.timestamp,
        }


def _signed_bytes(payload: dict) -> bytes:
    return _DOMAIN + canonicalize(payload)


def sign_tree_head(
    *,
    tree_size: int,
    root_hash: bytes,
    timestamp: str,
    private_key: Ed25519PrivateKey,
) -> SignedTreeHead:
    payload = {
        "tree_size": tree_size,
        "root_hash": root_hash.hex(),
        "timestamp": timestamp,
    }
    signature = private_key.sign(_signed_bytes(payload))
    return SignedTreeHead(
        tree_size=tree_size,
        root_hash=root_hash.hex(),
        timestamp=timestamp,
        signature=signature.hex(),
    )


def verify_tree_head(sth: SignedTreeHead, public_key: Ed25519PublicKey) -> bool:
    try:
        public_key.verify(bytes.fromhex(sth.signature), _signed_bytes(sth.signing_payload()))
    except (InvalidSignature, ValueError):
        return False
    return True
