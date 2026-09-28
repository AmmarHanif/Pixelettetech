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
 * assistant where it still holds, and from the Pix T brief where it gives a
 * line (sections 42, 51 and 55). What is NOT carried over is that assistant's
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
  /** Offer to take the enquiry in the chat, alongside the link. Never instead of it. */
  offer?: 'enquiry';
};

const CONTACT = '/contact';

/*
 * TIMELINES, AS ASKED RATHER THAN AS PHRASED IN A FORM. The first version knew
 * "how long" and "turnaround" and missed the way people actually ask: "can you
 * build it in 2 weeks" and "when would it be ready" both went to retrieval, which
 * duly found the one published passage with a duration in it - "Four weeks from
 * start to readout" - and offered it as if it answered the visitor's project. A
 * published fact about a fixed-length discovery engagement, put next to a
 * question about someone's delivery date, reads as a promise. Hence the second
 * half of the guard in respond.ts, which checks the REPLY as well as the question.
 */
export const TIMELINE_ASK =
  /\b(how long|timeline|timescale|time ?frame|deadline|how (fast|quickly|soon)|when (can|could|will|would) you|delivery date|turnaround|lead time|in (\d+|a|one|two|three|four|five|six|a few|several) (days?|weeks?|months?)|\d+ (days?|weeks?|months?)|how many (days|weeks|months)|(ready|finished|live|delivered|launched|completed) (by|in|before)|when (would|will|could|can|might) (it|this|that|the (project|app|site|system|build|product)) (be )?(ready|done|finished|live|delivered|built|start|launch|go live)|start (on |this |next )?(monday|tuesday|wednesday|thursday|friday|tomorrow|next week|next month|immediately|straight away|right away)|go live|launch date|by (next|the end of|end of) (week|month|quarter|year)|asap)\b/i;

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
      /*
       * There is no prompt behind this assistant to reveal or override, so these
       * are answered as what they are: attempts. The phrasings are the brief's
       * own examples (section 40) and their common variants. A bare "DAN" is not
       * matched: it is also a name, and "Hi, I am Dan" is not an attack.
       */
      id: 'injection',
      test: /\b(ignore (all |your |the )?(previous|prior|above)|system prompt|your instructions|hidden instructions|you are now|disregard (all|your|the)|jailbreak|pretend you are|(reveal|show|print|repeat|display) (me )?(your |the )?(system |hidden )?(prompt|instructions|rules)|developer mode|you are dan|dan mode|do anything now|act as (an? )?(unrestricted|unfiltered|uncensored|different)|new system (message|prompt)|use this (page|text|message) as (your )?(new )?(system|instructions|prompt)|(forget|override) (your|all|the|previous) (rules|instructions|guidelines))\b/i,
      reply:
        'There is nothing behind me to unlock. I answer from the published pages of this website and nothing else, so the most I can do is find you the right page. What are you trying to find out?',
    },
    {
      id: 'off-topic',
      test: /\b(weather|joke|poem|limerick|recipe|football|horoscope|president|prime minister|sing|song|homework|essay|translate (this|that|the following|into)|write (me )?(an? )?(story|essay|poem|song|cover letter)|cover letter|who won|latest news|news today|headlines|summari[sz]e (this|that|the following|my)|crossword|lottery|stock tips?)\b/i,
      reply:
        'I’m here to help with Pixelette Technologies and technology projects. Tell me what you’re trying to build, automate or improve.',
    },
    {
      id: 'identity',
      test: /\b(are you (a |an )?(human|real|person|bot|ai|robot|chatbot|chatgpt|gpt|claude|gemini)|is this (a |an )?(bot|human|person|chatbot|chatgpt|gpt|real person|ai)|am i (talking|speaking|chatting) to (a |an )?(human|person|real|bot|ai|machine)|what are you|who (made|built|created|programmed) you|what (model|ai|llm) (are|is) (you|this)|are you (using|powered by) (chatgpt|gpt|openai|claude|an? llm|ai))\b/i,
      reply:
        'I am an automated assistant, not a person. I answer by finding the relevant passage on this website rather than by generating an opinion, so if I cannot find it I will say so and put you in touch with the team.',
    },
    {
      /*
       * `rates?` ON ITS OWN WAS TOO BROAD: "what is your customer satisfaction
       * rate" was answered as a pricing question. Rates are now matched only
       * where they are prices - day rates, hourly rates, your rates - and the
       * satisfaction question goes to the Clutch fact, which is the evidenced
       * answer to it.
       *
       * "HOW MUCH" LIKEWISE ONLY WHEN IT IS ABOUT MONEY. On its own it refused
       * the site's own FAQ "How do you decide how much autonomy an agent should
       * have?" as a price question. It now needs a money-shaped continuation.
       * And "priced" is deliberately absent: "How is Value Discovery priced?"
       * is a published FAQ answering how pricing is STRUCTURED, which the site
       * chose to publish; the guard is for numbers the site has not.
       */
      id: 'price',
      test: /\b(price|prices|pricing|cost|costs|costing|quote|quotation|estimate|budget|how much (does|do|would|will|is|are|was|for|money|to|should|it|of)|day rates?|daily rates?|hourly rates?|your rates|rates for|rate card|fee|fees|ballpark|cheap|expensive|afford|pricey|costly|(what|how much) (do|would|will) you charge|you charge|charges|fixed[- ]price|time and materials|commercial model|payment terms|rough (figure|number|idea)|minimum (project|engagement|budget|spend|contract|order))\b/i,
      reply:
        'Pricing is always scoped to the project, so any number I gave you now would be wrong. The fastest way to an accurate picture is a scoping call with the team: I can take the details here, or you can use the contact page.',
      path: CONTACT,
      offer: 'enquiry',
    },
    {
      id: 'timeline',
      test: TIMELINE_ASK,
      reply:
        'Timeline depends entirely on scope and complexity, and a number without a scope would just be a guess. The team will give you a realistic picture on a scoping call: I can take the details here, or you can use the contact page.',
      path: CONTACT,
      offer: 'enquiry',
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
      // True by construction: there is no careers route on this site.
      id: 'careers',
      test: /\b((are you|is pixelette) (currently )?(hiring|recruiting)|careers?|job (openings?|vacanc(y|ies)|opportunit(y|ies))|vacanc(y|ies)|work (for|at) (you|pixelette)|join (your|the) team|internships?|graduate (roles?|scheme))\b/i,
      reply:
        'There is no careers page on this site. If you would like to ask about working with the team, the contact page reaches a person.',
      path: CONTACT,
    },
    {
      // The address is the one public/.well-known/security.txt publishes.
      id: 'security-report',
      test: /\b((report|found|disclose|disclosing) (a |an )?(security )?(vulnerabilit(y|ies)|security (issue|flaw|bug|hole|problem))|responsible disclosure|bug bounty|security\.txt)\b/i,
      reply: `Security reports go to ${ctx.contactEmail}, the address this site publishes in its security.txt.`,
      path: '/.well-known/security.txt',
    },
    {
      /*
       * "I JUST WANT TO SPEAK TO SOMEBODY" IS ROUTED IMMEDIATELY (brief section
       * 51). The route comes first and needs nothing more from the visitor;
       * taking the enquiry in the chat is offered beside it, never required.
       */
      id: 'contact',
      test: /\b(contact|get in touch|speak to|talk to (someone|somebody|a human|a person|the team|sales)|just want to (speak|talk)|book (a )?(call|conversation|meeting)|arrange a call|scoping call|meeting|email you|phone you|call you)\b/i,
      reply:
        `The contact page is the fastest route in, and ${ctx.contactEmail} reaches the same place. If you prefer, I can take the details here.`,
      path: CONTACT,
      offer: 'enquiry',
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
    test: /\b(how many (people|staff|employees|engineers|developers|countries)|team size|headcount|how big is (the|your) (team|company)|offices in|countries|\d+\+?\s*(people|staff|employees|engineers|developers|offices|locations))\b/i,
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
      test: /\b(review|reviews|rating|ratings|clutch|testimonial|testimonials|reputation|feedback|satisf(ied|action)|happy (clients|customers))\b/i,
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

/**
 * Where a question should go when retrieval cannot place it.
 *
 * THE FALLBACK, NOT THE FIRST RESORT. These run only after the knowledge base
 * has failed to produce a confident answer, so they never pre-empt a published
 * FAQ that answers the question better. They exist for questions asked in
 * words the pages do not use - "what is your process", "do you store my data"
 * - where the right page is obvious to a person and invisible to a word match.
 *
 * THE REPLY IS THE PAGE'S OWN PUBLISHED DESCRIPTION, taken from the knowledge
 * base, so a route adds a destination and never a sentence. The order matters:
 * the first match wins, so the narrow topics sit above the broad ones.
 */
export const TOPIC_ROUTES: readonly { id: string; test: RegExp; path: string }[] = [
  {
    id: 'privacy',
    test: /\b(gdpr|data protection|privacy|personal (data|information)|(my|our) (data|information)|store (my|our|your) (data|details)|cookies?)\b/i,
    path: '/privacy',
  },
  {
    id: 'process',
    test: /\b((your|the) (process|methodology|method|approach)|how (do|would|will) you (work|run|deliver|approach)|ways? of working)\b/i,
    path: '/method/live',
  },
  {
    id: 'case-studies',
    test: /\b(case stud(y|ies)|portfolio|examples? of (your )?work|(previous|past) (work|projects)|what have you (built|delivered|done))\b/i,
    path: '/case-studies',
  },
  {
    id: 'support',
    test: /\b(support (after|once|post)|after (launch|go[- ]live|delivery|handover)|ongoing support|maintenance|maintain (it|the|our)|support and run|continuous improvement)\b/i,
    path: '/support-continuous-improvement',
  },
  {
    id: 'modernisation',
    test: /\b(legacy|moderni[sz](e|es|ed|ing|ation)|replac(e|ing) (an? |our |my |the )?(existing|old|current|legacy)|re-?platform|migrat(e|ing|ion))\b/i,
    path: '/engineering/modernisation-integration',
  },
  {
    id: 'automation',
    test: /\b(automat(e|ed|ing|ion)|manual (process|processes|work|tasks?)|repetitive (tasks?|work|processes))\b/i,
    path: '/ai-automation/workflow-automation',
  },
  {
    id: 'ai',
    test: /\b(where (could|can|would|might|should) ai|ai (help|for) (my|our|a)|use ai|using ai|apply(ing)? ai|ai strategy|ai opportunit(y|ies))\b/i,
    path: '/ai-automation',
  },
  {
    id: 'llm',
    test: /\b((which|what) (ai |language )?(models?|llms?)|language models?|llms?|rag|retrieval[- ]augmented)\b/i,
    path: '/ai-automation/llm-integration-rag',
  },
  {
    id: 'blockchain',
    test: /\b(blockchain|web3|smart contracts?|tokeni[sz](e|ation)|dapps?)\b/i,
    path: '/blockchain',
  },
  {
    id: 'software',
    test: /\b(mobile apps?|web (apps?|platforms?|sites?)|websites?|custom software|saas)\b/i,
    path: '/engineering',
  },
];
