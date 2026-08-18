import dataclasses

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

from starvault_ledger.merkle import merkle_root
from starvault_ledger.sth import SignedTreeHead, sign_tree_head, verify_tree_head

TS = "2026-08-18T10:00:00Z"


def _sth(key, leaves=(b"a", b"b", b"c")):
    return sign_tree_head(
        tree_size=len(leaves),
        root_hash=merkle_root(list(leaves)),
        timestamp=TS,
        private_key=key,
    )


def test_signature_verifies_with_the_matching_public_key():
    key = Ed25519PrivateKey.generate()
    assert verify_tree_head(_sth(key), key.public_key())


def test_signature_fails_with_a_different_public_key():
    assert not verify_tree_head(_sth(Ed25519PrivateKey.generate()), Ed25519PrivateKey.generate().public_key())


def test_tampering_with_the_root_invalidates_the_signature():
    key = Ed25519PrivateKey.generate()
    forged = dataclasses.replace(_sth(key), root_hash="f" * 64)
    assert not verify_tree_head(forged, key.public_key())


def test_tampering_with_the_tree_size_invalidates_the_signature():
    key = Ed25519PrivateKey.generate()
    forged = dataclasses.replace(_sth(key), tree_size=999)
    assert not verify_tree_head(forged, key.public_key())


def test_tampering_with_the_timestamp_invalidates_the_signature():
    key = Ed25519PrivateKey.generate()
    forged = dataclasses.replace(_sth(key), timestamp="2030-01-01T00:00:00Z")
    assert not verify_tree_head(forged, key.public_key())


def test_tampering_with_the_signature_invalidates_it():
    key = Ed25519PrivateKey.generate()
    forged = dataclasses.replace(_sth(key), signature="00" * 64)
    assert not verify_tree_head(forged, key.public_key())


def test_records_tree_size_and_hex_root():
    key = Ed25519PrivateKey.generate()
    sth = _sth(key)
    assert sth.tree_size == 3
    assert sth.root_hash == merkle_root([b"a", b"b", b"c"]).hex()


def test_signing_payload_excludes_the_signature():
    assert "signature" not in _sth(Ed25519PrivateKey.generate()).signing_payload()


def test_two_trees_with_the_same_size_but_different_roots_differ():
    key = Ed25519PrivateKey.generate()
    assert _sth(key, (b"a", b"b", b"c")).signature != _sth(key, (b"x", b"y", b"z")).signature


def test_is_a_frozen_dataclass():
    assert dataclasses.is_dataclass(SignedTreeHead)
