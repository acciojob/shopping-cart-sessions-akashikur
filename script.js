// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartButton = document.getElementById("clear-cart-btn");

// Render product list
function renderProducts() {
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `${product.name} - $${product.price} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
    productList.appendChild(li);
  });
}

// Render cart list
function renderCart() {
  cartList.innerHTML = ""; // Clear cart list before rendering

  // Get cart data from session storage
  const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");

  cartData.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      const li = document.createElement("li");
      li.innerHTML = `${product.name} - $${product.price} <button class="remove-from-cart-btn" data-id="${product.id}">Remove</button>`;
      cartList.appendChild(li);
    }
  });
}

// Add item to cart
function addToCart(productId) {
  const productToAdd = products.find((product) => product.id === productId);
  if (productToAdd) {
    const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");
    if (!cartData.find((item) => item.id === productToAdd.id)) {
      cartData.push(productToAdd);
      sessionStorage.setItem("cart", JSON.stringify(cartData));
      renderCart();
    }
  }
}

// Remove item from cart
function removeFromCart(productId) {
  const cartData = JSON.parse(sessionStorage.getItem("cart") || "[]");
  const index = cartData.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cartData.splice(index, 1);
    sessionStorage.setItem("cart", JSON.stringify(cartData));
    renderCart();
  }
}

// Clear cart
function clearCart() {
  sessionStorage.removeItem("cart");
  renderCart();
}

// Event listener for adding items to the cart
productList.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart-btn")) {
    const productId = parseInt(event.target.dataset.id);
    addToCart(productId);
  }
});

// Event listener for removing items from the cart
cartList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const productId = parseInt(event.target.dataset.id);
    removeFromCart(productId);
  }
});
() => { 
  // Clear the cart before starting the test
  cy.window().its('sessionStorage').invoke('removeItem', 'cart');

  // Add the first product to the cart
  cy.get('ul#product-list').children('li').first().children('button').click();
  cy.window().its('sessionStorage').should('have.length', 1);

  // Add the second product to the cart
  cy.get('ul#product-list').children('li').eq(1).children('button').click();
  cy.window().its('sessionStorage').should('have.length', 1);

  // Check the cart data
  cy.window().its('sessionStorage').invoke('getItem', 'cart').should('eq', JSON.stringify([
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 }
  ]));
}"

// Event listener for clearing the cart
clearCartButton.addEventListener("click", clearCart);

// Initial render
renderProducts();
renderCart();
