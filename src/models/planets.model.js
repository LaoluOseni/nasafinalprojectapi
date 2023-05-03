const { parse } = require('csv-parse');
const fs = require('fs'); //used to send stream to the parse function above
const { resolve } = require('path');

const planets = require('./planets.mongo')

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
    .on('data', async (data) => {
        if (isHabitablePlanet(data)){
            habitablePlanets.push(data);
            //create mongodb document
            //insert + update = upsert
           savePlanet(data); 
        }
    })
    .on('error', (err) => {
        console.log(err);
        reject(err);
    })
    .on('end', async () => {
        //console.log(results);
        //to map planet name
        /* console.log(habitablePlanets.map((planet) => {
            return planet['kepler_name']
        })) */
        //console.log(`${habitablePlanets.length} planets are habitable`)
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found`);
        console.log('done');
        resolve();
    });    
    
    });
}

//parsed as a row or object.
//readable stream providing data to a writable stream. parse is the writable stream.

//create a getPlanets function for mongodB
async function getPlanets() {
    console.log('here now');
    return await planets.find({}, {
        '_id': 0, '__v': 0,
    });  
};

//save planet to mongo
async function savePlanet(data) {
    try {
        await planets.updateOne({
            kepler_name: data.kepler_name,
        }, {
            kepler_name: data.kepler_name,
        },
        {
            upsert: true,
        })
    } catch(err) {
        console.error(`could not save planets ${err}`)
    }
}

//export array of habitable planets
module.exports = {
    loadPlanets,
    //planets: habitablePlanets,
    getPlanets,
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
