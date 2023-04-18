const http = require('http');

const app = require('./app');

const { loadPlanets } = require('./models/planets.model');

const PORT = process.env.PORT || 8000; // defaults to 8000 because frontend runs on 3000

const server = http.createServer(app);

async function startServer() {
    await loadPlanets();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();

