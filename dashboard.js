// dashboard.js - Enhanced Crypto Dashboard Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sigma Six Dashboard - Quantum Systems Online');
    
    // Initialize dashboard effects
    initDashboardEffects();
    
    // Start session timer
    startSessionTimer();
    
    // Add interactive effects
    addCardInteractions();
    
    // System status animation
    startSystemAnimations();
});

function initDashboardEffects() {
    // Add random glitch effects to title
    setInterval(() => {
        if (Math.random() < 0.1) {
            const title = document.querySelector('.title-glitch');
            title.style.animation = 'none';
            setTimeout(() => {
                title.style.animation = 'textGlitch 6s infinite';
            }, 50);
        }
    }, 5000);
    
    // Add particle effects to cards on hover
    const cards = document.querySelectorAll('.cyber-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('coming-soon')) {
                createParticleEffect(this);
            }
        });
    });
}

function startSessionTimer() {
    const timerElement = document.getElementById('sessionTimer');
    if (!timerElement) return;
    
    function updateTimer() {
        const loginTime = parseInt(localStorage.getItem('loginTime'));
        const currentTime = new Date().getTime();
        const elapsed = currentTime - loginTime;
        const remaining = (20 * 60 * 1000) - elapsed;
        
        if (remaining <= 0) {
            logout();
            return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Color change based on time remaining
        if (minutes < 5) {
            timerElement.style.color = 'var(--neon-pink)';
            timerElement.style.textShadow = '0 0 10px var(--neon-pink)';
            timerElement.style.borderColor = 'var(--neon-pink)';
            timerElement.style.background = 'rgba(255, 42, 109, 0.2)';
        } else if (minutes < 10) {
            timerElement.style.color = 'var(--neon-orange)';
            timerElement.style.textShadow = '0 0 10px var(--neon-orange)';
            timerElement.style.borderColor = 'var(--neon-orange)';
            timerElement.style.background = 'rgba(255, 138, 0, 0.2)';
        } else {
            timerElement.style.color = 'var(--neon-green)';
            timerElement.style.textShadow = '0 0 10px var(--neon-green)';
            timerElement.style.borderColor = 'var(--neon-green)';
            timerElement.style.background = 'rgba(10, 252, 134, 0.2)';
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

function addCardInteractions() {
    const cards = document.querySelectorAll('.cyber-card:not(.coming-soon)');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add click feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Create ripple effect
            createRippleEffect(e, this);
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 243, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createParticleEffect(element) {
    const particles = 6;
    const colors = [
        'var(--neon-blue)',
        'var(--neon-purple)',
        'var(--neon-pink)',
        'var(--neon-green)'
    ];
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '100';
        
        const rect = element.getBoundingClientRect();
        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        element.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            {
                transform: `translate(0, 0) scale(1)`,
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        setTimeout(() => {
            particle.remove();
        }, duration);
    }
}

function startSystemAnimations() {
    // Random status updates
    setInterval(() => {
        const statusValues = document.querySelectorAll('.status-value');
        statusValues.forEach(value => {
            if (Math.random() < 0.02) {
                const originalText = value.textContent;
                value.textContent = 'SYNC...';
                value.style.color = 'var(--neon-orange)';
                
                setTimeout(() => {
                    value.textContent = originalText;
                    value.style.color = '';
                }, 500);
            }
        });
    }, 3000);
    
    // Animate welcome stats
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const originalValue = stat.textContent;
        let count = 0;
        const duration = 2000;
        const steps = 60;
        const stepValue = 100 / steps;
        
        const counter = setInterval(() => {
            count += stepValue;
            if (count >= 100) {
                stat.textContent = originalValue;
                clearInterval(counter);
            } else {
                // Add some random fluctuation for crypto feel
                const fluctuation = Math.random() * 20 - 10;
                stat.textContent = Math.floor(count + fluctuation) + '%';
            }
        }, duration / steps);
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Dashboard systems initialized successfully');