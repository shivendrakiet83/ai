// script.js
document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Form validation - You can add more validation rules as needed
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (name.trim() === '' || email.trim() === '') {
        alert('Name and Email are required!');
    } else {
        // Assume form is valid and show confirmation
        window.location.href = 'confirmation.html';
    }
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Form validation - You can add more validation rules as needed
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        alert('Name, Email, and Message are required!');
    } else {
        // Assume form is valid - You can add logic to handle form submission
        alert('Message sent successfully!');
    }
});