// Fetch and display available products
async function fetchProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

// Fetch and display cart items with quantity controls
async function fetchCart() {
    const res = await fetch('/api/cart');
    const { items, total } = await res.json();
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');

    cartList.innerHTML = items.length > 0
        ? items.map(item => `
            <div>
                <span><strong>${item.name}</strong> - $${item.price.toFixed(2)} x 
                    <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1">
                </span>
                <button class="update-button" onclick="updateQuantity(${item.id})">Update</button>
                <button class="remove-button" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('')
        : "<p>Your cart is empty.</p>";

    // Display the cart total
    cartTotal.textContent = `Total: $${total}`;
}

// Add a product to the cart
async function addToCart(productId) {
    await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
    });
    fetchCart();
}

// Update quantity of a product in the cart
async function updateQuantity(productId) {
    // Get the new quantity from the input field
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    // Send the update request only if quantity is valid
    if (quantity > 0) {
        await fetch(`/api/cart/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        fetchCart();
    } else {
        alert("Quantity must be at least 1.");
    }
}

// Remove a product from the cart
async function removeFromCart(productId) {
    await fetch(`/api/cart/${productId}`, {
        method: 'DELETE'
    });
    fetchCart();
}

// Initial fetch for products and cart on page load
fetchProducts();
fetchCart();
