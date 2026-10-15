// Teleology & Placeholders — adult norming, local review version.
// Open index.html directly. Responses stay in this browser until CSV download.
const STUDY_VERSION = "adult-norming-review-2026-10-15";
const TRIALS_PER_BLOCK = 20;
const N = STIMULI.length;

// The horizontal option is for layout review; index.html uses stacked buttons.
const requestedLayout = new URLSearchParams(window.location.search).get("layout");
const BUTTON_LAYOUT = requestedLayout === "horizontal" ? "horizontal" : "stacked";
let consentDeclined = false;

function updateProgress(completed) {
  const progress = document.getElementById("study-progress");
  const percent = Math.round(completed / N * 100);
  progress.hidden = false;
  progress.querySelector("[role=progressbar]").setAttribute("aria-valuenow", completed);
  progress.querySelector("[role=progressbar]").setAttribute("aria-valuemax", N);
  progress.querySelector("[role=progressbar]").setAttribute("aria-valuetext", `${completed} of ${N} descriptions completed`);
  progress.querySelector(".progress-fill").style.width = `${percent}%`;
  progress.querySelector(".progress-percent").textContent = `${percent}%`;
}

const jsPsych = initJsPsych({
  display_element: "experiment",
  on_finish: function () {
    jsPsych.getDisplayElement().innerHTML = consentDeclined
      ? '<div class="center"><h1>Thank you</h1><p>You have chosen not to participate. You may close this window.</p></div>'
      : '<div class="center"><h1>Thank you for participating!</h1><p>Your CSV download has been requested.</p><p>You may close this window when you have saved your file.</p></div>';
  }
});

// Use ?PID=abc123 for a labeled local test, or create a random review ID.
const participantId = jsPsych.data.getURLVariable("PID") ||
  "P" + Math.random().toString(36).slice(2, 8).toUpperCase();
jsPsych.data.addProperties({
  participant_id: participantId,
  study_version: STUDY_VERSION,
  button_layout: BUTTON_LAYOUT,
  consent_version: "evolution-standard-copy-2026-10-15"
});

const LABELS = Object.keys(CATEGORY_LABELS);
// Shuffle once for this participant, then reuse this exact order on all trials.
const buttonOrder = jsPsych.randomization.shuffle(LABELS.slice());
// Each participant sees every phrase once in a shuffled order.
const order = jsPsych.randomization.shuffle(STIMULI.slice());
const timeline = [];

// The consent text is the same form used in the Evolution review study.
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: TELEOLOGY_CONSENT,
  choices: ["I agree", "I do NOT agree"],
  css_classes: ["consent-screen"],
  data: { task: "consent" },
  on_finish: function (data) {
    data.consented = data.response === 0;
    if (!data.consented) {
      consentDeclined = true;
      jsPsych.abortExperiment();
    } else {
      jsPsych.data.addProperties({ consented: true });
    }
  }
});

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div class="intro">
    <h1>Welcome!</h1>
    <p>In this study, you will see short descriptions of things animals do or have.</p>
    <p>For each description, choose the category that you think fits best.</p>
    <p>The four categories are:</p>
    <dl class="category-definitions">
      <div><dt>Ecological</dt><dd>Something involving effects or benefits to another organism or the broader environment.</dd></div>
      <div><dt>Animal-benefiting</dt><dd>Something that benefits the animal itself.</dd></div>
      <div><dt>Human-benefiting</dt><dd>Something useful or beneficial to people.</dd></div>
      <div><dt>Behavioral</dt><dd>Something the animal simply does, which may not have a clear animal-benefiting, ecological, or human-benefiting function.</dd></div>
    </dl>
    <p>Some descriptions may fit more than one category. Please choose the one you think fits best.</p>
    <p>The buttons will stay in the same order throughout the study.</p>
    <p>You can take a break after every 20 descriptions.</p>
    <p>Click 'Begin' when you are ready.</p>
  </div>`,
  choices: ["Begin"],
  css_classes: ["single-btn", "instructions-screen"],
  data: { task: "instructions" }
});

order.forEach((stim, i) => {
  const trialNumber = i + 1;
  const blockNumber = Math.floor(i / TRIALS_PER_BLOCK) + 1;

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div class="property">${stim.text}</div>
      <div class="question">Which category best describes this property?</div>`,
    choices: buttonOrder,
    css_classes: ["category-screen", `layout-${BUTTON_LAYOUT}`],
    button_layout: "grid",
    grid_columns: BUTTON_LAYOUT === "horizontal" ? 4 : 1,
    grid_rows: null,
    post_trial_gap: 300,
    data: {
      task: "trial",
      stimulus_id: stim.id,
      property_text: stim.text,
      researcher_category: stim.category,
      trial_number: trialNumber,
      block_number: blockNumber,
      button_order: buttonOrder.join(" | ")
    },
    on_start: function () { updateProgress(i); },
    on_finish: function (data) {
      const chosen = buttonOrder[data.response];
      data.selected_label = chosen;
      data.selected_category = CATEGORY_LABELS[chosen];
      // Position is the 1-based reading order, including responsive layouts.
      data.selected_position = data.response + 1;
      data.matches_researcher_category = (data.selected_category === stim.category);
      updateProgress(trialNumber);
    }
  });

  if (trialNumber % TRIALS_PER_BLOCK === 0 && trialNumber < N) {
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<div class="center"><h1>You are doing great!</h1>
        <p>You have completed ${trialNumber} out of ${N} descriptions.</p>
        <p>Feel free to take a short break.</p>
        <p>Click 'Continue' whenever you are ready.</p></div>`,
      choices: ["Continue"],
      css_classes: ["single-btn"],
      data: { task: "break", completed: trialNumber }
    });
  }
});

const COLUMNS_TO_DROP = ["response", "stimulus", "trial_type", "trial_index", "plugin_version",
  "time_elapsed", "task", "jspsych_version", "view_history"];
function saveCsv() {
  jsPsych.data.get().filter({ task: "trial" }).ignore(COLUMNS_TO_DROP)
    .localSave("csv", `teleology_exp1_${participantId}.csv`);
}
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div class="center"><h1>Thank you for participating!</h1>
    <p>You have completed all ${N} descriptions.</p>
    <p>Your responses will help us understand how people think about the purposes and characteristics of animals.</p></div>`,
  choices: ["Download data (CSV)"],
  css_classes: ["single-btn"],
  data: { task: "completion" },
  on_start: function () { updateProgress(N); },
  on_finish: saveCsv
});

jsPsych.run(timeline);
