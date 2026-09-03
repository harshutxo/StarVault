# Prototypes

Archived exploration work, not part of the live build (`apps/website`, `services/*`). Kept for reference and future extraction.

- **v2-functional-backend/** — a working Express prototype backend (vault health, consent list/revoke, audit trail, identity claim issuance) with its own static frontend. Useful as a reference implementation while building out the real `services/vault` and `services/consent` FastAPI services.
- **website-v1-landing/** — an earlier single-file landing page design. Its email waitlist capture idea was carried into the live site's `CTA` component; kept here for the rest of its copy/layout ideas.
- **portfolio-dashboard-experiment/** — an unrelated concept exploration (a wealth/portfolio dashboard UI), not part of the StarVault product. Archived rather than discarded.

None of these run as part of `npm run dev` / `npm run build` for `apps/website`. Each is self-contained; see its own files for how to run it standalone.
