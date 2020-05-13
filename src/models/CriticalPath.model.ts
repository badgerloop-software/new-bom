import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const prodDB = mongoose.createConnection(mongoConfig.CRUD_URL);

let CriticalPathSchema = new mongoose.Schema({
    title: { type: String, required: false, max: 100 },
    description: { type: String, required: false, max: 500 },
    assignee: { type: String, required: false, max: 100 },
    due: { type: Date, required: false },
    channels: { type: String, required: false }
});

// Export the model
export default prodDB.model('criticalpaths', CriticalPathSchema);
