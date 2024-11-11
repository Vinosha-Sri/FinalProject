const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Sample product data
let products = [
    { id: 1, name: "Product 1", price: 10.99, description: "Description for Product 1" },
    { id: 2, name: "Product 2", price: 12.99, description: "Description for Product 2" },
    { id: 3, name: "Product 3", price: 15.99, description: "Description for Product 3" }
];

// Cart data (empty at start)
let cart = [];

// Routes for getting products and cart items
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/cart', (req, res) => {
    // Calculate total for the cart
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    res.json({ items: cart, total: total.toFixed(2) });
});

// Route to add a product to the cart
app.post('/api/cart', (req, res) => {
    const productId = req.body.productId;
    const product = products.find(p => p.id === productId);

    if (product) {
        cart.push(product);
        res.status(201).json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

// Route to remove a product from the cart
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
