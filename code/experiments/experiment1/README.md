# Experiment 1

This is the kids’ Animal Game from the October 18, 2026 study draft. It uses the
[top five phrases per category](../../../figures/Norming/exp1_top_stacked.pdf)
from the 100-person adult norming study.

The game introduces five animals. Each animal has one property from each of
the four categories. Each participant sees all 20 properties and answers one yes/no
question about each. The game randomizes the order of animals and the order of
the four properties within each animal. Questions follow the introduction order
for that animal.

The selected materials and animal assignments are in [stimuli.js](js/stimuli.js).
In each category, the phrases were assigned in rank order to Zorp, Dax, Wug,
Blicket, and Fep. The questions use the wording from adult norming, and the
introductions use the same descriptions as verbs. “Preventing sickness” is
human-benefiting based on the adult responses. The CSV includes
`norming_item_id` so each trial can be linked to the adult item.

The 30-person adult pilot uses the norming study’s consent template and optional
age, gender, race, and ethnicity questions. Study Console launches use one
all-items group. The Console saves the consent, practice, 20 test responses,
and demographics with the participant’s launch information. The
`test_trial_number` column counts the 20 test questions independently of the
Console’s row numbering.

To run the study locally, start `python3 -m http.server 8000 --bind 127.0.0.1`
from this folder and open `http://127.0.0.1:8000/` in a browser. Add
`?pid=42` if you want to set a participant number explicitly. Narration is
disabled, as in the source draft. At the end, the browser downloads a CSV with
the 20 test responses. Local walkthroughs do not submit to the Console.
