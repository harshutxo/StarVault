import dataclasses

import pytest

from starvault_ledger.chain import ChainVerificationError, HashChain, verify_chain
from starvault_ledger.entry import GENESIS_PREV_HASH

TS = "2026-08-18T10:00:00Z"


def _append(chain, **overrides):
    kwargs = dict(
        event_type="access.granted",
        subject="a" * 64,
        audience="app-1",
        scope=("health.labs:read",),
        decision="allow",
        timestamp=TS,
    )
    kwargs.update(overrides)
    return chain.append(**kwargs)


def test_empty_chain_head_is_genesis():
    assert HashChain().head == GENESIS_PREV_HASH


def test_empty_chain_verifies():
    verify_chain(())


def test_first_entry_links_to_genesis():
    chain = HashChain()
    assert _append(chain).prev_hash == GENESIS_PREV_HASH


def test_sequence_numbers_start_at_zero_and_increment():
    chain = HashChain()
    assert [_append(chain).seq for _ in range(3)] == [0, 1, 2]


def test_each_entry_links_to_its_predecessor():
    chain = HashChain()
    first = _append(chain)
    second = _append(chain)
    assert second.prev_hash == first.entry_hash


def test_head_tracks_the_last_entry():
    chain = HashChain()
    _append(chain)
    last = _append(chain)
    assert chain.head == last.entry_hash


def test_a_well_formed_chain_verifies():
    chain = HashChain()
    for _ in range(5):
        _append(chain)
    verify_chain(chain.entries)


def test_entries_is_immutable():
    chain = HashChain()
    _append(chain)
    assert isinstance(chain.entries, tuple)


def test_verification_error_reports_index_and_reason():
    chain = HashChain()
    _append(chain)
    _append(chain)
    tampered = list(chain.entries)
    tampered[1] = dataclasses.replace(tampered[1], decision="deny")
    with pytest.raises(ChainVerificationError) as exc:
        verify_chain(tampered)
    assert exc.value.index == 1
    assert exc.value.reason
