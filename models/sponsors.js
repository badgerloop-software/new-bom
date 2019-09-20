const mongoose = require('mongoose');
const mongoConfig = require('../config/mongo')
const prodDB = mongoose.createConnection(mongoConfig.prodDB);

let SponsorsSchema = new prodDB({
    tier: { type: String, required: false, max: 100 },
    website: { type: String, required: false, max: 100 },
    company: { type: String, required: false, max: 500 },
    logo: { type: String, required: false, max: 100 },
});


// Export the model
module.exports = mongoose.model('Sponsors', SponsorsSchema);