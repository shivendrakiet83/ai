javascript
// script.js
document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;
    
    // You can add further processing here (e.g., sending the data to a server)
    
    alert(`Reservation Details:\nName: ${name}\nEmail: ${email}\nDate: ${date}\nGuests: ${guests}`);
});