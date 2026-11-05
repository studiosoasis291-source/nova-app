// profile.js - NOVA Profile & Security Functions

const setPinBtn = document.getElementById('btn-set-pin');
const biometricsBtn = document.getElementById('btn-biometrics');
const supportBtn = document.getElementById('btn-support');

// 1. Mock PIN Setup
setPinBtn.addEventListener('click', function() {
    let pin = prompt("Enter a 4-digit PIN for your demo account:");
    if (pin && pin.length === 4 && !isNaN(pin)) {
        alert("Demo PIN successfully set! Your account is now more secure.");
        setPinBtn.textContent = "🔒 Change Demo PIN";
        setPinBtn.style.color = "#2ecc71"; // Turn text emerald green
    } else {
        alert("Invalid PIN. Please enter exactly 4 numbers.");
    }
});

// 2. Mock Biometrics Toggle
biometricsBtn.addEventListener('click', function() {
    let confirmBio = confirm("Do you want to enable simulated Face ID / Fingerprint for NOVA?");
    if (confirmBio) {
        alert("Biometrics enabled successfully (Demo Mode).");
        biometricsBtn.textContent = "👆 Biometrics: ON";
        biometricsBtn.style.color = "#2ecc71"; // Turn text emerald green
    }
});

// 3. Mock Support
supportBtn.addEventListener('click', function() {
    alert("NOVA Support:\n\nAs this is a demo environment, real support is not yet active. Thanks for exploring NOVA!");
});