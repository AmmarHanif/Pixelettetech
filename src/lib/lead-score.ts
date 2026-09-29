/**
 * Lead scoring for enquiries taken by Pix T.
 *
 * ADDED 2026-09-29 ON THE FOUNDER'S INSTRUCTION ("Lead Scoring Email Alert
 * Store in Supabase"). Until then this project deliberately scored nothing,
 * because the Privacy Statement says the site runs "no profiling of individual
 * visitors" - and a score about a person is profiling. The founder chose to
 * add it and to change the Statement; the drafted wording is in
 * PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md, and scripts/check-privacy-interlock.mjs
 * fails the build while the published Statement still says the opposite. So
 * nothing scored here can reach a real visitor before the Statement does.
 *
 * WHAT IT READS: only what the visitor typed into the enquiry - the four
 * answers, the company and the email address. Nothing about the device, the
 * visit or the rest of the chat, which this site does not keep.
 *
 * EXPLAINABLE BY CONSTRUCTION. Every point comes from a named rule and every
 * rule that fired, or failed to, is returned as a reason in plain words. Anyone
 * asking "why was I rated that?" gets the same list the team saw, which is what
 * a subject access request would require.
 *
 * A PERSON DECIDES. The score orders the team's inbox and nothing else. It never
 * decides whether anyone gets a reply, which keeps the Statement's promise that
 * no decision with legal or similarly significant effects is made about a
 * visitor by automated means. The notification email says so beside the score.
 *
 * SERVER ONLY. Its one caller is src/app/contact/actions.ts. Kept out of the
 * browser so the rules are not published for gaming, not because they are
 * secret: the Statement describes them. The guard below makes a browser import
 * loud instead of silent (security review N6).
 */

if (typeof window !== 'undefined') {
  throw new Error('src/lib/lead-score.ts was evaluated in a browser. It is server-only.');
}

export type LeadBand = 'cold' | 'warm' | 'hot' | 'urgent';

export type LeadScore = {
  /** 0 to 100. */
  score: number;
  band: LeadBand;
  /** Every rule, in a fixed order, as it applied to this enquiry. */
  reasons: string[];
};

export type LeadInput = {
  email: string;
  company: string;
  objective: string;
  existing: string;
  deadline: string;
  success: string;
};

/*
 * Personal mailbox providers. An address at one of these is still a real lead;
 * it simply says less about an organisation behind the enquiry than an address
 * elsewhere, so it earns fewer points, not none. The list is a list, not a
 * judgement of who is a company: an address NOT on it is "not at a listed
 * personal provider", which is all the reason says (security review S4).
 *
 * FAMILIES match the first label of the domain when what follows it is a
 * public suffix, so gmail.com, yahoo.co.uk and hotmail.fr count, and
 * live.acme.com - a company's own subdomain - does not. EXACT domains are
 * providers whose name is too generic to match as a family.
 */
const FREE_MAIL_FAMILIES = new Set([
  'gmail', 'googlemail', 'yahoo', 'ymail', 'rocketmail', 'hotmail', 'outlook', 'live', 'msn',
  'icloud', 'aol', 'protonmail', 'proton', 'gmx', 'yandex',
]);
const FREE_MAIL_DOMAINS = new Set([
  'me.com', 'mac.com', 'mail.com', 'pm.me', 'btinternet.com', 'sky.com', 'virginmedia.com',
  'talktalk.net', 'ntlworld.com', 'blueyonder.co.uk', 'qq.com', '163.com', '126.com', 'yeah.net',
  'foxmail.com', 'sina.com', 'naver.com', 'daum.net', 'zohomail.com', 'mail.ru', 'web.de',
  't-online.de', 'orange.fr', 'wanadoo.fr', 'free.fr', 'laposte.net', 'libero.it', 'virgilio.it',
  'rediffmail.com', 'hey.com', 'fastmail.com', 'tutanota.com', 'tuta.io', 'hushmail.com',
  'seznam.cz', 'wp.pl', 'o2.pl', 'interia.pl',
]);
const PUBLIC_SUFFIX =
  /^(com|net|org|fr|de|it|es|nl|be|ch|at|ie|ca|in|jp|ru|pl|se|no|dk|fi|pt|br|mx|ar|au|nz|za|cz|gr|tr|co\.(uk|jp|in|za|nz|id|kr)|com\.(au|br|mx|ar|tr|sg|my|hk|tw|cn))$/;

export function isFreeMail(email: string): boolean {
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();
  if (FREE_MAIL_DOMAINS.has(domain)) return true;
  const dot = domain.indexOf('.');
  return dot > 0 && FREE_MAIL_FAMILIES.has(domain.slice(0, dot)) && PUBLIC_SUFFIX.test(domain.slice(dot + 1));
}

function wordCount(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

/* A short answer that says there is nothing to say is not an answer for
   scoring. Only a short one: "No, we run bookings on a legacy PHP system" says a
   great deal, and starts with "No". */
const NOTHING = /^(no|none|nope|nothing|not really|not yet|n\/?a|tbc|tbd|unsure|not sure|no idea|flexible|-+)(\W|$)/i;

function meaningful(text: string): boolean {
  const value = text.trim();
  return value !== '' && !(wordCount(value) <= 4 && NOTHING.test(value));
}

/*
 * A timeline measured in days or weeks, or plainly urgent. Read from the
 * deadline answer and, for the words that only ever mean urgency, the
 * objective. Dates are not parsed: "by 3 March" means different things in
 * different months, and a guessed urgency is worse than a missed one.
 */
const URGENT_DEADLINE =
  /\b(asap|urgent(ly)?|immediately|right away|straight away|tomorrow|this week|next week|this month|end of (the )?(week|month)|within (a|one|two|three|1|2|3) (day|days|week|weeks)|in (a|one|two|three|1|2|3) (day|days|week|weeks))\b/i;
const URGENT_OBJECTIVE = /\b(urgent(ly)?|asap|emergency|outage|critical)\b/i;

export function scoreLead(input: LeadInput): LeadScore {
  let score = 0;
  const reasons: string[] = [];

  if (isFreeMail(input.email)) {
    reasons.push('Personal email provider');
  } else {
    score += 20;
    reasons.push('Email not at a listed personal provider');
  }

  if (input.company.trim() !== '') {
    score += 15;
    reasons.push('Company given');
  } else {
    reasons.push('No company given');
  }

  const objectiveWords = wordCount(input.objective);
  if (objectiveWords >= 12) {
    score += 20;
    reasons.push('Specific objective');
  } else if (objectiveWords > 0) {
    score += 10;
    reasons.push('Brief objective');
  }

  if (meaningful(input.existing)) {
    score += 10;
    reasons.push('Current situation described');
  }

  const urgent = URGENT_DEADLINE.test(input.deadline) || URGENT_OBJECTIVE.test(input.objective);
  if (meaningful(input.deadline)) {
    score += 15;
    reasons.push('Deadline given');
  } else {
    reasons.push('No deadline given');
  }
  if (urgent) {
    score += 10;
    reasons.push('Urgent timeline');
  }

  if (wordCount(input.success) >= 3 && meaningful(input.success)) {
    score += 10;
    reasons.push('Success described');
  }

  score = Math.min(100, score);
  const band: LeadBand =
    urgent && score >= 50 ? 'urgent' : score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold';

  return { score, band, reasons };
}
