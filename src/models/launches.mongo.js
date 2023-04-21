//file to create a schema for the data shape of launches
const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String,
    },
    upcoming: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    customers: {
        type: [ String ],
    },

});

//compiling the model to a collection.
module.exports = mongoose.model('Launch', launchesSchema);

