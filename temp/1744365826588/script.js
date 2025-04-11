// script.js
const form = document.getElementById('checkout-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    
    // Display form data
    for (const [name, value] of formData) {
        console.log(`${name}: ${value}`);
    }
    
    // You can add AJAX request or other functionality here
});