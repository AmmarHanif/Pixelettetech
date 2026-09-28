// Next resolves this to an empty module on the server and to a build error in a
// browser bundle, so "server only" below is enforced by the compiler, not by a
// comment. It is not an installed package; Next provides it.
import 'server-only';

import { isPublishable } from '@/content/claims';
import { clutch, company, contactEmail } from '@/content/company';

import type { PixContext } from './context';
import { PIX_CLAIM_IDS } from './rules';

/**
 * Reduces the claims register and the company record to what the assistant may
 * know. See `context.ts` for why.
 *
 * SERVER ONLY. Importing this from a 'use client' module would ship both
 * registers to every visitor again. The root layout calls it - a server
 * component, so for statically rendered pages it runs at build time and only
 * the returned object is serialised into the page.
 *
 * ONLY THE CONSULTED IDS ARE RESOLVED. The browser learns the status of the rows
 * `rules.ts` actually asks about, and of nothing else in the register.
 */
export function pixContext(): PixContext {
  return {
    contactEmail,
    company: {
      name: company.name,
      legalName: company.legalName,
      incorporated: company.incorporated,
      registeredIn: company.registeredIn,
      crn: company.crn,
    },
    clutch: clutch.published
      ? { ratingValue: clutch.ratingValue, reviewCount: clutch.reviewCount }
      : null,
    publishable: PIX_CLAIM_IDS.filter(id => isPublishable(id)),
  };
}
