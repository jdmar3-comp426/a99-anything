//////////////////////////////////////////////////////////// SETUP

// Define app using express
const express = require("express");
const app = express();

// Require user database file
var db = require( "./database.js" );

// Require md5 module
var md5 = require( "md5" );

// Require CORS module
const cors = require("cors");

// Have Express use its built-in body parser
app.use( express.urlencoded( { extended: true } ) );
app.use( express.json() );

// Make Express use CORS
app.use(cors());

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
  try {
    const info = stmt.run( req.body.username, md5( req.body.pass ) );
    res.status(201).json( { "message" : info.changes + " record created: ID " + info.lastInsertRowid + " (201)" } );
  } catch( error ) {
    res.json( { "message" : error.name + ": " + error.message } );
  }
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

//////////////////////////////////////////////////////////// API FOR CART ITEMS

// CREATE new cart item (HTTP method POST)
// At endpoint /app/user/new/item
app.post( "/app/user/new/item", ( req, res ) => {
  const stmt = db.prepare(
    `INSERT INTO cartInfo ( userId, itemId, quantity )
    VALUES ( ?, ?, ? );`
  );
  const info = stmt.run( req.body.userId, req.body.itemId, req.body.quantity );
  res.status(201).json( { "message" : info.changes + " record created: ID " + info.lastInsertRowid + " (201)" } );
} );

// READ list of all cart items for current user (HTTP method GET)
// At endpoint /app/user/cart
app.get( "/app/user/cart", ( req, res ) => {
  const stmt = db.prepare(
    `SELECT * FROM cartInfo
    WHERE userId = ?`
  );
  const cart = stmt.all( req.body.userId );
  res.status(200).send( JSON.stringify( cart, null, "\t" ) );
} );

// UPDATE a cart item (HTTP method PATCH)
// At endpoint /app/user/update/item
app.patch( "/app/user/update/item", ( req, res ) => {
  const stmt = db.prepare(
    `UPDATE cartInfo
    SET quantity = COALESCE( ?, quantity )
    WHERE userId = ? AND itemId = ?`
  );
  const info = stmt.run( req.body.quantity, req.body.userId, req.body.itemId );
  res.status(200).json( { "message" : info.changes + " record updated: ID " + req.body.userId + " (200)" } );
} );

// DELETE a cart item (HTTP method DELETE)
// At endpoint /app/user/delete/item
app.delete( "/app/user/delete/item", (req, res) => {
  const stmt = db.prepare(
    `DELETE FROM cartInfo WHERE userId = ? AND itemId = ?`
  );
  const info = stmt.run( req.body.userId, req.body.itemId );
  res.status(200).json( { "message" : info.changes + " record deleted: ID " + req.body.userId + " (200)" } );
} );

//////////////////////////////////////////////////////////// API FOR ORDERS

// CREATE new order from cart (HTTP method POST)
// At endpoint /app/user/new/order
app.post( "/app/user/new/order", ( req, res ) => {
  const readCart = db.prepare(
    `SELECT * FROM cartInfo
    WHERE userId = ?`
  );
  const cart = readCart.all( req.body.userId );
  const createOrder = db.prepare(
    `INSERT INTO orderInfo ( userId, itemId, quantity )
    VALUES ( ?, ?, ? );`
  );
  cart.forEach( ( cartItem ) => {
    const info = createOrder.run( cartItem.userId, cartItem.itemId, cartItem.quantity );
    res.status(201).json( { "message" : info.changes + " record created: ID " + info.lastInsertRowid + " (201)" } );
  } );
} );

// READ list of all orders for current user (HTTP method GET)
// At endpoint /app/user/orders
app.get( "/app/user/orders", ( req, res ) => {
  const stmt = db.prepare(
    `SELECT * FROM orderInfo
    WHERE userId = ?`
  );
  const orders = stmt.all( req.body.userId );
  res.status(200).send( JSON.stringify( orders, null, "\t" ) );
} );

// DELETE an order (HTTP method DELETE)
// At endpoint /app/user/delete/order
app.delete( "/app/user/delete/order", (req, res) => {
  const stmt = db.prepare(
    `DELETE FROM orderInfo WHERE orderId = ?`
  );
  const info = stmt.run( req.body.orderId );
  res.status(200).json( { "message" : info.changes + " record deleted: ID " + req.body.orderId + " (200)" } );
} );

//////////////////////////////////////////////////////////// API FOR ITEMS

// READ all items that match the search query (HTTP method GET)
// At endpoint /app/item/
app.get( "/app/item", ( req, res ) => {
  const stmt = db.prepare(
    `SELECT * FROM itemInfo WHERE like( ?, itemName )`
  );
  const item = stmt.all( '%' + req.body.search + '%' );
  res.status(200).send( JSON.stringify( item, null, "\t" ) );
} );

//////////////////////////////////////////////////////////// DEFAULT RESPONSE

app.use( function( req, res ){
	res.status(404).json( { "message" : "Endpoint not found (404)" } );
} );
