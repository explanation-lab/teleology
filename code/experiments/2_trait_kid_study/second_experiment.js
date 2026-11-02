// Animal Choice Study (jsPsych v8), standalone
//
// URL options
//     ?pid=7       participant number
//     ?audio=1     read screens aloud using the browser's speech synthesis
//
// Flow: welcome -> how to answer -> practice -> thank-you + fireworks ->
//       for each creature (random order):
//           meet screen (picture + the eco feature and self feature)
//           "what are they for" transition
//           ONE two-button question: "What is a Zorp for?"  (child picks one)
//           neutral thank-you before the next creature
//       -> end
//
// Random per child: creature order, feature order on the meet screen, left/right button position.
// Each child answers 5 questions (one per creature). Data downloads as a CSV when finished.

const urlParams = new URLSearchParams(window.location.search);
const SPEAK = urlParams.get("audio") === "1";

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
const SESSION = "choice" + PARTICIPANT + "_" + Date.now();

const jsPsych = initJsPsych({
    on_finish: () => {
        jsPsych.data.get().filter({phase: "test"}).localSave("csv", "animal_choice_" + SESSION + ".csv");
    }
});

// ---------- helpers ----------

// Reads text aloud (audio mode only). onDone runs when speech ends; onFail runs if speech is
// unavailable or blocked. Swap this function out to use recorded audio files later.
function speak(text, onDone, onFail) {
    if (!SPEAK || !window.speechSynthesis) { if (onFail) onFail(); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.85;
    let finished = false, timer;
    const settle = (ok) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (ok && onDone) onDone();
        if (!ok && onFail) onFail();
    };
    utterance.onend = () => settle(true);
    utterance.onerror = (e) => {
        if (e.error === "interrupted" || e.error === "canceled") { finished = true; clearTimeout(timer); return; }
        settle(false);
    };
    timer = setTimeout(() => settle(true), clean.split(" ").length * 600 + 4000);
    window.speechSynthesis.speak(utterance);
}

const panel = (html, extraClass) => `<div class="panel ${extraClass || ""}">${html}</div>`;

// Info screen with a single button. opts: auto (advance when narration ends, audio mode only),
// spoken (text to read if different from the screen), panelClass, on_load, on_finish
function infoScreen(html, buttonLabel, extraData, opts) {
    opts = opts || {};
    const autoAdvance = SPEAK && opts.auto;
    let done = false;
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: panel(html, opts.panelClass),
        choices: [buttonLabel],
        button_html: (c) => `<button class="btn btn-go${autoAdvance ? " hidden" : ""}">${c}</button>`,
        data: Object.assign({phase: "info"}, extraData || {}),
        on_load: () => {
            done = false;
            const btn = document.querySelector(".btn-go");
            speak(opts.spoken || html,
                autoAdvance ? () => { if (!done) jsPsych.finishTrial(); } : null,
                autoAdvance ? () => btn.classList.remove("hidden") : null);
            if (opts.on_load) opts.on_load();
        },
        on_finish: () => { done = true; if (opts.on_finish) opts.on_finish(); }
    };
}

// Two-button choice screen. `options` is in DISPLAY order (left to right). Each option is
// {label, ...anything}. The chosen option object is passed to on_finish as d.chosen_option.
function choiceScreen(html, spokenText, options, data, on_finish) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: panel(html),
        choices: options.map(o => o.label),
        button_html: (c) => `<button class="btn btn-pick">${c}</button>`,
        on_load: () => speak(spokenText),
        data: data,
        on_finish: (d) => {
            d.chosen_option = options[d.response];
            if (on_finish) on_finish(d);
        }
    };
}

// Practice: pick the correct label for the picture. Repeats (up to 3 times) until correct.
function practiceTrial(item) {
    let attempts = 0;
    let shown = [];
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
            on_load: () => speak(`${retryPrefix()}What is this? ${shown.map(o => o.label).join(", or ")}?`),
            data: {phase: "practice", practice_item: item.id},
            on_finish: (d) => { d.correct = shown[d.response].correct; }
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
    const eco = creature.ecoFeature;
    const self = creature.selfFeature;
    const featureIntroText = (f) => f.introText || f.text;
    const baseData = {animal: creature.name, animal_id: creature.id, animal_position: position + 1};

    // meet screen: both features, random order
    const meetOrder = jsPsych.randomization.shuffle([eco, self]);
    const tags = meetOrder.map(f => `<span class="feature-tag">${featureIntroText(f)}</span>`).join(" and ");
    const spokenMeet = `This is a ${creature.name}. ${creature.name}s ${meetOrder.map(featureIntroText).join(" and ")}.`;
    timeline.push(infoScreen(
        `<p class="headline">This is a <span class="creature-name">${creature.name}</span>.</p>
        <div class="meet-row">
            <img class="creature-pic" src="${creature.image}" alt="A ${creature.name}">
            <p class="subline meet-text">${creature.name}s ${tags}.</p>
        </div>`,
        "Next",
        Object.assign({screen: "meet_creature", meet_order: meetOrder.map(f => f.id).join("|")}, baseData),
        {spoken: spokenMeet}
    ));

    // transition
    timeline.push(infoScreen(
        `<img class="mini-pic" src="${creature.image}" alt="">
        <p class="headline">Now that you have learned about ${creature.name}s, we want to ask you about what ${creature.name}s are for.</p>`,
        "Next", Object.assign({screen: "question_intro"}, baseData)
    ));

    // the forced-choice question; left/right position is random
    const options = jsPsych.randomization.shuffle([
        {label: "for " + eco.text,  feature: eco,  kind: "ecological"},
        {label: "for " + self.text, feature: self, kind: "self_benefit"}
    ]);
    timeline.push(choiceScreen(
        `<img class="mini-pic" src="${creature.image}" alt="">
        <p class="headline">What is a ${creature.name} for?</p>
        <p class="subline">Pick one.</p>`,
        `What is a ${creature.name} for? Is it ${options[0].label}, or ${options[1].label}?`,
        options,
        {
            phase: "test",
            participant_id: PARTICIPANT,
            session_id: SESSION,
            animal: creature.name,
            animal_id: creature.id,
            animal_position: position + 1,
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