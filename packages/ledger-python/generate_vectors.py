"""Regenerate the shared conformance vectors.

Run after any intentional change to hashing or serialization:

    packages/ledger-python/.venv/bin/python packages/ledger-python/generate_vectors.py

Any change to the output is a protocol-breaking change and invalidates
every proof already published.
"""

import json
from pathlib import Path

from starvault_ledger import (
    GENESIS_PREV_HASH,
    HashChain,
    canonicalize,
    inclusion_proof,
    merkle_root,
)

VECTORS = Path(__file__).resolve().parents[1] / "protocol-spec" / "vectors"
TS = "2026-08-18T10:00:00Z"


def canonical_cases():
    inputs = [
        {"b": 1, "a": 2},
        {"n": 1.0},
        {"z": [3, 1], "a": {"y": 1, "x": 2}},
        {"unicode": "café", "emoji": "🔐"},
        {"nested": {"empty_obj": {}, "empty_list": []}},
        {"null": None, "true": True, "false": False},
        {"negative": -1, "zero": 0, "large": 9007199254740991},
    ]
    return [{"input": value, "expected": canonicalize(value).decode("utf-8")} for value in inputs]


def chain_cases():
    chain = HashChain()
    for index in range(4):
        chain.append(
            event_type="access.granted",
            subject="a" * 64,
            audience=f"app-{index}",
            scope=("health.labs:read",),
            decision="allow",
            timestamp=TS,
            grant_id=f"grant-{index}",
            grant_version=1,
        )
    return [
        {"payload": entry.payload(), "prev_hash": entry.prev_hash, "entry_hash": entry.entry_hash}
        for entry in chain.entries
    ]


def merkle_cases():
    cases = []
    for size in (1, 2, 3, 4, 5, 8, 9):
        leaves = [f"leaf-{i}".encode() for i in range(size)]
        cases.append(
            {
                "leaves": [leaf.hex() for leaf in leaves],
                "root": merkle_root(leaves).hex(),
                "proofs": [
                    {"index": index, "path": [step.hex() for step in inclusion_proof(leaves, index)]}
                    for index in range(size)
                ],
            }
        )
    return cases


def write(name: str, payload: dict) -> None:
    path = VECTORS / name
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {path}")


def main() -> None:
    VECTORS.mkdir(parents=True, exist_ok=True)
    write(
        "canonical.json",
        {"description": "RFC 8785 canonicalization vectors", "cases": canonical_cases()},
    )
    write(
        "chain.json",
        {
            "description": "Ledger entry hash chain vectors",
            "domain": "starvault.ledger.entry.v1",
            "genesis_prev_hash": GENESIS_PREV_HASH,
            "cases": chain_cases(),
        },
    )
    write(
        "merkle.json",
        {"description": "RFC 6962 Merkle roots and inclusion proofs", "cases": merkle_cases()},
    )


if __name__ == "__main__":
    main()
