javascript
document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    // You can perform further actions like sending this data to a server or displaying a success message
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Address:', address);
});