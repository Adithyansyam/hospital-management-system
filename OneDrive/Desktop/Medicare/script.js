document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    // Check if username is "medicare" (case-insensitive)
    if (username.toLowerCase() === 'medicare' && password) {
        // Show success message
        messageDiv.textContent = 'Login successful! Redirecting...';
        messageDiv.className = 'message success';
        
        // Redirect to another page after a short delay
        setTimeout(() => {
            // You can replace this with your actual redirect URL
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        // Show error message
        messageDiv.textContent = 'Invalid username or password. Please try again.';
        messageDiv.className = 'message error';
    }
});
