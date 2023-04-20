const { 
    allLaunches,
    addNewLaunch,
    doesLaunchExist,
    abortLaunchById,
    scheduleNewLaunch, 
    existsLaunchWithId,
} = require('../../models/launches.model');

function getAllLaunches(req, res) {
    //get launch value from launches map containing launches
    //console.log(launches.values());
    return res.status(200).json(allLaunches());

}

function httpAddLaunch(req, res) {
    const newLaunch = req.body
    if(!newLaunch.launchDate || !newLaunch.mission || !newLaunch.target || !newLaunch.rocket) {
        return res.status(400).json({
            error: 'missing required launch property',
        });
    }

    newLaunch.launchDate = new Date(newLaunch.launchDate)
    if(isNaN(newLaunch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid Date'
        })
    }

    scheduleNewLaunch(newLaunch);
    return res.status(201).json(newLaunch);
}

//New MongoDb function
async function httpAbortLaunch(req, res) {
    const launchId = +req.params.id;

    const existsLaunch = await existsLaunchWithId(launchId)
    if(!existsLaunch(launchId)) {
        return res.status(404).json({
            error: 'Launch not found',
        })
    }

    const aborted = await abortLaunchById(launchId);
    if(!aborted) {
        return res.status(400).json({
            error: 'launch not aborted',
        })
    }
    return res.status(200).json({
        ok: true,
    });

}

//earlier function before Mongo Implementation
function oldhttpAbortLaunch(req, res) {
    const launchId = +req.params.id;

    if(!doesLaunchExist(launchId)) {
        return res.status(404).json({
            error: 'Launch not found',
        })
    }

    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);

}

module.exports = {
    getAllLaunches,
    httpAddLaunch,
    httpAbortLaunch,
}