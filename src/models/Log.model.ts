import mongoose from 'mongoose'
import * as mongoConfig from '../config/mongo.config'
const prodDB = mongoose.createConnection(mongoConfig.CRUD_URL);

let LogsSchema = new mongoose.Schema({
    time: { type: String, required: false, max: 100 },
    name: { type: String, required: false, max: 100 },
    action: { type: String, required: false, max: 500 },
    field: { type: String, required: false, max: 100 },
});

LogsSchema.statics.createLog = function (name: string, action: string, field: string): void {
    let date = new Date();
    let loggedTime = {
       date: ("0" + date.getDate()).slice(-2),
       month: ("0" + (date.getMonth() + 1)).slice(-2),
       year: date.getFullYear(),
       hours: date.getHours(),
       minutes: date.getMinutes(),
       seconds: date.getSeconds()
    }
    let options =    {
        time: loggedTime.year + "-" + loggedTime.month + "-" + loggedTime.date + " " + loggedTime.hours + ":" + loggedTime.minutes + ":" + loggedTime.seconds,
        name: name,
        action: action,
        field: field
    }
    let newLog = mongoose.Model.create.call(this.model('Logs'), options);
    newLog.save((err) => {
        if (err) throw new Error(err);
    });
}

// Export the model
export default prodDB.model('Logs', LogsSchema);
