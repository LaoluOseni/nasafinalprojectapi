//import mongoose model for launches
const launchesMongo = require('./launches.mongo');
const planets = require('./planets.mongo')

const axios = require('axios');

//using a map object for collection of launches. Early stages
const launches = new Map();



//let latestFlightNumber = 3
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 1,
    mission: 'Interstallar Mach IV',
    rocket: 'Space Mobile 229',
    launchDate: new Date('December 27, 2030'),
    target: 'Keplar 442 b',
    customers: ['China', 'Nigeria'],
    upcoming: true,
    status: 'upcoming',
}
const launchTwo = {
    flightNumber: 2,
    mission: 'Roverton Spenning 11',
    rocket: 'Megas XLRH',
    launchDate: new Date('March 6, 2035'),
    target: 'Keplar-62 f',
    customers: ['Kenya', 'Uganda'],
    upcoming: true,
    status: 'upcoming',
}
launches.set(launchTwo.flightNumber, launchTwo);
launches.set(launch.flightNumber, launch);

//change this to get launches from mongodb and use pagination(skip and limit);
function allLaunches() {
    return Array.from(launches.values()).sort((a, b) => {
        return a.flightNumber - b.flightNumber;
    });
}


//schedule new Launch in database
async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Nigeria', 'Canada'],
        flightNumber: newFlightNumber,
    });
    
    await saveLaunch(newLaunch);
}


//save a new launch to database.
async function saveLaunch(launch) {
    const planet = await planets.findOne({
        kepler_name: launch.target,
    })
    
    if(!planet) {
        throw new Error('no matching planet found');
    }
    await launchesMongo.findOneAndUpdate( {
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesMongo.findOne()
    .sort('-flightNumber');

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}


//Abort Launch in MongoDb functions
async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId,
    })
}


//other functions. basic functionality.
function addNewLaunch(newLaunch) {
    latestFlightNumber ++;
    launches.set(latestFlightNumber, Object.assign(newLaunch, {
        flightNumber: latestFlightNumber,
        customers: ['Nigeria', 'Canada'],
        upcoming: true,
        status: 'upcoming',
    }));
}

function doesLaunchExist(launchId) {
    return launches.has(launchId);
}

//new mongo abortLaunch
async function abortLaunchById(launchId) {
    const aborted = await launchesMongo.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        status: 'aborted',
    })

    return aborted.modifiedCount === 1;
    
    
    //you do not completely delete just mark as aborted. the data is still useful
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}

//functions to interact with SpaceX API/ using axios for http tequests
const SPACEX_URL = 'https://api.spacexdata.com/v5/launches/query';

//query the api for a rocket object
async function loadSpaceXData() {
    console.log('downloading data');
    const response = await axios.post(SPACEX_URL, {
        query: {},
        options: {
            page: 1,
            limit: 15,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1,
                    }
                }
            ]
        }
    } )
    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        }) // turn all the customers into one list
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);
    }
    
};



module.exports = {
    launches,
    allLaunches,
    addNewLaunch,
    doesLaunchExist,
    abortLaunchById,
    scheduleNewLaunch,
    existsLaunchWithId,
    loadSpaceXData,
}