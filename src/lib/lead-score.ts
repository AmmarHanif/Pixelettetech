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
 * secret: the Statement describes them.
 */

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
 * at a company's own domain, so it earns fewer points, not none.
 *
 * FAMILIES match the first label of the domain, so gmail.com, yahoo.co.uk and
 * hotmail.fr all count. EXACT domains are providers whose name is too generic
 * to match as a family ("me", "mail", "sky").
 */
const FREE_MAIL_FAMILIES = new Set([
  'gmail', 'googlemail', 'yahoo', 'ymail', 'rocketmail', 'hotmail', 'outlook', 'live', 'msn',
  'icloud', 'aol', 'protonmail', 'proton', 'gmx', 'yandex',
]);
const FREE_MAIL_DOMAINS = new Set([
  'me.com', 'mac.com', 'mail.com', 'pm.me', 'btinternet.com', 'sky.com', 'virginmedia.com',
  'talktalk.net', 'ntlworld.com', 'qq.com', '163.com', '126.com',
]);

export function isFreeMail(email: string): boolean {
  const domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();
  return FREE_MAIL_DOMAINS.has(domain) || FREE_MAIL_FAMILIES.has(domain.split('.')[0]);
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
    reasons.push('Work email domain');
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
