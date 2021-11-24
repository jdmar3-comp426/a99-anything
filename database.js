////////////////////////////// SETUP

// Enable strict mode
// Ensures that things will not fail silently and that errors will be thrown
"use strict";

// Require better-sqlite3
const Database = require( 'better-sqlite3' );

// Connect to database
// If nonexistent then create database
const db = new Database( 'data.db' );

//////////////////////////////////////////////////////////// EXPORT

// Export all of the above as a module so that we can use it elsewhere
module.exports = db;