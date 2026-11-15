# Teleology & Placeholders — current status

Last updated: **2026-10-15** (America/New_York).

- **Current stage:** approved adult-norming update; Kate's local walkthrough is next.
- **Active experiment:** implemented for local testing; none launched for collection.
- **Project Lead:** Kate Shon.
- **Members:** Dhruv Sahu and Ethan Fisher-Dayn.
- **Backup:** not yet assigned. Neither member is implicitly a Backup.

## Current work and ownership

**Adult study review:** Kate's original draft is PR #2, branch `adult-norming-exp1`, commit `a891557`. David reviewed the revised study and the complete handoff, and approved pushing the update to that existing branch and emailing Kate the instructions on October 15. The consent, instruction, progress, button and category-mapping changes were developed on `codex/teleology-adult-review` and combined into `adult-norming-exp1` without rewriting Kate's history. Kate can Fetch/Pull in GitHub Desktop and follow [START_HERE.md](START_HERE.md); she does not need to manage the review branch.

The remaining staffing and background notes below record the September planning state; they do not establish new assignments or deadlines.

**Ethan:** revise/develop the candidate animal-description pool toward **25 unique, short, child-friendly descriptions in each of four working categories**: Behavior, Animal-benefiting, Ecological and Human-benefiting. Aim for about 100 descriptions overall; additional alternatives can remain during development. The target is not 25 animals with four descriptions each. Avoid forced category examples and retain useful natural ambiguity for adult norming.

**Kate:** coordinate the project, help turn the purpose-placeholder question into a testable plan, and organize subsequent team deliverables. Review the candidate-pool direction with Ethan and coordinate the decisions needed before norming.

**Dhruv:** a project Member; a specific individual task has not yet been established. Kate and the team will agree it when work begins. No task is assigned here merely to fill a roster.

## Next milestone

Kate completes a full local test and checks the CSV using the approved study and start guide. David selected horizontal buttons, a polished category table and removal of scheduled breaks, and approved the revised prototype and handoff. Online saving, final recruitment settings and item-selection criteria remain later work. No research deadline is assigned by this review.

## Current, prior and future work

- **Current:** 80 consecutive phrases without scheduled breaks, four horizontal category buttons, phrase order shuffled per session, and one button order per session. The instruction screen uses a category table with larger row labels and Behavioral last. This version saves a local CSV and is not connected to recruitment or lab-side storage.
- **Prior/exploratory:** the existing [Paper Readings](https://docs.google.com/document/d/13lWP7D-J-v3HgdYzgC6muQlbEM8qEqdO5mBLml37n2o/edit?usp=drivesdk) includes Ethan’s reading/design work, taxonomy discussion and an animal-by-category table. Treat these as preparatory material. Earlier Creative/Assigned-Social taxonomy arguments and older child-procedure sketches are not the current approved design. The original template-only Git history is retained; no background file was deleted or duplicated.
- **Future:** adult data collection → selection of child material → child placeholder-elaboration study. No participant data collection, analysis, results or preregistration is claimed by this review.

## Confirmed direction

The project focuses on purpose placeholders. Candidate generation precedes adult norming, which precedes selection of final child material. The reviewed adult set contains 20 phrases per researcher-assigned category; the earlier 25-per-category target was for candidate development. Wording should be short and child-friendly; naturally ambiguous candidates can be normed. The four categories are working distinctions for empirical evaluation, not assumed validated psychological kinds.

## Open questions and dependencies

- Finalize adult-norming sample/recruitment, exclusions, retention and consensus criteria, analysis and any preregistration. The current implementation is four-category classification of phrases without animal names or a none/unclear option, following David's October review direction.
- Confirm study-specific consent details before recruitment. The Evolution consent is copied unchanged, including the fictional-scenario, payment, duration and Qualtrics wording. Implement reliable lab-side saving and the recruitment completion route before collecting online.
- Decide whether to add a judgment of how natural a description sounds as something the animal could be “for.” This is proposed, not confirmed.
- Develop the later child protocol while distinguishing purpose existence from purpose knowledge. Ages, sample, conditions, trial count, stopping/exclusion rules and analyses remain unresolved.
- Select a Teleology Backup explicitly; none is assigned now.
- Agree Dhruv’s first individual task and actual research deadlines with the team. Do not infer them from the lab-onboarding date.
- Ethan’s lab onboarding, CITI certificate review, Slack workspace invitation/account match and actual GitHub username/access follow the existing member workflow. His Study Console access remains off. David sends the Slack invitation separately; resource links alone do not grant external permissions.

## Latest checkpoint

Kate added the adult prototype on October 14 in PR #2. David approved the October 15 revision and authorized the GitHub/email handoff. A complete browser walkthrough showed all 80 unique phrases without break screens, fixed button order, and 100% progress at completion. Focused logic checks passed across all 24 button orders and 7,680 response mappings. This is a study-development checkpoint, not collection or launch approval.

Preserve meaningful work in Git. David's review requirement for this update has been satisfied; his approval covers the reviewed changes and handoff instructions. Keep the repository README and this status accurate.

## Resume / handoff

1. Read [README.md](README.md), this status file, and the [Teleology Dashboard](https://explanation-lab-dashboard.web.app/#project/TELEOLOGY/overview), including Decisions and Open Questions.
2. Use [START_HERE.md](START_HERE.md) for the adult study and Kate's walkthrough task. Consult the existing Paper Readings document for background.
3. Continue on `adult-norming-exp1` and preserve any concurrent work Kate has made. Review her test CSV and questions before setting up collection.
4. Coordinate in [#proj-teleology](https://explanationlab.slack.com/archives/C0C19J4RA81), then record durable decisions, questions and progress in the appropriate Dashboard or repository location. Private Weekly Check-Ins retain their mentoring/privacy role and are not the shared project record.

The shared study branch is `adult-norming-exp1`; the review changes originated from Kate's `a891557`. The entry point is `code/experiments/Experiment 1/index.html`. Run `node tools/check-adult-norming.cjs` for focused logic checks; browser verification and synthetic outputs are retained with David's local review package. No analysis pipeline is supplied.

The first-month staffing plan recommended a weekly 60-minute full-lab meeting, 30-minute project-team meetings, and 15–20-minute Lead/David check-ins, with check-in frequency potentially decreasing as work becomes established. This is recommended coordination, not a permanent system rule or permission requirement.
