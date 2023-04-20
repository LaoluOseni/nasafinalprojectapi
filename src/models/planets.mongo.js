//file to create a schema for the data shape of planets
const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    kepler_name: {
        type: String,
        required: true,
        //might change property name
    }
})

module.exports = mongoose.model('Planet', planetSchema);