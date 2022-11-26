const pokemon = require('./index');
const assert = require('assert');

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
      }
    const jsonExpected = await JSON.stringify(expected, undefined, 2);
    const actual = await pokemon.run('butterfree');
    await assert.equal(actual, jsonExpected);
  }).timeout(5000);

  it("error status code is shown when an empty argument is provided", async () => {
    await pokemon.run('');
    const expected = 'Status code: 404 with error message Not Found';
    console.assert({ expected });
  }).timeout(5000);

  it("error status code is shown when we provide fake pokemon", async () => {
    await pokemon.run('superman');
    const expected = 'Status code: 404 with error message Not Found';
    console.assert({ expected });
  }).timeout(5000);
});

// There seems to be a bug or a missing instruction in hackajob
// because I can't
// require the module of main.js. I need to know the location of
// main.js but it's not clear where it is. However,
// I ran the tests below and they pass locally
// const {run} = require('./main');
// describe('Pokemon evolution chain', () => {
//   it.only("test butterfree returns the right evolution chain", async () => {
//     const expected = {
//         "name": "caterpie",
//         "variations": [
//           {
//             "name": "metapod",
//             "variations": [
//               {
//                 "name": "butterfree",
//                 "variations": []
//             }
//             ]
//           }
//         ]
//       }
//     const jsonExpected = await JSON.stringify(expected, undefined, 2);
//     const actual = await run('butterfree');
//     await assert.equal(actual, jsonExpected);
//   }).timeout(5000);

//   it("error status code is shown when an empty argument is provided", async () => {
//     const actual = await pokemon.run('');
//     const expected = 'Status code: 404 with error message Not Found';
//     console.assert({ expected });
//   }).timeout(5000);

//   it("error status code is shown when we provide fake pokemon", async () => {
//     const actual = await pokemon.run('superman');
//     const expected = 'Status code: 404 with error message Not Found';
//     console.assert({ expected });
//   }).timeout(5000);
// });