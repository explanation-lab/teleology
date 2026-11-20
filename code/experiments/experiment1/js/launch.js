const CONSENT_VERSION = "teleology-exp1-adult-pilot-consent-v1";

function getLocalParticipantNumber() {
    const requested = Number.parseInt(new URLSearchParams(location.search).get("pid"), 10);
    if (Number.isInteger(requested)) return requested;
    try {
        const previous = Number.parseInt(localStorage.getItem("teleology_kids_counter") || "0", 10);
        localStorage.setItem("teleology_kids_counter", String(previous + 1));
        return previous;
    } catch {
        return Math.floor(Math.random() * 1000);
    }
}

function showPilotStatus(display, title, message, role = "status") {
    display.innerHTML = `<section class="pilot-status" role="${role}"><h1></h1><p></p></section>`;
    display.querySelector("h1").textContent = title;
    display.querySelector("p").textContent = message;
}

function startExperiment1(explanationLab = null) {
    const startedAt = performance.now();
    const localParticipant = explanationLab ? null : getLocalParticipantNumber();
    const localSession = localParticipant === null ? null : `k${localParticipant}_${Date.now()}`;
    let consented = false;

    const jsPsych = initJsPsych({
        display_element: "experiment",
        async on_finish() {
            const display = jsPsych.getDisplayElement();
            if (!consented) {
                showPilotStatus(display, "Thank you", "You have chosen not to participate. You may close this window.");
                return;
            }
            if (!explanationLab) {
                jsPsych.data.get().filter({ phase: "test" }).localSave("csv", `teleology_kids_${localSession}.csv`);
                showPilotStatus(display, "All done! Thank you for playing!", "Your CSV download has been requested.");
                return;
            }

            const trials = jsPsych.data.get().values()
                .filter(trial => trial.trial_role)
                .map(({ stimulus, ...trial }) => trial);
            const options = {
                durationMs: performance.now() - startedAt,
                metadata: {
                    experimentVersion: EXPERIMENT_VERSION,
                    schemaVersion: "2.0.0",
                    demographicFields: DEMOGRAPHIC_FIELDS
                },
                showRetryScreen: false
            };

            async function saveResponses() {
                showPilotStatus(display, "Saving your responses", "Please keep this window open.");
                try {
                    await explanationLab.submitAndRedirect(trials, options);
                    showPilotStatus(display, "All done! Thank you for playing!", "Your responses have been saved.");
                } catch (error) {
                    const conditionMismatch = error?.code === "EXPLANATION_LAB_CONDITION_MISMATCH";
                    showPilotStatus(display, "Your responses have not been saved yet",
                        conditionMismatch ? "Please contact the researcher for help." :
                            "Please keep this window open and try again.", "alert");
                    if (conditionMismatch) return;
                    const retry = document.createElement("button");
                    retry.type = "button";
                    retry.className = "jspsych-btn";
                    retry.textContent = "Try saving again";
                    retry.addEventListener("click", saveResponses, { once: true });
                    display.querySelector("section").append(retry);
                }
            }
            await saveResponses();
        }
    });

    const identifiers = explanationLab
        ? { condition: explanationLab.launch.condition }
        : { participant_id: localParticipant, session_id: localSession };
    jsPsych.data.addProperties({
        ...identifiers,
        study_version: EXPERIMENT_VERSION,
        consent_version: CONSENT_VERSION
    });

    const consent = {
        type: jsPsychHtmlButtonResponse,
        stimulus: EXPERIMENT_1_CONSENT,
        choices: ["I agree", "I do NOT agree"],
        css_classes: ["consent-screen"],
        data: { task: "consent", trial_role: "consent" },
        on_finish(data) {
            consented = data.response === 0;
            data.consented = consented;
            if (!consented) jsPsych.abortExperiment();
        }
    };
    const demographics = {
        type: jsPsychSurveyHtmlForm,
        html: EXPERIMENT_1_DEMOGRAPHICS,
        button_label: "Finish",
        css_classes: ["demographics-screen"],
        data: { task: "demographics", trial_role: "demographic" },
        on_load: () => document.getElementById("demographics-heading")?.focus()
    };

    jsPsych.run([consent, ...buildExperiment1Timeline(jsPsych), demographics]);
}

(async () => {
    const local = ["localhost", "127.0.0.1"].includes(location.hostname);
    const hasStudy = new URLSearchParams(location.search).has("study");
    if (location.protocol === "file:" || (local && !hasStudy)) {
        startExperiment1();
        return;
    }

    const { default: createExplanationLabClient } = await import("../../Norming/js/explanation-lab-client.js");
    const explanationLab = await createExplanationLabClient({ experimentVersion: EXPERIMENT_VERSION });
    if (explanationLab.study.experimentVersion !== EXPERIMENT_VERSION) {
        throw new Error("This link is for a different study version. Please open the link provided by the researcher.");
    }
    if (explanationLab.launch.condition !== "mixed") {
        throw new Error("This study requires the all-items launch group.");
    }
    startExperiment1(explanationLab);
})().catch(error => showPilotStatus(document.getElementById("experiment"),
    "The study could not start", error.message || "Please contact the researcher.", "alert"));
