require('dotenv').config();
const BOM = process.env.BOMDB;
const CRUD = process.env.CRUDDB;

export const BASE_URL = 'mongodb://0.0.0.0:27017/'
export const BOM_URL = BASE_URL + BOM
export const CRUD_URL = BASE_URL + CRUD
