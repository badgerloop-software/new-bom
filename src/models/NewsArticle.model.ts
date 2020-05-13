import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const prodDB = mongoose.createConnection(mongoConfig.CRUD_URL);

let NewsSchema = new mongoose.Schema({
    title: { type: String, required: false, max: 100 },
    imgName: { type: String, required: false, max: 100 },
    subHeading: { type: String, required: false, max: 500 },
    body: { type: String, required: false, max: 10000000 },
});

// Export the model
export default prodDB.model('News', NewsSchema);
