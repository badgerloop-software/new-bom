import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const prodDB = mongoose.createConnection(mongoConfig.CRUD_URL);

let TeamleadsSchema = new mongoose.Schema({
    Team: { type: String, required: false, max: 100 },
    Position: { type: String, required: false, max: 100 },
    Name: { type: String, required: false, max: 100 },
    Major: { type: String, required: false, max: 100 },
    Year: { type: String, required: false, max: 100 },
    Picture: { type: String, required: false, max: 100 }
});

// Export the model
export default prodDB.model('Teamleads', TeamleadsSchema);