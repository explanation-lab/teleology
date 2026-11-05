// Coordinate segments with the matching answer button. The visual mode uses
// timed cues without claiming that any audio was played.
const OptionNarration = {
    create({question, labels, buttons, speak, visual = false,
        schedule = setTimeout, cancel = clearTimeout}) {
        const controls = Array.from(buttons);
        const mode = speak ? "audio" : visual ? "visual" : "silent";
        const segments = [{text: question, index: null}];
        labels.forEach((text, index) => {
            if (index) segments.push({text: "or", index: null});
            segments.push({text, index});
        });
        let generation = 0, timer = null, cancelSpeech = null;
        let status = "idle";
        const clear = () => controls.forEach(button => button.classList.remove("is-speaking"));
        function stop() {
            generation++;
            if (timer !== null) cancel(timer);
            timer = null;
            if (cancelSpeech) cancelSpeech();
            cancelSpeech = null;
            clear();
            if (status === "reading") status = "cancelled";
        }
        function start() {
            stop();
            if (mode === "silent") { status = "off"; return; }
            status = "reading";
            const run = generation;
            function next(position) {
                if (run !== generation) return;
                clear();
                if (position === segments.length) { status = "complete"; return; }
                const segment = segments[position];
                const mark = () => {
                    if (run !== generation) return;
                    clear();
                    if (segment.index !== null) controls[segment.index].classList.add("is-speaking");
                };
                const done = () => { if (run === generation) next(position + 1); };
                const failed = () => {
                    if (run !== generation) return;
                    stop();
                    status = "unavailable";
                };
                if (mode === "audio") {
                    cancelSpeech = speak(segment.text, mark, done, failed);
                } else {
                    mark();
                    const ms = segment.index === null ? 650 : Math.max(1200, segment.text.split(/\s+/).length * 400);
                    timer = schedule(done, ms);
                }
            }
            next(0);
        }
        return {start, stop, snapshot: () => ({mode, status})};
    }
};

if (typeof module !== "undefined") module.exports = OptionNarration;
