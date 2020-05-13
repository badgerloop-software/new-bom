require('dotenv').config();
const BOM = process.env.BOMDB;
const CRUD = process.env.CRUDDB;
module.exports = {
  bomURL : 'mongodb://localhost:27017/' + BOM,
  crudURL: 'mongodb://localhost:27017/' + CRUD
}
