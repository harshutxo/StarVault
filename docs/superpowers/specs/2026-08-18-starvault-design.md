# StarVault — Design Specification

**Date:** 2026-08-18
**Status:** Draft for review
**Supersedes:** the reliability-first architecture draft (active-active multi-region, HSM cluster, Hyperledger audit)

---

## 1. Context and scope decision

### 1.1 What changed

The originating architecture document described StarVault as a consent layer between applications and users' personal data, targeting 99.99% availability across an active-active multi-region deployment, with an HSM cluster and blockchain-backed audit.

Three findings during design reframed the project.

**The existing repository is documentation-heavy and implementation-light.** Roughly 1,675 lines of specification and vision across 14 documents, ~2,700 lines of working browser prototype, and ~355 lines across ten FastAPI services that return hardcoded demo strings. There are no tests anywhere.

**The builder is one person, full-time, with no ops team.** Ten independently deployed services, a two-region active-active topology, and a self-operated HSM cluster are not operable by one person. 99.99% availability allows 52 minutes of downtime per year across every dependency in the request path.

**India's regulatory framework prohibits the core architecture as originally conceived.** Under the DPDP Rules, a registered Consent Manager may not read the underlying personal data — that data remains with the Data Fiduciary — and may not simultaneously act as Data Fiduciary or Processor for the same individual. StarVault as drafted both stored data and managed consent. Registration additionally requires an Indian company with ₹2 crore minimum net worth, independent platform certification, and fit-and-proper directors, by 13 November 2026, with penalties up to ₹50 crore per instance for operating unregistered thereafter.

### 1.2 Scope decision

StarVault is **a user-held, end-to-end encrypted personal vault with an AI agent context layer.**

It is *not* a consent manager intermediating data held by institutions. The consent it brokers is over data the user already owns — documents, notes, platform exports, personal records. No Data Fiduciary sits in the loop, which places it outside the consent-manager regime, and it complements the Account Aggregator and ABDM stacks rather than competing with them.

The differentiating property is that **StarVault's servers cannot decrypt user data**. Account Aggregator is data-blind in transit but institutions still hold plaintext; a user-held E2EE vault is a primitive that stack does not provide. AI-agent access to personal context is not addressed by the Indian framework at all, and is the least contested part of the opportunity.

> **Legal caveat.** This is architecture-relevant regulatory reading, not legal advice. Whether a genuinely zero-knowledge ciphertext host constitutes a "Data Processor" under DPDP is unsettled and must be reviewed by a privacy lawyer before operating with real users.

### 1.3 Non-goals for v1

- Registering or operating as a DPDP Consent Manager.
- Multi-region active-active deployment; 99.99% availability.
- Self-operated HSM cluster or threshold signing.
- On-chain audit writes (Merkle roots may be anchored later).
- Server-side policy evaluation over data content — impossible under E2EE by construction.
- Any claim that StarVault can control data after plaintext delivery (export or resharing restriction is not enforceable; see §8.1).
- A data marketplace.

---

## 2. Key hierarchy and recovery

### 2.1 Hierarchy

```
Recovery key ──┐
Passkey (PRF) ─┼─► User Master Key (UMK) ──► Category keys ──► Item keys (DEK)
Device keys  ──┘        never leaves device in plaintext
```

**Device keys.** Each device generates an X25519 pair (encryption) and an Ed25519 pair (signing) in platform secure storage — Keychain, Android Keystore, or non-extractable WebCrypto. Private halves never leave the device.

**User Master Key.** One 256-bit key per user, generated client-side on first device. The server stores it only in wrapped form: once per enrolled device, once under the recovery key, and optionally once under a passkey-derived key.

**Category keys.** Consent is granted per category, so encryption is keyed per category. This allows revocation to rotate one category without re-encrypting the entire vault.

**Item keys (DEK).** One random 256-bit key per item, wrapped by its category key.

### 2.2 Algorithms — pinned

| Purpose | Algorithm |
|---|---|
| Content encryption | AES-256-GCM (only; see note) |
| Key wrapping (asymmetric) | X25519 + HKDF-SHA256 |
| Signatures | Ed25519 |
| Recovery key derivation | Argon2id, m = 64 MiB, t = 3, p = 4 |
| Recovery phrase | 24 words, BIP39 wordlist (256 bits entropy) |
| Canonical serialization | RFC 8785 (JSON Canonicalization Scheme) |
| Transport | TLS 1.3 |

Exactly one content cipher is permitted in v1. Offering AES-256-GCM "or XChaCha20-Poly1305" without a negotiation mechanism guarantees that two conformant implementations fail to interoperate. Adding a second cipher requires a versioned negotiation scheme first.

### 2.3 Recovery

Two independent paths, neither of which allows the server to decrypt:

1. **Recovery phrase — mandatory.** 24 words generated client-side at enrollment, wrapping the UMK under an Argon2id-derived key. The user must re-enter three randomly chosen words before the vault unlocks for the first time. This confirmation is not skippable.
2. **Passkey PRF — where supported.** Where the WebAuthn PRF extension is available, derive a second UMK wrap from the passkey. Because passkeys sync through iCloud Keychain or Google Password Manager, this silently carries the key across the user's devices.

If both the recovery phrase and all enrolled devices are lost, **the data is unrecoverable.** There is no operator backdoor. This must be stated at enrollment, not discovered at support time.

### 2.4 Device enrollment — the critical check

Adding a device requires the new device to display a public-key fingerprint, which the existing device must confirm **out-of-band** before wrapping the UMK to it.

Without this check, the server can present its own public key as a "new device" and obtain the UMK, defeating end-to-end encryption entirely, with no user-visible signal. This verification step is what makes the zero-knowledge claim a fact rather than a promise, and it must never be bypassed for onboarding convenience.

---

## 3. Consent and revocation

### 3.1 The Grant record

The Grant is the system of record. Fields: subject, audience, scope set, declared purpose, constraints (absolute expiry, optional time-of-day, optional max-uses), state, monotonic version, and consent notice version and hash.

**In v1 a Grant carries no key material.** Because the local agent is the sole decryption point (§6.5), no key is ever wrapped to an audience: the agent decrypts using the user's own device key and releases only granted fields. The Grant is purely a policy record that the local agent enforces. Grant envelopes — key material wrapped to an audience's public key — appear only if direct audience access is enabled later, and are specified in §6.5 for that case.

States: `pending → active → expired | revoked | superseded`.

### 3.2 Scope grammar

Hierarchical dotted paths with an explicit operation: `profile.email:read`, `health.labs:read`, `finance.txns:append`.

- Exactly three operations: `read`, `write`, `append`. No `delete` for audiences. No `admin` scope.
- Wildcards permitted one level only (`health.*:read`) and always rendered to users in plain language, never as the raw string.
- **Categories come from a curated, versioned registry.** Audiences may only request categories that exist in it. This is what makes a grant portable across applications and keeps consent prompts comprehensible; a self-declared namespace fragments immediately and destroys both properties.

### 3.3 Consistency asymmetry

A stale positive is dangerous; a stale negative is merely inconvenient. Grants and revocations therefore receive different guarantees:

- Revocations propagate on a **fail-closed priority path**. A revocation is not acknowledged to the user until durable.
- Every enforcement point holds the **revocation set in memory**, checked on every request. Zero-trust re-verification therefore costs nothing and there is no "already authorized" cache to bypass.
- **Tokens are short-lived: 60–300 seconds.** A missed revocation has a bounded blast radius. In v1 these are the tokens the local agent presents to the cloud to fetch ciphertext, and the session tokens scoping an MCP caller — not credentials held by a remote audience, which v1 does not issue.
- **Grant version acts as a fencing token.** An enforcement point that has observed version N refuses any token bearing a version below N, preventing replay of pre-revocation tokens.

In a single-region v1 most of this is free. It is specified now so that adding a second region later cannot reintroduce the gap.

### 3.4 Consent receipts

Every grant stores the version and hash of the exact notice text presented to the user. This makes it possible to reproduce what a person actually agreed to on a given date and prove the record was not edited afterwards. Conform to ISO/IEC 27560 rather than inventing a receipt format.

---

## 4. Audit ledger

### 4.1 Structure

Certificate Transparency's design, applied directly.

**Per-user hash chains.** `entry_hash = H(prev_hash ‖ canonical(fields))`, letting each user independently verify their complete access history.

**Global Merkle tree.** Chain heads are folded periodically into a global tree whose **Signed Tree Head** (tree size, root hash, timestamp, signature) is published each epoch. Per-user chains alone would permit an operator to truncate a user's history wholesale; the global tree makes that detectable.

**Publication.** STHs are published openly so third parties can gossip and cross-check them. Tamper-evidence must be a claim others can falsify, not one users are asked to take on trust. The consequence is accepted deliberately: history can never be quietly rewritten, including to correct our own bugs.

**Inclusion proofs.** Users can obtain a Merkle inclusion proof for any entry against a published STH.

### 4.2 Canonical serialization

RFC 8785 JSON Canonicalization, pinned now. A one-byte disagreement between implementations invalidates every proof. **Published test vectors are a deliverable.**

### 4.3 Synchronous versus asynchronous

The original document treated the audit write as one deferrable thing. It is two, and only one is deferrable.

- **The decision record must be durable in the same transaction as token issuance.** Otherwise a crash between serving data and recording it yields access with no audit trail — precisely the failure the ledger exists to prevent.
- **Chaining and anchoring are asynchronous.** If downstream publication is unavailable, entries queue and nothing user-facing degrades.

### 4.4 Anchoring cost

Anchoring commits Merkle **roots**, not events — one hash per epoch regardless of volume. Proof-write cost is O(1) per epoch rather than O(n) per access, which removes cost as a factor in any future chain selection.

### 4.5 Erasure versus immutability

Entries carry pseudonymous identifiers and hashes, never personal data. Erasing a vault therefore never requires rewriting the chain: deleting the identity mapping crypto-shreds the linkage while leaving proofs mathematically intact.

**Pseudonymous identifiers must be salted with a per-user secret.** An unsalted `SHA-256(user_id)` over a low-entropy identifier space is reversible by brute force in seconds and provides no protection against the adversary it exists to stop.

---

## 5. Architecture

Under end-to-end encryption, **the access barrier cannot live in the cloud.** A server that cannot decrypt cannot inspect what it releases, so cloud-side content policy enforcement is theatre. Enforcement must sit where the plaintext is.

### 5.1 Three tiers

**StarVault Cloud — the blind tier.** Stores ciphertext blobs, the user's own wrapped-key material (device, recovery, and PRF wraps of the UMK), consent state, and the audit chain. Cannot decrypt anything by construction. One deployable, modular internally.

**StarVault Agent — the local enforcement tier.** A process on the user's machine holding the device key. Decrypts, enforces grant scope and expiry, and records every access. Exposes **MCP**, the protocol AI agents already speak. The barrier becomes real because it sits adjacent to the plaintext.

**Vault clients.** The existing browser application, for managing grants, recovery, and reviewing access history.

### 5.2 Repository mapping

| Current | Becomes |
|---|---|
| `services/{identity,consent,audit,vault,applications}` | One deployable; names retained as internal modules |
| `services/{barrier,gateway,access,policy}` | Moves client-side into the local agent |
| `infrastructure/hyperledger` | Removed from v1; Merkle chain with published STHs instead |
| *(new)* `apps/agent` | Local MCP server — the enforcement point |
| Root prototype (`app.js`, `index.html`, `server.mjs`) | `apps/vault-web`; retained, it is the only working implementation |
| `packages/protocol*` | Retained; becomes the specification and SDK |

Ten deployables collapse to one cloud service and one local binary.

### 5.3 Availability

Single region. Target ~99.5%. Managed Postgres and managed object storage. No design decision may foreclose a second region later, but multi-region is not built in v1.

---

## 6. Flows

### 6.1 Enrollment

1. Passkey registration establishes authentication.
2. Device generates X25519 and Ed25519 pairs in secure storage.
3. Client generates the UMK.
4. Client generates the 24-word recovery phrase, derives a key via Argon2id, wraps the UMK.
5. Where PRF is available, derive a second wrapping key from the passkey and wrap the UMK again.
6. Wrap the UMK to the device public key.
7. Upload wraps and public keys only.
8. **Require re-entry of three random words from the recovery phrase before the vault unlocks.**
9. Audit: `device.enrolled`.

### 6.2 Adding a device

New device displays its public-key fingerprint; existing device confirms out-of-band (§2.4), then wraps the UMK to the new device's public key. Audit: `device.enrolled`.

### 6.3 Storing an item

Generate a DEK, encrypt with AES-256-GCM, wrap the DEK under the category key, upload ciphertext plus wrapped DEK.

Server-visible metadata is deliberately minimal: category, size, timestamp, content-type. **Filenames are never stored server-side** — a filename frequently discloses more than the ciphertext protects.

### 6.4 Granting access

1. Audience requests scope and purpose.
2. Grant created in `pending`; user's client notified.
3. User reviews audience, scope in plain language, purpose, expiry, **and where the data will physically travel** (for example, "this sends your data to Anthropic's servers").
4. Notice hash recorded.
5. Grant activated as a policy record. **No key material is wrapped to the audience in v1** — the local agent enforces the grant and decrypts with the user's own device key (§3.1).
6. Audit: `grant.created`.

### 6.5 Agent access

**Local agent is the only decryption point in v1.** Remote agents never receive keys or ciphertext directly; they call the user's local agent over MCP, which checks the grant, decrypts, applies scope, and returns only granted fields.

The accepted cost is that **the user's device must be online.** For an assistant acting on the user's behalf this is nearly always true; the casualty is background and server-to-server access while the user is away.

**Where direct audience access is later enabled**, release keys **per item, not per category**. The audience requests each item's wrapped DEK individually, signing a request naming the item and purpose. The cloud cannot read the item but records a non-repudiable signed record of exactly which items were unlocked — the difference between "touched your health category" and "unlocked these three lab reports, with a signature proving it."

**Grant-scoped audience keypairs.** A fresh keypair per grant, so a leaked key compromises one grant rather than every grant that audience has ever held.

### 6.6 Audit trustworthiness

**The server-observed fetch log is the authoritative backbone** — the cloud can see which audience fetched which blob and when, without decrypting anything. Any audience-reported detail is supplementary and **must be rendered in the UI as an unverified claim**, never with the visual weight of a cryptographically observed event.

### 6.7 Revocation

Grant marked `revoked`, version incremented, revocation set pushed, further ciphertext fetches for that audience refused, and the category key rotated.

**Rotation is lazy.** A new category key is generated and used for items written from that point on; existing items keep their current wrapped DEKs until rewritten. Eager re-encryption of the whole category is optional background work, not a precondition for the revocation to take effect.

The UI states plainly that revocation stops future access and that **data already downloaded cannot be recalled.** This is true of every system, and implying otherwise is the dishonest option.

### 6.8 Failure behaviour — always fail closed

| Condition | Behaviour |
|---|---|
| Cloud unreachable | Serve from cache only while the grant remains unexpired, then stop |
| Revocation status unknown | Continue serving only until the current token expires (≤300s), then deny |
| Decryption failure | Surface as an integrity error; never return a silent partial result |
| Clock skew beyond tolerance | Reject; expiry is evaluated against server-signed timestamps |
| Recovery phrase and all devices lost | Data is unrecoverable; stated at enrollment |

---

## 7. Testing and operability

The repository currently has no tests. The two areas where defects are unrecoverable are the cryptography and the ledger.

- **Ledger adversarial suite.** Mutate every field of every entry and assert that verification fails. This is precisely the test absent today (§9.1).
- **Published test vectors** for RFC 8785 canonicalization and the hash chain, so independent implementations can demonstrate conformance. The conformance suite is a deliverable, not overhead.
- **Property tests** on the key hierarchy: wrap/unwrap round-trips, rotation invariants, and the invariant that a revoked audience can never unwrap a post-rotation item.
- **Full recovery drill in CI.** Simulated total device loss, restored from the recovery phrase alone.
- **Fail-closed tests** covering every condition in §6.8.
- **Device-enrollment attack test.** A malicious server substituting its own public key must fail fingerprint verification.

**Operability for one person:** managed Postgres and object storage; backups with *scheduled restore drills*, because an untested backup is not a backup; monitoring for missed STH epochs; a single paging path.

---

## 8. Known limitations

These are accepted, not unsolved. Each must be visible in the product, not buried.

**8.1 Post-delivery control is impossible.** Once an audience holds plaintext it can retain, export, and reshare it. The `export_allowed` and `resharing_allowed` capability flags in the current codebase imply otherwise and should be removed or reframed as declared intent rather than enforcement.

**8.2 End-to-end encryption and cloud AI are mutually exclusive.** When a cloud model receives plaintext, that provider has the data. No architecture changes this. StarVault offers per-grant disclosure of destination, minimum-necessary scoping, revocability, and a tamper-evident record. Only for locally run models is the guarantee genuinely end-to-end, and the UI must distinguish the two cases.

**8.3 Server-side search is impossible** over encrypted content. Accepted for v1.

**8.4 Requiring a local agent excludes some users** — pure-web and mobile-only users cannot use agent access in v1.

**8.5 Availability is ~99.5%, not 99.99%.**

---

## 9. Repository remediation

Defects in `services/barrier/app/main.py`, the only component containing real logic. All are superseded by this design, but each represents a class of error the new implementation must not repeat.

**9.1 `verify()` does not verify** (`main.py:92-100`). It compares `previous_event_hash` linkage but never recomputes `event_hash` from entry contents. Any field — `decision`, `purpose`, `capabilities` — can be modified and verification still returns `valid: true`. The ledger's entire purpose is defeated.

**9.2 Hashing over a Python dict repr** (`main.py:33-35`). `f"{event}|{previous_hash}"` is not stable across insertion order or Python versions, and no non-Python implementation could reproduce it. Superseded by §4.2.

**9.3 Unsalted `sha256(user_id)`** (`main.py:41`). Trivially reversible over an enumerable identifier space. Superseded by §4.5.

**9.4 Ledger held in a module-global list** (`main.py:10`). An append-only tamper-evident log erased by process restart.

**9.5 Revocation performs no invalidation** (`main.py:79-82`). Appends a "revoked" event with no token store behind it; the token remains valid. Combined with `expires_in: 86400` in `services/gateway/app/main.py:40`, a revoked token stays usable for up to 24 hours. Superseded by §3.3.

**9.6 Public claims exceed implementation.** The GitHub Pages site and protocol documents describe security properties the code does not provide. Reconcile before any real user relies on it.

---

## 10. Implementation slices

This specification is larger than a single implementation plan. It decomposes into four, in dependency order.

| Slice | Contents | Done when |
|---|---|---|
| **1. Crypto core** | Key hierarchy (§2), recovery phrase and PRF wraps, device enrollment with fingerprint verification, property tests, recovery drill | A vault can be created, locked, unlocked, enrolled to a second device, and fully recovered from the phrase alone |
| **2. Ledger** | Hash chain, RFC 8785 canonicalization, salted pseudonyms, Merkle tree, STH publication, adversarial test suite, published test vectors | Every field mutation is detected; an independent implementation verifies against the vectors |
| **3. Cloud service** | Consent and grant model (§3), storage, revocation with fencing, fail-closed behaviour (§6.8), the single deployable of §5.2 | Grant, access, and revoke work end to end with correct consistency semantics |
| **4. Local agent** | MCP server, scope enforcement, local decryption, audit emission, packaging | An AI agent reads granted context and nothing beyond it, with every access recorded |

Slices 1 and 2 are independent and could proceed in either order. Slice 3 depends on both; slice 4 depends on 3. The web client of §5.2 is upgraded incrementally alongside slices 1 and 3 rather than forming its own slice.

---

## 11. Deferred

| Item | Revisit when |
|---|---|
| Proxy re-encryption for offline direct access | Audited library available; demand demonstrated |
| Merkle root anchoring to a public chain | Publication process stable |
| Independent log witnesses | Third parties available to recruit |
| Multi-region, active-active | Usage justifies the operational cost |
| HSM cluster and threshold signing | Beyond managed KMS capacity |
| Splitting the cloud service into microservices | A measured reason exists |
| DPDP Consent Manager registration | Net worth requirement met and the vault/consent-manager separation resolved |
| Data marketplace | Consent and audit primitives proven in production |

---

## 12. Open questions

1. **Legal review of the zero-knowledge host question** — whether an operator that cannot decrypt is a Data Processor under DPDP. Determines whether the current position holds.
2. **Initial category registry contents** — the taxonomy is the portability surface and needs a concrete v1 list.
3. **Local agent distribution** — packaging and update mechanism across macOS, Windows, and Linux.
4. **STH publication venue** — where roots are published so third parties can gossip them.
5. **Whether the browser prototype's PBKDF2 vault migrates to the new hierarchy or users re-enroll.** Existing prototype data uses a passphrase-derived key with no UMK; a migration path must be chosen before any real user data exists.
