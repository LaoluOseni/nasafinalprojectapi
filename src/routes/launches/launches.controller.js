const { 
    allLaunches,
    addNewLaunch,
    doesLaunchExist,
    abortLaunchById, 
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
            error: 'nissing required launch property',
        });
    }

    newLaunch.launchDate = new Date(newLaunch.launchDate)
    if(isNaN(newLaunch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid Date'
        })
    }

    addNewLaunch(newLaunch);
    return res.status(201).json(newLaunch);
}

function httpAbortLaunch(req, res) {
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