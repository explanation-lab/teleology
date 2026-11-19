// Each animal shows one property from each of the four normed categories.
// text is the phrase from adult norming, lowercased for the question.
// introText is the same phrase inflected to describe what the animals do or have.
// normingItemId links the child trial back to the original adult item.

const ANIMALS = [
    {id: "A1", name: "Zorp", image: "assets/animals/zorp.svg",
        properties: [
            {id: "B1", category: "behavioral", normingItemId: "B06", text: "flying in circles", introText: "fly in circles"},
            {id: "E1", category: "ecological", normingItemId: "E08", text: "helping flowers grow", introText: "help flowers grow"},
            {id: "N1", category: "self_benefit", normingItemId: "A06", text: "having spikes", introText: "have spikes"},
            {id: "H1", category: "human_benefit", normingItemId: "H07", text: "helping make clothes", introText: "help make clothes"},
        ]
    },
    {id: "A2", name: "Dax", image: "assets/animals/dax.svg",
        properties: [
            {id: "B2", category: "behavioral", normingItemId: "B10", text: "swimming in circles", introText: "swim in circles"},
            {id: "E2", category: "ecological", normingItemId: "E01", text: "cleaning air", introText: "clean air"},
            {id: "N2", category: "self_benefit", normingItemId: "A08", text: "having a shell", introText: "have a shell"},
            {id: "H2", category: "human_benefit", normingItemId: "H08", text: "producing medicine", introText: "produce medicine"},
        ]
    },
    {id: "A3", name: "Wug", image: "assets/animals/wug.svg",
        properties: [
            {id: "B3", category: "behavioral", normingItemId: "B02", text: "buzzing around", introText: "buzz around"},
            {id: "E3", category: "ecological", normingItemId: "E05", text: "planting seeds", introText: "plant seeds"},
            {id: "N3", category: "self_benefit", normingItemId: "A07", text: "having thick fur", introText: "have thick fur"},
            {id: "H3", category: "human_benefit", normingItemId: "H01", text: "helping with travel", introText: "help with travel"},
        ]
    },
    {id: "A4", name: "Blicket", image: "assets/animals/blicket.svg",
        properties: [
            {id: "B4", category: "behavioral", normingItemId: "B05", text: "jumping over rocks", introText: "jump over rocks"},
            {id: "E4", category: "ecological", normingItemId: "E06", text: "cleaning dirty water", introText: "clean dirty water"},
            {id: "N4", category: "self_benefit", normingItemId: "A02", text: "being poisonous", introText: "are poisonous"},
            {id: "H4", category: "human_benefit", normingItemId: "H02", text: "pulling carts", introText: "pull carts"},
        ]
    },
    {id: "A5", name: "Fep", image: "assets/animals/fep.svg",
        properties: [
            {id: "B5", category: "behavioral", normingItemId: "B08", text: "diving into water", introText: "dive into water"},
            {id: "E5", category: "ecological", normingItemId: "E07", text: "cleaning up waste", introText: "clean up waste"},
            {id: "N5", category: "self_benefit", normingItemId: "A10", text: "seeing in darkness", introText: "see in darkness"},
            {id: "H5", category: "human_benefit", normingItemId: "E02", text: "preventing sickness", introText: "prevent sickness"},
        ]
    },
];
