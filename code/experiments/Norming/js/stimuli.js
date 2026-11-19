// stimuli.js -- 40 properties, 10 per researcher-assigned category.
// Loaded with a <script> tag (no fetch), so it works from file://.
// "category" values are the ORIGINAL research labels and are never shown to participants.
// IDs: B = Behavioral, E = Ecological-benefiting, A = Animal-benefiting, H = Human-benefiting.
// Texts follow the lab's 10-per-category table (screenshot of 2026-11-10).
const STIMULI = [
  // ---- Behavioral ----
  { id: "B01", text: "Barking loudly", category: "Behavioral" },
  { id: "B02", text: "Buzzing around", category: "Behavioral" },
  { id: "B03", text: "Running fast", category: "Behavioral" },
  { id: "B04", text: "Hopping up high", category: "Behavioral" },
  { id: "B05", text: "Jumping over rocks", category: "Behavioral" },
  { id: "B06", text: "Flying in circles", category: "Behavioral" },
  { id: "B07", text: "Swinging between trees", category: "Behavioral" },
  { id: "B08", text: "Diving into water", category: "Behavioral" },
  { id: "B09", text: "Climbing up trees", category: "Behavioral" },
  { id: "B10", text: "Swimming in circles", category: "Behavioral" },
  // ---- Ecological-benefiting ----
  { id: "E01", text: "Cleaning air", category: "Ecological-benefiting" },
  { id: "E02", text: "Preventing sickness", category: "Ecological-benefiting" },
  { id: "E03", text: "Helping others eat", category: "Ecological-benefiting" },
  { id: "E04", text: "Giving others shelter", category: "Ecological-benefiting" },
  { id: "E05", text: "Planting seeds", category: "Ecological-benefiting" },
  { id: "E06", text: "Cleaning dirty water", category: "Ecological-benefiting" },
  { id: "E07", text: "Cleaning up waste", category: "Ecological-benefiting" },
  { id: "E08", text: "Helping flowers grow", category: "Ecological-benefiting" },
  { id: "E09", text: "Eating dead animals", category: "Ecological-benefiting" },
  { id: "E10", text: "Eating harmful bugs", category: "Ecological-benefiting" },
  // ---- Animal-benefiting ----
  { id: "A01", text: "Changing color", category: "Animal-benefiting" },
  { id: "A02", text: "Being poisonous", category: "Animal-benefiting" },
  { id: "A03", text: "Spinning webs", category: "Animal-benefiting" },
  { id: "A04", text: "Rattling tail", category: "Animal-benefiting" },
  { id: "A05", text: "Breathing underwater", category: "Animal-benefiting" },
  { id: "A06", text: "Having spikes", category: "Animal-benefiting" },
  { id: "A07", text: "Having thick fur", category: "Animal-benefiting" },
  { id: "A08", text: "Having a shell", category: "Animal-benefiting" },
  { id: "A09", text: "Spraying bad smell", category: "Animal-benefiting" },
  { id: "A10", text: "Seeing in darkness", category: "Animal-benefiting" },
  // ---- Human-benefiting ----
  { id: "H01", text: "Helping with travel", category: "Human-benefiting" },
  { id: "H02", text: "Pulling carts", category: "Human-benefiting" },
  { id: "H03", text: "Making milk", category: "Human-benefiting" },
  { id: "H04", text: "Making honey", category: "Human-benefiting" },
  { id: "H05", text: "Carrying things", category: "Human-benefiting" },
  { id: "H06", text: "Sending messages", category: "Human-benefiting" },
  { id: "H07", text: "Helping make clothes", category: "Human-benefiting" },
  { id: "H08", text: "Producing medicine", category: "Human-benefiting" },
  { id: "H09", text: "Laying eggs", category: "Human-benefiting" },
  { id: "H10", text: "Making beautiful music", category: "Human-benefiting" }
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
