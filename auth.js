// auth.js - Ye har protected page me include karna hoga

const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds

function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const loginTime = localStorage.getItem('loginTime');
    
    // Agar authenticated nahi hai
    if (!isAuthenticated || isAuthenticated !== 'true') {
        redirectToLogin();
        return false;
    }
    
    // Session timeout check
    if (loginTime) {
        const currentTime = new Date().getTime();
        const sessionTime = currentTime - parseInt(loginTime);
        
        if (sessionTime > SESSION_DURATION) {
            // Auto logout - session expired
            logout();
            alert('Your session has expired. Please login again.');
            return false;
        } else {
            // Update session time on activity
            localStorage.setItem('loginTime', currentTime.toString());
        }
    } else {
        logout();
        return false;
    }
    
    return true;
}

function redirectToLogin() {
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    redirectToLogin();
}

// User activity pe session time update karo
document.addEventListener('click', function() {
    if (localStorage.getItem('isAuthenticated') === 'true') {
        localStorage.setItem('loginTime', new Date().getTime().toString());
    }
});

document.addEventListener('keypress', function() {
    if (localStorage.getItem('isAuthenticated') === 'true') {
        localStorage.setItem('loginTime', new Date().getTime().toString());
    }
});

// Page load pe check karo
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Agar login page pe nahi hai, toh authentication check karo
    if (currentPage !== 'index.html') {
        if (!checkAuth()) {
            return;
        }
        
        // Session timer display (optional)
        startSessionTimer();
    }
});

// Session timer display ke liye (optional)
function startSessionTimer() {
    const timerElement = document.getElementById('sessionTimer');
    if (!timerElement) return;
    
    function updateTimer() {
        const loginTime = parseInt(localStorage.getItem('loginTime'));
        const currentTime = new Date().getTime();
        const elapsed = currentTime - loginTime;
        const remaining = SESSION_DURATION - elapsed;
        
        if (remaining <= 0) {
            logout();
            return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        timerElement.textContent = `Session expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);

}
