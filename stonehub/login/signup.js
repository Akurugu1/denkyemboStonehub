document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const passwordAgainInput = document.getElementById('password_again');
    const errorMessage = document.getElementById('errorMessage');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const password = passwordInput.value;
        const passwordAgain = passwordAgainInput.value;

        // Reset error message
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        // Check if passwords match
        if (password !== passwordAgain) {
            errorMessage.textContent = 'Passwords do not match. Please try again.';
            errorMessage.style.display = 'block';
            passwordAgainInput.focus();
            return;
        }

        // Basic password length validation
        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long.';
            errorMessage.style.display = 'block';
            passwordInput.focus();
            return;
        }

        // Simulate successful registration payload
        const userData = {
            name,
            email,
            address,
            password
        };

        console.log('Signup Payload:', userData);

        // Here you would typically send userData to your backend API via fetch()
        // Example:
        // fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData) })

        // Simulated success flow
        alert('Account created successfully! Redirecting to login...');
        window.location.href = 'login.html'; 
    });
});