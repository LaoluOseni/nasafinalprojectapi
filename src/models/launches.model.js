//import mongoose model for launches
const launchesMongo = require('./launches.mongo');
const planets = require('./planets.mongo')

const axios = require('axios');

//using a map object for collection of launches. Early stages
const launches = new Map();



//let latestFlightNumber = 3
const DEFAULT_FLIGHT_NUMBER = 100;

//functions to interact with SpaceX API/ using axios for http tequests
const SPACEX_URL = 'https://api.spacexdata.com/v5/launches/query';

const oldLaunch = {
    flightNumber: 1,
    mission: 'Interstallar Mach IV',
    rocket: 'Space Mobile 229',
    launchDate: new Date('December 27, 2030'),
    target: 'Keplar 442 b',
    customers: ['China', 'Nigeria'],
    upcoming: true,
    status: 'upcoming',
}
const oldLaunchTwo = {
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

//v2 of above
async function allLaunches2() {
    console.log('Fetching Launches');
    const response = await axios.post(SPACEX_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path:'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log('Problem fetching data');
        throw new Error('data download failed!');
    }

    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs) {
        const payloads = launch['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

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

        await saveLaunch(launch);
    }
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



    return aborted.modifiedCount === 1;
    
    
    //you do not completely delete just mark as aborted. the data is still useful
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;




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



async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if (firstlaunch) {
        console.log('launch data previously loaded!');
    } else {
        await populateLaunches();
    }
}


async function findLaunch(filter) {
    return await launchesMongo.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId,
    })
}


// latest flight number
async function getLatestFlightNumber() {
    const latestLaunch = await launchesMongo.findOne()
    .sort('-flightNumber');

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}


//gets all launches from database with skip and limit defined
async function allLaunches(skip, limit) {
    return await launchesMongo.
    find({}, { 'id': 0, '__v': 0 })
    .sort({ flightNumber: 1})
    .skip(skip)
    .limit(limit)
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


//schedule new Launch in database
async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (planet) {
        throw new Error ('No mathcing planet found');
    }

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Nigeria', 'Canada'],
        flightNumber: newFlightNumber,
    });
    
    await saveLaunch(newLaunch);
}


//new mongo abortLaunch
async function abortLaunchById(launchId) {
    const aborted = await launchesMongo.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        status: 'aborted',
    })
}

module.exports = {
    allLaunches,
    existsLaunchWithId,
    loadLaunchData,
    scheduleNewLaunch,
    abortLaunchById,
}