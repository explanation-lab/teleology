// Run with Node from any directory. These checks exercise the study's callbacks
// without a browser; the visible consent and CSV flow are checked separately.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const folder = path.join(root, 'code/experiments/Experiment 1');
const read = name => fs.readFileSync(path.join(folder, name), 'utf8');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
const plain = value => JSON.parse(JSON.stringify(value));
const labels = ['Behavioral', 'Ecological', 'Animal-benefiting', 'Human-benefiting'];
function permutations(a) {
  return a.length ? a.flatMap((v, i) => permutations(a.filter((_, j) => i !== j)).map(rest => [v, ...rest])) : [[]];
}
function build(buttons, shift = 7) {
  let timeline, options, aborted = false, saves = [];
  const props = {}, rows = [], display = { innerHTML: '' }, attrs = {};
  const fill = { style: {} }, percent = {};
  const progress = { hidden: true, querySelector: selector => selector === '.progress-fill' ? fill : selector === '.progress-percent' ? percent : { setAttribute: (key, value) => { attrs[key] = value; } } };
  const collection = {
    filter: query => {
      const selected = rows.filter(row => Object.entries(query).every(([key, value]) => row[key] === value));
      return {
        ignore: columns => ({
          localSave: (type, file) => {
            const exportedRows = selected.map(row => Object.fromEntries(Object.entries(row).filter(([key]) => !columns.includes(key))));
            saves.push({ type, file, rows: exportedRows });
          }
        })
      };
    }
  };
  const engine = {
    data: { getURLVariable: () => 'SYNTHETIC_CHECK', addProperties: data => Object.assign(props, data), get: () => collection },
    randomization: { shuffle: array => array.length === 4 ? buttons.slice() : array.slice(shift).concat(array.slice(0, shift)) },
    run: value => { timeline = value; },
    abortExperiment: () => { aborted = true; },
    getDisplayElement: () => display
  };
  const context = vm.createContext({
    document: { getElementById: id => { assert.equal(id, 'study-progress'); return progress; } },
    initJsPsych: value => { options = value; return engine; }, jsPsychHtmlButtonResponse: function () {}
  });
  for (const name of ['js/stimuli.js', 'js/consent.js', 'js/experiment.js']) vm.runInContext(read(name), context, { filename: name });
  return { timeline, options, context, props, rows, display, progress, attrs, fill, percent, saves, aborted: () => aborted };
}

let responseChecks = 0;
for (const buttons of permutations(labels)) {
  const test = build(buttons);
  const { timeline, context } = test;
  assert.equal(timeline[0].data.task, 'consent');
  assert.equal(timeline[1].data.task, 'instructions');
  const definitionLabels = [...timeline[1].stimulus.matchAll(/<th scope="row">(.*?)<\/th>/g)].map(m => m[1]);
  assert.equal(definitionLabels.length, 4);
  assert.equal(definitionLabels.at(-1), 'Behavioral');
  assert.doesNotMatch(timeline[1].stimulus, /The buttons will stay|take a break/);
  assert.equal(timeline.length, 83);
  assert.equal(test.progress.hidden, true);
  timeline[0].on_finish({ response: 0 });
  assert.equal(test.props.consented, true);
  const trials = timeline.filter(t => t.data.task === 'trial');
  assert.equal(trials.length, 80);
  assert.equal(new Set(trials.map(t => t.data.stimulus_id)).size, 80);
  assert.equal(timeline.filter(t => t.data.task === 'break').length, 0);
  assert.ok(timeline.slice(2, -1).every(t => t.data.task === 'trial'));
  assert.notDeepEqual(trials.map(t => t.data.stimulus_id), plain(vm.runInContext('STIMULI.map(s => s.id)', context)));
  assert.equal(hash(vm.runInContext('JSON.stringify(STIMULI)', context)), '7f662c088ec057ae3f685aec78f127ead7358bb1c03e45fa3fe2b3ec1ee79a47');
  assert.equal(hash(vm.runInContext('TELEOLOGY_CONSENT', context)), 'cda7361e25fa7dab714b832b30304aeda735e2a13e7d323aa63d258953d1d8b0');
  for (let i = 0; i < trials.length; i++) {
    const trial = trials[i];
    assert.deepEqual(plain(trial.choices), buttons);
    assert.equal(trial.data.button_order, buttons.join(' | '));
    assert.equal(trial.data.trial_number, i + 1);
    assert.equal(trial.data.block_number, undefined);
    assert.equal(trial.grid_columns, 4);
    trial.on_start();
    assert.equal(test.attrs['aria-valuenow'], i);
    for (let response = 0; response < 4; response++) {
      const data = { ...test.props, ...trial.data, response, rt: 500 };
      trial.on_finish(data);
      const selected = buttons[response] === 'Ecological' ? 'Ecological-benefiting' : buttons[response];
      assert.equal(data.selected_label, buttons[response]);
      assert.equal(data.selected_category, selected);
      assert.equal(data.selected_position, response + 1);
      assert.equal(data.matches_researcher_category, selected === trial.data.researcher_category);
      responseChecks++;
      if (response === i % 4) test.rows.push(data);
    }
    assert.equal(test.attrs['aria-valuenow'], i + 1);
  }
  const completion = timeline.at(-1);
  completion.on_start();
  assert.equal(test.percent.textContent, '100%');
  assert.equal(test.fill.style.width, '100%');
  completion.on_finish();
  assert.equal(test.saves.length, 1);
  assert.equal(test.saves[0].rows.length, 80);
  assert.equal(test.saves[0].file, 'teleology_exp1_SYNTHETIC_CHECK.csv');
  assert.equal(test.saves[0].rows[0].task, undefined);
  assert.equal(test.saves[0].rows[0].consented, true);
  assert.equal(test.saves[0].rows[0].button_layout, 'horizontal');
}
const declined = build(labels);
declined.timeline[0].on_finish({ response: 1 });
assert.equal(declined.aborted(), true);
declined.options.on_finish();
assert.match(declined.display.innerHTML, /chosen not to participate/);
assert.equal(declined.progress.hidden, true);
assert.equal(declined.saves.length, 0);
assert.equal(declined.props.consented, undefined);

const html = read('index.html');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(folder, match[1])), match[1]);
assert.ok(!/type="module"|https:\/\//.test(html));
console.log(`PASS: 24 button orders; ${responseChecks} response mappings; 80 original items without breaks; horizontal layout; consent; progress; CSV selection.`);
