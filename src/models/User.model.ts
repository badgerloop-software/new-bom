import mongoose from 'mongoose';
import * as mongoConfig from '../config/mongo.config'
const bomDB = mongoose.createConnection(mongoConfig.BOM_URL);

let userSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    slackID: String,
    picture: String,
    isAdmin: { type: Boolean, default: false },
    isFSC: { type: Boolean, default: false },
    isTeamLead: { type: Boolean, default: false }
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    }
  }
);

export interface IUserSchema extends mongoose.Document {
  name: string;
  displayName: string;
  slackID: string;
  picture: string;
  isAdmin: boolean;
  isFSC: boolean;
  isTeamLead: boolean; 
  setFSC: Function;
  setAdmin: Function;
}

declare global {
  namespace Express {
      interface User extends IUserSchema {}
  }
}

userSchema.methods.setFSC = function(status: boolean): void {
  this.isFSC = status;
  this.save();
}

userSchema.methods.toggleFSC = function(): void {
  this.isFSC = !this.isFSC;
  this.save();
}

userSchema.methods.setAdmin = function(status: boolean): void {
  this.isAdmin = status;
  this.save();
}

userSchema.methods.toggleAdmin = function(): void {
  this.isAdmin = !this.isAdmin;
  this.save();
}

userSchema.methods.setTeamLead = function(status: boolean): void {
  this.isTeamLead = status;
  this.save();
}

userSchema.methods.toggleTeamLead = function(): void {
  this.isTeamLead = !this.isTeamLead;
  this.save();
}

userSchema.statics.findBySlackID = function(slackID: string): IUserSchema {
  return this.findOne({slackID: slackID});
}

userSchema.statics.getAllUsers = function(): any[] {
  return this.find({});
}
export const Users = bomDB.model('User', userSchema);
