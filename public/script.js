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

// Fetch and display cart items
async function fetchCart() {
    const res = await fetch('/api/cart');
    const cart = await res.json();
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = cart.length > 0
        ? cart.map(item => `
            <div>
                <p><strong>${item.name}</strong> - $${item.price.toFixed(2)}</p>
            </div>
        `).join('')
        : "<p>Your cart is empty.</p>";
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

// Initial fetch for products and cart on page load
fetchProducts();
fetchCart();
