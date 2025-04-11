/* script.js */

const form = document.getElementById('reservation-form');
const confirmation = document.getElementById('confirmation');
const confirmationDetails = document.getElementById('confirmation-details');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const datetime = document.getElementById('datetime').value;
  const guests = document.getElementById('guests').value;
  const notes = document.getElementById('notes').value;
  
  const confirmationMessage = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Date & Time:</strong> ${datetime}</p>
    <p><strong>Guests:</strong> ${guests}</p>
    <p><strong>Notes:</strong> ${notes}</p>
  `;
  
  confirmationDetails.innerHTML = confirmationMessage;
  confirmation.style.display = 'block';
  
  form.reset();
});