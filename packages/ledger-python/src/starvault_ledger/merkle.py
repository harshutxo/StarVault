"""Merkle tree per RFC 6962 (Certificate Transparency).

Leaves are prefixed with 0x00 and internal nodes with 0x01. The prefixes
are not decoration: without them an internal node can be presented as a
leaf, which forges inclusion proofs.
"""

from collections.abc import Sequence
from hashlib import sha256

__all__ = [
    "inclusion_proof",
    "leaf_hash",
    "merkle_root",
    "node_hash",
    "verify_inclusion",
]

_LEAF_PREFIX = b"\x00"
_NODE_PREFIX = b"\x01"


def leaf_hash(data: bytes) -> bytes:
    return sha256(_LEAF_PREFIX + data).digest()


def node_hash(left: bytes, right: bytes) -> bytes:
    return sha256(_NODE_PREFIX + left + right).digest()


def _split(size: int) -> int:
    """Largest power of two strictly less than ``size`` (RFC 6962 split)."""
    k = 1
    while k * 2 < size:
        k *= 2
    return k


def _root(hashes: list[bytes]) -> bytes:
    if not hashes:
        return sha256(b"").digest()
    if len(hashes) == 1:
        return hashes[0]
    k = _split(len(hashes))
    return node_hash(_root(hashes[:k]), _root(hashes[k:]))


def merkle_root(leaves: Sequence[bytes]) -> bytes:
    return _root([leaf_hash(leaf) for leaf in leaves])


def _proof(hashes: list[bytes], index: int) -> list[bytes]:
    if len(hashes) <= 1:
        return []
    k = _split(len(hashes))
    if index < k:
        return _proof(hashes[:k], index) + [_root(hashes[k:])]
    return _proof(hashes[k:], index - k) + [_root(hashes[:k])]


def inclusion_proof(leaves: Sequence[bytes], index: int) -> list[bytes]:
    """Audit path for ``leaves[index]``, leaf-to-root order."""
    if not 0 <= index < len(leaves):
        raise IndexError(f"index {index} out of range for {len(leaves)} leaves")
    return _proof([leaf_hash(leaf) for leaf in leaves], index)


def verify_inclusion(
    leaf: bytes,
    index: int,
    tree_size: int,
    proof: Sequence[bytes],
    root: bytes,
) -> bool:
    """Return True if ``leaf`` sits at ``index`` in a tree with ``root``."""
    if not 0 <= index < tree_size:
        return False

    computed = leaf_hash(leaf)
    node_index, last_index = index, tree_size - 1

    for sibling in proof:
        if last_index == 0:
            return False
        if node_index % 2 == 1 or node_index == last_index:
            computed = node_hash(sibling, computed)
            while node_index % 2 == 0 and node_index != 0:
                node_index //= 2
                last_index //= 2
        else:
            computed = node_hash(computed, sibling)
        node_index //= 2
        last_index //= 2

    return last_index == 0 and computed == root
