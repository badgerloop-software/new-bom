require('dotenv').config();
const BOM = process.env.BOMDB;
const CRUD = process.env.CRUDDB;

export const BOM_URL = 'mongodb://localhost:27017/' + BOM
export const CRUD_URL = 'mongodb://localhost:27017/' + CRUD
