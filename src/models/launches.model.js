//using a map object for collection of launches
const launches = new Map();

const launch = {
    flightNumber: 001,
    mission: 'Interstallar Mach IV',
    rocket: 'Space Mobile 229',
    launchDate: new Date('December 27, 2030'),
    target: 'Keplar 442 b',
    customer: ['China', 'Nigeria'],
    upcoming: true,
    status: 'upcoming',
}

launches.set(launch.flightNumber, launch);

module.exports = {
    launches,
}