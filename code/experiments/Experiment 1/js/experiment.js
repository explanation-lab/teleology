// experiment.js -- Teleology & Placeholders, Adult Norming (Experiment 1), jsPsych v8
// ---------------------------------------------------------------------------
// SETTINGS
// LOCAL_TESTING = true : a "Download data (CSV)" button appears on the final screen.
//   Data stay in the browser until downloaded. NOTHING is sent to a server.
// For real data collection, set to false AND add server-side saving (see README).
const LOCAL_TESTING = true;
const TRIALS_PER_BLOCK = 20;
// ---------------------------------------------------------------------------

const jsPsych = initJsPsych({
  on_finish: function () {
    // jsPsych clears the screen when the timeline ends, so show a final message.
    document.body.innerHTML = '<div class="jspsych-content-wrapper"><div class="jspsych-content center">' +
      '<h1>Thank you for participating!</h1>' +
      (LOCAL_TESTING ? '<p>(Local test: your CSV file has been downloaded.)</p>' : '') + '</div></div>';
  }
});

// Participant ID: use ?PID=abc123 in the URL if present (e.g. from Prolific/MTurk), else make a random one.
const participantId = jsPsych.data.getURLVariable("PID") ||
  "P" + Math.random().toString(36).slice(2, 8).toUpperCase();
jsPsych.data.addProperties({ participant_id: participantId });

const LABELS = Object.keys(CATEGORY_LABELS); // the four participant-facing labels
const BUTTON_CLASS = { "Behavioral": "red", "Ecological": "green", "Self-benefiting": "yellow", "Human-benefiting": "blue" };
const N = STIMULI.length;                    // 80

const timeline = [];

// Screen 1: welcome / instructions (no auto-advance)
timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `<div class="intro">
    <h1>Welcome!</h1>
    <p>In this study, you will see short descriptions of things animals do or have.</p>
    <p>For each description, choose the category that you think fits best.</p>
    <p>The four categories are:</p>
    <dl>
      <dt>Behavioral:</dt><dd>Something an animal does.</dd>
      <dt>Ecological:</dt><dd>Something that helps the environment.</dd>
      <dt>Self-benefiting:</dt><dd>Something that helps the animal itself.</dd>
      <dt>Human-benefiting:</dt><dd>Something that helps people.</dd>
    </dl>
    <p>Some descriptions may fit more than one category. Please choose the one you think fits best.</p>
    <p>There will be breaks provided during the study.</p>
    <p>The order of the buttons will change after each description, so please read each button before you choose.</p>
    <p>Click 'Begin' when you are ready.</p></div>`,
  choices: ["Begin"],
  css_classes: ["single-btn"],
  data: { task: "instructions" }
});

// Screen 2 + 3: trials and breaks.
// The order of the 80 stimuli is shuffled once per participant; the button order is
// shuffled separately for every trial. Both are fixed here, when the timeline is built.
const order = jsPsych.randomization.shuffle(STIMULI.slice());

order.forEach((stim, i) => {
  const trialNumber = i + 1;
  const blockNumber = Math.floor(i / TRIALS_PER_BLOCK) + 1;
  const buttonOrder = jsPsych.randomization.shuffle(LABELS.slice());

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div class="progress">Description ${trialNumber} of ${N}</div>
               <div class="property">${stim.text}</div>
               <div class="question">Which category best describes this property?</div>`,
    choices: buttonOrder,            // choices[response] is always the label that was clicked
    button_html: (choice) => `<button class="jspsych-btn cat-${BUTTON_CLASS[choice]}" data-choice="${choice}">${choice}</button>`,
    button_layout: "grid",
    grid_columns: 2,
    post_trial_gap: 300,             // brief blank screen so a double-click can't hit the next trial
    data: {
      task: "trial",
      stimulus_id: stim.id,
      property_text: stim.text,
      researcher_category: stim.category,
      trial_number: trialNumber,
      block_number: blockNumber,
      button_order: buttonOrder.join(" | ")
    },
    on_finish: function (data) {
      const chosen = buttonOrder[data.response];          // label of the button actually clicked
      data.selected_label = chosen;                       // participant-facing label
      data.selected_category = CATEGORY_LABELS[chosen];   // original research category label
      data.selected_position = data.response + 1;         // 1 = top-left, 2 = top-right, 3 = bottom-left, 4 = bottom-right
      data.matches_researcher_category = (data.selected_category === stim.category);
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

// Screen 4: completion
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
  choices: LOCAL_TESTING ? ["Download data (CSV)"] : [],
  css_classes: ["single-btn"],
  data: { task: "completion" },
  on_finish: function () { if (LOCAL_TESTING) saveCsv(); }
});

jsPsych.run(timeline);
