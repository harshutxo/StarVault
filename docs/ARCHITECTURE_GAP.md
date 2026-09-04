# Architecture gap: target spec vs. current repo

Source of truth for the target state: `StarVault_Architecture.docx` ("Identity & Consent Infrastructure — Architecture Document", Draft v1). This tracks where the repo stands against that spec so the gap doesn't just live in chat history.

Status as of 2026-09-04, commit `f995960`.

## Summary

The repo currently implements the **shape** of the architecture (service names, folder layout, SDK package stubs) but not the **substance** (reliability engineering, real persistence, encryption, auth, zero trust). It is an MVP prototype plus a labeled skeleton for the target services, not a partial build of the production system the docx describes.

| Area | Target (docx) | Current repo | Status |
|---|---|---|---|
| Service components | 8 independently scalable services (§3) | 9 FastAPI stub folders under `services/`, each 15–99 lines, hardcoded demo responses | Skeleton only |
| Vault storage | Encrypted at rest, user-controlled keys, no StarVault access to plaintext (§3, §4.3) | Client-side WebCrypto AES-GCM in the root static prototype only; `services/vault` has no encryption, no DB write | Not started server-side |
| Availability | 99.99% uptime, active-active multi-region (§4.1) | Single `docker-compose.yml` (one Postgres + one Redis container) | Not started |
| Blockchain audit path | Non-blocking, async queue; proofs only (§4.2) | `infrastructure/hyperledger/chaincode/starvault_barrier_contract.py` (71-line chaincode stub); no queue, no writer service | Prototype only, wrong chain (see Discrepancies) |
| Key management | HSM cluster, threshold signing (§4.3) | None | Not started |
| Consent consistency | Sync in-region, async cross-region, quorum-read option (§4.4) | `services/consent` returns static demo data, no persistence or replication | Not started |
| Zero trust | Every request re-evaluated: identity, device posture, consent, policy, risk score (§5) | No auth, no per-request evaluation in any stub service | Not started |
| SDK | Handles token issuance, consent prompts, retries, region routing transparently (§6) | `packages/protocol-sdk-js` (46 lines), `packages/protocol` (99 lines) — type/shape stubs, no network calls | Skeleton only |
| Frontend | React, Next.js, Flutter | `apps/website` (Next.js, live) — matches | Done for web |
| Backend languages | Go/Rust core, Node.js APIs, Python AI services | All `services/*` are Python/FastAPI; no Go/Rust | Mismatch |
| Storage | PostgreSQL + S3-compatible object storage, sync in-region / async cross-region replicas | Postgres container exists but unused by any service | Not started |
| Messaging | Kafka or NATS, decouples audit/notification from request path | None | Not started |
| Observability | Prometheus, Grafana, OpenTelemetry | None | Not started |
| Deployment | Kubernetes, multi-region, autoscaled, health-checked global LB | None (no k8s manifests) | Not started |

## Discrepancies to reconcile

- **Blockchain choice**: the docx specifies Ethereum L2/Polygon for the audit ledger; the repo's only blockchain artifact is a Hyperledger Fabric chaincode stub. Pick one before building the real Audit Ledger Writer — they have different operational models (permissioned consortium vs. public L2).
- **Backend language split**: the docx calls for Go/Rust on the protocol layer specifically for latency predictability under load (§7 notes). The repo's stubs are all Python/FastAPI. Worth deciding whether that constraint is still live before more stub services get built out in Python, since a language migration later is more expensive than choosing correctly now.

## Design recommendations for the architecture itself

The gaps above are about the repo not yet matching the docx. These are about the docx's design, independent of the repo — worth resolving before more of it gets built:

- **Revocation needs a stronger consistency guarantee than everything else.** §4.4 gives consent state one uniform model: strongly consistent in-region, ~2s p99 async cross-region, with quorum reads as an opt-in exception. That's a reasonable default for grants, which can tolerate staleness. Revocation is the one operation where staleness directly breaks the product's core promise: a user who revokes an app in Region A can still have that app pulling data in Region B for the propagation window — worse under replication lag, where §4.5 has consent reads fall back to local-region state. Recommendation: give revoke-writes a different, stronger path than grants — either synchronous cross-region propagation for revokes specifically, or a push-based fast-invalidation channel to every Access Gateway — rather than one consistency model for both directions of a consent change.
- **No key-recovery story.** §4.3 states StarVault "cannot read vault contents by design" because keys are user-controlled, and covers HSM/threshold-signing availability for the *service's* key operations. It doesn't say what happens when a user loses the device or passkey holding their own key material. For a zero-knowledge architecture this is usually the first question asked in review: without an explicit recovery mechanism (social recovery, Shamir-split escrow, hardware backup), "cannot read vault contents by design" is indistinguishable from "user data is permanently lost on device loss."
- **Single DID risks cross-app correlation.** §3 describes one portable StarVault DID per user, reused across every application. That identifier becomes a super-correlator: any two apps (or StarVault itself, or anyone who compromises it) can trivially link a user's activity across services by comparing DIDs. Decentralized-identity designs (e.g. DIDComm / Aries-style pairwise DIDs) usually issue a distinct DID per relationship specifically to prevent this. Worth deciding whether unlinkability across apps is a goal — if it is, §3's identity model needs to change.
- **PostgreSQL doesn't natively do active-active multi-region writes.** §7 pairs the 99.99%/active-active availability target with plain PostgreSQL for metadata. Stock Postgres replication is primary/replica, not multi-writer-active-active — running it the way §4 describes needs either a different engine built for this (CockroachDB, Spanner-style) or an explicit conflict-resolution strategy layered on top. The doc specifies the availability target and the database independently; they need to be reconciled.

## Limits of the protocol (what this doesn't solve)

Worth stating explicitly, since the docx's positioning (§1, "comparable in category to what OAuth did for identity") invites reading this as a bigger claim than the architecture actually delivers:

- **This is a mechanism, not an economic fix.** The system controls *how* apps request and use data — scope, duration, revocation, audit. It doesn't touch *why* surveillance-driven data collection is profitable: ad-targeting revenue models, data-broker markets, and the market power that lets companies condition service on broad data access in the first place. A consent protocol doesn't change an incumbent's incentives; nothing in this architecture makes routing through StarVault commercially necessary for a company whose business model depends on not doing so. Adoption at the scale needed to matter depends on something outside the architecture entirely — regulation mandating it (GDPR-style) or user/market pressure strong enough to make non-adoption costly.
- **Honest plumbing doesn't prevent coerced consent.** Nothing in §3–§5 stops an application from simply refusing service unless a user grants broad, long-duration access — the same dynamic as today's take-it-or-leave-it ToS, just running through a more auditable pipe. Zero trust (§5) verifies that a *given* grant is real and scoped; it has no opinion on whether the user had a genuine choice when making it. If that matters to the product's positioning, it's a policy/UX problem (e.g. requiring minimal-necessary scopes, or surfacing when an app demands more than its stated purpose needs) that the current architecture doesn't address.

Net: this is useful infrastructure — the same category as OAuth or HTTPS, groundwork that shifts what *becomes possible* — not something that, on its own, ends surveillance capitalism. Worth being precise about that distinction wherever the project is pitched externally.

## Suggested build order

Roughly follows the doc's own dependency chain — each later item assumes the one before it is real, not stubbed:

1. **Identity Service** — real StarVault ID issuance + WebAuthn/passkey auth. Nothing else in the zero-trust model (§5) works without this.
2. **Vault Store + Encryption Service** — move encryption server-side (or formalize the client-side model as permanent and document why), wire `services/vault` to Postgres/object storage for real.
3. **Consent Manager** — persistent grants/revocations backing the existing dashboard UI, replacing the hardcoded demo array.
4. **Access Gateway + Tokenization** — the doc's "sole entry point" (§3); this is where zero-trust per-request evaluation (§5) actually gets enforced.
5. **Audit Ledger Writer** — after the blockchain choice is settled — async, queue-backed, never in the request path (§4.2).
6. **Reliability layer** — multi-region, HSM/threshold signing, Kubernetes, observability. Deliberately last: doc §4.1 itself notes failover-by-runbook can't hit 99.99%, so this isn't a bolt-on — it has to be designed into whichever services exist by the time it's tackled, not retrofitted after.

## Open questions carried over from the docx (§8)

- Confirm the 99.99% target and whether both regions must run at 100% capacity alone, or a reduced-capacity degraded mode is acceptable.
- Confirm the acceptable cross-region consent staleness window (docx assumes 2s p99).
- Regulatory scope (GDPR, HIPAA-adjacent categories) affects region placement and audit retention — unresolved.
- Audit volume modeling needed before committing to a specific L2 (or, per the discrepancy above, before confirming L2 over Hyperledger at all).
