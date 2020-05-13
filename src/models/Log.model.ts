import mongoose from 'mongoose'
import * as mongoConfig from '../config/mongo.config'
const prodDB = mongoose.createConnection(mongoConfig.CRUD_URL);

let LogsSchema = new mongoose.Schema({
    time: { type: String, required: false, max: 100 },
    name: { type: String, required: false, max: 100 },
    action: { type: String, required: false, max: 500 },
    field: { type: String, required: false, max: 100 },
});

// Export the model
export default prodDB.model('Logs', LogsSchema);
