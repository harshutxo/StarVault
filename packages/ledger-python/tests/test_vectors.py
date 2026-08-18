import json
from pathlib import Path

import pytest

from starvault_ledger import (
    canonicalize,
    compute_entry_hash,
    inclusion_proof,
    merkle_root,
    verify_inclusion,
)

VECTORS = Path(__file__).resolve().parents[2] / "protocol-spec" / "vectors"


def _load(name):
    return json.loads((VECTORS / name).read_text(encoding="utf-8"))


REQUIRED_FILES = ["canonical.json", "chain.json", "merkle.json"]


def test_vector_directory_exists():
    assert VECTORS.is_dir(), f"missing vectors directory: {VECTORS}"


@pytest.mark.parametrize("name", REQUIRED_FILES)
def test_vector_file_exists_and_is_non_empty(name):
    """Guards against vacuous success: an absent file yields zero
    parametrized cases, which would otherwise report as passing."""
    path = VECTORS / name
    assert path.is_file(), f"missing vector file: {path}"
    assert _load(name)["cases"], f"no cases in {path}"


@pytest.mark.parametrize("case", _load("canonical.json")["cases"] if (VECTORS / "canonical.json").exists() else [])
def test_canonical_vectors(case):
    assert canonicalize(case["input"]).decode("utf-8") == case["expected"]


@pytest.mark.parametrize("case", _load("chain.json")["cases"] if (VECTORS / "chain.json").exists() else [])
def test_chain_vectors(case):
    assert compute_entry_hash(case["payload"], case["prev_hash"]) == case["entry_hash"]


@pytest.mark.parametrize("case", _load("merkle.json")["cases"] if (VECTORS / "merkle.json").exists() else [])
def test_merkle_root_vectors(case):
    leaves = [bytes.fromhex(leaf) for leaf in case["leaves"]]
    assert merkle_root(leaves).hex() == case["root"]


@pytest.mark.parametrize("case", _load("merkle.json")["cases"] if (VECTORS / "merkle.json").exists() else [])
def test_merkle_inclusion_vectors(case):
    leaves = [bytes.fromhex(leaf) for leaf in case["leaves"]]
    root = bytes.fromhex(case["root"])
    for entry in case["proofs"]:
        index = entry["index"]
        proof = [bytes.fromhex(step) for step in entry["path"]]
        assert inclusion_proof(leaves, index) == proof
        assert verify_inclusion(leaves[index], index, len(leaves), proof, root)
