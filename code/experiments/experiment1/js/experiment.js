// Kids Teleology Study (jsPsych v8)
// URL options
//     ?pid = 7         participant number.
// Narration is disabled in this draft; screens advance with their buttons.
//
// Structure: welcome -> how to answer yes/no -> practice -. thank you + fireworks -.
//            for each animal (random order):
//               introduction (picture + all 4 properties on one screen)
//               "what is the animal for" transition -> 4 questions, one per screen
//               neutral thank you before the next animal
// Animal order and property introduction order are random per child.
// Questions follow that animal's property introduction order.
// Every child answers 20 questions, one per property


const params = new URLSearchParams(window.location.search);
const AUDIO = false;

function getParticipantNumber(){
    const fromUR1 = parseInt(params.get("pid"), 10);
    if (!isNaN(fromUR1)) return fromUR1;
    try{
        const n = parseInt(localStorage.getItem("teleology_kids_counter") || "0", 10);
        localStorage.setItem("teleology_kids_counter", String(n+1));
        return n;
    } catch (e){
        return Math.floor(Math.random()*1000);
    }
}

const PID = getParticipantNumber();
const SESSION_ID = "k" + PID + "_" + Date.now();

const jsPsych = initJsPsych({
    on_finish: () => {
        jsPsych.data.get().filter({phase: "test"}).localSave("csv", "teleology_kids_" + SESSION_ID + ".csv");
    }
})

// helper functions

// reads text aloud. onDOne runs whens narration finishes. onFail run sif speech is unavailable or blocked
// (for example, if the browser needs a click first). To use recorded audio files later, replace this func
function narrate(text, onDone, onFail){
    if (!AUDIO || !window.speechSynthesis){if (onFail) onFail(); return;}
    window.speechSynthesis.cancel();
    const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 0.85;
    let settled = false, timer;
    const settle = (ok)=> {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (ok && onDone) onDone();
        if (!ok && onFail) onFail();
    };
    u.onend = () => settle(true);
    u.onerror =(e)=> {
        // interrupted/canceled means the next screen took over
        if (e.error === "interrupted" || e.error === "canceled") { settled = true; clearTimeout(timer); return; }
        settle(false);
    };
    // in case onend is never run due to browser settings
    timer = setTimeout(()=> settle(true), (clean.split(" ").length * 600) + 4000);
    window.speechSynthesis.speak(u);
}

const stage = (html, cls) => `<div class="stage ${cls || ""}">${html}</div>`;

// an info screen with one button. opts.auto will advance automatically when narration ends (for audio mode only)
// opts.spoken menas text to read if it should differ from the on-scrreen HHTML
function screen(html, label, extraData, opts){
    opts = opts || {};
    const auto = AUDIO && opts.auto;
    let ended = false;
    return{
        type: jsPsychHtmlButtonResponse,
        stimulus: stage(html, opts.stageClass),
        choices: [label],
        button_html: (c)=> `<button class="jspsych-btn btn-next${auto ? " hidden" : ""}">${c}</button>`,
        data: Object.assign({phase: "info"}, extraData || {}),
        on_load: ()=> {
            ended = false;
            const btn = document.querySelector(".btn-next");
            narrate(opts.spoken || html,
                auto ? () => {if (!ended) jsPsych.finishTrial(); } : null,
                auto ?() => btn.classList.remove("hidden") : null);
            if (opts.on_load) opts.on_load();
        },
        on_finish: () => {ended = true; if (opts.on_finish) opts.on_finish();}
    };
}

//yes and no buttons including symbol and word.  same for instructions, practice, and test
const ICON_YES = `<svg class="answer-icon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#0da032"/>
    <path d="M17 33 L28 44 L48 21" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_NO = `<svg class="answer-icon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#ac1f07"/>
    <path d="M20 20 L44 44 M44 20 L20 44" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const yesNoButton = (c) => {
    const yes = c === "Yes";
    return `<button class="jspsych-btn btn-answer ${yes ? "btn-yes" : "btn-no"}">${yes ? ICON_YES : ICON_NO}<span>${c}</span></button>`;
};

//Yes/no question screen
function yesNoTrial(html, spoken, data, on_finish){
    return{
        type: jsPsychHtmlButtonResponse,
        stimulus: typeof html === "function" ? ()=> stage(html()) : stage(html),
        choices: ["Yes", "No"],
        button_html: yesNoButton,
        on_load: () => narrate(typeof spoken === "function" ? spoken() : spoken),
        data: data,
        on_finish: on_finish
    };
}

// Practice question (asked again (up to 3x) until the expected answer is given)
function practiceBlock(image, question, correctIdx, label){
    let attempts = 0;
    const retry = () => attempts > 0 ? "Let's look again. " : "";
    return{
        timeline: [yesNoTrial(
            () => `<img class="practice-img" src="${image}" alt=""><p class="big">${retry()}${question}</p>`,
            () => retry() + question,
            {phase: "practice", practice_item: label},
            (d) => { d.correct = d.response === correctIdx;}
        )],
        loop_function: (data) => {
            attempts++;
            return !data.values()[0].correct && attempts < 3;
        }
    };
}

// fireworks animation
let stopFireworks = null
function startFireworks(){
    const canvas = document.getElementById("fireworks")
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const colors = ["#ffc93c", "#e8674f", "#3fae5a", "#2f80c9", "#c69bf0", "#ff8fa3"];
    let particles = [], raf, nextBurst = 0;
    function burst(){
        const x = canvas.width * (0.15 + Math.random()*0.7);
        const y = canvas.height * (0.15 + Math.random()*0.55);
        const c = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i< 44; i++){
            const a = (Math.PI*2*i)/44, s=2+Math.random()*3.5;
            particles.push({x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 1, c});
        }
    }
    function frame(t){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        if (t> nextBurst){burst(); nextBurst=t+500; }
        particles = particles.filter(p => p.life >0);
        particles.forEach(p=> {
            p.x += p.vx; p.y+= p.vy; p.vy+=0.05; p.vx*=0.99; p.life-=0.012;
            ctx.globalAlpha = Math.max(p.life, 0);
            ctx.fillStyle = p.c;
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
        });
        raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    stopFireworks = () => cancelAnimationFrame(raf);
}


// timeline
const animalOrder = jsPsych.randomization.shuffle(ANIMALS.map((a, i) => i));
const timeline = [];

// 1. Welcome screen
timeline.push(screen(
    `<p class="big title">Welcome to the Animal Game!</p>
    <div class="parade">${ANIMALS.map((a, i) => `<img class="parade-animal" style ="animation-delay:${(i*0.18).toFixed(2)}s" src="${a.image}" alt="">`).join("")}</div>
    <p class="mid">Today you are going to meet some animals and answer some questions about them. </p>`,
    "Let's start!", {screen: "welcome"},
    {auto: true,
        spoken: "Welcome to the Animal Game! Today you are going to meet some animals and answer some questions about them."}
));

// 2. How to answer
timeline.push(screen(
    `<p class="big">In our game, we will ask you a question, and you can answer yes or no.</p>
    <span class="jspsych-btn btn-answer btn-yes demo">${ICON_YES}<span>Yes</span></span>
    <span class="jspsych-btn btn-answer btn-no demo">${ICON_NO}<span>No</span></span>
    <p class="mid">Let's practice!</p>`,
    "Next", {screen: "yes_no_instructions"},
    {spoken: "In our game, we will ask you questions, and you can answer yes or no. Let's practice!"}
));

// 3. practice
timeline.push(practiceBlock("assets/animals/bird.svg", "Is this a bird?", 0, "bird_yes"));
timeline.push(practiceBlock("assets/animals/giraffe.svg", "Is this a cat?", 1, "giraffe_no"));

// 4. thank you with fireworks
timeline.push(screen(
    `<canvas id="fireworks"></canvas>
    <p class="big title">Thank you!</p>
    <p class="big"> Now you are going to meet some animals.</p>`,
    "Next", {screen: "practice_thanks"},
    {stageClass: "fireworks-stage", spoken: "Thank you! Now you are going to meet some animals.",
        on_load: startFireworks, on_finish: () => {if (stopFireworks) stopFireworks();}}
));

// 5. Animals
animalOrder.forEach((animalIdx, pos) =>{
    const animal = ANIMALS[animalIdx];
    const pluralName = animal.name === "Dax" ? "Daxes" : `${animal.name}s`;
    const baseData = {animal: animal.name, animal_id: animal.id, animal_position: pos + 1};

    // intro
    const introProps = jsPsych.randomization.shuffle(animal.properties);
    const chips = introProps.map((p, i) =>
    `<span class="prop">${p.introText}</span>${i < 2 ? "," : i ===2 ? ", and" : "."}`).join(" ");
    const spokenIntro = `This is a ${animal.name}. ${pluralName} ` +
    introProps.map((p, i) => (i === 3 ? "and " : "") + p.introText).join(", ")+".";
    timeline.push(screen(
        `<p class="big">This is a <span class="animal-name">${animal.name}</span>.</p>
        <div class="intro-row">
        <img class="animal-img" src="${animal.image}" alt="A ${animal.name}">
        <p class="mid intro-text">${pluralName} ${chips}</p>
        </div>`,
        "Next", Object.assign({screen: "animal_intro", intro_order: introProps.map(p =>p.id).join("|")}, baseData),
        {spoken: spokenIntro}
    ));

    // transition
    timeline.push(screen(
        `<img class="mini-animal" src="${animal.image}" alt="">
        <p class="big">Now that you have learned about ${pluralName}, we want to ask you about what ${pluralName} are for.</p>`,
        "Next", Object.assign({screen: "questions_intro"}, baseData)
    ));

    // One question per screen, in the same order as this animal's introduction.
    introProps.forEach((p,k)=> {
        const spoken = `Is a ${animal.name} for ${p.text}?`;
        timeline.push(yesNoTrial(
            `<img class="mini-animal" src="${animal.image}" alt="">
            <p class ="big">Is a ${animal.name} for <span class="prop">${p.text}</span>?</p>`,
            spoken,
            {
                phase: "test",
                participant_id: PID,
                session_id: SESSION_ID,
                animal: animal.name,
                animal_position: pos + 1,
                intro_order: introProps.map(item => item.id).join("|"),
                test_position_within_animal: k + 1,
                property_id: p.id,
                norming_item_id: p.normingItemId,
                property_text: p.text,
                property_category: p.category
            },
            (d) => {
                d.response_label = d.response === 0 ? "yes" : "no";
                d.rt_ms=Math.round(d.rt);
            }
        ));
    });

    // neutral transition
    if (pos <animalOrder.length -1){
        timeline.push(screen(
            `<p class="big">Thank you!</p>
            <p class="mid">Let's meet a new animal.</p>`,
            "Next", {screen: "between_animals", break_after: pos + 1}
        ));
    }
});

// 6. end
timeline.push(screen(
    `<p class="big">All done! Thank you for playing!</p>
    <p class="mid">Press the button to finish.</p>`,
    "Finish", {screen: "end"}
));

jsPsych.run(timeline);
