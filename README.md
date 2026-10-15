# Teleology & Placeholders

Do children represent that an animal has **something it is for** even when they do not know exactly what that purpose is, and if so, how do they constrain or elaborate that placeholder?

## Scientific motivation and hypothesis

Believing that a purpose exists need not be the same as knowing its content. The purpose-placeholder hypothesis distinguishes **purpose existence** (“this animal has something it is for”) from **purpose knowledge** (“I know what it is for”). The project asks whether children can hold the first representation without the second, and which descriptions they accept as possible elaborations of it. Keeping those questions separate helps us avoid treating an answer about what an animal does as evidence that the child attributes a purpose to it.

The research pipeline is **candidate item generation → adult norming → child placeholder-elaboration study**. The current phase is **review of the adult-norming prototype**. No Teleology experiment has been launched.

## Start here

**Working on the adult norming study? Read [Start here for the adult norming study](START_HERE.md).** It gives the GitHub Desktop steps, the study location, what changed and Kate's next walkthrough task. Open `code/experiments/Experiment 1/index.html` directly in a browser.

Read this README for the science, then [PROJECT_STATUS.md](PROJECT_STATUS.md) for current ownership, milestones, unresolved choices and handoff. The team is **Kate Shon (Project Lead), Dhruv Sahu (Member), and Ethan Fisher-Dayn (Member)**. No Backup has been selected. Kate coordinates the project and helps turn the conceptual question into a testable plan. Ethan’s confirmed immediate work is candidate-pool revision/development; an individual assignment for Dhruv remains to be agreed.

Use the existing Dashboard project home and guided project introduction alongside the lab’s general GitHub/GitHub Desktop and Slack onboarding. Opening a resource does not grant private access. Supply your actual GitHub username through onboarding, request the intended repository access, and then clone this repository through GitHub Desktop. Keep general onboarding and CITI review separate from project work and study authorization.

## Current materials development

The earlier development target was 25 descriptions per working category. The current adult-norming prototype uses **80 short descriptions, 20 per researcher-assigned category**, presented as phrases without animal names. This is the set being reviewed; additional alternatives can remain in the background material.

| Working category | Intended distinction to evaluate |
|---|---|
| Behavior | Something the animal simply does. |
| Animal-benefiting | Something that benefits the animal itself. |
| Ecological | Something involving effects or benefits to another organism or the broader environment. |
| Human-benefiting | Something useful or beneficial to people. |

These are **working distinctions to test**, not validated psychological categories. The target is not 25 animals with all four descriptions for each animal. An animal need not appear in every category. Do not force unnatural examples to fill a table, and make descriptions brief and understandable to children from the outset. Naturally ambiguous candidates may remain for adult norming rather than being assigned a uniquely “correct” category by the research team in advance.

The existing [Paper Readings](https://docs.google.com/document/d/13lWP7D-J-v3HgdYzgC6muQlbEM8qEqdO5mBLml37n2o/edit?usp=drivesdk) document contains literature notes, exploratory designs, taxonomy discussion and an animal-description table. It is background/item-development material, not a final protocol, normed stimulus set, dataset or result of this project. Historical directions and stronger taxonomy claims there do not supersede the current working distinctions above. Do not duplicate that document or import its older proposed design details as settled decisions.

## Planned adult norming

Adult norming precedes selection of final material for the child study. The current prototype asks adults to classify each of 80 phrases using **four category buttons**. Animal-description pairs and a none/unclear option belonged to the earlier proposal and are not in this version. Norming establishes how descriptions are perceived empirically, rather than assuming the team's labels are uniquely correct.

An additional judgment about how natural a description sounds as something the animal could be “for” has been discussed; it is an **open proposed measure**, not a confirmed feature. Sample size, recruitment, exclusions, retention thresholds, consensus criteria, analysis and preregistration remain to be finalized. The experiment is implemented for local review; responses download to the tester's computer. Online saving and recruitment have not been set up.

## Planned later child study

The later study would use adult-normed descriptions to examine how children elaborate a purpose placeholder. It should distinguish whether children think an animal has something it is for from whether they know what that purpose is, then investigate the content they accept as possible fillings of the placeholder.

This is a planned research direction. Ages, sample size, conditions, trial count, stopping rules, exclusions, analyses and preregistration are not yet specified. Older exploratory screen sequences and character suggestions in background material are not a finalized child protocol.

## Project resources

- [Research Dashboard](https://explanation-lab-dashboard.web.app/#project/TELEOLOGY/overview) — concise current state, people, tasks, shared updates, confirmed decisions and open questions.
- [Private Teleology repository](https://github.com/explanation-lab/teleology) — version-controlled scientific materials and reproducibility documentation.
- [#proj-teleology](https://explanationlab.slack.com/archives/C0C19J4RA81) — team conversation; important durable state also belongs in the Dashboard or repository.
- [Paper Readings](https://docs.google.com/document/d/13lWP7D-J-v3HgdYzgC6muQlbEM8qEqdO5mBLml37n2o/edit?usp=drivesdk) — existing background-reading and exploratory item-development document.

The resource links were verified during preparation. Their existing sharing is unchanged. There is no configured Teleology OSF project, preregistration, dataset, analysis, experiment link or Study Console resource. Dashboard membership does not grant Study Console access; verified CITI and a separate explicit Admin grant are required before any future student access.

## Repository organization and reproducibility status

```text
README.md              Durable scientific orientation and reproducibility status
PROJECT_STATUS.md      Current operational state, ownership and handoff
code/
  R/                   R analyses and figure code, when they exist
  experiments/         Experiment implementations/materials, when they exist
data/                  Appropriately de-identified analysis data, when they exist
docs/                  Browser-renderable experiments or generated web output
figures/               Plots, diagrams, screenshots and paper figures
```

The adult prototype is in `code/experiments/Experiment 1/`; its README explains the sequence and data fields. `tools/check-adult-norming.cjs` provides focused logic checks. There are no participant datasets, analyses or results in this repository. The prior exploratory material remains in the linked background document.

`docs/` is not a general literature/meeting-notes directory. Add a different directory deliberately if the work later needs one, rather than forcing scientific prose into a generated-output folder.

## Data, access and privacy

This repository is private. Commit only appropriately de-identified analysis data when such data exist and are approved for this location. Never commit participant-identifiable data, identifiable raw CHS exports, login/session information, payment information, gift-card codes, credentials, API tokens, private keys or other restricted operational information. Keep restricted source data in approved systems outside GitHub. Review the actual staged files and history; `.gitignore` is not a privacy audit.

Use focused branches, meaningful commits and review before merging. Keep operational ownership, blockers, next actions, version/checkpoint details and resume instructions in [PROJECT_STATUS.md](PROJECT_STATUS.md).
