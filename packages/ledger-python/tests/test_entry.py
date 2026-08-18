import dataclasses

import pytest

from starvault_ledger.entry import (
    GENESIS_PREV_HASH,
    compute_entry_hash,
    make_entry,
)

TS = "2026-08-18T10:00:00Z"


def _entry(**overrides):
    kwargs = dict(
        seq=0,
        event_type="access.granted",
        subject="a" * 64,
        audience="app-1",
        scope=("health.labs:read",),
        decision="allow",
        timestamp=TS,
        prev_hash=GENESIS_PREV_HASH,
    )
    kwargs.update(overrides)
    return make_entry(**kwargs)


def test_genesis_prev_hash_is_64_zeros():
    assert GENESIS_PREV_HASH == "0" * 64


def test_entry_hash_is_hex_sha256():
    entry = _entry()
    assert len(entry.entry_hash) == 64
    int(entry.entry_hash, 16)


def test_payload_excludes_entry_hash():
    """A hash cannot commit to itself."""
    assert "entry_hash" not in _entry().payload()


def test_payload_includes_prev_hash():
    assert _entry().payload()["prev_hash"] == GENESIS_PREV_HASH


def test_identical_inputs_produce_identical_hashes():
    assert _entry().entry_hash == _entry().entry_hash


def test_changing_any_field_changes_the_hash():
    baseline = _entry().entry_hash
    assert _entry(decision="deny").entry_hash != baseline
    assert _entry(audience="app-2").entry_hash != baseline
    assert _entry(scope=("health.labs:write",)).entry_hash != baseline
    assert _entry(timestamp="2026-08-18T10:00:01Z").entry_hash != baseline
    assert _entry(seq=1).entry_hash != baseline
    assert _entry(subject="b" * 64).entry_hash != baseline


def test_changing_prev_hash_changes_the_hash():
    assert _entry(prev_hash="f" * 64).entry_hash != _entry().entry_hash


def test_compute_entry_hash_matches_make_entry():
    entry = _entry()
    assert compute_entry_hash(entry.payload(), entry.prev_hash) == entry.entry_hash


def test_entry_is_immutable():
    with pytest.raises(dataclasses.FrozenInstanceError):
        _entry().decision = "deny"


def test_rejects_unknown_event_type():
    with pytest.raises(ValueError):
        _entry(event_type="not.a.real.event")


def test_rejects_unknown_decision():
    with pytest.raises(ValueError):
        _entry(decision="maybe")


def test_optional_fields_default_to_none():
    entry = _entry()
    assert entry.grant_id is None
    assert entry.grant_version is None
    assert entry.reason_code is None
    assert entry.notice_hash is None
