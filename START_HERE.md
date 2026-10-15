# Start here for the adult norming study

Kate, your adult study is in the same experiment folder as before. Use this guide to get the update, try the study, and check a few saved responses. This is a local review version; we will set up online collection after the study is ready.

## Get the update in GitHub Desktop

1. Open **GitHub Desktop**. At the top left, choose **teleology** under **Current repository**.
2. Under **Current Branch**, select **adult-norming-exp1**. If that name is already showing, leave it selected.
3. Click **Fetch origin**. If the button changes to **Pull origin**, click that too. Fetch checks for updates; Pull brings them onto your computer.
4. If **Pull origin** does not appear, your selected branch may already be up to date. Check **History** for **Polish adult norming study for review**. If you cannot find it, let David know before continuing.

If Desktop shows unfinished changes of your own or a conflict, keep those changes and ask David to help combine them. You do not need to discard your work, create another repository, or use a terminal.

## Open the study

1. In GitHub Desktop, choose **Repository → Show in Finder** on Mac, or **Show in Explorer** on Windows.
2. Open **code → experiments → Experiment 1**.
3. Double-click **index.html** to open it in your browser.

Keep the folder together. The study works directly from the file; there is nothing to install. Each new run shuffles the phrases and chooses a button order for that session.

## What changed and why

- The lab consent form now appears first. Choosing **I do NOT agree** ends the study; choosing **I agree** opens the instructions.
- The instructions are centered. **Behavioral** comes last, with a fuller explanation of how it relates to the other categories.
- A progress bar shows how much of the task is complete. Consent, instructions, and breaks do not move it forward.
- The category buttons use the same neutral style. Their order is shuffled once for each session and stays fixed throughout that session.
- The 80 phrases are shuffled separately for each session. The phrases and their IDs have stayed the same.
- The saved **Ecological** response now maps to **Ecological-benefiting**, matching the original researcher label. This fixes the agreement calculation.

## Your next step

Please work through one complete test and make a short note of what you find:

1. First try **I do NOT agree** and check that the study ends. Open the file again for the full test.
2. Work through the consent and instructions. Note anything that is unclear or awkward.
3. On the first phrase, write down the four buttons in order. Check that the order is still the same after each break.
4. Confirm that breaks appear after 20, 40, and 60 responses, and that the progress bar is full at the end.
5. Click **Download data (CSV)**. Open the downloaded file in Excel. It should contain **80 response rows, plus one header row**.
6. Check a few rows against the choices you made. Look at **property_text**, **selected_label**, and **button_order**. **selected_position** is the button's position, counting from 1 in reading order.
7. In **History**, open the update and look at **js/experiment.js**. Find the line beginning `const buttonOrder` before `order.forEach`. That is why the button order now stays fixed. The comments explain the two separate shuffles.

An Ecological click is displayed as **Ecological**, but **selected_category** saves **Ecological-benefiting**. If the researcher label for that item is also Ecological-benefiting, **matches_researcher_category** should be true. Agreement is a comparison with our initial label; it is not a score of whether a participant answered correctly.

Please share your test CSV and a short project update with David: whether the checks worked, any wording or layout issues, and anything you would like help understanding. Keep the test CSV outside the repository. There is no need to change the item wording or set up recruitment for this task.

## Where the files live

| File inside Experiment 1 | What it does |
|---|---|
| index.html | Opens the study and loads its files |
| js/consent.js | Contains the lab consent form |
| js/experiment.js | Sets the screen sequence, randomization, progress, and saved responses |
| js/stimuli.js | Contains the 80 phrases and category labels |
| css/style.css | Controls the appearance |

The [study README](code/experiments/Experiment%201/README.md) has the technical details if you need them. [GitHub's Desktop guide](https://docs.github.com/en/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/syncing-your-branch-in-github-desktop) explains Fetch and Pull with screenshots.
