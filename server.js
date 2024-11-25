const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(
    session({
        secret: 'secure-secret', // Replace with environment variable in production
        resave: false,
        saveUninitialized: true,
    })
);

// Mock users database
let users = [];
let products = [
    { id: 1, name: "Product 1", price: 179.99, description: "Apple AirPods" },
    { id: 2, name: "Product 2", price: 2099.99, description: "Macbook Pro" },
    { id: 3, name: "Product 3", price: 849.99, description: "iPhone 14" }
];
let cart = [];

// Authentication Routes
app.post('/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = username;
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Product and Cart Routes
app.get('/api/products', (req, res) => res.json(products));

app.get('/api/cart', (req, res) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    res.json({ items: cart, total: total.toFixed(2) });
});

app.post('/api/cart', authMiddleware, (req, res) => {
    const productId = req.body.productId;
    const product = products.find(p => p.id === productId);
    if (product) {
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

app.put('/api/cart/:productId', authMiddleware, (req, res) => {
    const productId = parseInt(req.params.productId);
    const newQuantity = req.body.quantity;
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem && newQuantity > 0) {
        cartItem.quantity = newQuantity;
        res.status(200).json(cartItem);
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
});

app.delete('/api/cart/:productId', authMiddleware, (req, res) => {
    const productId = parseInt(req.params.productId);
    cart = cart.filter(item => item.id !== productId);
    res.status(200).json({ message: "Product removed from cart" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
