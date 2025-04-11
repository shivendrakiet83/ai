// script.js

// Fetch featured products from API or static data
const featuredProducts = [
    { id: 1, name: 'Product 1', price: 19.99, image: 'product1.jpg' },
    { id: 2, name: 'Product 2', price: 24.99, image: 'product2.jpg' },
    { id: 3, name: 'Product 3', price: 29.99, image: 'product3.jpg' },
    { id: 4, name: 'Product 4', price: 14.99, image: 'product4.jpg' }
];

// Function to display featured products
function displayFeaturedProducts() {
    const featuredProductsSection = document.querySelector('.featured-products');

    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button>Add to Cart</button>
        `;

        featuredProductsSection.appendChild(productCard);
    });
}

// Call function to display featured products
displayFeaturedProducts();