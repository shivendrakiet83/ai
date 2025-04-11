javascript
// script.js

const form = document.getElementById('login-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = form.username.value;
    const password = form.password.value;
    
    // You can add your own login logic here
    console.log('Username:', username);
    console.log('Password:', password);
});