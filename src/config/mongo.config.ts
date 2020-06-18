require('dotenv').config();
const BOM = process.env.BOMDB;
const CRUD = process.env.CRUDDB;

export const BOM_URL = 'mongodb://0.0.0.0:27017/' + BOM
export const CRUD_URL = 'mongodb://0.0.0.0:27017/' + CRUD
