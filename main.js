'use strict';

const axios = require('axios');

const transform = (evolvesTo) => {
  if (evolvesTo.evolves_to.length < 1) {
    return {
      name: evolvesTo.species.name,
      variations: []
    };
  }
  const evolutions = [];

  // This is also covers a potential situation where there are
  // multiple evolution chains
  for(let i=0; i < evolvesTo.evolves_to.length; i++) {
    evolutions.push(transform(evolvesTo.evolves_to[i]));
  }

  return {
    name: evolvesTo.species.name,
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

    const map = transform(evolutionChain);

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
