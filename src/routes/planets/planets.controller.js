const planets = require('../../models/planets.model');


function getAllPlanets(req, res) {
    return res.status(200).json(planets);
}


module.exports = {
    getAllPlanets,
}






/*
tried to acces data from csv file stream and failed.
revisit after completion.

const path = require('path');

const folderAbove = path.dirname(path.dirname(__dirname));

const planetData = path.join(folderAbove, 'data');
console.log(planetData);

async () => {
    planets = await require(`${planetData}/planets.js`);
    console.log(planets);
}
*/