import pytest

from starvault_ledger.canonical import CanonicalizationError, canonicalize


def test_sorts_keys_regardless_of_insertion_order():
    a = canonicalize({"b": 1, "a": 2})
    b = canonicalize({"a": 2, "b": 1})
    assert a == b == b'{"a":2,"b":1}'


def test_normalizes_number_representation():
    assert canonicalize({"n": 1.0}) == b'{"n":1}'


def test_nested_structures_are_canonical():
    assert canonicalize({"z": [3, 1], "a": {"y": 1, "x": 2}}) == b'{"a":{"x":2,"y":1},"z":[3,1]}'


def test_returns_bytes_not_str():
    assert isinstance(canonicalize({"a": 1}), bytes)


def test_rejects_nan():
    with pytest.raises(CanonicalizationError):
        canonicalize({"n": float("nan")})


def test_rejects_infinity():
    with pytest.raises(CanonicalizationError):
        canonicalize({"n": float("inf")})


def test_rejects_non_serializable_values():
    with pytest.raises(CanonicalizationError):
        canonicalize({"d": object()})
