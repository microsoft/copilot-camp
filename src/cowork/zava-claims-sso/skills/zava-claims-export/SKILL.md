---
name: zava-claims-export
description: Converts a raw claims export workbook (one claim per row) into a polished,
  formatted Excel report with a Dashboard (KPIs, breakdowns by status, damage
  type, severity, and location, plus charts) and a clean Claims Detail table.
  The report layout is a built-in reference template, so every run looks
  consistent. Use when the user asks to "turn this claims export into a report",
  "build a claims report", "format the claims data", "make a claims dashboard",
  "summarize these claims", "claims summary report", or drops a claims_export
  spreadsheet and wants it turned into a nice report. Also use for similar flat
  claim/loss/incident exports that share the columns Claim Number, Claimant,
  Location, Damage Type, Status, Date Filed, and Estimated Cost. Do NOT use for
  writing a prose narrative document (use docx), building slides (use pptx),
  ad-hoc one-off spreadsheet edits unrelated to claims (use xlsx), or
  interactive dashboards the user clicks through (use canvas).
license: Proprietary. LICENSE.txt has complete terms
---

# Claims Report

Automate the boring part of claims reporting: take a raw export and return a
report a manager would be happy to open — headline numbers up top, breakdowns
and charts on a Dashboard, and a tidy, filterable Claims Detail table behind it.

The report design lives in the `THEME` block at the top of
`scripts/build_report.py`. That block **is** the reference template — colours,
fonts, and number formats. Edit it once and every future report inherits it.

## When to Use

Trigger when the user has a **flat claims/loss/incident export** (one claim per
row) and wants it turned into a formatted, summarized report. The canonical
input is the columns below; the script tolerates minor header-name variation.

## When NOT to Use

- The user wants a **written narrative** (memo, summary letter) → use `docx`.
- The user wants **slides** for a meeting → use `pptx`.
- The user wants a **clickable/interactive** dashboard → use `canvas`.
- A generic spreadsheet task with **no claims structure** → use `xlsx`.
- The export is **not row-per-claim** (e.g. already a pivot/summary) — reshape
  it first, or fall back to `xlsx`.

## Expected Input Schema

| Column | Example | Notes |
|--------|---------|-------|
| Claim Number | `CN202504990` | Row key; blank / "Total" rows are dropped |
| Claimant Name | `David King` | |
| Location | `9607 Maple Dr, Bellevue, WA 98004` | City/State/ZIP parsed out |
| Damage Type | `Mold damage - moderate severity; Water damage` | Split into primary / severity / other |
| Status | `Open - Claim is under investigation` | Short status kept for grouping |
| Date Filed | `2026-04-11` | ISO or common date formats |
| Estimated Cost | `10608` | Numeric; missing values are counted, never invented |

See [references/schema.md](references/schema.md) for full parsing rules and how
to add a column.

## Workflow

1. **Find the input.** If the user attached a file, use that path. Otherwise
   look in `input/` for the claims export (`Glob input/**/*.xlsx`). If nothing
   is found, ask the user for the file — do not invent data.
2. **Build the report** into scratch space (never write to `output/` directly):
   ```bash
   python scripts/build_report.py --in "<input.xlsx>" --out working/claims_report.xlsx --title "Insurance Claims Report"
   ```
   The script prints a one-line summary (`claims=…  skipped_rows=…
   total_cost=…  avg_cost=…`) and notes any claims missing a cost. Read that
   line back to the user in plain language.
3. **Publish to the user surface** with the artifact tool (output/ is
   read-only to direct writes):
   ```
   CopyArtifact(surface="output", source="working/claims_report.xlsx",
                destination="Claims Report.xlsx")
   ```
4. **Confirm delivery (blocking):** `Glob output/**/*` must show the file
   before you tell the user it's ready. If it's missing, re-run step 3.
5. **Summarize** the headline numbers (total claims, total & average estimated
   cost, open vs closed, top damage type) so the user gets value in the chat
   even before opening the file. Ground every number in the script's output —
   never estimate.

## Output

A single `.xlsx` with two sheets:

- **Dashboard** — title banner (source file, generated date, filing range),
  six KPI cards (Total Claims, Total / Average Est. Cost, Open, Closed,
  Severe-Severity), breakdown tables by Status, Damage Type, Severity, State,
  and City (each with count, % of claims, and est. cost + a totals row), and
  two bar charts (claims by status, cost by damage type).
- **Claims Detail** — the cleaned claim table: Claim Number, Claimant, City,
  State, Damage Type, Severity (colour-cued), Other Damage, Status, Date Filed,
  and Est. Cost (currency-formatted), with banded rows, a frozen header, an
  AutoFilter, and a grand-total row.

## Guardrails

- **Never fabricate data.** Only values present in the source appear in the
  report. Blank or "Total" rows are dropped and counted; missing costs are
  reported, not filled in.
- **Reconcile before reporting.** The detail total and the dashboard totals both
  derive from the same cleaned rows; if the printed `total_cost` looks wrong,
  re-check the input rather than the report.
- **Currency is display-only** — the raw exports carry no currency code; the
  `$` format is cosmetic. If the user says the data isn't USD, change
  `THEME["money_fmt"]` in the script.
- **Don't hand-edit the output** for one-off fixes — change the input or the
  `THEME`/logic and re-run, so the report stays reproducible.
- **Large files:** the script streams values with openpyxl; for very large
  exports (tens of thousands of rows) warn the user it may take a moment.
