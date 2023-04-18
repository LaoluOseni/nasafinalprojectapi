//using a map object for collection of launches
const launches = new Map();

let latestFlightNumber = 003

const launch = {
    flightNumber: 001,
    mission: 'Interstallar Mach IV',
    rocket: 'Space Mobile 229',
    launchDate: new Date('December 27, 2030'),
    target: 'Keplar 442 b',
    customers: ['China', 'Nigeria'],
    upcoming: true,
    status: 'upcoming',
}
const launchTwo = {
    flightNumber: 002,
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


function allLaunches() {
    return Array.from(launches.values()).sort((a, b) => {
        return a.flightNumber - b.flightNumber;
    });
}

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

function abortLaunchById(launchId) {
    //you do not completely delete just mark as aborted. the data is still useful

    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    launches,
    allLaunches,
    addNewLaunch,
    doesLaunchExist,
    abortLaunchById,
}