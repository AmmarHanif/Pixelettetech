# Contact form — what has to be supplied before it works

The contact form at `/contact` writes each enquiry to a Supabase table and sends
a notification email through Resend. Since 28 September 2026 the site
assistant, Pix T, sends its enquiries through the same path, and since 29
September it also records the name and email a visitor gives it before
chatting, in a second table, `assistant_contacts`. The code is written, built
and tested, and has been on Vercel Production since 2026-10-01. **Whether the
four variables below are set in the Vercel project is not recorded.** Until
they are set, the form does what it has always done: it tells the visitor
plainly that it is not connected and asks them to email
`sales@pixelettetech.com` instead. It never reports success for an enquiry that
went nowhere.

That is deliberate, and it is also what every preview deployment will do.

Written 2026-09-14, updated 2026-10-01. No run of anything in this file against
a live Supabase project or a live Resend account has been recorded — see "What
is still unproven" at the end.

**Urgent since 2026-10-01.** The code that writes to both tables went live that
day, and whether the migrations have been applied to the live project is
unconfirmed. Until the lead-capture migration is applied, a site with the
Supabase variables set does not record chat contacts at all. It stores Pix T
enquiries without their score if the code's fallback works as designed, and
otherwise does not store them at all. Section 2, "Applying the migrations —
step by step", gives the exact conditions, how to find out which state the
project is in, and what to run.

---

## 1. The four environment variables

Set these in the Vercel project (Settings, Environment Variables), for
Production and any Preview environment that should really deliver. None of them
belongs in a file in this repository, and none of them may be given the
`NEXT_PUBLIC_` prefix — that prefix is what makes Next.js inline a value into the
JavaScript sent to the browser.

| Variable | What it is | Where it comes from |
|---|---|---|
| `SUPABASE_URL` | The project's API base URL, of the form `https://<project-ref>.supabase.co` | Supabase dashboard, Project Settings, API section, "Project URL" |
| `SUPABASE_SERVICE_ROLE_KEY` | The **secret** service-role credential. It bypasses Row Level Security, which is exactly why the form uses it and exactly why it must never leave the server | Supabase dashboard, Project Settings, API section, under project API keys, the `service_role` entry. It is hidden behind a reveal control because it is a secret |
| `RESEND_API_KEY` | A Resend credential with permission to send | Resend dashboard, API Keys, create one. Give it sending permission only |
| `CONTACT_NOTIFICATION_FROM` | The address notifications are sent **from**, for example `website@pixelettetech.com` | You choose it, but it must be on a domain you have verified in Resend. Resend refuses to send from an unverified domain |

The Supabase and Resend dashboards both rename these panels from time to time.
If the wording above does not match what you see, the thing you are looking for
is the project's API URL, its service-role secret, and a sending credential.

**The address notifications are sent TO is not a variable.** It is
`contactEmail` in `src/content/company.ts`, currently `sales@pixelettetech.com`.
Change it there and the form follows, because that file is the single source of
truth for the published address and the form reads it rather than repeating it.

### Which half each variable controls

The two halves are independent, and either can be configured without the other.

- `SUPABASE_URL` **and** `SUPABASE_SERVICE_ROLE_KEY` — both needed, or the
  enquiry is not stored.
- `RESEND_API_KEY` **and** `CONTACT_NOTIFICATION_FROM` — both needed, or no
  notification is sent.

If only one half is configured, that half runs and the form works. If neither
is, the form reports honestly that it is not connected. See section 6.

---

## 2. Supabase: create the table

1. Create the project, or pick the existing one.
2. Apply the two migrations, in this order:
   `supabase/migrations/20260914120000_create_contact_enquiries.sql`, then
   `supabase/migrations/20260929120000_pix_t_lead_capture.sql` (Pix T lead
   capture, 29 September 2026: the lead-score columns and the
   `assistant_contacts` table, with the same access controls). Either
   `supabase db push` with the CLI, or paste each whole file into the SQL Editor
   in the dashboard and run it. Follow "Applying the migrations — step by step"
   below, which runs a read-only preflight query first so that only what is
   missing gets applied. The first file is safe to run twice. The second is
   not: running it twice fails on the constraints it adds, deliberately. It has
   six checks at its foot. Its header says to apply it before the code that
   uses it is deployed; that can no longer be met, because the code went live on
   2026-10-01.
3. **Confirm Row Level Security is on and that no policy was created.** Both are
   the security design, not an oversight. The table is a list of named people
   and their work email addresses, and the anon key that reaches it is published
   in browsers by design, so the anon role must be able to do nothing at all.
   Run the checks written out at the bottom of each migration file (steps C
   and D below). The REST check is the one that matters (check 4 in the first
   file, check 5 in the second): it calls the REST endpoint with the **anon**
   key and expects to be refused. Submit one enquiry first, so that there is
   actually a row there to leak — a query returning `[]` against an empty table
   proves nothing.
4. Do not "fix" the table later by adding a policy to make it readable. Read it
   in the dashboard's table editor, which uses the owning role and is unaffected.
5. **Open enquiry CSV exports through Excel's Data → From Text/CSV, never by
   double-clicking the file.** Added 2026-09-14 after a security review, and the
   victim here is your laptop rather than the website. Every field in the table
   is free text a stranger typed. A name submitted as `=HYPERLINK(...)` or a DDE
   payload is stored exactly as sent — correctly, because the table is the
   record and mangling it would corrupt genuine enquiries — and then *evaluated*
   when a spreadsheet opens the export by double-click. That can fire a formula
   or quietly send adjacent cells, meaning other enquirers' names and email
   addresses, to whoever wrote it. The import path does not auto-evaluate.
6. **Enforce MFA on every member of the Supabase organisation, and keep a note
   of who they are.** This is the real access control for the data, not a nice
   extra: because the table deliberately does not `force row level security`
   (which would lock the owner out and look exactly like data loss), the only
   route to a list of named individuals and their work email addresses is
   whoever can log in to the dashboard. Review the member list whenever you
   review the certificate dates — an ISO 27001 certified firm will be asked this
   in diligence, and "we rely on the Supabase login" is only a good answer if
   the login is defended.

The migration grants the service role `INSERT` and deliberately not `SELECT`.
If a future admin page needs to list enquiries through the API, grant `SELECT`
explicitly; the migration says so at the point where it matters.

### Applying the migrations — step by step

Added 2026-10-01. Written for the founder, pasting into the Supabase SQL Editor
(dashboard, SQL Editor, new query). No run of it against the live project has
been recorded.

**Why this is now urgent.** The code that writes to both tables has been live on
Vercel Production since 2026-10-01 (`main` at `0e9a979`). Whether either
migration has been applied to the live project is unconfirmed: no check has
been recorded. If `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Vercel
(also unconfirmed) and the lead-capture migration has not been applied:

- **Pix T enquiries are stored without their score.** The insert carrying the
  lead columns is refused, and `src/lib/enquiries.ts:228-231` logs
  `lead columns missing - apply the lead-capture migration` and writes the row
  again without them. The score and its reasons still go in the notification
  email (`enquiries.ts:490-494`), if Resend is configured. That fallback fires
  only if Supabase answers with `PGRST204` or `42703`, which has not been
  confirmed against Supabase itself (`enquiries.ts:224-226`). Any other answer means the enquiry is not stored at all, and the
  email, which then opens with the "NOT saved to the database" warning, is the
  only copy.
- **Chat contacts are not recorded.** The name and email a visitor gives Pix T
  before chatting go to `assistant_contacts` through `storeChatContact`
  (`enquiries.ts:237-247`), which has no fallback. No email is sent for a chat
  contact, so nothing else holds it. The visitor is not told and chats on
  (`src/app/contact/actions.ts:268-301`).
- If the first migration is missing as well, no enquiry is stored at all, from
  the contact form or from Pix T.

**A. Run the preflight query first.** It only reads the catalogues, changes
nothing, and does not error whatever state the project is in: it uses
`to_regclass`, which returns null for a missing table instead of failing. Paste
it as one query and run it.

```sql
select
  to_regclass('public.contact_enquiries') is not null                as contact_enquiries_exists,
  (select count(*) from pg_constraint
    where conrelid = to_regclass('public.contact_enquiries')
      and contype = 'c')                                             as contact_enquiries_check_constraints,
  (select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'contact_enquiries'
      and column_name in ('lead_ref', 'lead_score', 'lead_band', 'lead_reasons'))
                                                                     as lead_columns_present,
  to_regclass('public.assistant_contacts') is not null               as assistant_contacts_exists,
  (select count(*) from pg_constraint
    where conrelid = to_regclass('public.assistant_contacts')
      and contype = 'c')                                             as assistant_contacts_check_constraints,
  (select relrowsecurity from pg_class
    where oid = to_regclass('public.contact_enquiries'))             as contact_enquiries_rls,
  (select relrowsecurity from pg_class
    where oid = to_regclass('public.assistant_contacts'))            as assistant_contacts_rls,
  (select count(*) from pg_policies
    where schemaname = 'public'
      and tablename in ('contact_enquiries', 'assistant_contacts'))  as policies,
  (select count(*) from information_schema.role_table_grants
    where table_schema = 'public'
      and table_name in ('contact_enquiries', 'assistant_contacts')
      and grantee in ('anon', 'authenticated', 'PUBLIC'))            as anon_authenticated_grants;
```

It returns one row of nine values, in the order of the columns above. There
are three expected answers:

1. `false | 0 | 0 | false | 0 | null | null | 0 | 0` — **nothing is applied.**
   Apply both files in step B, the first and then the second.
2. `true | 8 | 0 | false | 0 | true | null | 0 | 0` — **only the first file is
   applied.** Apply the second file only.
3. `true | 11 | 4 | true | 3 | true | true | 0 | 0` — **both are applied.** Apply
   nothing, and go straight to step C.

**Any other answer: stop, and apply nothing until someone has looked at it.** In
particular:

- If the first value is `true` and the second is fewer than 8,
  `contact_enquiries` was probably created before the first migration ran: the
  trap its check 3b describes. Re-running the first
  file will not repair it; follow check 3b.
- A non-zero `policies` or `anon_authenticated_grants` means the anon key may be
  able to reach the data. Deal with that before anything else.
- Between 1 and 3 lead columns, or `assistant_contacts` present without all four
  lead columns, means the second file ran only in part or something was changed
  by hand.

**B. Apply only what is missing, in order.** Open the file in the repository,
copy the whole of it, paste it into a new query and run it:
`20260914120000_create_contact_enquiries.sql` first, then
`20260929120000_pix_t_lead_capture.sql`. After each file, run the preflight
again; it should now show the next answer in the list above.

- **The first file run twice** is harmless: the second run changes nothing. It
  also does not repair a table that existed before it (check 3b).
- **The second file run twice fails loudly, on purpose.** The second run stops at
  once with `42710 constraint "contact_enquiries_lead_score_range" for relation
  "contact_enquiries" already exists`; the file explains why at lines 36-38. If
  you see it, run the preflight. If it shows answer 3, the earlier run worked and
  nothing is wrong. Do not drop constraints to make the error go away.
- **The second file run before the first** fails at its first statement with
  `42P01 relation "public.contact_enquiries" does not exist`. Run the preflight;
  if it shows answer 1, apply the first file and then the second. The second
  file's header does not say that it needs the first, but it does.

In the local test below, both failures left the database exactly as it was,
because each file ran as a single transaction. Whether the SQL Editor runs a
pasted file as a single transaction was not tested, which is one more reason to
run the preflight after any error rather than guess.

**C. Run each file's acceptance checks.** They are in the comment block at the
foot of each file. Paste the queries one at a time.

- First file, checks 1, 2, 3 and 3b. Expect RLS on with 0 policies; zero rows;
  exactly one row, `INSERT`; 8 rows.
- Second file, checks 1, 2, 3, 4 and 6. Expect 4 rows; RLS on with 0 policies;
  zero rows; exactly one row, `INSERT`; 3 on `assistant_contacts` and 11 on
  `contact_enquiries`.

Two known quirks in those checks, neither a fault in the tables. Checks 3b and 6
use `'public.<table>'::regclass`, which throws "relation does not exist" when a
table is missing, so they can confirm an apply but cannot detect a missing one;
the preflight is for that. Check 1 in the second file uses `like 'lead_%'`, in
which `_` is a wildcard; it returns exactly the four lead columns today, and the
preflight lists them by name.

**D. The REST check, with the ANON key.** Checks in step C read the same
catalogues the files wrote to. This one comes from outside, as anyone on the
internet would. It is check 4 in the first file and check 5 in the second. Use
the project's anon (public) key, never the service-role key. First submit one
real enquiry through `/contact` and give Pix T a name and email, so that there
are rows to leak.

```
GET  {SUPABASE_URL}/rest/v1/contact_enquiries?select=*    apikey: {anon key}  -> 401, or 200 []. NEVER a row.
POST {SUPABASE_URL}/rest/v1/contact_enquiries             apikey: {anon key}  -> 401/403. NEVER 201.
GET  {SUPABASE_URL}/rest/v1/assistant_contacts?select=*   apikey: {anon key}  -> 401, or 200 []. NEVER a row.
```

Then run the first live test in section 5.

**What was tested on 2026-10-01, and what was not.**

Tested, locally only. Both files were applied verbatim to PGlite 0.5.8
(PostgreSQL 18.3) under Node 22.18.0, in a scratch folder outside this
repository, after setting up Supabase-like roles (`anon` and `authenticated`,
and `service_role` with BYPASSRLS) and Supabase-style default grants on new
tables. Both applied without error. Every SQL check in step C gave the expected
result. The preflight gave the three answers above, one per state, and did not
error in any of them. `anon` and `authenticated` were refused SELECT and INSERT
on both tables. `service_role` could INSERT, and was refused SELECT and
`INSERT ... RETURNING *`, which is why `enquiries.ts:318` sends
`Prefer: return=minimal`. The CHECK constraints rejected out-of-range values,
and rows shaped exactly as the code sends them were accepted. Re-running the
first file changed nothing. The second file's re-run, and its run without the
first, failed as step B describes and changed nothing.

Not tested: anything against Supabase itself. That means the live project's
state, the SQL Editor's transaction behaviour, the hosted REST API (step D),
and whether that API really answers `PGRST204` or `42703` for the missing lead
columns, which the fallback at `enquiries.ts:228` depends on. No live or remote
database was touched.

---

## 3. Resend: verify a domain

1. Add and verify the sending domain in the Resend dashboard. This means adding
   the DNS records it gives you and waiting for verification to complete.
2. Create the API credential and set `RESEND_API_KEY`.
3. Set `CONTACT_NOTIFICATION_FROM` to an address on that verified domain.

Sending from an unverified domain is the single most likely reason for a first
live test to fail.

---

## 4. Two facts to look up and record

Both are dashboard lookups, both are needed for the privacy disclosures, and
neither can be determined from the code. Record the answers here when you have
them.

| Fact | Where to read it | Answer |
|---|---|---|
| **Supabase project region** | Supabase dashboard, Project Settings, General. It is fixed when the project is created and cannot be changed afterwards — so choose it deliberately, before creating the project | _not yet recorded_ |
| **Resend region** | Resend dashboard. Check the account or domain settings for the sending region | _not yet recorded_ |

These matter because the table holds personal data and the disclosures have to
say where it is processed. If the intention is that enquiry data stays in the
UK or the EU, **check the Supabase region before creating the project**, not
after.

The disclosures have since been written. `/privacy` says the regions in which
Vercel, Supabase and Resend process this information have not been restricted
(`src/app/privacy/page.tsx:523-525`), and `/security-and-data` was withdrawn on
17 September 2026. PROCUREMENT-PACK.md records an OPEN conflict between that
and a London requirement. This file records the facts; it does not draft the
disclosures.

---

## 5. Proving it works, on the first live test

1. Submit the form on the deployed site with a real address you control.
2. The visitor should see "Thank you. One of us will reply personally, not an
   automated sequence." (`MESSAGES.SUCCESS`, `src/app/contact/actions.ts:80`;
   the one-working-day promise was removed on 24 September 2026).
3. A row should appear in `contact_enquiries`.
4. A notification should arrive at `sales@pixelettetech.com`. Replying to it
   should reply to the address the visitor typed.
5. Check the deployment logs. On a fully working submission there should be
   **no** `[contact]` lines at all. Any `[contact] ... failed` line means one of
   the two halves did not work even though the visitor was told the enquiry was
   received — which is correct behaviour, and is precisely why the line is there.

If the notification email carries a block of capitals reading **"WARNING: this
enquiry was NOT saved to the database"**, then the email is the only copy of that
enquiry. Do not delete it, and go and look at Supabase.

---

## 6. What the form does when things are half-broken

The rule is one sentence: **the visitor is told the enquiry was received only if
it actually reached something that outlives the request.**

| Store | Email | Visitor sees | Logged |
|---|---|---|---|
| ok | ok | Success | nothing |
| ok | failed | Success — the record exists | the email failure |
| failed | ok | Success — a person has it, and the email says it is the only copy | the store failure |
| failed | failed | Honest error, and the address to email instead | both failures |
| unconfigured | unconfigured | "Our contact form is not currently connected" | the fault |

The two halves are always both attempted. A failure in the store never skips
the notification, because the two fail for unrelated reasons and an enquiry in
somebody's inbox is an enquiry that gets answered.

Nothing in those log lines contains personal data. Failures are logged against a
generated enquiry reference and the provider's own status code, never against a
name, an address or an answer — so an operator diagnoses from the reference and
looks the content up in the table.

---

## 7. Proving nothing reaches the browser

The service-role credential bypasses Row Level Security, so it reaching a
browser would be the whole security model gone. Three things prevent it, and the
third is checkable after any build:

1. `src/app/contact/actions.ts` is a `'use server'` module, so Next compiles it
   to a server reference and its body never enters a client bundle.
2. None of the four variables carries the `NEXT_PUBLIC_` prefix, so Next does
   not inline them into client code.
3. `src/lib/enquiries.ts` throws if it is ever evaluated in a browser.

To check it yourself after a build, from the repository root:

```
grep -rlF SUPABASE_SERVICE_ROLE_KEY .next/static   # expect: no matches
grep -rlF RESEND_API_KEY            .next/static   # expect: no matches
grep -rlF api.resend.com            .next/static   # expect: no matches

grep -rlF SUPABASE_SERVICE_ROLE_KEY .next/server   # expect: a match
```

The last line is the point. It proves the search would have found the string if
it were there, so the three empty results above it are real absences rather than
a grep that was never going to match anything.

---

## 8. Running the tests

No dependency install is needed; both scripts use only Node and the TypeScript
compiler already in the tree.

```
node verification/2026-09-14/contact_action_test.js
node verification/2026-09-14/positive_controls.js
```

Both scripts hard-code the repository path of the machine they were written on
(`REPO`, line 22 of each). On any other machine, point that constant at this
checkout first, or they fail before running a test.

The first compiles the real server action, stubs the network, and exercises the
unconfigured state, the success path, both partial-failure paths and the total
failure. It ends with two deliberately false assertions that must be reported as
failures; if they ever pass, the harness is broken and its other results mean
nothing.

The second is the proof that those tests bite. It injects a type error and
checks the compiler rejects it, then rewrites the action so it claims success
when nothing was delivered and checks the suite goes red. It restores the file
afterwards and verifies the restore by SHA-256.

---

## 9. What is still unproven

Stated plainly, because it is the difference between "written" and "working".

- **No run against a live Supabase project or Resend account has been
  recorded.** Whether either migration has been applied to the live project is
  unconfirmed. On 2026-10-01 both migrations were executed against a local
  PostgreSQL (PGlite), not Supabase, and every SQL check passed; section 2,
  "Applying the migrations — step by step", says exactly what that did and did
  not prove. Section 2 step 3 is the acceptance test against the real project,
  and no run of it has been recorded.
- **The access control is the thing to check first, not last.** If only one item
  in this document gets verified, make it the anon-key request: check 4 in the
  first migration and check 5 in the second.
- **One field name in the Resend payload is unverified.** The notification is
  sent with `reply_to`, which is the expected spelling for Resend's HTTP API, but
  it could not be checked against the vendor's reference from the build
  environment. The code handles being wrong: if Resend rejects the payload as
  invalid, it drops that one field and sends the enquiry anyway, and writes a log
  line saying it did. If you see `status=422 retrying without reply_to` in the
  logs after a real send, the field name is wrong — tell whoever maintains this
  and the fallback branch can be replaced with the correct name.
- **The Vercel Node version has not been checked.** It does not matter today,
  because no dependency was added. It would matter if the Supabase SDK were
  adopted later; see `DEPENDENCIES.md`, 2026-09-14.
