# Barrier service — superseded prototype

This service is a non-functional prototype retained for reference. Do not
deploy it and do not rely on its ledger.

Its `/barrier/verify` endpoint does not verify. It compares stored
linkage fields without recomputing entry hashes, so any field of any
event can be edited and verification still reports success. Its ledger is
an in-process list erased by restart, its pseudonyms are unsalted, and
its revoke endpoint invalidates nothing.

The working implementation is `packages/ledger-python`. The design that
replaces this service is
`docs/superpowers/specs/2026-08-18-starvault-design.md`, which records
these defects as 9.1 through 9.5.

Under the current design the access barrier does not run server-side at
all: end-to-end encryption means the cloud cannot inspect what it
releases, so enforcement belongs in the local agent (spec §5).
