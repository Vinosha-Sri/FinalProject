const express = require('express'); // Express framework 
const bodyParser = require('body-parser'); // Middleware to parse incoming JSON requests
const session = require('express-session'); // Middleware to manage user sessions
const app = express(); // Initializing the Express application
const PORT = 3000; // Defining the port number for the server
// Middleware to parse incoming JSON requests:
app.use(bodyParser.json());
// Serve static files from the public directory:
app.use(express.static('public'));
app.use(
    session({
        secret: 'secure-secret', // Secret key for signing the session ID cookie.
        resave: false, // Prevents resaving session data if nothing has changed.
        saveUninitialized: true, // Forces uninitialized sessions to be saved.
    })
);
// In-memory storage for users, products, and cart data:
let users = []; // Stores registered users
let products = [ // Product data:
    { id: 1, name: "Product 1", price: 179.99, description: "Apple AirPods" },
    { id: 2, name: "Product 2", price: 2099.99, description: "Macbook Pro" },
    { id: 3, name: "Product 3", price: 849.99, description: "iPhone 14" }
];
let cart = []; // Stores the user's cart items.
// Route to register a new user:
app.post('/auth/register', (req, res) => {
    const { username, password } = req.body; // Extract username and password from the request body.
    if (users.find(user => user.username === username)) { // Check if the user already exists.
        return res.status(400).json({ message: 'User already exists.' }); // If user exists, then error. 
    }
    users.push({ username, password }); // Add the new user to the user list
    res.status(201).json({ message: 'User registered successfully.' }); // If new user, successfully registered.
});
// Route to log in a user:
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body; // Extract username and password
    const user = users.find(u => u.username === username && u.password === password); // Check credentials.
    if (user) {
        req.session.user = username; // Save username in the session.
        res.status(200).json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid credentials!!!' }); // Respond with error if credentials are invalid.
    }
});
// Route to log out a user
app.post('/auth/logout', (req, res) => {
    req.session.destroy(); // Destroy the session
    res.status(200).json({ message: 'Logout successful!' }); 
});
// Middleware to restrict access to authenticated users only:
function authMiddleware(req, res, next) {
    if (req.session.user) { // Check if a user is logged in
        next(); // Proceed to the next middleware/route handler if, if not:
    } else {
        res.status(401).json({ message: 'Unauthorized' }); // Respond with error if not an authenticated user.
    }
}
// Route to fetch all available products:
app.get('/api/products', (req, res) => res.json(products)); // Responds with the product list.
// Route to fetch cart items (protected by authMiddleware):
app.get('/api/cart', authMiddleware, (req, res) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0); // Calculates the total price
    res.json({ items: cart, total: total.toFixed(2) }); // Responds with cart items and total price.
});
// Route to add a product to the cart
app.post('/api/cart', authMiddleware, (req, res) => {
    const productId = req.body.productId; // Extracts product ID from request
    const product = products.find(p => p.id === productId); // Find the product by ID
    if (product) {
        const existingProduct = cart.find(item => item.id === productId); // Check if the product is already in the cart.
        if (existingProduct) {
            existingProduct.quantity += 1; // Increase the quantity if it exists
        } else {
            cart.push({ ...product, quantity: 1 }); // Add the product to cart with quantity 1:
        }
        res.status(201).json(product); // Respond with the added product:
    } else {
        res.status(404).json({ message: "Product not found" }); // Respond with error if product is not found.
    }
});
// Route to update the quantity of a product in the cart:
app.put('/api/cart/:productId', authMiddleware, (req, res) => {
    const productId = parseInt(req.params.productId); // Gets product id
    const newQuantity = req.body.quantity; // Gets the new quantity from request body
    const cartItem = cart.find(item => item.id === productId); // Find the product in the cart
    if (cartItem && newQuantity > 0) {
        cartItem.quantity = newQuantity; // Updates the quantity
        res.status(200).json(cartItem); // Responds with the updated cart item
    } else {
        res.status(400).json({ message: "Invalid request" }); // Respond with error for invalid requests
    }
});
// Route to remove a product from the cart (protected)
app.delete('/api/cart/:productId', authMiddleware, (req, res) => {
    const productId = parseInt(req.params.productId); // Extract product ID
    cart = cart.filter(item => item.id !== productId); // Remove the product from the cart
    res.status(200).json({ message: "Product removed from cart" }); // Respond with success
});
// Route to serve the products page
app.get('/products', (req, res) => {
    res.sendFile(__dirname + '/public/products.html'); // Serve the products.html file
});
// Route to serve the cart page
app.get('/cart', (req, res) => {
    res.sendFile(__dirname + '/public/cart.html'); // Serve the cart.html file
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Log server start message
});