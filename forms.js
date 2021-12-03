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

  //////////////////////////////////////////////////////////// ADD ITEM TO CART

  // Access the HTML button element
  const itemForms = document.getElementsByClassName( "add-to-cart" );

  function addToCart( id ) {

    const sendRequest = new XMLHttpRequest();

    // Bind FormData object and form element
    const addToCartInfo = new URLSearchParams( new FormData( itemForms.namedItem( id ) ) );
    addToCartInfo.append( "userId", localStorage.getItem( "currentUserId" ) );
    alert( addToCartInfo );

    // Set up request
    sendRequest.open( "POST", "http://localhost:3000/app/user/new/item" );

    // Send request with data
    sendRequest.send( addToCartInfo );

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 201 ) {
        alert( "Item added to cart" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  for( let i = 0; i < itemForms.length; i++ ) {
    itemForms.item(i).addEventListener( "submit", function( event ) {
      event.preventDefault();
      addToCart( itemForms.item(i).id );
    } );
  }

} );