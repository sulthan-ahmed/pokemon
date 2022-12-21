'use strict';

const axios = require('axios');

const transform = (chain) => ({
  name: chain?.species?.name,
  variations: chain?.evolves_to?.map(transform)
});

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
