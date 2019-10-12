require('dotenv').config();
const BOM = process.env.BOMDB;
const CRUD = process.env.CRUDDB;
console.log(process.env);
module.exports = {
  bomURL : 'mongodb://localhost:27017/' + BOM,
  prodURL: 'mongodb://localhost:27017/' + CRUD
}
