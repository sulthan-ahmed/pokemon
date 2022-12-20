'use strict';

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
    const evolutionChainUrl = pokemonSpecies?.data?.evolution_chain?.url;

    if (!evolutionChainUrl) {
      throw new Error(`Unable to find evolution chain URL for pokemon, '${pokemonName}'`);
    }

    const evolutionDetail = await axios.get(evolutionChainUrl);
    const evolutionChain = evolutionDetail?.data?.chain;

    if (!evolutionChain) {
      throw new Error(`Unable to find evolution chain for pokemon, '${pokemonName}'`);
    }

    const map = recursion(evolutionChain);

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
