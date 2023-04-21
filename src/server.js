const http = require('http');

require('dotenv').config();

const app = require('./app');

//import mongo functions
const { mongoConnect } = require('./services/mongo');

const { loadPlanets } = require('./models/planets.model');
const { loadSpaceXData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000; // defaults to 8000 because frontend runs on 3000

//Mongo db database URL for atlas server
//const MONGO_URL = 'mongodb+srv://nasaprojectapi:<password>@cluster0.dqmqnni.mongodb.net/?retryWrites=true&w=majority;'

const server = http.createServer(app);



async function startServer() {
    await mongoConnect();
    await loadPlanets();
    await loadSpaceXData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();

