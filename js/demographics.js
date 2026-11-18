const DEMOGRAPHIC_FIELDS = ["age", "gender", "race", "ethnicity"];

const TELEOLOGY_DEMOGRAPHICS = (() => {
  function choices(name, label, options) {
    const responses = [...options, "Prefer not to answer"].map(option =>
      `<label><input type="radio" name="${name}" value="${option}"> ${option}</label>`
    ).join("");
    return `<fieldset><legend>${label}</legend><div class="demographic-options">${responses}</div></fieldset>`;
  }

  return `<section class="demographics" aria-labelledby="demographics-heading">
    <h1 id="demographics-heading" tabindex="-1">Demographic information</h1>
    <p>You’ve completed all the descriptions. These last questions are optional.</p>
    <div class="demographics-fields">
      <div class="demographics-age">
        <label for="demographic-age">Age in years</label>
        <input id="demographic-age" name="age" type="number" min="18" max="120" step="1" inputmode="numeric">
      </div>
      ${choices("gender", "Gender", ["Female", "Male", "Non-binary", "Another gender"])}
      ${choices("race", "Race", [
        "White", "Black or African American", "American Indian or Alaska Native", "Asian",
        "Native Hawaiian or Pacific Islander", "Multiracial or mixed", "Another race"
      ])}
      ${choices("ethnicity", "Ethnicity", ["Hispanic or Latino", "Not Hispanic or Latino"])}
    </div>
  </section>`;
})();
