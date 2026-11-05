# Two-feature child study

Open `second_index.html` for the normal silent demo. The script loads pinned jsPsych files from a CDN, so it needs internet access.

## Feature and answer order

The description order, spoken option order, and answer-button order are tied together. The first-mentioned feature is always the left button. Buttons stay side by side on small screens.

There are two reversed counterbalance schedules. Schedule 0 introduces the ecological feature first for Zorp, Wug, and Fep, and self-benefiting first for Dax and Blicket. Schedule 1 reverses every creature. Each schedule therefore has a 3/2 split across the five creatures, and the paired schedules balance every creature exactly. Creature presentation order is still randomized separately.

- `?pid=0` uses schedule 0; `?pid=1` uses schedule 1. Other numeric participant IDs alternate by even/odd parity.
- `?order=0` or `?order=1` explicitly selects a schedule, overriding participant parity.
- Without these parameters, the sample uses its browser-local participant counter. That counter is **not shared across remote participants**. For online collection, supply centrally assigned participant numbers or balanced condition links rather than relying on each child's local storage.

CSV rows include `counterbalance_group`, `counterbalance_source`, `first_kind`, `second_kind`, `eco_mentioned_first`, `meet_order`, and the left/right feature IDs. Choice mapping is saved against that same order.

## Visual option cues

`second_index.html` is the main study, with no audio. Its answer buttons highlight and briefly wiggle in sequence: first/left, then second/right. “Show the choices again” replays the visual sequence. Old `audio` URL parameters do not enable narration.

The sequence currently uses timed visual cues. Its export is labeled `option_presentation_mode=visual` so it does not imply that narration was played. Responses remain available while the cues run, and their status at response is recorded.

Both options retain the same blue border and get the same temporary treatment. The wiggle is disabled when reduced motion is requested; the highlight remains. `option_narration.js` retains start/end callback hooks so these cues can be synchronized with recordings later. The cue clears when the child leaves a trial.

## Local checks

From the repository root, run:

```bash
node --test code/experiments/tests/order-and-cues.test.cjs
```

These checks cover the original study's introduction/question alignment, both counterbalance schedules, response mapping, and visual/future-audio cue lifecycle including cancellation and failure.
