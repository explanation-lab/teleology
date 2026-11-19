# Teleology & Placeholders

Do children represent that an animal has **something it is for** even when they do not know exactly what that purpose is, and if so, how do they constrain or elaborate that placeholder?

## Scientific motivation and hypothesis

Believing that a purpose exists need not be the same as knowing its content. The purpose-placeholder hypothesis distinguishes **purpose existence** (“this animal has something it is for”) from **purpose knowledge** (“I know what it is for”). The project asks whether children can hold the first representation without the second, and which descriptions they accept as possible elaborations of it. Keeping those questions separate helps us avoid treating an answer about what an animal does as evidence that the child attributes a purpose to it.

The research pipeline is **candidate item generation → adult norming → child placeholder-elaboration study**. Adult norming is complete. The 20 selected properties are now in [Experiment 1](code/experiments/experiment1/README.md), the kids’ Animal Game.

## Start here

Read this README for the science, then [PROJECT_STATUS.md](PROJECT_STATUS.md) for current ownership, milestones, unresolved choices and handoff. The team is **Kate Shon (Project Lead), Dhruv Sahu (Member), and Ethan Fisher-Dayn (Member)**. No Backup has been selected. Kate coordinates the project and helps turn the conceptual question into a testable plan. Ethan’s confirmed immediate work is candidate-pool revision/development; an individual assignment for Dhruv remains to be agreed.

Use the existing Dashboard project home and guided project introduction alongside the lab’s general GitHub/GitHub Desktop and Slack onboarding. Opening a resource does not grant private access. Supply your actual GitHub username through onboarding, request the intended repository access, and then clone this repository through GitHub Desktop. Keep general onboarding and CITI review separate from project work and study authorization.

## Candidate materials development

Develop **25 unique, short, child-friendly candidate descriptions per working category**, paired with appropriate animals: about 100 descriptions overall, with additional alternatives welcome during development.

| Working category | Intended distinction to evaluate |
|---|---|
| Behavior | Something the animal simply does. |
| Animal-benefiting | Something that benefits the animal itself. |
| Ecological | Something involving effects or benefits to another organism or the broader environment. |
| Human-benefiting | Something useful or beneficial to people. |

These are **working distinctions to test**, not validated psychological categories. The target is not 25 animals with all four descriptions for each animal. An animal need not appear in every category. Do not force unnatural examples to fill a table, and make descriptions brief and understandable to children from the outset. Naturally ambiguous candidates may remain for adult norming rather than being assigned a uniquely “correct” category by the research team in advance.

The existing [Paper Readings](https://docs.google.com/document/d/13lWP7D-J-v3HgdYzgC6muQlbEM8qEqdO5mBLml37n2o/edit?usp=drivesdk) document contains literature notes, exploratory designs, taxonomy discussion and an animal-description table. It is background/item-development material, not a final protocol, normed stimulus set, dataset or result of this project. Historical directions and stronger taxonomy claims there do not supersede the current working distinctions above. Do not duplicate that document or import its older proposed design details as settled decisions.

## Adult norming

In the [adult study](code/experiments/Norming/index.html), 100 participants each categorized 40 phrases. The [preregistration](preregistrations/norming.docx) describes the study design. The [analysis](code/R/README.md) ranks phrases by the number of votes they received in each category. The [selection figure](figures/Norming/exp1_top_stacked.pdf) shows the top five phrases for each category.

## Child Experiment 1

The [Animal Game](code/experiments/experiment1/README.md) uses five fictional animals. Each animal has four properties, one from each category at the same rank. Each child sees every property and answers 20 yes/no questions.

## Project resources

- [Research Dashboard](https://explanation-lab-dashboard.web.app/#project/TELEOLOGY/overview) — concise current state, people, tasks, shared updates, confirmed decisions and open questions.
- [Teleology repository](https://github.com/explanation-lab/teleology) — version-controlled scientific materials and reproducibility documentation.
- [#proj-teleology](https://explanationlab.slack.com/archives/C0C19J4RA81) — team conversation; important durable state also belongs in the Dashboard or repository.
- [Paper Readings](https://docs.google.com/document/d/13lWP7D-J-v3HgdYzgC6muQlbEM8qEqdO5mBLml37n2o/edit?usp=drivesdk) — existing background-reading and exploratory item-development document.

Dashboard membership does not grant Study Console access; verified CITI and a separate explicit Admin grant are required before any future student access.

## Repository organization and reproducibility status

```text
README.md              Durable scientific orientation and reproducibility status
PROJECT_STATUS.md      Current operational state, ownership and handoff
code/
  R/                   R analysis and figure code
  experiments/         Experiment implementations and materials
data/                  Local analysis inputs excluded from Git
docs/                  Browser-renderable experiments or generated web output
figures/               Plots and paper figures
preregistrations/       Study preregistration documents
```

`docs/` is not a general literature/meeting-notes directory. Add a different directory deliberately if the work later needs one, rather than forcing scientific prose into a generated-output folder.

## Data, access and privacy

This repository is public. Keep raw exports and Prolific IDs outside the checkout. The adult analysis reads local de-identified CSVs from `data/Norming`, which Git ignores. The repository contains the aggregate report and figure.

Use focused branches, meaningful commits and review before merging. Keep operational ownership, blockers, next actions, version/checkpoint details and resume instructions in [PROJECT_STATUS.md](PROJECT_STATUS.md).
