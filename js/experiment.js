// Teleology & Placeholders — 40-item adult norming pilot.
const EXPERIMENT_VERSION = "adult-norming-pilot-40-v1";
const CONDITION_ASSIGNMENT = "within_participant";
const CONDITION_CELLS = { behavioral: {}, ecological: {}, self_benefiting: {}, human_benefiting: {} };

function startTeleologyStudy(explanationLab = null) {
  const N = STIMULI.length;
  const studyStartedAt = performance.now();
  const BUTTON_LAYOUT = "horizontal";
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
    on_finish: async function () {
      const display = jsPsych.getDisplayElement();
      if (consentDeclined) {
        display.innerHTML = '<div class="center"><h1>Thank you</h1><p>You have chosen not to participate. You may close this window.</p></div>';
        return;
      }
      if (!explanationLab) {
        display.innerHTML = '<div class="center"><h1>Thank you for participating!</h1><p>Your CSV download has been requested.</p></div>';
        return;
      }
      const responseData = jsPsych.data.get();
      const saveOptions = {
        durationMs: performance.now() - studyStartedAt,
        metadata: { experimentVersion: EXPERIMENT_VERSION, schemaVersion: "2.0.0", demographicFields: [] },
        showRetryScreen: false
      };
      async function saveResponses() {
        display.innerHTML = '<div class="center" role="status"><h1>Saving your responses</h1><p>Please keep this window open.</p></div>';
        try {
          await explanationLab.submitAndRedirect(responseData, saveOptions);
          display.innerHTML = '<div class="center"><h1>Thank you for participating!</h1><p>Your responses have been saved.</p></div>';
        } catch (error) {
          if (error?.code === "EXPLANATION_LAB_CONDITION_MISMATCH") {
            display.innerHTML = '<div class="center" role="alert"><h1>Your responses have not been saved yet</h1><p>Please contact the researcher for help.</p></div>';
            return;
          }
          display.innerHTML = '<div class="center" role="alert"><h1>Your responses have not been saved yet</h1><p>Please keep this window open and try again.</p><button class="jspsych-btn" type="button">Try saving again</button></div>';
          display.querySelector("button").addEventListener("click", saveResponses, { once: true });
        }
      }
      await saveResponses();
    }
  });

  const participantId = explanationLab?.launch.participant.prolificPid ||
    jsPsych.data.getURLVariable("PID") || "P" + Math.random().toString(36).slice(2, 8).toUpperCase();
  jsPsych.data.addProperties({
    ...(explanationLab ? { condition: explanationLab.launch.condition } : { participant_id: participantId }),
    study_version: EXPERIMENT_VERSION,
    button_layout: BUTTON_LAYOUT,
    consent_version: "teleology-adult-pilot-v1"
  });

  const LABELS = Object.keys(CATEGORY_LABELS);
  // Shuffle once for this participant, then reuse this exact order on all trials.
  const buttonOrder = jsPsych.randomization.shuffle(LABELS.slice());
  // Each participant sees every phrase once in a shuffled order.
  const order = jsPsych.randomization.shuffle(STIMULI.slice());
  const timeline = [];

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: TELEOLOGY_CONSENT,
    choices: ["I agree", "I do NOT agree"],
    css_classes: ["consent-screen"],
    data: { task: "consent", trial_role: "consent" },
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
      <div class="category-table-wrap">
        <table class="category-definitions" aria-label="The four categories">
          <thead><tr><th scope="col">Category</th><th scope="col">Description</th></tr></thead>
          <tbody>
            <tr><th scope="row">Ecological</th><td>Something involving effects or benefits to another species or the broader ecosystem.</td></tr>
            <tr><th scope="row">Self-benefiting</th><td>Something that benefits the animal itself.</td></tr>
            <tr><th scope="row">Human-benefiting</th><td>Something useful or beneficial to people.</td></tr>
            <tr><th scope="row">Behavioral</th><td>Something the animal simply does, which may not have a clear animal-benefiting, ecological, or human-benefiting function.</td></tr>
          </tbody>
        </table>
      </div>
      <p class="instruction-note">Some descriptions may fit more than one category.<br>Please choose the one you think fits best.</p>
    </div>`,
    choices: ["Begin"],
    css_classes: ["single-btn", "instructions-screen"],
    data: { task: "instructions", trial_role: "instruction" }
  });

  order.forEach((stim, i) => {
    const trialNumber = i + 1;

    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<div class="property">${stim.text}</div>
        <div class="question">Which category best describes this property?</div>`,
      choices: buttonOrder,
      css_classes: ["category-screen", `layout-${BUTTON_LAYOUT}`],
      button_layout: "grid",
      grid_columns: 4,
      grid_rows: null,
      post_trial_gap: 300,
      data: {
        task: "trial",
        trial_role: "response",
        measure: "category_choice",
        item_id: stim.id,
        stimulus_id: stim.id,
        property_text: stim.text,
        researcher_category: stim.category,
        trial_number: trialNumber,
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

  });

  const COLUMNS_TO_DROP = ["response", "stimulus", "trial_type", "trial_index", "plugin_version",
    "time_elapsed", "task", "jspsych_version", "view_history"];
  function saveCsv() {
    jsPsych.data.get().filter({ task: "trial" }).ignore(COLUMNS_TO_DROP)
      .localSave("csv", `teleology_exp1_${participantId}.csv`);
  }
  if (!explanationLab) timeline.push({
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
}
