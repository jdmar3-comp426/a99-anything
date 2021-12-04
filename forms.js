window.addEventListener( "load", function() {

  //////////////////////////////////////////////////////////// CREATE ACCOUNT

  // Access the HTML form element
  const createAccountForm = document.forms["create-account"];

  function createAccount() {

    const sendRequest = new XMLHttpRequest();

    // Bind FormData object and form element
    const createAccountInfo = new URLSearchParams( new FormData( createAccountForm ) );

    // Set up request
    sendRequest.open( "POST", "http://localhost:3000/app/new/user" );

    // Send request with data
    sendRequest.send( createAccountInfo );

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 201 ) {
        alert( "Account creation successful" );
      } else if( sendRequest.status == 409 ) {
        alert( "Username already exists, please try another username" );
      } else if( sendRequest.status == 404 ) {
        alert( "Invalid username / password, please try again" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  createAccountForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    createAccount();
  } );

  //////////////////////////////////////////////////////////// SIGN IN

  // Access the HTML form element
  const signInForm = document.forms["sign-in"];

  function signIn() {

    const username = signInForm.elements.username.value;
    const pass = signInForm.elements.pass.value;

    const sendRequest = new XMLHttpRequest();

    // Set up request
    sendRequest.open( "GET", "http://localhost:3000/app/user/" + username + "/" + pass );

    // Send request
    sendRequest.send();

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status === 200 ) {
        alert( "Valid username / password" );
        localStorage.setItem( "currentUserId", JSON.parse( sendRequest.response ).userId );
        alert( "currentUserId: " + localStorage.getItem( "currentUserId" ) );
      } else if( sendRequest.status === 404 ) {
        alert( "Invalid username / password, please try again" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  signInForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    signIn();
  } );

  //////////////////////////////////////////////////////////// UPDATE USERNAME

  // Access the HTML form element
  const updateUsernameForm = document.forms["update-username"];

  function updateUsername() {

    const sendRequest = new XMLHttpRequest();

    // Bind FormData object and form element
    const updateUsernameInfo = new URLSearchParams( new FormData( updateUsernameForm ) );
    updateUsernameInfo.append( "userId", localStorage.getItem( "currentUserId" ) );

    // Set up request
    sendRequest.open( "PATCH", "http://localhost:3000/app/update/user" );

    // Send request with data
    sendRequest.send( updateUsernameInfo );

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 200 ) {
        alert( "Username update successful" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  updateUsernameForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    updateUsername();
  } );

  //////////////////////////////////////////////////////////// UPDATE PASSWORD

  // Access the HTML form element
  const updatePassForm = document.forms["update-pass"];

  function updatePass() {

    const sendRequest = new XMLHttpRequest();

    // Bind FormData object and form element
    const updatePassInfo = new URLSearchParams( new FormData( updatePassForm ) );
    updatePassInfo.append( "userId", localStorage.getItem( "currentUserId" ) );

    // Set up request
    sendRequest.open( "PATCH", "http://localhost:3000/app/update/user" );

    // Send request with data
    sendRequest.send( updatePassInfo );

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 200 ) {
        alert( "Password update successful" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  updatePassForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    updatePass();
  } );

  //////////////////////////////////////////////////////////// SIGN OUT

  // Take over submit event of form element
  document.forms["sign-out"].addEventListener( "submit", function( event ) {
    event.preventDefault();
    localStorage.setItem( "currentUserId", 0 );
    alert( "Sign out successful" );
  } );

  //////////////////////////////////////////////////////////// GET CART ITEMS

  function getCart( callback, ...params ) {

    const sendRequest = new XMLHttpRequest();

    // Set up request
    if( localStorage.getItem( "currentUserId" ) == 0 ) {
      alert( "Please sign in for cart and ordering functionality" );
      return;
    }

    // Set up request
    sendRequest.open( "GET", "http://localhost:3000/app/cart/" + localStorage.getItem( "currentUserId" ) );

    // Send request
    sendRequest.send();

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status === 200 ) {
        callback( JSON.parse( sendRequest.response ), ...params );
      } else if( sendRequest.status === 404 ) {
        alert( "Invalid request, please try again" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  //////////////////////////////////////////////////////////// ADD / UPDATE CART ITEM

  ////////////////////////////// ADD CART ITEM

  function addCartItem( changeCartInfo ) {

    const newItemRequest = new XMLHttpRequest();
  
    // Set up request
    newItemRequest.open( "POST", "http://localhost:3000/app/user/new/item" );
  
    // Send request with data
    newItemRequest.send( changeCartInfo );
  
    // Successful data submission
    newItemRequest.addEventListener( "load", function( event ) {
      if( newItemRequest.status == 201 ) {
        alert( "Cart item added" );
      }
    } );
  
    // Error with data submission
    newItemRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  ////////////////////////////// UPDATE CART ITEM

  function updateCartItem( changeCartInfo ) {

    const updateItemRequest = new XMLHttpRequest();
  
    // Set up request
    changeCartInfo.set( "quantity", changeCartInfo.get( "quantity" ) );
    updateItemRequest.open( "PATCH", "http://localhost:3000/app/user/update/item" );
  
    // Send request with data
    updateItemRequest.send( changeCartInfo );
  
    // Successful data submission
    updateItemRequest.addEventListener( "load", function( event ) {
      if( updateItemRequest.status == 200 ) {
        alert( "Cart item updated" );
      }
      return;
    } );
  
    // Error with data submission
    updateItemRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
      return;
    } );

  }

  ////////////////////////////// CHANGE CART

  // Access the HTML form element
  const itemForms = document.getElementsByClassName( "change-cart" );

  function changeCart( cartItems, id ) {
  
    const changeCartInfo = new URLSearchParams( new FormData( itemForms.namedItem( id ) ) );
    changeCartInfo.append( "userId", localStorage.getItem( "currentUserId" ) );

    let existingCartItem = null;
    cartItems.forEach( ( cartItem ) => {
      if( cartItem.itemId === changeCartInfo.get( "itemId" ) ) {
        // Update existing cart item
        existingCartItem = cartItem;
      }
    } );

    if( existingCartItem === null ) {
      addCartItem( changeCartInfo );
    } else {
      updateCartItem( changeCartInfo );
    }

  }

  // Take over submit event of form element
  for( let i = 0; i < itemForms.length; i++ ) {
    itemForms.item(i).addEventListener( "submit", function( event ) {
      event.preventDefault();
      getCart( changeCart, itemForms.item(i).id );
    } );
  }

  //////////////////////////////////////////////////////////// VIEW CART ITEMS

  // Access the HTML form element
  const viewCartForm = document.forms["view-cart"];

  function displayCart( cart ) {
    alert( JSON.stringify( cart ) );
  }

  // Take over submit event of form element
  viewCartForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    getCart( displayCart );
  } );

  //////////////////////////////////////////////////////////// PLACE ORDER

  // Access the HTML form element
  const placeOrderForm = document.forms["place-order"];

  function placeOrder() {

    const sendRequest = new XMLHttpRequest();

    // Bind FormData object and form element
    if( localStorage.getItem( "currentUserId" ) == 0 ) {
      alert( "Please sign in for cart and ordering functionality" );
      return;
    }
    const placeOrderInfo = new URLSearchParams();
    placeOrderInfo.append( "userId", localStorage.getItem( "currentUserId" ) );

    // Set up request
    sendRequest.open( "POST", "http://localhost:3000/app/user/new/order" );

    // Send request with data
    sendRequest.send( placeOrderInfo );

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 201 ) {
        alert( "Order placement successful" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  placeOrderForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    placeOrder();
  } );

  //////////////////////////////////////////////////////////// VIEW ORDERS

  // Access the HTML form element
  const viewOrdersForm = document.forms["view-orders"];

  function viewOrders() {

    const sendRequest = new XMLHttpRequest();

    // Set up request
    if( localStorage.getItem( "currentUserId" ) == 0 ) {
      alert( "Please sign in for cart and ordering functionality" );
      return;
    }

    // Set up request
    sendRequest.open( "GET", "http://localhost:3000/app/orders/" + localStorage.getItem( "currentUserId" ) );

    // Send request
    sendRequest.send();

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status === 200 ) {
        alert( sendRequest.response );
      } else if( sendRequest.status === 404 ) {
        alert( "Invalid request, please try again" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  viewOrdersForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    viewOrders();
  } );

} );