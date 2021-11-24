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

//////////////////////////////////////////////////////////// DEFAULT RESPONSE

app.use( function( req, res ){
	res.status(404).json( { "message" : "Endpoint not found (404)" } );
} );