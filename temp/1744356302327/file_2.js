document.getElementById("reservationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    
    // You can add further logic here like sending data to a server or displaying a confirmation message
    
    console.log("Reservation Details:");
    console.log("Name: " + name);
    console.log("Email: " + email);
    console.log("Date: " + date);
    console.log("Time: " + time);
});