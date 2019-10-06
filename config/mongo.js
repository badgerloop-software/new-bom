require('dotenv').config();
const BOM = process.env.bomDB;
const CRUD = process.env.crudDB;

module.exports = {
  bomURL : 'mongodb://localhost:27017/' + BOM,
  prodURL: 'mongodb://localhost:27017/' + CRUD
}
