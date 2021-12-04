window.addEventListener( "load", function() {
  
  if( localStorage.getItem( "menuItemsRequested" ) == 1 ) {
    if( localStorage.getItem( "menuItemsQuery" ) === "" ) {
      viewItems();
    }
  }
  
  if( localStorage.getItem( "cartItemsRequested" ) == 1 ) {
    viewCart();
  }

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

  //////////////////////////////////////////////////////////// DELETE ACCOUNT

  // Access the HTML form element
  const deleteAccountForm = document.forms["delete-account"];

  function deleteAccount() {

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

  // Take over submit event of form element
  deleteAccountForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    deleteAccount();
  } );

  //////////////////////////////////////////////////////////// VIEW MENU ITEMS

  ////////////////////////////// GENERATE MENU ITEMS

  function generateMenuItems( items ) {

    if( document.getElementById( "items" ) !== null ) {
      document.getElementById( "items" ).remove();
    }

    let range = document.createRange();
    range.setStartAfter( document.getElementById( "view-orders" ) );

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
  const viewItemsForm = document.forms["view-items"];

  function viewItems() {

    const sendRequest = new XMLHttpRequest();

    // Set up request
    sendRequest.open( "GET", "http://localhost:3000/app/items/" );

    // Send request
    sendRequest.send();

    // Successful data submission
    sendRequest.addEventListener( "load", function( event ) {
      if( sendRequest.status === 200 ) {
        localStorage.setItem( "cartItemsRequested", 0 );
        localStorage.setItem( "menuItemsRequested", 1 );
        localStorage.setItem( "menuItemsQuery", "" );
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

  // Take over submit event of form element
  viewItemsForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    viewItems();
  } );

  ////////////////////////////// SEARCH FOR MENU ITEMS

  // Access the HTML form element
  const searchItemsForm = document.forms["search-items"];

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
        localStorage.setItem( "menuItemsRequested", 1 );
        localStorage.setItem( "menuItemsQuery", query );
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

  // Take over submit event of form element
  searchItemsForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    const searchItemsInfo = new URLSearchParams( new FormData( searchItemsForm ) );
    searchItems( searchItemsInfo.get( "query" ) );
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

  // Take over submit event of form element
  for( let i = 0; i < itemForms.length; i++ ) {
    itemForms.item(i).addEventListener( "submit", function( event ) {
      event.preventDefault();
      getCart( changeCart, itemForms.item(i).id );
    } );
  }

  //////////////////////////////////////////////////////////// VIEW CART ITEMS

  ////////////////////////////// GENERATE CART ITEMS

  function generateCartItems( items ) {

    if( document.getElementById( "items" ) !== null ) {
      document.getElementById( "items" ).remove();
    }

    let range = document.createRange();
    range.setStartAfter( document.getElementById( "view-orders" ) );

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

  // Access the HTML form element
  const viewCartForm = document.forms["view-cart"];

  function viewCart() {
    localStorage.setItem( "menuItemsRequested", 0 );
    localStorage.setItem( "cartItemsRequested", 1 );
    getCart( generateCartItems );
  }

  // Take over submit event of form element
  viewCartForm.addEventListener( "submit", function( event ) {
    event.preventDefault();
    viewCart();
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