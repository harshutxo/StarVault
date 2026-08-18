"""Every mutation of every entry must be detected.

This suite exists because the prior implementation's verify() compared
stored linkage fields without ever recomputing a hash, so editing a
decision from "deny" to "allow" left verification reporting success.
"""

import dataclasses

import pytest

from starvault_ledger.chain import ChainVerificationError, HashChain, verify_chain

TS = "2026-08-18T10:00:00Z"

MUTATIONS = [
    ("decision", "deny"),
    ("event_type", "access.denied"),
    ("audience", "attacker-app"),
    ("subject", "b" * 64),
    ("scope", ("finance.txns:read",)),
    ("timestamp", "2030-01-01T00:00:00Z"),
    ("seq", 99),
    ("grant_id", "grant-forged"),
    ("grant_version", 42),
    ("reason_code", "forged"),
    ("notice_hash", "c" * 64),
    ("prev_hash", "d" * 64),
    ("entry_hash", "e" * 64),
]


def _chain(length=4):
    chain = HashChain()
    for index in range(length):
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
    return chain


@pytest.mark.parametrize("field_name,new_value", MUTATIONS)
@pytest.mark.parametrize("target", [0, 1, 3])
def test_mutating_any_field_of_any_entry_is_detected(field_name, new_value, target):
    entries = list(_chain().entries)
    entries[target] = dataclasses.replace(entries[target], **{field_name: new_value})
    with pytest.raises(ChainVerificationError):
        verify_chain(entries)


def test_deleting_an_entry_is_detected():
    entries = list(_chain().entries)
    del entries[2]
    with pytest.raises(ChainVerificationError):
        verify_chain(entries)


def test_truncating_the_chain_is_not_detected_locally():
    """A truncated prefix is internally consistent. Only the global Merkle
    tree of Task 5 makes this detectable, which is precisely why per-user
    chains alone are insufficient."""
    entries = list(_chain().entries)[:2]
    verify_chain(entries)


def test_reordering_entries_is_detected():
    entries = list(_chain().entries)
    entries[1], entries[2] = entries[2], entries[1]
    with pytest.raises(ChainVerificationError):
        verify_chain(entries)


def test_appending_a_forged_entry_is_detected():
    chain = _chain()
    entries = list(chain.entries)
    entries.append(dataclasses.replace(entries[-1], seq=len(entries)))
    with pytest.raises(ChainVerificationError):
        verify_chain(entries)


def test_wholesale_rehash_after_tampering_is_still_detected_by_the_head():
    """An attacker who rewrites every hash produces a self-consistent chain.
    Local verification passes; the published head no longer matches, which
    is what the STH in Task 6 pins."""
    chain = _chain()
    original_head = chain.head
    entries = list(chain.entries)
    rebuilt = HashChain()
    for entry in entries:
        rebuilt.append(
            event_type=entry.event_type,
            subject=entry.subject,
            audience=entry.audience,
            scope=entry.scope,
            decision="deny",
            timestamp=entry.timestamp,
            grant_id=entry.grant_id,
            grant_version=entry.grant_version,
        )
    verify_chain(rebuilt.entries)
    assert rebuilt.head != original_head
