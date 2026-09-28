import type { PixContext } from './context';

/**
 * The guardrail layer. Rules run BEFORE retrieval and win outright.
 *
 * WHY BEFORE AND NOT AFTER. A price question will always retrieve something -
 * the site discusses commercial models in several places - and a passage about
 * how pricing is structured, surfaced in answer to "how much does it cost",
 * reads as a price indication whether or not it contains a number. The refusal
 * has to pre-empt retrieval, not filter it.
 *
 * THE WORDING IS THE FOUNDER'S OWN, carried over from the previous site's
 * assistant where it still holds. What is NOT carried over is that assistant's
 * factual claims: its prompt asserted a 200-plus engineer network across 13
 * countries, a Scotlands Business Award, an APPG connection and a 97 per cent
 * satisfaction rating as plain fact. On this site those are HELD in the claims
 * register or absent from it entirely, so repeating them here would have put the
 * assistant in direct contradiction of the site's own governance.
 *
 * ONE CORRECTION TO THE INHERITED WORDING. The old replies promised a response
 * "within one business day". That phrasing was deliberately removed from every
 * page of this site on 2026-09-24 by founder instruction, so the assistant does
 * not reintroduce it.
 *
 * THE REGISTERS ARRIVE AS AN ARGUMENT. This file runs in the browser, so it
 * reads nothing from the claims register or the company record itself: the
 * verdicts and facts it needs are handed in as a `PixContext` built on the
 * server. `context.ts` records what importing the registers here once cost.
 */

export type Rule = {
  id: string;
  /** What the visitor said that triggers this. */
  test: RegExp;
  reply: string;
  /** Offered as a follow-up link where one genuinely helps. */
  path?: string;
};

const CONTACT = '/contact';

/*
 * ORDER IS SIGNIFICANT: the first match wins. Abuse and off-topic sit above the
 * commercial rules so that an abusive message containing the word "cost" is
 * handled as abuse rather than answered politely about pricing.
 */
export function rules(ctx: PixContext): Rule[] {
  return [
    {
      id: 'abuse',
      test: /\b(fuck|fucking|shit|bitch|bastard|cunt|dickhead|wanker|arsehole|idiot|moron|scam|scammer|fraud|fraudster|crooks?)\b/i,
      reply:
        'I am here to help with technology projects. If you have a genuine enquiry I am happy to assist, and otherwise you can reach the team directly at ' +
        `${ctx.contactEmail}.`,
    },
    {
      id: 'injection',
      test: /\b(ignore (all |your |the )?(previous|prior|above)|system prompt|your instructions|you are now|disregard (all|your|the)|jailbreak|pretend you are)\b/i,
      reply:
        'There is nothing behind me to unlock. I answer from the published pages of this website and nothing else, so the most I can do is find you the right page. What are you trying to find out?',
    },
    {
      id: 'off-topic',
      test: /\b(weather|joke|poem|limerick|recipe|football|horoscope|president|prime minister|sing|song|homework|essay|translate this|write me a story|who won)\b/i,
      reply:
        'I only know what is published on this website, which is Pixelette Technologies’ engineering, AI and blockchain work. Is there a project I can help you with?',
    },
    {
      id: 'identity',
      test: /\b(are you (a )?(human|real|person|bot|ai|robot)|is this a (bot|human|person)|am i (talking|speaking) to (a )?(human|person|real))\b/i,
      reply:
        'I am an automated assistant, not a person. I answer by finding the relevant passage on this website rather than by generating an opinion, so if I cannot find it I will say so and put you in touch with the team.',
    },
    {
      id: 'price',
      test: /\b(price|prices|pricing|cost|costs|costing|quote|quotation|estimate|budget|how much|day rate|hourly rate|rates?|fee|fees|ballpark|cheap|expensive|afford)\b/i,
      reply:
        'Pricing is always scoped to the project, so any number I gave you now would be wrong. The fastest way to get an accurate picture is a scoping call with the team. Shall I point you at the contact page?',
      path: CONTACT,
    },
    {
      id: 'timeline',
      test: /\b(how long|timeline|timescale|time frame|timeframe|deadline|how (fast|quickly|soon)|when (can|could|will) you|delivery date|turnaround|lead time)\b/i,
      reply:
        'Timeline depends entirely on scope and complexity, and a number without a scope would just be a guess. The team will give you a realistic picture on a scoping call.',
      path: CONTACT,
    },
    {
      id: 'competitors',
      test: /\b(better than|compare(d)? (to|with) (accenture|infosys|tcs|wipro|capgemini|deloitte)|vs\.? (accenture|infosys|tcs|wipro)|why not use|competitor)\b/i,
      reply:
        'I will not run down other firms. What I can do is show you how this one works and what it has actually delivered, and you can judge it against anyone else.',
      path: '/case-studies',
    },
    {
      id: 'staff-contact',
      test: /\b(personal (email|number|phone|mobile)|mobile number of|home address|linkedin of|who is your (ceo|cto)\b.*\b(email|number|phone))\b/i,
      reply:
        `I do not share individual contact details. Everything reaches the right person through ${ctx.contactEmail} or the contact page.`,
      path: CONTACT,
    },
    {
      id: 'contact',
      test: /\b(contact|get in touch|speak to|talk to (someone|a human|a person)|book a call|arrange a call|scoping call|meeting|email you|phone you|call you)\b/i,
      reply:
        `The contact page is the fastest route in, and ${ctx.contactEmail} reaches the same place.`,
      path: CONTACT,
    },
    {
      id: 'legal-or-financial-advice',
      test: /\b(legal advice|is (this|it) legal|tax advice|investment advice|should i invest|financial advice|sue|lawsuit)\b/i,
      reply:
        'That is not something an engineering firm should answer, and I am certainly not the right source for it. Speak to a qualified adviser.',
    },
  ];
}

/**
 * Questions about claims the site does NOT publish.
 *
 * THIS IS THE RULE MOST WORTH HAVING. The obvious failure of a site chatbot is
 * not rudeness, it is confidently repeating a marketing figure the business has
 * deliberately stopped standing behind. Each entry is bound to an id in the
 * claims register, so if a claim is later evidenced and released the assistant
 * gains the ability to discuss it automatically, and if one is withdrawn it
 * loses it. There is no second list to keep in step.
 */
export const CLAIM_GUARDS: { id: string; test: RegExp; whenHeld: string }[] = [
  {
    id: 'geography-count',
    test: /\b(how many (people|staff|employees|engineers|developers|countries)|team size|headcount|how big is (the|your) (team|company)|offices in|countries)\b/i,
    whenHeld:
      'I am not going to put a number on the team or the countries it covers, because that figure is not something this site currently evidences. The team will tell you exactly who would work on your project.',
  },
  {
    id: 'top-ai-company-award',
    test: /\b(award|awards|award-winning|best (ai|agency|company)|ranked|ranking|accolade)\b/i,
    whenHeld:
      'I will not claim an award this site does not currently evidence. What it does publish is its Clutch rating and its certifications.',
  },
  {
    id: 'appg-parliament-reference',
    test: /\b(appg|parliament|parliamentary|government|policy group|secretariat)\b/i,
    whenHeld:
      'That is not a connection this site currently states, so I am not going to characterise it. The contact page is the right route if it matters to your decision.',
  },
  {
    id: 'client-logos',
    test: /\b(who are your clients|client list|which companies|name.{0,12}clients?|worked with (any|which))\b/i,
    whenHeld:
      'Clients are only named where a case study is published with their permission. I will not confirm or deny anyone else.',
  },
  {
    id: 'ai-project-count',
    test: /\b(how many (projects|builds|clients|ai projects)|number of projects|track record numbers)\b/i,
    whenHeld:
      'I am not going to quote a project count that this site does not evidence. The published case studies are the honest version of that answer.',
  },
];

/** The register rows the facts layer consults, each named once. */
const FACT_CLAIMS = {
  iso9001: 'iso-9001-certificate',
  iso27001: 'iso-27001-certificate',
  clutch: 'clutch-rating',
} as const;

/**
 * Every register id the assistant consults, and so the only rows the server
 * resolves for it (`server-context.ts`). A guard or fact that asks about an id
 * missing from here is told "withheld", which fails closed.
 */
export const PIX_CLAIM_IDS: readonly string[] = [
  ...CLAIM_GUARDS.map(guard => guard.id),
  ...Object.values(FACT_CLAIMS),
];

/** What the assistant may state as fact, and only while the register allows it. */
export function publishableFacts(ctx: PixContext): { test: RegExp; reply: string; path?: string }[] {
  const facts: { test: RegExp; reply: string; path?: string }[] = [];
  const allowed = (id: string) => ctx.publishable.includes(id);

  if (allowed(FACT_CLAIMS.iso27001) || allowed(FACT_CLAIMS.iso9001)) {
    const held: string[] = [];
    if (allowed(FACT_CLAIMS.iso9001)) held.push('ISO 9001 for quality management');
    if (allowed(FACT_CLAIMS.iso27001)) held.push('ISO 27001 for information security');
    facts.push({
      test: /\b(iso|certified|certification|certifications|accredited|9001|27001|standards)\b/i,
      reply: `Pixelette Technologies holds ${held.join(' and ')}. The assurance page carries the detail and the certificate evidence.`,
      path: '/assurance',
    });
  }

  if (allowed(FACT_CLAIMS.clutch) && ctx.clutch) {
    facts.push({
      test: /\b(review|reviews|rating|ratings|clutch|testimonial|testimonials|reputation|feedback)\b/i,
      reply: `The Clutch profile shows ${ctx.clutch.ratingValue} out of 5 from ${ctx.clutch.reviewCount} verified reviews. The case studies page carries client comments alongside the work.`,
      path: '/case-studies',
    });
  }

  facts.push({
    /*
     * "What does Pixelette do?" belongs HERE rather than to retrieval. The
     * company name appears on nearly every page, so as a search term it
     * discriminates nothing - which is why the question reached the assistant
     * as an unanswerable one-word query. It is an identity question, and the
     * identity answer is the right one.
     */
    test: /\b(who are you|what is pixelette|what do(es)? (you|pixelette|they)( actually)? do|what services|about the company|founded|established|based|where are you|registered|company number)\b/i,
    reply: `${ctx.company.name} is a UK software engineering firm, incorporated in ${ctx.company.incorporated} and registered in ${ctx.company.registeredIn} as ${ctx.company.legalName}, company number ${ctx.company.crn}.`,
    path: '/about-us',
  });

  return facts;
}
