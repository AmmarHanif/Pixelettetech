# Privacy Statement: proposed changes for Pix T lead capture

**DRAFT, NOT PUBLISHED.** Drafted 29 September 2026 on the founder's instruction, for the founder and Legal.
Nothing below is on `/privacy`. The build refuses to pass while Pix T captures leads and the published
Statement still says the site does no profiling (`scripts/check-privacy-interlock.mjs`). Once the wording is
approved, it is applied to `src/app/privacy/page.tsx`, and that check passes without any other change.

## Why the Statement has to change

On 29 September 2026 the founder asked for Pix T to:

- ask for a name and a work email before chatting;
- greet the visitor by name;
- find out what they want;
- score the lead, alert the team by email and store the lead in Supabase.

That is built on branch `claude/charming-pascal-gndc6j`. Four things in today's Statement would then be untrue
or incomplete:

1. It describes personal data arriving through the enquiry form. It does not describe the assistant taking a
   name and email at the start of every conversation.
2. It says the site runs "no profiling of individual visitors". A lead score is profiling.
3. It gives no lawful basis or retention period for chat contacts, and none for scoring.
4. It does not tell visitors they can object to scoring.

Unchanged and still true: the site sets no cookies (Pix T stores nothing in the browser). The providers are still
Vercel, Supabase and Resend. A person still decides every reply.

## The proposed changes

Each change gives the section, the current text, the proposed text, and why.

### 1. Information we collect > What you give us: add a paragraph after the first

**Current (first paragraph, unchanged):** "If you complete the enquiry form we receive your name, your company name
if you give one, your work email address, and your answers to four questions..."

**Add:**

> If you use Pix T, the assistant on this site, it asks for your name and your work email before the conversation
> starts, and we record them as soon as you give them, so that we can reply even if you leave before finishing.
> It then asks the same four questions as the enquiry form, and which company you are with. You can skip any of
> those questions or stop at any point. When you finish, your answers are sent to us with your name and email as
> an enquiry. The questions you ask Pix T yourself are answered in your browser and are not sent to us or stored.

**Why:** this is a new point of collection, and it collects before any enquiry. The last sentence is true of the
build: Pix T answers from the site's own pages, in the page. If the assistant is later moved to the server
gateway, that sentence must change first.

### 2. Information we collect > What the site generates: extend one sentence

**Current:** "Your enquiry is stored with the date it arrived and nothing else about your device."

**Proposed:** "Your enquiry, and the name and email you give Pix T, are stored with the date they arrived and
nothing else about your device. To stop the assistant being misused, we count how often each connection uses it,
for up to a day. The connection's address is held only in the server's memory for that count, and is never
stored or logged."

**Why:** the new chat-contact record holds the name, email, source and time only. It deserves the same
statement. The second part describes the rate limit added after the security review. That limit is in-memory
processing of the connection address for the purpose the Statement already names, preventing abuse, and it is
disclosed rather than left implied.

### 3. Information we collect > Please do not send more than you need to

**Current:** "An enquiry form is for telling us what you want built."

**Proposed:** "An enquiry form, or Pix T, is for telling us what you want built."

### 4. How and why we use information: two rows added to the table

| What we do | Why we are allowed to |
|---|---|
| Record the name and email you give Pix T, so that we can reply if you leave before finishing | Our legitimate interests in replying to people who start a conversation with us |
| Give an enquiry sent through Pix T a lead score, so that we can see which to answer first | Our legitimate interests in answering first the enquiries we are best placed to help with |

**Why:** each processing purpose needs a lawful basis. Legitimate interests is proposed; **Legal to confirm**, and
to say whether a written legitimate interests assessment is wanted.

### 5. AI and technology providers: new paragraph after "No decision producing legal effects..."

**Add, under the heading "How we prioritise enquiries from Pix T".** The heading carries `id="pix-t-lead-score"`.
That is the marker the build checks for, so the paragraph cannot be dropped by accident.

> When you send an enquiry through Pix T, we give it a lead score from 0 to 100 and a band (cold, warm, hot or
> urgent) so that we can see which enquiries to answer first. The score uses only what you told Pix T: whether
> your email address is at a well-known personal email provider, whether you named a company, how much you
> told us about what you want, whether you described what exists today and what success would look like, and
> whether you gave a deadline and how soon it is. It uses nothing about your device or how you browsed
> the site. The score is stored with your enquiry, together with the reasons for it, and you can ask us for both.
> It only affects the order in which we look at enquiries: a person reads every enquiry and decides whether and
> how to reply. Enquiries sent through the contact form are not scored.

**Why:** this is the disclosure the interlock looks for. It describes the rules as built in
`src/lib/lead-score.ts`, and it keeps the existing promise that no decision with legal or similarly significant
effects is made by automated means.

**Optional, for accuracy today:** the section opens "We use third-party AI and technology providers to operate
our website assistant". Pix T calls no AI provider; its answers come from this site's pages, and what a visitor
gives it is handled by the three providers already named. This was reported on 28 September and left for the
founder and Legal. It is not needed for lead capture.

### 6. Analytics, cookies and your privacy choices: take out the sentence that would become untrue

**Current:** "We run no advertising or remarketing technology, no cross-site tracking, no session recording or
heatmaps, and no profiling of individual visitors. We do not share visitor data with advertising platforms and
we do not match website behaviour to a person or to a CRM record."

**Proposed:** "We run no advertising or remarketing technology, no cross-site tracking and no session recording
or heatmaps. We do not share visitor data with advertising platforms, and we do not match your browsing of this
website to a person or to a CRM record. The one thing we do score is an enquiry you send through Pix T, as
described under [AI and technology providers](#ai-automation)."

**Why:** "no profiling of individual visitors" is the sentence the lead score contradicts. The rest stays true,
because scoring reads only what the visitor chose to send.

### 7. How long we keep it: add the chat-contact period

**Add after the first paragraph:**

> If you give Pix T your name and email but do not go on to send an enquiry, we keep them for
> **[12 months] from when you gave them**, and then delete them. An enquiry you do send is kept as above, and its
> lead score and the reasons for it are kept and deleted with it.

**Decision needed:** the period for contacts who never sent an enquiry. 12 months is proposed. It is shorter than
the 24 months for enquiries, because no enquiry was made. Alternatives are 24 months, to match enquiries, or 6
months.

### 8. Your rights: add the right to object to scoring

**Add to the second paragraph:**

> You can object to your enquiry being scored. If you do, we delete the score and the reasons for it, and your
> enquiry is read in the ordinary order.

**Why:** scoring relies on legitimate interests, so the objection right applies. Stating it plainly costs
nothing.

### 9. Version

The Statement is at version 2.0, effective 17 September 2026, and is unpublished. Earlier pre-publication edits
kept that label. **Decision:** keep 2.0 until first publication (the precedent), or re-issue as 2.1 with the
publication date if Legal wants the change on the record.

## Also for Legal to see (already built, not Statement text)

- **Where the name and email are asked, proposed (security review S5):** "We record your name and email as
  soon as you give them, so the team can reply even if you leave before finishing. See our Privacy Notice for
  more information." This replaces the contact form's notice (founder wording, 17 September), which said only
  that the information is used to respond to an enquiry. Here the details are recorded before any enquiry
  exists. The build checks for "as soon as you give them". **For approval.**
- **Pix T's footer once the visitor is known:** "Your name, email and answers to Pix T's questions go to the team.
  The rest of this chat is not stored."
- **Before the first discovery question:** "So the team can help properly, a few quick questions. Your answers go
  to them with your name and email when we finish. Skip any you like, or stop at any point."
- **Whether a DPIA is required** for scoring combined with an assistant is Legal's call, raised on 29 September.
  Nothing here decides it.
- **Conflicts with the founder's Pix T brief, resolved by his later instruction:** §45 asked for a verified email
  (the build checks the format only, by his choice). §47 said no CRM record per chat (every chat contact is now
  recorded).

## To apply, once approved

1. Edit `src/app/privacy/page.tsx` with the approved wording. Put `id="pix-t-lead-score"` on the heading of
   change 5.
2. Run `npm run build`. The privacy interlock checks both the source (from `next.config.ts`, on any production
   build) and the build output. It passes only when:
   - the marker is present;
   - nothing on the page still says "no profiling" or "no scoring", "do not profile" or "do not score", or
     "never profiles" or "never scores";
   - the notice where the name and email are asked says "as soon as you give them".
3. Apply `supabase/migrations/20260929120000_pix_t_lead_capture.sql` to the Supabase project **before** deploying
   (founder step). Then run its six checks.

## Host settings for the founder (from the security review)

- **Build command:** confirm the Vercel project's Build Command is not overridden. The source half of the
  interlock runs on any `next build`; the output half and the leak scan run only with `npm run build`.
- **Firewall:** add a Vercel Firewall rate-limit rule for POST requests carrying a `Next-Action` header. The
  in-memory limit in the code counts per server instance, so the host's rule is the stronger control.
- **Monitoring:** run a daily row count on `assistant_contacts`, so a flood of fake contacts is noticed.
- **Supabase Auth:** if the site does not use it, turn sign-ups off in the project.
- **Use of the data:** `assistant_contacts` holds unverified details that anyone can type. It is not a marketing
  list and must not be used as one.
