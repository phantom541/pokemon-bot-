module.exports = {
  ELEMENTS: {
    fire: { strong: ["ice", "air"], weak: ["water"] },
    water: { strong: ["fire"], weak: ["storm", "earth"] },
    ice: { strong: ["storm"], weak: ["fire"] },
    storm: { strong: ["water", "earth"], weak: ["ice", "air"] },
    air: { strong: ["storm"], weak: ["fire", "earth"] },
    earth: { strong: ["storm", "air"], weak: ["ice"] },
    smoke: { strong: ["spirit"], weak: ["storm"] },
    spirit: { strong: ["smoke"], weak: ["fire"] },
  },
  STARTER_DRAGON: {
    name: "Starter Dragon",
    attack: 50,
    defense: 20,
    hp: 200,
    element: "fire",
    linkedEye: null,
    eye: null
  }
}
