window.addEventListener( "load", function() {

  //////////////////////////////////////////////////////////// CREATE ACCOUNT

  // Access the HTML form element
  const createAccountForm = document.forms["create-account"];

  function sendCreateAccountData() {

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
    sendCreateAccountData();
  } );

  //////////////////////////////////////////////////////////// SIGN IN

  // Access the HTML form element
  const signInForm = document.forms["sign-in"];

  function sendSignInData() {

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
    sendSignInData();
  } );

} );