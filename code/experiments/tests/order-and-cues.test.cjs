const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const OptionNarration = require('../2_trait_kid_study/option_narration.js');
const experiments = path.resolve(__dirname, '..');

function loadStudy(kind, pid, seed = 42, extraQuery = '', overrides = {}) {
    let timeline;
    let rng = seed;
    const shuffle = items => {
        const out = [...items];
        for (let i = out.length - 1; i > 0; i--) {
            rng = (rng * 1664525 + 1013904223) >>> 0;
            const j = Math.floor(rng / 2 ** 32 * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    };
    const context = vm.createContext({
        URLSearchParams, Date, setTimeout, clearTimeout,
        window: {location: {search: `?pid=${pid}${extraQuery}`}},
        localStorage: {getItem: () => null, setItem: () => {}},
        document: {body: {dataset: {}}},
        jsPsychHtmlButtonResponse: function HtmlButtonResponse() {},
        initJsPsych: () => ({randomization: {shuffle}, run: value => { timeline = value; }}),
        ...overrides
    });
    const folder = kind === 'original' ? 'Kids_Teleology_Study_10-18-2026' : '2_trait_kid_study';
    const files = kind === 'original'
        ? ['js code/stimuli.js', 'js code/experiment.js']
        : ['second_stimuli.js', 'option_narration.js', 'second_experiment.js'];
    files.forEach(file => vm.runInContext(fs.readFileSync(path.join(experiments, folder, file), 'utf8'), context));
    return timeline;
}

test('original questions follow the actual introduction order for every animal', () => {
    for (const seed of [1, 71, 987]) {
        const timeline = loadStudy('original', 9, seed);
        const introductions = timeline.filter(t => t.data?.screen === 'animal_intro');
        const questions = timeline.filter(t => t.data?.phase === 'test');
        assert.equal(introductions.length, 5);
        assert.equal(questions.length, 20);
        for (const intro of introductions) {
            const animalQuestions = questions.filter(t => t.data.animal === intro.data.animal);
            assert.equal(animalQuestions.map(t => t.data.property_id).join('|'), intro.data.intro_order);
            assert.ok(animalQuestions.every((t, i) => t.data.test_position_within_animal === i + 1));
            assert.ok(animalQuestions.every(t => t.data.intro_order === intro.data.intro_order));
            assert.ok(animalQuestions.every(t => t.stimulus.includes(`Is a ${intro.data.animal} for`)));
        }
    }
});

test('reversed participant groups balance each creature and align description, speech, and left button', () => {
    const schedules = [0, 1].map(pid => loadStudy('choice', pid, 71));
    for (const timeline of schedules) {
        const intros = timeline.filter(t => t.data?.screen === 'meet_creature');
        const trials = timeline.filter(t => t.data?.phase === 'test');
        assert.equal(trials.length, 5);
        const firstEco = trials.filter(t => t.data.first_kind === 'ecological').length;
        assert.ok(firstEco === 2 || firstEco === 3);
        for (const trial of trials) {
            const intro = intros.find(t => t.data.animal_id === trial.data.animal_id);
            assert.equal(`${trial.data.left_feature_id}|${trial.data.right_feature_id}`, intro.data.meet_order);
            assert.equal(trial.data.meet_order, intro.data.meet_order);
            assert.equal(trial.data.first_kind, trial.data.left_kind);
            assert.equal(trial.data.second_kind, trial.data.right_kind);
            assert.equal(trial.data.eco_mentioned_first, Number(trial.data.left_kind === 'ecological'));
            assert.equal(trial.data.counterbalance_group, intro.data.counterbalance_group);
            const expectedFirst = trial.data.left_kind === 'ecological' ? trial.data.eco_feature_text : trial.data.self_feature_text;
            assert.equal(trial.choices[0], 'for ' + expectedFirst);
            for (const response of [0, 1]) {
                const data = {response, rt: 123.4};
                trial.on_finish(data);
                const side = response === 0 ? 'left' : 'right';
                assert.equal(data.chosen_side, side);
                assert.equal(data.chosen_feature_id, trial.data[side + '_feature_id']);
                assert.equal(data.chosen_kind, trial.data[side + '_kind']);
            }
        }
    }
    const a = schedules[0].filter(t => t.data?.phase === 'test');
    const b = schedules[1].filter(t => t.data?.phase === 'test');
    for (const trial of a) {
        const paired = b.find(t => t.data.animal_id === trial.data.animal_id);
        assert.notEqual(trial.data.first_kind, paired.data.first_kind);
    }
    const newCreatureOrder = loadStudy('choice', 0, 118).filter(t => t.data?.phase === 'test');
    for (const trial of a) {
        assert.equal(trial.data.first_kind, newCreatureOrder.find(t => t.data.animal_id === trial.data.animal_id).data.first_kind);
    }
});

test('the new study uses Daxes in descriptions and transitions', () => {
    const timeline = loadStudy('choice', 0);
    const intro = timeline.find(t => t.data?.screen === 'meet_creature' && t.data.animal === 'Dax');
    const transition = timeline.find(t => t.data?.screen === 'question_intro' && t.data.animal === 'Dax');
    assert.ok(intro.stimulus.includes('Daxes'));
    assert.ok(transition.stimulus.includes('Daxes'));
    assert.ok(!intro.stimulus.includes('Daxs'));
    assert.ok(!transition.stimulus.includes('Daxs'));
});

test('explicit schedule links override participant parity and record their assignment source', () => {
    const assigned = loadStudy('choice', 1, 42, '&order=0').filter(t => t.data?.phase === 'test');
    const comparison = loadStudy('choice', 0, 42).filter(t => t.data?.phase === 'test');
    for (const trial of assigned) {
        assert.equal(trial.data.counterbalance_group, 0);
        assert.equal(trial.data.counterbalance_source, 'url_condition');
        assert.equal(trial.data.first_kind, comparison.find(t => t.data.animal_id === trial.data.animal_id).data.first_kind);
    }
});

test('both study pages remain without narration; the choice study uses visual cues in its main page', () => {
    for (const kind of ['original', 'choice']) {
        const controls = buttons();
        const timeline = loadStudy(kind, 0, 42, '&audio=1&previewCues=1', {
            document: {
                body: {dataset: {}},
                querySelector: selector => selector === '.jspsych-content' ? {appendChild: () => {}} : controls[0],
                querySelectorAll: () => controls,
                createElement: () => ({addEventListener: () => {}})
            },
            SpeechSynthesisUtterance: function () { throw new Error('Normal study must not start narration'); }
        });
        const welcome = timeline.find(t => t.data?.screen === 'welcome');
        assert.ok(!welcome.button_html('Next').includes('hidden'));
        welcome.on_load();
        const trial = timeline.find(t => t.data?.phase === 'test');
        trial.on_load();
        const data = {response: 0, rt: 500};
        trial.on_finish(data);
        if (kind === 'choice') assert.equal(data.option_presentation_mode, 'visual');
        assert.deepEqual(highlighted(controls), [false, false]);
    }
});

function buttons() {
    return [0, 1].map(() => {
        const classes = new Set();
        return {classList: {add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c)}};
    });
}
const highlighted = controls => controls.map(b => b.classList.contains('is-speaking'));

test('speech start/end events cue only the corresponding button in spoken order', () => {
    const controls = buttons(), segments = [];
    const reader = OptionNarration.create({
        question: 'What is it for?', labels: ['for the first feature', 'for the second feature'], buttons: controls,
        speak: (text, start, done, fail) => { segments.push({text, start, done, fail}); return () => {}; }
    });
    reader.start();
    assert.equal(segments[0].text, 'What is it for?');
    assert.deepEqual(highlighted(controls), [false, false]);
    segments[0].done();
    assert.equal(segments[1].text, 'for the first feature');
    assert.deepEqual(highlighted(controls), [false, false]);
    segments[1].start();
    assert.deepEqual(highlighted(controls), [true, false]);
    segments[1].done();
    assert.equal(segments[2].text, 'or');
    assert.deepEqual(highlighted(controls), [false, false]);
    segments[2].done();
    assert.equal(segments[3].text, 'for the second feature');
    segments[3].start();
    assert.deepEqual(highlighted(controls), [false, true]);
    segments[3].done();
    assert.deepEqual(highlighted(controls), [false, false]);
    assert.deepEqual(reader.snapshot(), {mode: 'audio', status: 'complete'});
});

test('leaving a trial clears the cue and prevents late speech callbacks touching the next screen', () => {
    const controls = buttons(), segments = [];
    let cancelled = 0;
    const reader = OptionNarration.create({question: 'Question', labels: ['A', 'B'], buttons: controls,
        speak: (text, start, done, fail) => { segments.push({text, start, done, fail}); return () => { cancelled++; }; }});
    reader.start();
    segments[0].done();
    segments[1].start();
    reader.stop();
    const count = segments.length;
    segments[1].start();
    segments[1].done();
    assert.deepEqual(highlighted(controls), [false, false]);
    assert.equal(segments.length, count);
    assert.ok(cancelled > 0);
    assert.equal(reader.snapshot().status, 'cancelled');
});

test('speech failure clears the cue without pretending the choices finished', () => {
    const controls = buttons(), segments = [];
    const reader = OptionNarration.create({question: 'Question', labels: ['A', 'B'], buttons: controls,
        speak: (text, start, done, fail) => { segments.push({start, done, fail}); return () => {}; }});
    reader.start();
    segments[0].done();
    segments[1].start();
    segments[1].fail();
    assert.deepEqual(highlighted(controls), [false, false]);
    assert.equal(reader.snapshot().status, 'unavailable');
});

test('visual cues are identified separately from audio and use the same option order', () => {
    const controls = buttons(), timers = [];
    const reader = OptionNarration.create({question: 'Question', labels: ['A', 'B'], buttons: controls,
        visual: true, schedule: callback => { timers.push(callback); return timers.length; }, cancel: () => {}});
    reader.start();
    timers.shift()();
    assert.deepEqual(highlighted(controls), [true, false]);
    timers.shift()();
    timers.shift()();
    assert.deepEqual(highlighted(controls), [false, true]);
    timers.shift()();
    assert.deepEqual(reader.snapshot(), {mode: 'visual', status: 'complete'});
    assert.deepEqual(highlighted(controls), [false, false]);
});
