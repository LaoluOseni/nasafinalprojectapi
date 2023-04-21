//file to handle all mongodb connections
const mongoose = require('mongoose');

//MongoDb URL for server on local machine for development
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('connected');
})

mongoose.connection.on('error', (err) => {
    console.error(err);
})

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        //useFindAndModify: false,
        //useCreateIndex: true,
        //useUnifiedTopology: true,
   })
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}