// MATERIALS for the Animal Choice Study (edit this file to swap in real items)
//
// 5 creatures x 2 features:
//   ecoFeature  = a feature that benefits the ecosystem / other living things
//   selfFeature = a feature that benefits the animal itself
//
// All feature text is PLACEHOLDER until the real items are finalized.
// Each feature's text appears in two places, so it must read naturally in both:
//      "This is a Zorp. Zorps {introText or text} and {introText or text}."   (meeting screen)
//      the answer button reads "for {text}"                                   (question screen)
// If one place can't do both (e.g. "building dams" vs "build dams"), give the feature an
// introText in addition to text; the meeting screen uses introText when it exists.

const CREATURES = [
    {id: "C1", name: "Zorp", image: "assets/animals/zorp.svg",
        ecoFeature:  {id: "C1_eco",  text: "[PLACEHOLDER ecological 1]"},
        selfFeature: {id: "C1_self", text: "[PLACEHOLDER self-benefiting 1]"}},
    {id: "C2", name: "Dax", image: "assets/animals/dax.svg",
        ecoFeature:  {id: "C2_eco",  text: "[PLACEHOLDER ecological 2]"},
        selfFeature: {id: "C2_self", text: "[PLACEHOLDER self-benefiting 2]"}},
    {id: "C3", name: "Wug", image: "assets/animals/wug.svg",
        ecoFeature:  {id: "C3_eco",  text: "[PLACEHOLDER ecological 3]"},
        selfFeature: {id: "C3_self", text: "[PLACEHOLDER self-benefiting 3]"}},
    {id: "C4", name: "Blicket", image: "assets/animals/blicket.svg",
        ecoFeature:  {id: "C4_eco",  text: "[PLACEHOLDER ecological 4]"},
        selfFeature: {id: "C4_self", text: "[PLACEHOLDER self-benefiting 4]"}},
    {id: "C5", name: "Fep", image: "assets/animals/fep.svg",
        ecoFeature:  {id: "C5_eco",  text: "[PLACEHOLDER ecological 5]"},
        selfFeature: {id: "C5_self", text: "[PLACEHOLDER self-benefiting 5]"}},
];

// Practice items (pick the right label for the picture)
const PRACTICE_ITEMS = [
    {id: "bird", image: "assets/animals/bird.svg", right: "A bird", wrong: "A cat"},
    {id: "dog",  image: "assets/animals/dog.svg",  right: "A dog",  wrong: "A fish"},
];