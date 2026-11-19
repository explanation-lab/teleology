// Locally opened copies support an offline walkthrough. Hosted copies require
// a valid Study Console launch so a participant cannot finish without saving.
(async () => {
  if (location.protocol === "file:" ||
      (["localhost", "127.0.0.1"].includes(location.hostname) &&
       !new URLSearchParams(location.search).has("study"))) {
    startTeleologyStudy();
    return;
  }

  const { default: createExplanationLabClient } = await import("./explanation-lab-client.js");
  const explanationLab = await createExplanationLabClient({ experimentVersion: EXPERIMENT_VERSION });
  if (explanationLab.study.experimentVersion !== EXPERIMENT_VERSION) {
    throw new Error("This link is for a different study version. Please open the link provided by the researcher.");
  }
  if (explanationLab.launch.condition !== "mixed") {
    throw new Error("This study requires the all-items launch group.");
  }
  startTeleologyStudy(explanationLab);
})().catch(error => {
  const display = document.getElementById("experiment");
  const message = document.createElement("p");
  message.setAttribute("role", "alert");
  message.textContent = error.message || "The study could not start. Please contact the researcher.";
  display.replaceChildren(message);
});
