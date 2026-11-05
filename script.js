// First, we tell the computer to find our green button on the homepage
const accountButton = document.querySelector('button');

// Next, we tell the computer to open the signup page when the button is clicked
accountButton.addEventListener('click', function() {
    window.location.href = "signup.html";
});