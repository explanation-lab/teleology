// ============================================================
// Kids teleology study (jsPsych v8). Stimuli live in stimuli.js.
//
// URL options (all optional):
//   ?pid=7       participant number (drives counterbalancing). If absent,
//                a counter stored in this browser (localStorage) is used.
//   ?audio=1     read screens aloud with the browser's speech synthesis.
//
// Counterbalancing: each animal's 4 properties are paired with the 4
// question categories using a cyclic shift (a Latin square):
//   shift = (pid + animalIndex) % 4
//   question category of a property = CATEGORIES[(its category index + shift) % 4]
// Over any 4 consecutive participants, every animal gets every shift, so each
// property is asked about every question category equally often. Every child
// answers 20 questions: one per property.
// Animal order, property learning order, and test order are random per child.
// ============================================================

const params = new URLSearchParams(window.location.search);
const AUDIO = params.get("audio") === "1";

function getParticipantNumber() {
  const fromUrl = parseInt(params.get("pid"), 10);
  if (!isNaN(fromUrl)) return fromUrl;
  try {
    const n = parseInt(localStorage.getItem("teleology_kids_counter") || "0", 10);
    localStorage.setItem("teleology_kids_counter", String(n + 1));
    return n;
  } catch (e) {
    return Math.floor(Math.random() * 1000);
  }
}
const PID = getParticipantNumber();
const SESSION_ID = "k" + PID + "_" + Date.now();

const jsPsych = initJsPsych({
  on_finish: () => {
    jsPsych.data.get().filter({ phase: "test" }).localSave("csv", "teleology_kids_" + SESSION_ID + ".csv");
  }
});

// ---------- helpers ----------
function speak(text) {
  if (!AUDIO || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ""));
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}
const stage = (html) => `<div class="stage">${html}</div>`;
const nextBtn = (c, i) => `<button class="jspsych-btn btn-next">${c}</button>`;

function screen(html, label, extraData) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: stage(html),
    choices: [label],
    button_html: nextBtn,
    data: Object.assign({ phase: "info" }, extraData || {}),
    on_load: () => speak(html)
  };
}

// ---------- randomization / counterbalancing ----------
const animalOrder = jsPsych.randomization.shuffle(ANIMALS.map((a, i) => i));

function questionCategoryFor(property, animalIndex) {
  const shift = (PID + animalIndex) % CATEGORIES.length;
  const catIdx = CATEGORIES.indexOf(property.category);
  return { qCat: CATEGORIES[(catIdx + shift) % CATEGORIES.length], shift };
}

// ---------- timeline ----------
const timeline = [];

timeline.push(screen(
  `<p class="big">We are going to play a game and learn about some animals!</p>
   <p class="mid">First, we will meet each animal and hear about it.<br>
   Then we will ask you some questions. There are no wrong answers.</p>`,
  "Let's start!"));

animalOrder.forEach((animalIdx, pos) => {
  const animal = ANIMALS[animalIdx];

  // 1) Meet the animal
  timeline.push(screen(
    `<p class="big">This is a <span class="animal-name">${animal.name}</span>!</p>
     <img class="animal-img" src="${animal.image}" alt="A ${animal.name}">`,
    "Next", { animal: animal.name, animal_id: animal.id, animal_position: pos + 1 }));

  // 2) Learn properties (random order)
  jsPsych.randomization.shuffle(animal.properties).forEach((p) => {
    timeline.push(screen(
      `<img class="mini-animal" src="${animal.image}" alt="">
       <p class="mid">Here is something about the ${animal.name}:</p>
       <p class="big"><span class="prop">${p.text}</span></p>`,
      "Next", { animal: animal.name, property_id: p.id, learn_trial: true }));
  });

  // 3) Test: one yes/no question per property (random order)
  timeline.push(screen(
    `<img class="mini-animal" src="${animal.image}" alt="">
     <p class="big">Now let's ask some questions about the ${animal.name}!</p>`,
    "OK", { animal: animal.name }));

  jsPsych.randomization.shuffle(animal.properties).forEach((p, k) => {
    const { qCat, shift } = questionCategoryFor(p, animalIdx);
    const qHtml = `<p class="mid">Now that you learned about the ${animal.name}, is
        <span class="prop">${p.text}</span> for ${CATEGORY_QUESTION[qCat]}?</p>`;
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: () => stage(`<img class="mini-animal" src="${animal.image}" alt="">` + qHtml),
      choices: ["Yes", "No"],
      button_html: (c) => `<button class="jspsych-btn ${c === "Yes" ? "btn-yes" : "btn-no"}">${c}</button>`,
      on_load: () => speak(qHtml),
      data: {
        phase: "test",
        participant_id: PID,
        session_id: SESSION_ID,
        animal: animal.name,
        animal_id: animal.id,
        animal_position: pos + 1,
        test_position_within_animal: k + 1,
        property_id: p.id,
        property_text: p.text,
        property_category: p.category,
        question_category: qCat,
        question_matches_property: qCat === p.category,
        latin_shift: shift
      },
      on_finish: (d) => {
        d.response_label = d.response === 0 ? "yes" : "no";
        d.rt_ms = Math.round(d.rt);
      }
    });
  });

  // 4) Break between animals (not after the last one)
  if (pos < animalOrder.length - 1) {
    timeline.push(screen(
      `<p class="big">Great job! 🌟</p>
       <p class="mid">Let's take a little break.<br>Ready to meet a new animal?</p>`,
      "I'm ready!", { break_after: pos + 1 }));
  }
});

timeline.push(screen(
  `<p class="big">All done! Thank you for playing! 🎉</p>
   <p class="mid">Press the button to finish.</p>`,
  "Finish"));

jsPsych.run(timeline);
