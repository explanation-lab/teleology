// Animal Choice Study (jsPsych v8), standalone
//
// URL options
//     ?pid=7       participant number
//     ?order=0|1   explicit counterbalance schedule (otherwise participant parity)
// The study is silent, with timed visual option cues ready for future audio.
//
// Flow: welcome -> how to answer -> practice -> thank-you + fireworks ->
//       for each creature (random order):
//           meet screen (picture + the eco feature and self feature)
//           "what are they for" transition
//           ONE two-button question: "What is a Zorp for?"  (child picks one)
//           neutral thank-you before the next creature
//       -> end
//
// Creature order is random. Two reversed feature-order schedules alternate by
// participant number: each creature is eco-first for one group and self-first for
// the other. Introduction, spoken answer order, and left/right buttons all agree.
// Each child answers 5 questions (one per creature). Data downloads as a CSV when finished.

const urlParams = new URLSearchParams(window.location.search);
const SHOW_OPTION_CUES = true;

function resolveParticipantId() {
    const fromUrl = parseInt(urlParams.get("pid"), 10);
    if (!isNaN(fromUrl)) return fromUrl;
    try {
        const n = parseInt(localStorage.getItem("animal_choice_study_counter") || "0", 10);
        localStorage.setItem("animal_choice_study_counter", String(n + 1));
        return n;
    } catch (e) {
        return Math.floor(Math.random() * 1000);
    }
}

const PARTICIPANT = resolveParticipantId();
const requestedOrder = urlParams.get("order");
const ORDER_GROUP = requestedOrder === "0" || requestedOrder === "1"
    ? Number(requestedOrder) : ((PARTICIPANT % 2) + 2) % 2;
const ORDER_SOURCE = requestedOrder === "0" || requestedOrder === "1"
    ? "url_condition" : urlParams.has("pid") ? "participant_number" : "local_counter";
const SESSION = "choice" + PARTICIPANT + "_" + Date.now();

const jsPsych = initJsPsych({
    on_finish: () => {
        jsPsych.data.get().filter({phase: "test"}).localSave("csv", "animal_choice_" + SESSION + ".csv");
    }
});

// ---------- helpers ----------

const panel = (html, extraClass) => `<div class="panel ${extraClass || ""}">${html}</div>`;

function readOptions(question, labels) {
    const reader = OptionNarration.create({
        question, labels,
        buttons: document.querySelectorAll("#jspsych-html-button-response-btngroup .btn-pick"),
        // A future recording adapter can supply the start/end callbacks here.
        speak: null,
        visual: SHOW_OPTION_CUES
    });
    if (SHOW_OPTION_CUES) {
        const replay = document.createElement("button");
        replay.type = "button";
        replay.className = "btn btn-replay";
        replay.textContent = "Show the choices again";
        replay.addEventListener("click", () => reader.start());
        document.querySelector(".jspsych-content").appendChild(replay);
    }
    reader.start();
    return reader;
}

function finishReading(reader, data) {
    const state = reader ? reader.snapshot() : {mode: "silent", status: "off"};
    data.option_presentation_mode = state.mode;
    data.option_reading_status_at_response = state.status;
    if (reader) reader.stop();
}

// Silent info screen with a single button. Animation hooks are retained.
function infoScreen(html, buttonLabel, extraData, opts) {
    opts = opts || {};
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: panel(html, opts.panelClass),
        choices: [buttonLabel],
        button_html: (c) => `<button class="btn btn-go">${c}</button>`,
        data: Object.assign({phase: "info"}, extraData || {}),
        on_load: () => {
            if (opts.on_load) opts.on_load();
        },
        on_finish: () => { if (opts.on_finish) opts.on_finish(); }
    };
}

// Two-button choice screen. `options` is in DISPLAY order (left to right). Each option is
// {label, ...anything}. The chosen option object is passed to on_finish as d.chosen_option.
function choiceScreen(html, spokenText, options, data, on_finish) {
    let reader = null;
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: panel(html),
        choices: options.map(o => o.label),
        button_html: (c) => `<button class="btn btn-pick">${c}</button>`,
        on_load: () => { reader = readOptions(spokenText, options.map(option => option.label)); },
        data: data,
        on_finish: (d) => {
            finishReading(reader, d);
            d.chosen_option = options[d.response];
            if (on_finish) on_finish(d);
        }
    };
}

// Practice: pick the correct label for the picture. Repeats (up to 3 times) until correct.
function practiceTrial(item) {
    let attempts = 0;
    let shown = [];
    let reader = null;
    const retryPrefix = () => attempts > 0 ? "Let's look again. " : "";
    return {
        timeline: [{
            type: jsPsychHtmlButtonResponse,
            stimulus: () => panel(
                `<img class="practice-pic" src="${item.image}" alt="">
                <p class="headline">${retryPrefix()}What is this?</p>`),
            choices: () => {
                shown = jsPsych.randomization.shuffle([
                    {label: item.right, correct: true},
                    {label: item.wrong, correct: false}
                ]);
                return shown.map(o => o.label);
            },
            button_html: (c) => `<button class="btn btn-pick">${c}</button>`,
            on_load: () => { reader = readOptions(`${retryPrefix()}What is this?`, shown.map(o => o.label)); },
            data: {phase: "practice", practice_item: item.id},
            on_finish: (d) => {
                finishReading(reader, d);
                d.correct = shown[d.response].correct;
            }
        }],
        loop_function: (data) => {
            attempts++;
            return !data.values()[0].correct && attempts < 3;
        }
    };
}

// Fireworks (canvas animation on the practice thank-you screen)
let cancelFireworks = null;
function launchFireworks() {
    const canvas = document.getElementById("fireworks");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const palette = ["#ffc93c", "#e8674f", "#3fae5a", "#2f80c9", "#c69bf0", "#ff8fa3"];
    let sparks = [], frameId, nextBurstAt = 0;
    function burst() {
        const x = canvas.width * (0.15 + Math.random() * 0.7);
        const y = canvas.height * (0.15 + Math.random() * 0.55);
        const color = palette[Math.floor(Math.random() * palette.length)];
        for (let i = 0; i < 44; i++) {
            const angle = (Math.PI * 2 * i) / 44, speed = 2 + Math.random() * 3.5;
            sparks.push({x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color});
        }
    }
    function draw(t) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (t > nextBurstAt) { burst(); nextBurstAt = t + 500; }
        sparks = sparks.filter(s => s.life > 0);
        sparks.forEach(s => {
            s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.vx *= 0.99; s.life -= 0.012;
            ctx.globalAlpha = Math.max(s.life, 0);
            ctx.fillStyle = s.color;
            ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, Math.PI * 2); ctx.fill();
        });
        frameId = requestAnimationFrame(draw);
    }
    frameId = requestAnimationFrame(draw);
    cancelFireworks = () => cancelAnimationFrame(frameId);
}

// ---------- timeline ----------

const creatureOrder = jsPsych.randomization.shuffle(CREATURES.map((c, i) => i));
const timeline = [];

// 1. Welcome
timeline.push(infoScreen(
    `<p class="headline heading-title">Welcome to the Animal Game!</p>
    <div class="parade">${CREATURES.map((c, i) =>
        `<img class="parade-pic" style="animation-delay:${(i * 0.18).toFixed(2)}s" src="${c.image}" alt="">`).join("")}</div>
    <p class="subline">Today you are going to meet some animals and answer some questions about them.</p>`,
    "Let's start!", {screen: "welcome"},
    {auto: true,
        spoken: "Welcome to the Animal Game! Today you are going to meet some animals and answer some questions about them."}
));

// 2. How to answer
timeline.push(infoScreen(
    `<p class="headline">In our game, we will ask you a question, and you will pick one of two answers by pressing a button.</p>
    <span class="btn btn-pick demo">This one</span>
    <span class="btn btn-pick demo">Or this one</span>
    <p class="subline">Let's practice!</p>`,
    "Next", {screen: "how_to_answer"},
    {spoken: "In our game, we will ask you a question, and you will pick one of two answers by pressing a button. Let's practice!"}
));

// 3. Practice
PRACTICE_ITEMS.forEach(item => timeline.push(practiceTrial(item)));

// 4. Thank you + fireworks
timeline.push(infoScreen(
    `<canvas id="fireworks"></canvas>
    <p class="headline heading-title">Thank you!</p>
    <p class="headline">Now you are going to meet some animals.</p>`,
    "Next", {screen: "practice_done"},
    {panelClass: "fireworks-panel",
        spoken: "Thank you! Now you are going to meet some animals.",
        on_load: launchFireworks,
        on_finish: () => { if (cancelFireworks) cancelFireworks(); }}
));

// 5. Creatures
creatureOrder.forEach((creatureIdx, position) => {
    const creature = CREATURES[creatureIdx];
    const pluralName = creature.name === "Dax" ? "Daxes" : `${creature.name}s`;
    const eco = creature.ecoFeature;
    const self = creature.selfFeature;
    const featureIntroText = (f) => f.introText || f.text;
    const baseData = {animal: creature.name, animal_id: creature.id, animal_position: position + 1};

    // Reverse the assignment for each creature in the other participant group.
    // With five creatures, each participant gets a 3/2 split; paired groups give
    // every creature each first-mentioned category equally often.
    const ecoFirst = (ORDER_GROUP + creatureIdx) % 2 === 0;
    const ecoOption = {label: "for " + eco.text, feature: eco, kind: "ecological"};
    const selfOption = {label: "for " + self.text, feature: self, kind: "self_benefit"};
    const options = ecoFirst ? [ecoOption, selfOption] : [selfOption, ecoOption];
    const meetOrder = options.map(option => option.feature);
    const orderData = {
        counterbalance_group: ORDER_GROUP,
        counterbalance_source: ORDER_SOURCE,
        first_kind: options[0].kind,
        second_kind: options[1].kind,
        eco_mentioned_first: ecoFirst ? 1 : 0
    };
    const tags = meetOrder.map(f => `<span class="feature-tag">${featureIntroText(f)}</span>`).join(" and ");
    const spokenMeet = `This is a ${creature.name}. ${pluralName} ${meetOrder.map(featureIntroText).join(" and ")}.`;
    timeline.push(infoScreen(
        `<p class="headline">This is a <span class="creature-name">${creature.name}</span>.</p>
        <div class="meet-row">
            <img class="creature-pic" src="${creature.image}" alt="A ${creature.name}">
            <p class="subline meet-text">${pluralName} ${tags}.</p>
        </div>`,
        "Next",
        Object.assign({screen: "meet_creature", meet_order: meetOrder.map(f => f.id).join("|")}, baseData, orderData),
        {spoken: spokenMeet}
    ));

    // transition
    timeline.push(infoScreen(
        `<img class="mini-pic" src="${creature.image}" alt="">
        <p class="headline">Now that you have learned about ${pluralName}, we want to ask you about what ${pluralName} are for.</p>`,
        "Next", Object.assign({screen: "question_intro"}, baseData)
    ));

    // The first introduced and first spoken option is always the left button.
    timeline.push(choiceScreen(
        `<img class="mini-pic" src="${creature.image}" alt="">
        <p class="headline">What is a ${creature.name} for?</p>
        <p class="subline">Pick one.</p>`,
        `What is a ${creature.name} for? Is it`,
        options,
        {
            phase: "test",
            participant_id: PARTICIPANT,
            session_id: SESSION,
            animal: creature.name,
            animal_id: creature.id,
            animal_position: position + 1,
            ...orderData,
            left_feature_id: options[0].feature.id,
            left_kind: options[0].kind,
            right_feature_id: options[1].feature.id,
            right_kind: options[1].kind,
            meet_order: meetOrder.map(f => f.id).join("|"),
            eco_feature_id: eco.id,
            eco_feature_text: eco.text,
            self_feature_id: self.id,
            self_feature_text: self.text
        },
        (d) => {
            const choice = d.chosen_option;
            d.chosen_feature_id = choice.feature.id;
            d.chosen_feature_text = choice.feature.text;
            d.chosen_kind = choice.kind;
            d.chose_ecological = choice.kind === "ecological" ? 1 : 0;
            d.chosen_side = d.response === 0 ? "left" : "right";
            d.rt_ms = Math.round(d.rt);
            delete d.chosen_option;
        }
    ));

    // neutral transition
    if (position < creatureOrder.length - 1) {
        timeline.push(infoScreen(
            `<p class="headline">Thank you!</p>
            <p class="subline">Let's meet a new animal.</p>`,
            "Next", {screen: "between_animals", completed_animals: position + 1}
        ));
    }
});

// 6. End
timeline.push(infoScreen(
    `<p class="headline">All done! Thank you for playing!</p>
    <p class="subline">Press the button to finish.</p>`,
    "Finish", {screen: "end"}
));

jsPsych.run(timeline);
