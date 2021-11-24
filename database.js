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

//////////////////////////////////////////////////////////// MENU ITEM TABLE

// Determine whether menu item table has been initialized
// If uninitialized then initialize table

let itemInfoExists = db.prepare(
  `SELECT name
  FROM sqlite_master
  WHERE type='table' and name='itemInfo';`
).get();

if ( itemInfoExists === undefined ) {

  console.log( 'Did not find table for menu item information, will create' );
  
  // Create table for cart information
  db.exec(
    `CREATE TABLE itemInfo (
      itemId INTEGER PRIMARY KEY,
      itemName TEXT UNIQUE, /* CHECK cannot be empty string */
      price REAL NOT NULL, /* CHECK must be greater than 0, have up to 2 decimal places */
      prepTime INTEGER NOT NULL, /* CHECK must be greater than 0 */ /* IN MINUTES */
      isVegetarian INTEGER NOT NULL /* CHECK must be either 0 or 1 */
    );`
  );

  // Records for all menu items
  db.exec(
    `INSERT INTO itemInfo ( itemName, price, prepTime, isVegetarian )
    VALUES
    ( 'ITEM 1.0', 1.00, 1, 0 ),
    ( 'ITEM 1.1', 1.00, 1, 1 );`
  );

  console.log( 'Created table for menu item information' );

} else {

  console.log( "There exists a table for menu item information" );

}

//////////////////////////////////////////////////////////// EXPORT

// Export all of the above as a module so that we can use it elsewhere
module.exports = db;
