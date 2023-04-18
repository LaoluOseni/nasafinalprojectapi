const { parse } = require('csv-parse');
const fs = require('fs'); //used to send stream to the parse function above
const { resolve } = require('path');

const habitablePlanets= [];
//function to find habitable planets
function isHabitablePlanet(planet) {
    return planet.koi_disposition === "CONFIRMED"
    && planet.koi_insol > 0.36 && planet.koi_insol < 1.11
    && planet.koi_prad < 1.6;
}

//creates a stream of data from the csv file.
function loadPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream('../server/data/kepler_data.csv')
    .pipe(parse({
        comment: '#',
        columns: true,
    }))
    .on('data', (data) => {
        if (isHabitablePlanet(data)){
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log(err);
        reject(err);
    })
    .on('end', () => {
        //console.log(results);
        //to map planet name
        /* console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name']
        })) */
        //console.log(`${habitablePlanets.length} planets are habitable`)
        console.log('done');
        resolve();
    });    
    
    });
}

//parsed as a row or object.
//readable stream providing data to a writable stream. parse is the writable stream.


//export array of habitable planets
module.exports = {
    loadPlanets,
    planets: habitablePlanets,
}

//how do you make results update with objects and use it.
//arrays and edits on arrays
//console.log(results);
/* 
const habitable = [];

for (planet in results) {
    if(isHabitablePlanet(planet)) {
        habitable.push(planet);
    }
    //console.log(habitable);
}

//console.log(habitable);
*/
