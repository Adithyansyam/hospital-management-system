document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    // Check if username is "medicare" and password is "Medicare@123" (case-sensitive)
    if (username === 'medicare' && password === 'Medicare@123') {
        // Show success message
        messageDiv.textContent = 'Login successful! Redirecting...';
        messageDiv.className = 'message success';
        
        // Redirect to the homepage after a short delay
        setTimeout(() => {
            window.location.href = 'homepage.html';
        }, 1500);
    } else {
        // Show error message
        messageDiv.textContent = 'Invalid username or password. Please try again.';
        messageDiv.className = 'message error';
    }
});
