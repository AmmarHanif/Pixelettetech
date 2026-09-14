# Contact form — what has to be supplied before it works

The contact form at `/contact` writes each enquiry to a Supabase table and sends
a notification email through Resend. The code for both is written, built and
tested. **Nothing is configured**, so until the four variables below are set the
form does what it has always done: it tells the visitor plainly that it is not
connected and asks them to email `sales@pixelettetech.com` instead. It never
reports success for an enquiry that went nowhere.

That is deliberate, and it is also what every preview deployment will do.

Written 2026-09-14. Nothing in this file has been run against a live Supabase
project or a live Resend account — see "What is still unproven" at the end.

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
2. Apply `supabase/migrations/20260914120000_create_contact_enquiries.sql`.
   Either `supabase db push` with the CLI, or open the SQL Editor in the
   dashboard, paste the whole file and run it. The file is safe to run twice.
3. **Confirm Row Level Security is on and that no policy was created.** Both are
   the security design, not an oversight. The table is a list of named people
   and their work email addresses, and the anon key that reaches it is published
   in browsers by design, so the anon role must be able to do nothing at all.
   Run the four checks written out at the bottom of the migration file. The
   fourth is the one that matters: it calls the REST endpoint with the **anon**
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

The privacy and security-and-data page copy is being written separately. This
file records the facts; it does not draft the disclosures.

---

## 5. Proving it works, on the first live test

1. Submit the form on the deployed site with a real address you control.
2. The visitor should see "Thank you. One of us will reply within one working
   day".
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

- **Nothing here has touched a live Supabase project or Resend account.** The
  migration has never been executed. Its behaviour is reasoned from documented
  PostgreSQL and Supabase semantics, not observed. Section 2 step 3 is the
  acceptance test, and it has not been run.
- **The access control is the thing to check first, not last.** If only one item
  in this document gets verified, make it the anon-key request in the migration's
  check 4.
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
