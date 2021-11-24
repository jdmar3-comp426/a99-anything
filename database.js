//////////////////////////////////////////////////////////// SETUP

// Enable strict mode
// Ensures that things will not fail silently and that errors will be thrown
"use strict";

// Require better-sqlite3
const Database = require( 'better-sqlite3' );

// Connect to database
// If nonexistent then create database
const db = new Database( 'data.db' );

//////////////////////////////////////////////////////////// USER TABLE

// Determine whether user table has been initialized
// If uninitialized then initialize table

let userInfoExists = db.prepare(
  `SELECT name
  FROM sqlite_master
  WHERE type='table' and name='userInfo';`
).get();

if ( userInfoExists === undefined ) {

  console.log( 'Did not find table for user information, will create' );
  
  // Create table for user information
  db.exec(
    `CREATE TABLE userInfo (
      userId INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE, /* CHECK cannot be empty string */
      pass TEXT NOT NULL /* CHECK cannot be empty string */
    );`
  );

  console.log( 'Created table for user information, table currently empty' );

} else {

  console.log( 'There exists a table for user information' );

}

//////////////////////////////////////////////////////////// EXPORT

// Export all of the above as a module so that we can use it elsewhere
module.exports = db;
