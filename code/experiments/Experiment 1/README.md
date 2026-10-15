# Adult norming study

For the GitHub Desktop steps and walkthrough, start with [START_HERE.md](../../../START_HERE.md).

Open **index.html** directly in a browser. The study uses bundled jsPsych 8.3.0 and html-button-response 2.1.0; it needs no install, build step, server, or internet connection.

## Current sequence

Consent → instructions with a category table → 80 phrases without scheduled breaks → local CSV download.

Declining consent ends the session before the instructions and task. The progress bar is hidden on consent and instructions, starts at zero before the first response, and reaches 100% after the last response.

The 80 phrases are shuffled once per session. The four labels are shuffled separately once per session and reused on every trial. The researcher-assigned categories remain hidden from participants. The stimulus IDs, wording, and 20-per-category membership are unchanged from Kate's original draft.

The buttons use one horizontal row on a wide screen, two columns on a medium screen, and one column on a narrow screen. Reading order stays the same. There is no layout selector. The instruction table gives each category a larger row label, with Behavioral last.

## Data

Nothing is uploaded. Responses remain in browser memory until **Download data (CSV)** is clicked. Refreshing or closing the page before download discards the unsaved test. Online saving and the recruitment completion route still need a separate implementation.

The CSV contains 80 task rows for a completed session. Alongside the original fields, it records `study_version`, `button_layout`, `consent_version`, and `consented`. `selected_label` stores the visible label; `selected_category` stores the original research category. In particular, **Ecological → Ecological-benefiting**. `matches_researcher_category` records agreement with the initial researcher label, not response accuracy. `selected_position` is 1-based reading order. The obsolete `block_number` field is omitted because the task no longer has scheduled blocks.

Use `?PID=YOUR_TEST_LABEL` to label a local test; otherwise a random review ID is generated. Opening the study again starts a fresh session and may produce the same random order by chance.

## Consent provenance

The consent HTML is copied verbatim from `explanation-lab/evolution`, `code/experiment1/js/forms.js`, as inspected October 15, 2026. That file identifies the source as the lab's tort cognition adult form. Only the JavaScript constant name changed. The blue consent background, wording, contacts, payment, duration and Qualtrics references are retained. The surrounding consent controls use the same neutral style as the rest of this study.

Before real collection, David will confirm that the consent's scenario description, $2 payment, approximately 15-minute duration, Qualtrics language and anonymity description match the actual collection procedure. This review pass does not change those details or establish a newly approved protocol.

## Checks

From the repository root, `node tools/check-adult-norming.cjs` verifies all 24 possible button orders, response/category mapping, 80 consecutive trials without breaks, horizontal layout, progress callbacks, consent paths and the preserved consent/stimulus content. Browser walkthroughs separately check the visible interface. The initial review also verified the CSV download; its historical receipt is kept separately from the current walkthrough.
