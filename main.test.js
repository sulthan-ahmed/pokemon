'use strict';

const pokemon = require('./main');
const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;

chai.use(chaiAsPromised);

// I would usually use proxyquire to stub out the response for the api but
// it's not available for this test. You don't really want to be calling real
// apis for unit tests so I had to increase the timeout
describe('Pokemon evolution chain', () => {
  it("test butterfree returns the right evolution variations", async () => {
    const expected = {
      "name": "caterpie",
      "variations": [
        {
          "name": "metapod",
          "variations": [
            {
              "name": "butterfree",
              "variations": []
            }
          ]
        }
      ]
    };

    const jsonExpected = JSON.stringify(expected, undefined, 2);
    const actual = await pokemon.run('butterfree');
    await assert.equal(actual, jsonExpected);
  }).timeout(5000);

  it("error status code is shown when an empty argument is provided", async () => {
    const result = pokemon.run('');
    const error = 'Status code: 404 with error message Not Found';

    return expect(result).to.be.rejectedWith(error);
  });

  it("error status code is shown when we provide fake pokemon", async () => {
    const result = pokemon.run('superman');
    const error = 'Status code: 404 with error message Not Found';

    return expect(result).to.be.rejectedWith(error);
  });
});
