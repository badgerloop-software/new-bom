const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const prodDB = mongoose.createConnection(mongoConfig.prodURL);

let CriticalPathSchema = new mongoose.Schema({
    title: { type: String, required: false, max: 100 },
    description: { type: String, required: false, max: 500 },
    assignee: { type: String, required: false, max: 100 },
    due: { type: Date, required: false },
});

// Export the model
module.exports = prodDB.model('criticalPaths', CriticalPathSchema);
