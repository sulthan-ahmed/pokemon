const axios = require('axios');

const recursion = (evolvesToJson) => {
  if (evolvesToJson.evolves_to.length < 1) {
    return {
      name: evolvesToJson.species.name,
      variations: []
    };
  }
  const evolutions = [];

  // This is also covers a potential situation where there are
  // multiple evolution chains
  for(let i=0; i < evolvesToJson.evolves_to.length; i++) {
    evolutions.push(recursion(evolvesToJson.evolves_to[i]));
  }

  return {
    name: evolvesToJson.species.name,
    variations: evolutions
  };
};

const run = async (pokemonName) => {
  try {
    const pokemonSpecies = await axios.get(`https://challenges.hackajob.co/pokeapi/api/v2/pokemon-species/${pokemonName}/`);
    evolutionChainUrl = pokemonSpecies.data.evolution_chain.url;
    const evolutionDetail = await axios.get(evolutionChainUrl);
    const EvolutionDetailJson = await evolutionDetail.data.chain;

    const map = recursion(EvolutionDetailJson);

    return JSON.stringify(map, undefined, 2);
  } catch (err) {
      // Tidy up error if we can
      if (err?.response?.status) {
        throw new Error(`Status code: ${err.response.status} with error message ${err.response.statusText}`);
      } else {
        throw err;
      }
  }
};

exports.run = run;
