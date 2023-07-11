"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
require('dotenv').config();
const stringport = process.env.db_port;
const portval = +stringport;
exports.pool = new pg_1.Pool({
    user: process.env.db_username,
    password: process.env.db_password,
    host: process.env.db_host,
    port: portval,
    database: process.env.db_name,
});
