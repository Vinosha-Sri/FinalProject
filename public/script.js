// Function to handle user login
async function login(event) {
    event.preventDefault(); // Prevent the form from submitting the default way (page reload)
    // Retrieve the username and password entered by the user
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    // Send a post request to the server for login
    const res = await fetch('/auth/login', {
        method: 'POST', // HTTP method for sending data to the server
        headers: { 'Content-Type': 'application/json' }, // Specify the request payload format as json
        body: JSON.stringify({ username, password }), // Send username and password in the request body
    });
    // Handle the response
    if (res.ok) {
        // If login is successful, notify the user and update the navigation links
        alert('Login successful');
        toggleAuthLinks(true); // Show the "Logout" link and hide "Login/Register" links
    } else {
        // If login fails, notifies the user:
        alert('Invalid credentials');
    }
}
// Function to handle user registration
async function register(event) {
    event.preventDefault(); // Prevent the form from submitting the default way (page reload)
    // Retrieve the username and password entered by the user
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    // Send a post request to the server for registration
    const res = await fetch('/auth/register', {
        method: 'POST', // HTTP method for sending data to the server
        headers: { 'Content-Type': 'application/json' }, // Specify the request payload format as json:
        body: JSON.stringify({ username, password }), // Send username and password in the request body
    });
    // Handle the response
    if (res.ok) {
        // If registration is successful, notify the user
        alert('Registration successful');
    } else {
        // If registration fails (e.g., user already exists), notify the user
        alert('User already exists');
    }
}
// Function to handle user logout
async function logout() {
    // Send a POST request to the server to log out the user
    await fetch('/auth/logout', { method: 'POST' });
    // Notify the user of the logout and update the navigation links
    alert('Logged out');
    toggleAuthLinks(false); // Show "Login/Register" links and hide the "Logout" link
}
// Function to toggle the visibility of navigation links based on login state
function toggleAuthLinks(isLoggedIn) {
    // If the user is logged in, hide "Login/Register" links and show "Logout" link
    document.getElementById('login-link').style.display = isLoggedIn ? 'none' : '';
    document.getElementById('register-link').style.display = isLoggedIn ? 'none' : '';
    document.getElementById('logout-link').style.display = isLoggedIn ? '' : 'none';
}
// Function to show the login form and hide the registration form
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block'; // Show the login form
    document.getElementById('register-form').style.display = 'none'; // Hide the registration form
}
// Function to show the registration form and hide the login form
function showRegisterForm() {
    document.getElementById('register-form').style.display = 'block'; // Show the registration form
    document.getElementById('login-form').style.display = 'none'; // Hide the login form
}
// Function to check the login state when the page loads
async function checkLoginState() {
    // Optional: Add an endpoint to check if the user is logged in
    const res = await fetch('/auth/login-status'); // Check the current login session status
    // Update the navigation links based on whether the user is logged in
    toggleAuthLinks(res.ok);
}
checkLoginState();