async function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        alert('Login successful');
        toggleAuthLinks(true);
    } else {
        alert('Invalid credentials');
    }
}

async function register(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        alert('Registration successful');
    } else {
        alert('User already exists');
    }
}

async function logout() {
    await fetch('/auth/logout', { method: 'POST' });
    alert('Logged out');
    toggleAuthLinks(false);
}

function toggleAuthLinks(isLoggedIn) {
    document.getElementById('login-link').style.display = isLoggedIn ? 'none' : '';
    document.getElementById('register-link').style.display = isLoggedIn ? 'none' : '';
    document.getElementById('logout-link').style.display = isLoggedIn ? '' : 'none';
}

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

// Fetch and display products and cart
fetchProducts();
fetchCart();
