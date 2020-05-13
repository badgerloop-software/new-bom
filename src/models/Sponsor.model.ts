import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const prodDB = mongoose.createConnection(mongoConfig.CRUD_URL);

let SponsorsSchema = new mongoose.Schema({
    tier: { type: String, required: false, max: 100 },
    website: { type: String, required: false, max: 100 },
    company: { type: String, required: false, max: 500 },
    logo: { type: String, required: false, max: 100 },
});

// Export the model
export default prodDB.model('Sponsors', SponsorsSchema);
