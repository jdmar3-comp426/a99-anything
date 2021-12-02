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
      username TEXT NOT NULL UNIQUE, /* Implement client-side check for empty field */
      pass TEXT NOT NULL /* Implement client-side check for empty field */
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
  
  // Create table for menu item information
  db.exec(
    `CREATE TABLE itemInfo (
      itemId INTEGER PRIMARY KEY,
      itemName TEXT NOT NULL UNIQUE CHECK ( itemName != '' ),
      price REAL NOT NULL CHECK ( price > 0 ),
      prepTime INTEGER NOT NULL CHECK ( prepTime > 0 ), /* prepTime is in minutes */
      isVegetarian INTEGER NOT NULL CHECK ( ( isVegetarian == 0 ) OR ( isVegetarian == 1 ) )
    );`
  );

  // Records for all menu items
  db.exec(
    `INSERT INTO itemInfo ( itemName, price, prepTime, isVegetarian )
    VALUES
    ( 'Almond milk', 1.00, 1, 1 ),
    ( 'Apple', 1.00, 1, 1 ),
    ( 'Apple pie', 1.00, 1, 0 ),
    ( 'Avocado', 1.00, 1, 1 ),
    ( 'Bagel', 1.00, 1, 0 ),
    ( 'Blueberry', 1.00, 1, 1 ),
    ( 'Blueberry pie', 1.00, 1, 0 ),
    ( 'Cheese', 1.00, 1, 0 ),
    ( 'Cheesecake', 1.00, 1, 0 ),
    ( 'Chicken pot pie', 1.00, 1, 0 ),
    ( 'Chocolate', 1.00, 1, 1 ),
    ( 'Chocolate milk', 1.00, 1, 0 );`
  );

  console.log( 'Created table for menu item information' );

} else {

  console.log( 'There exists a table for menu item information' );

}

console.log( db.prepare( 'SELECT * FROM itemInfo' ).all() );

//////////////////////////////////////////////////////////// CART TABLE

// Determine whether cart table has been initialized
// If uninitialized then initialize table

let cartInfoExists = db.prepare(
  `SELECT name
  FROM sqlite_master
  WHERE type='table' and name='cartInfo';`
).get();

if ( cartInfoExists === undefined ) {

  console.log( 'Did not find table for cart information, will create' );
  
  // Create table for cart information
  db.exec(
    `CREATE TABLE cartInfo (
      userId NOT NULL REFERENCES userInfo( userId ),
      itemId NOT NULL REFERENCES itemInfo( itemId ),
      quantity INTEGER NOT NULL CHECK ( quantity > 0 )
    );`
  );

  console.log( 'Created table for cart information, table currently empty' );

} else {

  console.log( 'There exists a table for cart information' );

}

//////////////////////////////////////////////////////////// ORDER TABLE

// Determine whether order table has been initialized
// If uninitialized then initialize table

let orderInfoExists = db.prepare(
  `SELECT name
  FROM sqlite_master
  WHERE type='table' and name='orderInfo';`
).get();

if ( orderInfoExists === undefined ) {

  console.log( 'Did not find table for order information, will create' );
  
  // Create table for order information
  db.exec(
    `CREATE TABLE orderInfo (
      orderId INTEGER PRIMARY KEY,
      userId NOT NULL REFERENCES userInfo( userId ),
      itemId NOT NULL REFERENCES itemInfo( itemId ),
      quantity INTEGER NOT NULL CHECK ( quantity > 0 ),
      timePlaced DEFAULT CURRENT_TIMESTAMP
    );`
  );

  console.log( 'Created table for order information, table currently empty' );

} else {

  console.log( 'There exists a table for order information' );

}

//////////////////////////////////////////////////////////// EXPORT

// Export all of the above as a module so that we can use it elsewhere
module.exports = db;
