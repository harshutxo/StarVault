"""StarVault tamper-evident audit ledger primitives."""

from .canonical import CanonicalizationError, canonicalize
from .chain import ChainVerificationError, HashChain, verify_chain
from .entry import (
    DECISIONS,
    EVENT_TYPES,
    GENESIS_PREV_HASH,
    LedgerEntry,
    compute_entry_hash,
    make_entry,
)
from .merkle import (
    inclusion_proof,
    leaf_hash,
    merkle_root,
    node_hash,
    verify_inclusion,
)
from .pseudonym import generate_salt, pseudonym
from .sth import SignedTreeHead, sign_tree_head, verify_tree_head

__all__ = [
    "CanonicalizationError",
    "ChainVerificationError",
    "DECISIONS",
    "EVENT_TYPES",
    "GENESIS_PREV_HASH",
    "HashChain",
    "LedgerEntry",
    "SignedTreeHead",
    "canonicalize",
    "compute_entry_hash",
    "generate_salt",
    "inclusion_proof",
    "leaf_hash",
    "make_entry",
    "merkle_root",
    "node_hash",
    "pseudonym",
    "sign_tree_head",
    "verify_chain",
    "verify_inclusion",
    "verify_tree_head",
]
