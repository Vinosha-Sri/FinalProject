async function fetchProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = products.map(product => `
        <div>
            <p><strong>${product.name}</strong> - $${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button onclick="showEditProductForm(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        </div>
    `).join('');
}

function showAddProductForm() {
    document.getElementById('form-title').innerText = "Add Product";
    document.getElementById('product-id').value = "";
    document.getElementById('product-name').value = "";
    document.getElementById('product-price').value = "";
    document.getElementById('product-description').value = "";
    document.getElementById('product-form').style.display = "block";
}

function showEditProductForm(id) {
    fetch(`/api/products`)
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id === id);
            document.getElementById('form-title').innerText = "Edit Product";
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-form').style.display = "block";
        });
}

function hideProductForm() {
    document.getElementById('product-form').style.display = "none";
}

async function submitProduct() {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value;

    const product = { name, price, description };

    if (id) {
        await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    } else {
        await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
    }

    hideProductForm();
    fetchProducts();
}

async function deleteProduct(id) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
}