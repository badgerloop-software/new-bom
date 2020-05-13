const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const prodDB = mongoose.createConnection(mongoConfig.crudURL);

let NewsSchema = new mongoose.Schema({
    title: { type: String, required: false, max: 100 },
    imgName: { type: String, required: false, max: 100 },
    subHeading: { type: String, required: false, max: 500 },
    body: { type: String, required: false, max: 10000000 },
});

// Export the model
module.exports = prodDB.model('News', NewsSchema);
