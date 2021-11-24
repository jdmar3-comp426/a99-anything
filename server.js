//////////////////////////////////////////////////////////// SETUP

// Define app using express
const express = require("express");
const app = express();

// Require user database file
var db = require( "./database.js" );

// Require md5 module
var md5 = require( "md5" );

// Have Express use its built-in body parser
app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );

// Set server port
const port = 3000;

// Start server
app.listen( port, () => {
  console.log( `Server running on port ${port}` );
} );

// READ (HTTP method GET)
// At root endpoint /app/
app.get( "/app", ( req, res ) => {
  res.status(200).json( { "message": "API works"} );
} );

//////////////////////////////////////////////////////////// API FOR USERS

// CREATE new user (HTTP method POST)
// At endpoint /app/new/user/
app.post( "/app/new/user", ( req, res ) => {
  const stmt = db.prepare(
    `INSERT INTO userInfo ( username, pass )
    VALUES ( ?, ? );`
  );
  const info = stmt.run( req.body.username, md5( req.body.pass ) );
  res.status(201).json( { "message" : info.changes + " record created: ID " + info.lastInsertRowid + " (201)" } );
} );

// READ list of all users (HTTP method GET)
// At endpoint /app/users/
app.get( "/app/users", ( req, res ) => {
  const stmt = db.prepare(
    `SELECT * FROM userInfo`
  );
  const userList = stmt.all();
  //res.status(200).json( userList );
  res.status(200).send( JSON.stringify( userList, null, "\t" ) );
} );

// READ a single user (HTTP method GET)
// At endpoint /app/user/
app.get( "/app/user", ( req, res ) => {
  const stmt = db.prepare(
    `SELECT * FROM userInfo WHERE userId = ?`
  );
  const user = stmt.get( req.body.userId );
  res.status(200).send( JSON.stringify( user, null, "\t" ) );
} );

// UPDATE a single user (HTTP method PATCH)
// At endpoint /app/update/user
app.patch( "/app/update/user", ( req, res ) => {
  const stmt = db.prepare(
    `UPDATE userInfo
    SET username = COALESCE( ?, username ), pass = COALESCE( ?, pass )
    WHERE userId = ?`
  );
  const info = stmt.run( req.body.username, md5(req.body.pass), req.body.userId );
  res.status(200).json( { "message" : info.changes + " record updated: ID " + req.body.userId + " (200)" } );
} );

// DELETE a single user (HTTP method DELETE)
// At endpoint /app/delete/user
app.delete( "/app/delete/user", (req, res) => {
  const stmt = db.prepare(
    `DELETE FROM userInfo WHERE userId = ?`
  );
  const info = stmt.run( req.body.userId );
  res.status(200).json( { "message" : info.changes + " record deleted: ID " + req.body.userId + " (200)" } );
} );

//////////////////////////////////////////////////////////// DEFAULT RESPONSE

app.use( function( req, res ){
	res.status(404).json( { "message" : "Endpoint not found (404)" } );
} );
