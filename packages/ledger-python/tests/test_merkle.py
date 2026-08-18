from hashlib import sha256

import pytest

from starvault_ledger.merkle import (
    inclusion_proof,
    leaf_hash,
    merkle_root,
    node_hash,
    verify_inclusion,
)


def test_empty_tree_root_is_sha256_of_empty_string():
    assert merkle_root([]) == sha256(b"").digest()


def test_single_leaf_root_is_its_leaf_hash():
    assert merkle_root([b"a"]) == leaf_hash(b"a")


def test_two_leaf_root_is_node_of_both():
    assert merkle_root([b"a", b"b"]) == node_hash(leaf_hash(b"a"), leaf_hash(b"b"))


def test_leaf_and_node_hashes_are_domain_separated():
    """An internal node must never be presentable as a leaf."""
    assert leaf_hash(b"") != node_hash(b"", b"")


def test_root_changes_when_any_leaf_changes():
    assert merkle_root([b"a", b"b", b"c"]) != merkle_root([b"a", b"x", b"c"])


def test_root_changes_when_leaves_are_reordered():
    assert merkle_root([b"a", b"b"]) != merkle_root([b"b", b"a"])


@pytest.mark.parametrize("size", [1, 2, 3, 4, 5, 7, 8, 9, 16, 17])
def test_inclusion_proof_verifies_for_every_leaf(size):
    leaves = [f"leaf-{i}".encode() for i in range(size)]
    root = merkle_root(leaves)
    for index, leaf in enumerate(leaves):
        proof = inclusion_proof(leaves, index)
        assert verify_inclusion(leaf, index, size, proof, root)


def test_inclusion_proof_fails_for_a_leaf_not_in_the_tree():
    leaves = [b"a", b"b", b"c"]
    root = merkle_root(leaves)
    proof = inclusion_proof(leaves, 1)
    assert not verify_inclusion(b"forged", 1, 3, proof, root)


def test_inclusion_proof_fails_with_a_tampered_path():
    leaves = [b"a", b"b", b"c", b"d"]
    root = merkle_root(leaves)
    proof = inclusion_proof(leaves, 0)
    proof[0] = bytes(32)
    assert not verify_inclusion(b"a", 0, 4, proof, root)


def test_inclusion_proof_fails_at_the_wrong_index():
    leaves = [b"a", b"b", b"c", b"d"]
    root = merkle_root(leaves)
    proof = inclusion_proof(leaves, 0)
    assert not verify_inclusion(b"a", 1, 4, proof, root)


def test_inclusion_proof_rejects_out_of_range_index():
    with pytest.raises(IndexError):
        inclusion_proof([b"a", b"b"], 5)
