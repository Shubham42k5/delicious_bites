document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("login-message");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Stop form from refreshing the page
  
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      const validEmail = "astha@gemail.com";
      const validPassword = "12345";
  
      if (email === validEmail && password === validPassword) {
        loginMessage.style.display = "block"; // Show success message
  
        // Optional: Redirect to home page after 2 seconds
        setTimeout(() => {
          window.location.href = "index.html"; // Replace with your homepage
        }, 2000);
      } else {
        alert("❌ Invalid email or password.");
      }
    });
    
  });
  
  document.addEventListener("DOMContentLoaded", function () {
  const useLocationBtn = document.getElementById("useLocationBtn");
  const locationResult = document.getElementById("locationResult");
  const zipForm = document.getElementById("zipForm");
  const zipInput = document.getElementById("zipInput");

  let map;

  // Function to show location on the map
  function showMap(lat, lon, label) {
    if (!map) {
      map = L.map('map').setView([lat, lon], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    } else {
      map.setView([lat, lon], 13);
    }

    L.marker([lat, lon]).addTo(map)
      .bindPopup(label)
      .openPopup();
  }

  // Use My Current Location
  useLocationBtn.addEventListener("click", function () {
    locationResult.textContent = "Detecting your current location...";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          locationResult.textContent = Your location: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)};
          showMap(lat, lon, "You are here!");
        },
        function () {
          locationResult.textContent = "Failed to get location. Please allow permission.";
        }
      );
    } else {
      locationResult.textContent = "Geolocation not supported by your browser.";
    }
  });

  // ZIP code lookup using OpenStreetMap Nominatim API
  zipForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const zip = zipInput.value.trim();
    if (zip === "") return;

    locationResult.textContent = "Looking up ZIP code...";

    fetch(https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=India&format=json)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          locationResult.textContent = ZIP ${zip} found: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)};
          showMap(lat, lon, ZIP Code: ${zip});
        } else {
          locationResult.textContent = "No location found for that ZIP code.";
        }
      })
      .catch(() => {
        locationResult.textContent = "Error finding location. Try again.";
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const orderForm = document.getElementById("order-form");
  let map;

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const address = document.getElementById("address").value;

    fetch(https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)})
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          if (!map) {
            map = L.map('map').setView([lat, lon], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
          } else {
            map.setView([lat, lon], 15);
          }

          L.marker([lat, lon]).addTo(map).bindPopup("Delivery Address").openPopup();
          document.getElementById("paymentModal").style.display = "block";
        } else {
          alert("Could not locate the address. Please check and try again.");
        }
      })
      .catch(() => {
        alert("Error occurred while locating address.");
      });
  });
});

function selectPayment(method) {
  if (method === "online") {
    alert("Redirecting to online payment gateway... (demo)");
  } else if (method === "cod") {
    alert("You selected Cash on Delivery.");
  }

  document.getElementById("paymentModal").style.display = "none";
  window.location.href = "order-success.html";
}