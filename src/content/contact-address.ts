/**
 * The published enquiries address, for client code.
 *
 * Client components must not import src/content/company.ts, or anything that
 * imports it: everything a client component imports ships to every visitor,
 * and the company record is a register (see src/lib/pix/context.ts). The error
 * pages still need a way to reach a person, so the one public fact they need
 * lives here, alone.
 *
 * It must equal `contactEmail` in src/content/company.ts, which stays the
 * source of truth for everything rendered on the server.
 * verification/2026-09-29/hardening_test.js fails if the two ever differ.
 */
export const PUBLISHED_CONTACT_EMAIL = 'sales@pixelettetech.com';
