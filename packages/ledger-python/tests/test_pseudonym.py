import pytest

from starvault_ledger.pseudonym import generate_salt, pseudonym


def test_salt_is_32_bytes():
    assert len(generate_salt()) == 32


def test_salts_differ_between_calls():
    assert generate_salt() != generate_salt()


def test_is_deterministic_for_same_salt():
    salt = generate_salt()
    assert pseudonym("user-1", salt) == pseudonym("user-1", salt)


def test_differs_across_salts_for_same_user():
    assert pseudonym("user-1", generate_salt()) != pseudonym("user-1", generate_salt())


def test_differs_across_users_for_same_salt():
    salt = generate_salt()
    assert pseudonym("user-1", salt) != pseudonym("user-2", salt)


def test_is_lowercase_hex_of_sha256_length():
    value = pseudonym("user-1", generate_salt())
    assert len(value) == 64
    assert value == value.lower()
    int(value, 16)


def test_is_not_a_bare_sha256_of_the_user_id():
    """The defect this module exists to prevent: an unsalted digest is
    reversible over an enumerable identifier space."""
    import hashlib

    salt = generate_salt()
    assert pseudonym("user-1", salt) != hashlib.sha256(b"user-1").hexdigest()


def test_rejects_short_salt():
    with pytest.raises(ValueError):
        pseudonym("user-1", b"tooshort")
