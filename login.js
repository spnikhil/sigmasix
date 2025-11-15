document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Default credentials
    const correctUsername = "admin";
    const correctPassword = "sigma123";
    
    if (username === correctUsername && password === correctPassword) {
        // Login successful effects
        const btn = document.querySelector('.cyber-btn');
        btn.style.background = 'linear-gradient(45deg, var(--neon-green), var(--neon-blue))';
        btn.querySelector('.btn-text').textContent = 'ACCESS GRANTED';
        
        setTimeout(() => {
            // Set login time and authentication
            const loginTime = new Date().getTime();
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('loginTime', loginTime.toString());
            
            // Redirect to main page
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } else {
        const errorElement = document.getElementById('errorMessage');
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
});

// Input animations
document.querySelectorAll('.input-container input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Agar already logged in hai toh redirect karo
window.addEventListener('load', function() {
    if (localStorage.getItem('isAuthenticated') === 'true') {
        window.location.href = 'dashboard.html';
    }
});