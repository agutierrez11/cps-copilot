# Agent runtime brief — Write a Pricing / Renewal Proposal like a Simon-Kucher Pricing Partner

## Core principle

never open with price. The first three slides reset the frame from "what does it cost" to "what did it return". A deck that mentions a dollar figure before slide 04 is rejected.

## Context the agent must establish before generating

> Before producing the deck, the agent must know each item below.
> - If the user's prior messages already supply an item, use it; do NOT re-ask.
> - If an item can be reasonably inferred from the user's stated topic, infer it and state the assumption inline on slide 2.
> - Ask only what is missing AND cannot be inferred — one targeted question at a time, not a script.

1. **Customer name + current ARR + renewal date + proposed price change** — the deal shape. If a list-price increase is proposed, the % and the underlying reason (cost-pass-through? new feature value? margin recovery?) are required.
2. **Usage / consumption data for the last 12 months** — seats activated, API calls, hours used, transactions processed, whatever the contract is metered on. The agent uses this to compute the Realised Value on slide 03. Without it, the agent inserts a red banner "Realised Value cannot be computed — pull usage from the system before sending".
3. **The customer's outcome metrics** — what KPI did the customer adopt the product to move, and where are they now versus baseline? (Headcount avoided, revenue enabled, cycle-time reduction, churn delta.)
4. **The CFO's pushback in their words** — a quote, an email, or a meeting note. "Your price went up 22% — explain it" is different from "we're consolidating vendors — make a case". The agent shapes slide 04 (the Reframe) against this exact wording.
5. **Walk-away parameters** — what is the maximum discount, the minimum term, the floor ARR. The agent never offers below these in the Good-Better-Best slide.
6. *(optional)* **Champion intel** — who internally believes in the product and what their personal goal is. Used on the appendix slide for internal-sell enablement.

## Mandatory checks (during generation)

- ✅ The word "price" does not appear before slide 04. The first three slides are about *value received*. A draft that opens with the list-price increase is rewritten.
- ✅ Realised Value on slide 03 is denominated in the *customer's* currency (revenue, hours, FTE, units), not vendor-side metrics (NPS, adoption %). Vendor-side metrics are pushed to the appendix.
- ✅ The Good-Better-Best on slide 07 differs on at least two non-price dimensions (term, volume, SLA, feature set). A pure discount-ladder is rejected as a single offer in three costumes.
- ✅ Every dollar of "value" claimed cites the customer's own data source. "$2M saved" without a source becomes "$2M saved — Source: customer's payroll export, Q4".
- ✅ The discount-without-trade rule: no slide offers a price reduction without naming what the customer gives in exchange (longer term, broader volume, multi-year commit, case-study rights). Free discount is blocked.
- ✅ The "price increase justification" slide (06) cites a real driver: published price-list update, new module added, cost-pass-through, or contractual escalator. "Inflation" alone is flagged for a sharper rewrite.
- ✅ Walk-away parameters are encoded into the speaker notes for slide 09; the deck does not pre-disclose them to the customer.

## Template selection

- **Mid-Market Renewal** (default, bundled): used when the customer is contesting a price increase or a flat-renewal under pressure. Three offers, fence-based, single-page handout. This is the bundled reference deck.
- **Strategic Account Multi-Year** (alternate, not bundled): for enterprise accounts considering a 3-5 year commit. Adds an EBITDA-impact slide and a CFO-grade discounted-cash-flow comparison of the three scenarios. Use for accounts > $500K ARR or CFO-led renegotiations.

## Use the bundled deck as a starting point

The included reference deck is a complete, ready-to-use renewal proposal for a fictional mid-market SaaS account ($480K ARR, 22% proposed list increase, two named competing scenarios). The agent should copy this deck into the new project and replace slide-by-slide content, preserving:

- The price-silence on slides 01-03 and the Realised Value anchor on slide 03
- The Willingness-to-Pay framing on slide 05 (price-per-unit-of-outcome)
- The Good-Better-Best fence map on slide 07
- Palette (CFO-charcoal `#1F2933` + value-green `#0F766E` + warm paper `#F8F5EF`) and typography (Inter UI, IBM Plex Serif for the Realised Value hero, IBM Plex Mono for prices)

Authors may add a multi-year DCF slide between 07 and 08 for strategic accounts, but may NOT remove slides 03, 05, 07 — these are the Realised Value, WTP, and Fence-Map spine that defines this skill.

## Recommended 11-slide structure

| # | Page | Purpose | Required? |
|---:|---|---|:---:|
| 1 | Cover | Customer name + renewal date + "Value Review" framing | yes |
| 2 | What we set out to do (last year) | The customer's stated goal at signing | yes |
| 3 | Realised Value (in customer's currency) | The receipt | **yes** |
| 4 | Reframe | The CFO's question, re-asked correctly | yes |
| 5 | Willingness-to-Pay anchor | $ per unit of outcome | **yes** |
| 6 | List Price + Drivers | The actual number + what changed | yes |
| 7 | Good-Better-Best with fences | Three real packages | **yes** |
| 8 | TCO / Multi-year comparison | DCF of the three scenarios | yes |
| 9 | Mutual Action Plan | Dates, owners, signatures | yes |
| 10 | What's coming (roadmap as gift) | Why staying is the asymmetric bet | yes |
| 11 | Appendix | Source data, methodology, walk-aways (speaker-notes only) | yes |
