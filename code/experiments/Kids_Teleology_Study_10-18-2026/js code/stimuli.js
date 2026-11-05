// STIMULI (edit this file to swap in real items)

// 5 animals x 4 properties, one property per category.
// All property text is PLACEHOLDER until the adult norming study finishes. Replace each 'text' with the real item
//The categories are only used to select/organize materials and are saved in teh data. C
// Each propertys text appears in two sentences, so it must read naturally in both
//      "This is a Zorp. Zorps {intro text},..., and..." (intro screen)
//      "Is a zorp for {text}?"                             (question screen)
// if one phase can't do both (e.g., building dams vs build dams), give the proerty an introText in addition to 'text'; the introduciton uses introText when it is present




const CATEGORIES = ["behavioral", "ecological", "self_benefit", "human_benefit"];

const ANIMALS = [
    {id: "A1", name: "Zorp", image: "assets/animals/zorp.svg",
        properties: [
            {id: "B1", category: "behavioral", text: "[PLACEHOLDER behavioral 1]"},
            {id: "E1", category: "ecological", text: "[PLACEHOLDER ecological 1]"},
            {id: "N1", category: "self_benefit", text: "[PLACEHOLDER self-benefiting 1]"},
            {id: "H1", category: "human_benefit", text: "[PLACEHOLDER human-benefiting 1]"},
        ]
    },
    {id: "A2", name: "Dax", image: "assets/animals/dax.svg",
        properties: [
            {id: "B2", category: "behavioral", text: "[PLACEHOLDER behavioral 2]"},
            {id: "E2", category: "ecological", text: "[PLACEHOLDER ecological 2]"},
            {id: "N2", category: "self_benefit", text: "[PLACEHOLDER self-benefiting 2]"},
            {id: "H2", category: "human_benefit", text: "[PLACEHOLDER human-benefiting 2]"},
        ]
    },
    {id: "A3", name: "Wug", image: "assets/animals/wug.svg",
        properties: [
            {id: "B3", category: "behavioral", text: "[PLACEHOLDER behavioral 3]"},
            {id: "E3", category: "ecological", text: "[PLACEHOLDER ecological 3]"},
            {id: "N3", category: "self_benefit", text: "[PLACEHOLDER self-benefiting 3]"},
            {id: "H3", category: "human_benefit", text: "[PLACEHOLDER human-benefiting 3]"},
        ]
    },
    {id: "A4", name: "Blicket", image: "assets/animals/blicket.svg",
        properties: [
            {id: "B4", category: "behavioral", text: "[PLACEHOLDER behavioral 4]"},
            {id: "E4", category: "ecological", text: "[PLACEHOLDER ecological 4]"},
            {id: "N4", category: "self_benefit", text: "[PLACEHOLDER self-benefiting 4]"},
            {id: "H4", category: "human_benefit", text: "[PLACEHOLDER human-benefiting 4]"},
        ]
    },
    {id: "A5", name: "Fep", image: "assets/animals/fep.svg",
        properties: [
            {id: "B5", category: "behavioral", text: "[PLACEHOLDER behavioral 5]"},
            {id: "E5", category: "ecological", text: "[PLACEHOLDER ecological 5]"},
            {id: "N5", category: "self_benefit", text: "[PLACEHOLDER self-benefiting 5]"},
            {id: "H5", category: "human_benefit", text: "[PLACEHOLDER human-benefiting 5]"},
        ]
    },
];
