const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(express.static('public'));
// Current product data:
let products = [
    { id: 1, name: "Product 1", price: 179.99, description: "Apple AirPods" },
    { id: 2, name: "Product 2", price: 2099.99, description: "Macbook Pro" },
    { id: 3, name: "Product 3: ", price: 849.99, description: "iPhone 14" }
];
let cart = [];
// Routes for getting products and cart items:
app.get('/api/products', (req, res) => {
    res.json(products);
});
app.get('/api/cart', (req, res) => {
    // Calculates the total price as items are added, deleted, or updated:
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    res.json({ items: cart, total: total.toFixed(2) });
});
// Route to add a product to the cart:
app.post('/api/cart', (req, res) => {
    const productId = req.body.productId;
    const product = products.find(p => p.id === productId);
    if (product) {
        // Check if the product is already in the cart, if so, increment the quantity:
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        res.status(201).json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});
// Route to update the quantity of a product in the cart:
app.put('/api/cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const newQuantity = req.body.quantity;
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && newQuantity > 0) {
        cartItem.quantity = newQuantity;
        res.status(200).json(cartItem);
    } else if (cartItem && newQuantity === 0) {
        cart = cart.filter(item => item.id !== productId);
        res.status(200).json({ message: "Product removed from cart." });
    } else {
        res.status(404).json({ message: "Product not found in cart." });
    }
});
// Route to remove a product from the cart:
app.delete('/api/cart/:productId', (req, res) => {
    const productId = parseInt(req.params.productId);
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart.splice(productIndex, 1);
        res.status(200).json({ message: "Product removed from cart" });
    } else {
        res.status(404).json({ message: "Product not found in cart" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});