const express = require('express');
const {
    getAllLaunches,
    httpAddLaunch,
    httpAbortLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllLaunches);
launchesRouter.post('/launches', httpAddLaunch);
launchesRouter.delete('/launches/:id', httpAbortLaunch)


module.exports = launchesRouter;