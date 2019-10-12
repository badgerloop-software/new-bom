const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const prodDB = mongoose.createConnection(mongoConfig.prodURL);

let LogsSchema = new mongoose.Schema({
    time: { type: String, required: false, max: 100 },
    name: { type: String, required: false, max: 100 },
    action: { type: String, required: false, max: 500 },
    field: { type: String, required: false, max: 100 },
});

// Export the model
module.exports = prodDB.model('Logs', LogsSchema);
