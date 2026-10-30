// stimuli.js -- 80 properties, 20 per researcher-assigned category.
// Loaded with a <script> tag (no fetch), so it works from file://.
// "category" values are the ORIGINAL research labels and are never shown to participants.
// IDs: B = Behavioral, E = Ecological-benefiting, A = Animal-benefiting, H = Human-benefiting.
// Texts are exactly as supplied (e.g. "walking very slowly" keeps its lowercase "w");
// only invisible trailing spaces were trimmed.
const STIMULI = [
  // ---- Behavioral ----
  { id: "B01", text: "Barking loudly", category: "Behavioral" },
  { id: "B02", text: "Meowing softly", category: "Behavioral" },
  { id: "B03", text: "Mooing loudly", category: "Behavioral" },
  { id: "B04", text: "Oinking loudly", category: "Behavioral" },
  { id: "B05", text: "Quacking loudly", category: "Behavioral" },
  { id: "B06", text: "Buzzing around", category: "Behavioral" },
  { id: "B07", text: "Howling loudly", category: "Behavioral" },
  { id: "B08", text: "Hooting softly", category: "Behavioral" },
  { id: "B09", text: "Pecking quickly", category: "Behavioral" },
  { id: "B10", text: "Running fast", category: "Behavioral" },
  { id: "B11", text: "Hopping up high", category: "Behavioral" },
  { id: "B12", text: "Jumping over rocks", category: "Behavioral" },
  { id: "B13", text: "Roaring very loudly", category: "Behavioral" },
  { id: "B14", text: "Flying in circles", category: "Behavioral" },
  { id: "B15", text: "Swinging between trees", category: "Behavioral" },
  { id: "B16", text: "Diving into water", category: "Behavioral" },
  { id: "B17", text: "Slithering on ground", category: "Behavioral" },
  { id: "B18", text: "Climbing up trees", category: "Behavioral" },
  { id: "B19", text: "walking very slowly", category: "Behavioral" },
  { id: "B20", text: "Swimming in circles", category: "Behavioral" },
  // ---- Ecological-benefiting ----
  { id: "E01", text: "Building dams", category: "Ecological-benefiting" },
  { id: "E02", text: "Mixing dirt", category: "Ecological-benefiting" },
  { id: "E03", text: "Eating flies", category: "Ecological-benefiting" },
  { id: "E04", text: "Building nests", category: "Ecological-benefiting" },
  { id: "E05", text: "Building sea plants", category: "Ecological-benefiting" },
  { id: "E06", text: "Burying seeds", category: "Ecological-benefiting" },
  { id: "E07", text: "Giving others shelter", category: "Ecological-benefiting" },
  { id: "E08", text: "Planting trees", category: "Ecological-benefiting" },
  { id: "E09", text: "Cleaning dirty water", category: "Ecological-benefiting" },
  { id: "E10", text: "Digging holes", category: "Ecological-benefiting" },
  { id: "E11", text: "Making grass short", category: "Ecological-benefiting" },
  { id: "E12", text: "Cleaning up waste", category: "Ecological-benefiting" },
  { id: "E13", text: "Building others homes", category: "Ecological-benefiting" },
  { id: "E14", text: "Helping flowers grow", category: "Ecological-benefiting" },
  { id: "E15", text: "Eating dead animals", category: "Ecological-benefiting" },
  { id: "E16", text: "Eating harmful bugs", category: "Ecological-benefiting" },
  { id: "E17", text: "Cleaning shark teeth", category: "Ecological-benefiting" },
  { id: "E18", text: "Feeding baby animals", category: "Ecological-benefiting" },
  { id: "E19", text: "Warming other animals", category: "Ecological-benefiting" },
  { id: "E20", text: "Helping birds fly", category: "Ecological-benefiting" },
  // ---- Animal-benefiting ----
  { id: "A01", text: "Squirting ink", category: "Animal-benefiting" },
  { id: "A02", text: "Producing light", category: "Animal-benefiting" },
  { id: "A03", text: "Changing color", category: "Animal-benefiting" },
  { id: "A04", text: "Regrowing tail", category: "Animal-benefiting" },
  { id: "A05", text: "Being poisonous", category: "Animal-benefiting" },
  { id: "A06", text: "Spinning webs", category: "Animal-benefiting" },
  { id: "A07", text: "Rattling tail", category: "Animal-benefiting" },
  { id: "A08", text: "Breathing underwater", category: "Animal-benefiting" },
  { id: "A09", text: "Balancing well", category: "Animal-benefiting" },
  { id: "A10", text: "Having spikes", category: "Animal-benefiting" },
  { id: "A11", text: "Having thick fur", category: "Animal-benefiting" },
  { id: "A12", text: "Sleeping upside down", category: "Animal-benefiting" },
  { id: "A13", text: "Having a shell", category: "Animal-benefiting" },
  { id: "A14", text: "Spraying bad smell", category: "Animal-benefiting" },
  { id: "A15", text: "Living in groups", category: "Animal-benefiting" },
  { id: "A16", text: "Having webbed feet", category: "Animal-benefiting" },
  { id: "A17", text: "Having a trunk", category: "Animal-benefiting" },
  { id: "A18", text: "Seeing in darkness", category: "Animal-benefiting" },
  { id: "A19", text: "Rolling into balls", category: "Animal-benefiting" },
  { id: "A20", text: "Staying cool", category: "Animal-benefiting" },
  // ---- Human-benefiting ----
  { id: "H01", text: "Making wool", category: "Human-benefiting" },
  { id: "H02", text: "Pulling carts", category: "Human-benefiting" },
  { id: "H03", text: "Giving milk", category: "Human-benefiting" },
  { id: "H04", text: "Making honey", category: "Human-benefiting" },
  { id: "H05", text: "Carrying things", category: "Human-benefiting" },
  { id: "H06", text: "Sending messages", category: "Human-benefiting" },
  { id: "H07", text: "Guiding people", category: "Human-benefiting" },
  { id: "H08", text: "Making pearls", category: "Human-benefiting" },
  { id: "H09", text: "Laying eggs", category: "Human-benefiting" },
  { id: "H10", text: "Warning of danger", category: "Human-benefiting" },
  { id: "H11", text: "Making others happy", category: "Human-benefiting" },
  { id: "H12", text: "Waking up others", category: "Human-benefiting" },
  { id: "H13", text: "Keeping others company", category: "Human-benefiting" },
  { id: "H14", text: "Helping with travel", category: "Human-benefiting" },
  { id: "H15", text: "Keeping houses safe", category: "Human-benefiting" },
  { id: "H16", text: "Giving feathers", category: "Human-benefiting" },
  { id: "H17", text: "Protecting farm animals", category: "Human-benefiting" },
  { id: "H18", text: "Bringing back items", category: "Human-benefiting" },
  { id: "H19", text: "Finding hidden objects", category: "Human-benefiting" },
  { id: "H20", text: "Making beautiful music", category: "Human-benefiting" }
];

// Participant-facing button label  ->  original research category (kept in the data).
// Only the keys (left side) are shown to participants; the values (right side) are the
// original research labels and must match the "category" values above.
const CATEGORY_LABELS = {
  "Behavioral":       "Behavioral",
  "Ecological":       "Ecological-benefiting",
  "Self-benefiting":  "Animal-benefiting",
  "Human-benefiting": "Human-benefiting"
};
