window.addEventListener( "load", function() {

  //////////////////////////////////////////////////////////// SETUP

  toggleAccountView();

  function toggleAccountView() {

    if( localStorage.getItem( "currentUserId" ) == "0" ) {
      document.getElementById( "nav-sign-in" ).style.display = "initial";
      document.getElementById( "nav-sign-out" ).style.display = "none";
      document.getElementById( "nav-delete-account" ).style.display = "none";
      document.getElementById( "nav-update-account" ).style.display = "none";
    } else {
      document.getElementById( "nav-sign-in" ).style.display = "none";
      document.getElementById( "nav-sign-out" ).style.display = "initial";
      document.getElementById( "nav-delete-account" ).style.display = "initial";
      document.getElementById( "nav-update-account" ).style.display = "initial";
    }

  }

  //////////////////////////////////////////////////////////// CREATE ACCOUNT

  // Access the HTML form element
  const createAccountForm = document.forms["create-account"];

  // Take over submit event of form element
  if( createAccountForm != null ) {
    createAccountForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      createAccount();
    } );
  }

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

  //////////////////////////////////////////////////////////// SIGN IN

  // Access the HTML form element
  const signInForm = document.forms["sign-in"];

  // Take over submit event of form element
  if( signInForm != null ) {
    signInForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      signIn();
    } );
  }

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
        alert( localStorage.getItem("currentUserId") );
        toggleAccountView();
        window.location.href = "/index.html";
      } else if( sendRequest.status === 404 ) {
        alert( "Invalid username / password, please try again" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  //////////////////////////////////////////////////////////// UPDATE USERNAME

  // Access the HTML form element
  const updateUsernameForm = document.forms["update-username"];

  // Take over submit event of form element
  if( updateUsernameForm != null ) {
    updateUsernameForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      updateUsername();
    } );
  }

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

  //////////////////////////////////////////////////////////// UPDATE PASSWORD

  // Access the HTML form element
  const updatePassForm = document.forms["update-pass"];

  // Take over submit event of form element
  if( updatePassForm != null ) {
    updatePassForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      updatePass();
    } );
  }

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

  //////////////////////////////////////////////////////////// SIGN OUT

  // Access the HTML form element
  const signOutForm = document.forms["nav-sign-out"];

  // Take over submit event of form element
  if( signOutForm != null ) {
    signOutForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      localStorage.setItem( "currentUserId", 0 );
      alert( "Sign out successful" );
      toggleAccountView();
      window.location.href = "/index.html";
    } );
  }

  //////////////////////////////////////////////////////////// DELETE ACCOUNT

  // Access the HTML form element
  const deleteAccountForm = document.forms["nav-delete-account"];

  // Take over submit event of form element
  if( deleteAccountForm != null ) {
    deleteAccountForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      getCart( deleteAccount );
    } );
  }

  function deleteAccount( cart ) {

    // Delete all cart items
    cart.forEach( ( item ) => {

      const changeCartInfo = new URLSearchParams();
      changeCartInfo.append( "userId", localStorage.getItem( "currentUserId" ) );
      changeCartInfo.append( "itemId", item.itemId );
      deleteCartItem( changeCartInfo );

    } );

    const sendRequest = new XMLHttpRequest();

    // Bind FormData object and form element
    const deleteAccountInfo = new URLSearchParams();
    deleteAccountInfo.append( "userId", localStorage.getItem( "currentUserId" ) );

    // Set up request
    sendRequest.open( "DELETE", "http://localhost:3000/app/delete/user" );

    // Send request with data
    sendRequest.send( deleteAccountInfo );

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 200 ) {
        localStorage.setItem( "currentUserId", 0 );
        alert( "Account deletion successful" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  //////////////////////////////////////////////////////////// VIEW MENU ITEMS

  ////////////////////////////// GENERATE MENU ITEMS

  function generateMenuItems( items ) {

    if( document.getElementById( "items" ) !== null ) {
      document.getElementById( "items" ).remove();
    }

    let range = document.createRange();
    range.setStartAfter( document.getElementById( "menu" ) );

    let itemContainer = document.createElement( "div" );
    itemContainer.setAttribute( "id", "items" );

    items.forEach( ( item ) => {

      let itemName = document.createElement( "h1" );
      itemName.innerHTML = item.itemName;

      let itemForm = document.createElement( "form" );
      itemForm.setAttribute( "class", "change-cart" );
      let itemFormId = "item" + item.itemId;
      itemForm.setAttribute( "id", itemFormId );
      itemForm.innerHTML =
        `<input type="hidden" id="itemId" name="itemId" value="${item.itemId}" required>
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" value="1" min="1" max="100" required>
        <input type="submit" value="Submit">`;
      
      itemContainer.appendChild( itemName );
      itemContainer.appendChild( itemForm );

      itemForm.addEventListener( "submit", function( event ) {
        event.preventDefault();
        getCart( changeCart, itemFormId );
      } );

    } );

    range.insertNode( itemContainer );

  }

  ////////////////////////////// VIEW ALL MENU ITEMS

  // Access the HTML form element
  const clearSearchForm = document.forms["clear-search"];

  // Take over submit event of form element
  if( clearSearchForm != null ) {
    clearSearchForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      viewItems();
    } );
  }

  if( document.getElementById( "menu" ) != null ) {
    viewItems();
  }

  function viewItems() {

    const sendRequest = new XMLHttpRequest();

    // Set up request
    sendRequest.open( "GET", "http://localhost:3000/app/items/" );

    // Send request
    sendRequest.send();

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status === 200 ) {
        let items = JSON.parse( sendRequest.response );
        generateMenuItems( items );
      } else if( sendRequest.status === 404 ) {
        alert( "Invalid request, please try again" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  ////////////////////////////// SEARCH FOR MENU ITEMS

  // Access the HTML form element
  const searchItemsForm = document.forms["search-items"];

  // Take over submit event of form element
  if( searchItemsForm != null ) {
    searchItemsForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      const searchItemsInfo = new URLSearchParams( new FormData( searchItemsForm ) );
      searchItems( searchItemsInfo.get( "query" ) );
    } );
  }

  function searchItems( query ) {

    const sendRequest = new XMLHttpRequest();

    // Set up request
    const searchItemsInfo = new URLSearchParams( new FormData( searchItemsForm ) );
    sendRequest.open( "GET", "http://localhost:3000/app/specify/items/" + query );

    // Send request
    sendRequest.send();

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status === 200 ) {
        let items = JSON.parse( sendRequest.response );
        generateMenuItems( items );
      } else if( sendRequest.status === 404 ) {
        alert( "Invalid request, please try again" );
      }
    } );

    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

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

    const sendRequest = new XMLHttpRequest();
  
    // Set up request
    sendRequest.open( "POST", "http://localhost:3000/app/user/new/item" );
  
    // Send request with data
    sendRequest.send( changeCartInfo );
  
    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 201 ) {
        alert( "Cart item added" );
      }
    } );
  
    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
    } );

  }

  ////////////////////////////// UPDATE CART ITEM

  function updateCartItem( changeCartInfo ) {

    const sendRequest = new XMLHttpRequest();
  
    // Set up request
    changeCartInfo.set( "quantity", changeCartInfo.get( "quantity" ) );
    sendRequest.open( "PATCH", "http://localhost:3000/app/user/update/item" );
  
    // Send request with data
    sendRequest.send( changeCartInfo );
  
    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 200 ) {
        alert( "Cart item updated" );
      }
      return;
    } );
  
    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
      return;
    } );

  }

  ////////////////////////////// DELETE CART ITEM

  function deleteCartItem( changeCartInfo ) {

    const sendRequest = new XMLHttpRequest();
  
    // Set up request
    changeCartInfo.delete( "quantity" );
    sendRequest.open( "DELETE", "http://localhost:3000/app/user/delete/item" );
  
    // Send request with data
    sendRequest.send( changeCartInfo );
  
    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status == 200 ) {
        alert( "Cart item deleted" );
      }
      return;
    } );
  
    // Error with data submission
    sendRequest.addEventListener( "error", function( event ) {
      alert( "Submission unsuccessful, please try again" );
      return;
    } );

  }

  ////////////////////////////// CHANGE CART

  // Access the HTML form element
  const itemForms = document.getElementsByClassName( "change-cart" );

  // Take over submit event of form element
  if( itemForms !== null ) {
    for( let i = 0; i < itemForms.length; i++ ) {
      itemForms.item(i).addEventListener( "submit", function( event ) {
        event.preventDefault();
        getCart( changeCart, itemForms.item(i).id );
      } );
    }
  }

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

    if( changeCartInfo.get( "quantity" ) == 0 ) {
      deleteCartItem( changeCartInfo );
    } else {
      if( existingCartItem === null ) {
        addCartItem( changeCartInfo );
      } else {
        updateCartItem( changeCartInfo );
      }
    }

  }

  //////////////////////////////////////////////////////////// VIEW CART ITEMS

  ////////////////////////////// GENERATE CART ITEMS

  if( document.getElementById( "cart" ) != null ) {
    viewCart();
  }

  function viewCart() {
    getCart( generateCartItems );
  }

  function generateCartItems( items ) {

    if( document.getElementById( "items" ) !== null ) {
      document.getElementById( "items" ).remove();
    }

    let range = document.createRange();
    range.setStartAfter( document.getElementById( "cart" ) );

    let itemContainer = document.createElement( "div" );
    itemContainer.setAttribute( "id", "items" );

    // Cart empty
    if( items === undefined ) {
      return;
    }

    items.forEach( ( item ) => {

      // Request item name
      let itemName = document.createElement( "h1" );

      const sendRequest = new XMLHttpRequest();
  
      // Set up request
      sendRequest.open( "GET", "http://localhost:3000/app/item/" + item.itemId );
  
      // Send request
      sendRequest.send();
  
      // Successful data submission
      sendRequest.addEventListener( "load", function( event ) {

        if( sendRequest.status === 200 ) {

          itemName.innerHTML = JSON.parse( sendRequest.response ).itemName;

          let itemForm = document.createElement( "form" );
          itemForm.setAttribute( "class", "change-cart" );
          let itemFormId = "item" + item.itemId;
          itemForm.setAttribute( "id", itemFormId );
          itemForm.innerHTML =
            `<input type="hidden" id="itemId" name="itemId" value="${item.itemId}" required>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" value="${item.quantity}" min="0" max="100" required>
            <input type="submit" value="Update">`;
          
          itemContainer.appendChild( itemName );
          itemContainer.appendChild( itemForm );
    
          itemForm.addEventListener( "submit", function( event ) {
            event.preventDefault();
            getCart( changeCart, itemFormId );
          } );

        } else if( sendRequest.status === 404 ) {

          alert( "Invalid request, please try again" );

        }
      } );
  
      // Error with data submission
      sendRequest.addEventListener( "error", function( event ) {
        alert( "Submission unsuccessful, please try again" );
      } );

    } );

    range.insertNode( itemContainer );

  }

  //////////////////////////////////////////////////////////// PLACE ORDER

  // Access the HTML form element
  const placeOrderForm = document.forms["place-order"];

  // Take over submit event of form element
  if( placeOrderForm != null ) {
    placeOrderForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      placeOrder();
    } );
  }

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

  //////////////////////////////////////////////////////////// VIEW ORDERS

  // Access the HTML form element
  const viewOrdersForm = document.forms["view-orders"];

  // Take over submit event of form element
  if( viewOrdersForm != null ) {
    viewOrdersForm.addEventListener( "submit", function( event ) {
      event.preventDefault();
      viewOrders();
    } );
  }

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

} );