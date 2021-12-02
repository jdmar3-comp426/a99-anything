window.addEventListener( "load", function() {

  // Access the HTML form element
  const createAccountForm = document.getElementById( "create-account" );

  function sendCreateAccountData() {

    const sendRequest = new XMLHttpRequest();

    // Bind FormData object and form element
    const createAccountInfo = new URLSearchParams( new FormData( createAccountForm ) );

    // Set up request
    sendRequest.open( "POST", "http://localhost:3000/app/new/user" );

    // Send data
    sendRequest.send( createAccountInfo );

    // Message for successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status != 201 ) {
        alert( sendRequest.response );
      }
    } );

    // Message for error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  // Take over submit event of form element
  createAccountForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    sendCreateAccountData();
  } );

} );