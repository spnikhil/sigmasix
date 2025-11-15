// Social Service Motivational Quotes Database
const socialQuotes = [
    {
        text: "The best way to find yourself is to lose yourself in the service of others.",
        author: "Mahatma Gandhi"
    },
    {
        text: "We make a living by what we get, but we make a life by what we give.",
        author: "Winston Churchill"
    },
    {
        text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.",
        author: "Ralph Waldo Emerson"
    },
    {
        text: "Service to others is the rent you pay for your room here on earth.",
        author: "Muhammad Ali"
    },
    {
        text: "No one has ever become poor by giving.",
        author: "Anne Frank"
    },
    {
        text: "The smallest act of kindness is worth more than the grandest intention.",
        author: "Oscar Wilde"
    },
    {
        text: "We rise by lifting others.",
        author: "Robert Ingersoll"
    },
    {
        text: "What we do for ourselves dies with us. What we do for others and the world remains and is immortal.",
        author: "Albert Pine"
    },
    {
        text: "The meaning of life is to find your gift. The purpose of life is to give it away.",
        author: "Pablo Picasso"
    },
    {
        text: "Help others without any reason and give without the expectation of receiving anything in return.",
        author: "Roy T. Bennett"
    },
    {
        text: "A kind gesture can reach a wound that only compassion can heal.",
        author: "Steve Maraboli"
    },
    {
        text: "The best time to plant a tree was 20 years ago. The second best time is now.",
        author: "Chinese Proverb"
    },
    {
        text: "You have not lived today until you have done something for someone who can never repay you.",
        author: "John Bunyan"
    },
    {
        text: "The world is changed by your example, not by your opinion.",
        author: "Paulo Coelho"
    },
    {
        text: "Small acts, when multiplied by millions of people, can transform the world.",
        author: "Howard Zinn"
    }
];

// Morning greeting database
const morningGreetings = [
    {
        greeting: "Good Morning",
        subtitle: "Small acts, when multiplied by millions, can transform the world!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Rise and shine! Time to spread kindness and compassion!"
    },
    {
        greeting: "Good Morning", 
        subtitle: "New day, new opportunities to make a difference!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Wake up with purpose, go to bed with satisfaction of service!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Your kindness today can change someone's world!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Great communities begin with great individuals!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Another day to write your story of service!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Seize the day and make someone smile!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Today's compassion shapes tomorrow's world!"
    },
    {
        greeting: "Good Morning",
        subtitle: "Start your day with purpose and humanitarian spirit!"
    }
];

// DOM Elements
const currentDateElement = document.getElementById('currentDate');
const quoteTextElement = document.getElementById('quoteText');
const quoteAuthorElement = document.getElementById('quoteAuthor');
const greetingText = document.getElementById('greetingText');
const greetingSubtitle = document.getElementById('greetingSubtitle');
const downloadBtn = document.getElementById('downloadBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const resetBtn = document.getElementById('resetBtn');
const dashboard = document.getElementById('dashboard');
const clickSound = document.getElementById('clickSound');
const successSound = document.getElementById('successSound');

// Initialize the application
function initApp() {
    updateDate();
    updateGreeting();
    displayRandomQuote();
    setupEventListeners();
    createFloatingSymbols();
    preloadLogo();
    addCustomStyles();
}

// Preload logo to ensure it's available for download
function preloadLogo() {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = 'sankalp-shakti-logo.png';
    logoImg.onload = function() {
        console.log('Logo loaded successfully');
    };
    logoImg.onerror = function() {
        console.log('Logo not found, using fallback');
        createFallbackLogo();
    };
}

// Create fallback logo using canvas
function createFallbackLogo() {
    const logoElement = document.querySelector('.logo');
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    // Draw Sankalp Shakti logo with humanitarian colors
    const gradient = ctx.createLinearGradient(0, 0, 120, 120);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(0.5, '#8BC34A');
    gradient.addColorStop(1, '#CDDC39');
    
    ctx.fillStyle = gradient;
    ctx.font = 'bold 35px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤝', 60, 60);
    
    // Convert to data URL and set as background
    const dataURL = canvas.toDataURL('image/png');
    
    // Create img element
    const img = document.createElement('img');
    img.src = dataURL;
    img.alt = 'Sankalp Shakti Logo';
    img.className = 'logo-image';
    
    // Clear logo container and add new image
    logoElement.innerHTML = '';
    logoElement.appendChild(img);
}

// Update the current date
function updateDate() {
    const now = new Date();
    const options = { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('en-US', options);
    currentDateElement.textContent = formattedDate;
}

// Update greeting based on time of day
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    
    let timeBasedGreeting = "Good Morning";
    
    if (hour < 12) {
        timeBasedGreeting = "Good Morning";
    } else if (hour < 17) {
        timeBasedGreeting = "Good Afternoon";
    } else {
        timeBasedGreeting = "Good Evening";
    }
    
    // Get random morning greeting
    const randomGreeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
    
    greetingText.textContent = timeBasedGreeting;
    greetingSubtitle.textContent = randomGreeting.subtitle;
    
    // Create floating particles
    createGreetingParticles();
}

// Create floating particles for greeting
function createGreetingParticles() {
    const greetingContainer = document.querySelector('.greeting-container');
    
    // Remove existing particles
    const existingParticles = greetingContainer.querySelector('.greeting-particles');
    if (existingParticles) {
        existingParticles.remove();
    }
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'greeting-particles';
    
    // Create 12 particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const left = 5 + Math.random() * 90;
        const top = 10 + Math.random() * 80;
        
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.background = `hsl(${45 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%)`;
        particle.style.boxShadow = `0 0 ${8 + Math.random() * 8}px currentColor`;
        
        particlesContainer.appendChild(particle);
    }
    
    greetingContainer.appendChild(particlesContainer);
}

// Display a random social service quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * socialQuotes.length);
    const quote = socialQuotes[randomIndex];
    
    quoteTextElement.textContent = `"${quote.text}"`;
    quoteAuthorElement.textContent = `- ${quote.author}`;
    
    // Play click sound
    playSound('click');
}

// Create additional floating symbols
function createFloatingSymbols() {
    const symbolsContainer = document.querySelector('.humanity-symbols');
    const symbols = ['❤️', '🤝', '🌍', '🙏', '💫', '🌟', '🕊️', '✨', '🌱', '💝', '🌞', '🌈', '🎗️', '💞', '🌺'];
    
    // Add more symbols for better effect
    for (let i = 0; i < 25; i++) {
        const symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.left = `${Math.random() * 100}%`;
        symbol.style.top = `${Math.random() * 100}%`;
        symbol.style.animationDelay = `${Math.random() * 30}s`;
        symbol.style.animationDuration = `${25 + Math.random() * 30}s`;
        symbol.style.fontSize = `${20 + Math.random() * 35}px`;
        symbol.style.opacity = `${0.2 + Math.random() * 0.6}`;
        symbol.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(${0.8 + Math.random() * 0.4})`;
        symbolsContainer.appendChild(symbol);
    }
}

// Setup event listeners for buttons
function setupEventListeners() {
    downloadBtn.addEventListener('click', downloadImage);
    whatsappBtn.addEventListener('click', shareToWhatsApp);
    resetBtn.addEventListener('click', resetQuoteAndGreeting);
    
    // Add hover sound effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => playSound('click'));
        button.addEventListener('click', () => playSound('click'));
    });
}

// Play sound effects
function playSound(type) {
    try {
        if (type === 'click') {
            clickSound.currentTime = 0;
            clickSound.volume = 0.3;
            clickSound.play().catch(e => console.log('Sound play prevented:', e));
        } else if (type === 'success') {
            successSound.currentTime = 0;
            successSound.volume = 0.4;
            successSound.play().catch(e => console.log('Sound play prevented:', e));
        }
    } catch (error) {
        console.log('Sound error:', error);
    }
}

// Reset both quote and greeting
function resetQuoteAndGreeting() {
    displayRandomQuote();
    updateGreeting();
    showNotification('✨ New inspiration loaded!');
}

// Create a solid color version for download - FIXED VERSION
function createDownloadVersion() {
    return new Promise((resolve) => {
        // Clone the dashboard
        const clone = dashboard.cloneNode(true);
        
        // FIX: Remove all transitions and animations
        const allElements = clone.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.transition = 'none';
            el.style.animation = 'none';
            el.style.transform = 'none';
        });
        
        // Fix foundation name for download
        const foundationName = clone.querySelector('.foundation-name');
        if (foundationName) {
            foundationName.style.backgroundImage = 'none';
            foundationName.style.color = '#4CAF50';
            foundationName.style.webkitBackgroundClip = 'initial';
            foundationName.style.backgroundClip = 'initial';
            foundationName.style.fontWeight = '800';
        }
        
        // Fix greeting text for download
        const greetingText = clone.querySelector('.greeting-text');
        if (greetingText) {
            greetingText.style.backgroundImage = 'none';
            greetingText.style.color = '#FF9800';
            greetingText.style.webkitBackgroundClip = 'initial';
            greetingText.style.backgroundClip = 'initial';
            greetingText.style.fontWeight = '800';
        }
        
        // Fix logo for download
        const logo = clone.querySelector('.logo');
        if (logo) {
            logo.style.backgroundImage = 'none';
            logo.style.backgroundColor = '#1a2f3b';
        }
        
        // Remove particles for download
        const particles = clone.querySelector('.greeting-particles');
        if (particles) {
            particles.remove();
        }
        
        // Remove floating symbols
        const symbols = clone.querySelector('.humanity-symbols');
        if (symbols) {
            symbols.remove();
        }
        
        // Remove glow effects
        const glowEffects = clone.querySelectorAll('.glow-effect-1, .glow-effect-2');
        glowEffects.forEach(glow => glow.remove());
        
        // Hide buttons container
        const buttonsContainer = clone.querySelector('.buttons-container');
        if (buttonsContainer) {
            buttonsContainer.style.display = 'none';
        }
        
        // FIX: Set fixed dimensions and ensure proper layout
        clone.style.width = '800px';
        clone.style.height = 'auto';
        clone.style.margin = '0 auto';
        clone.style.position = 'fixed';
        clone.style.left = '0';
        clone.style.top = '0';
        clone.style.zIndex = '-9999';
        clone.style.opacity = '1';
        clone.style.visibility = 'visible';
        
        // FIX: Ensure proper background
        clone.style.background = 'rgba(25, 45, 35, 0.95)';
        clone.style.backdropFilter = 'none';
        
        document.body.appendChild(clone);
        
        // Wait for layout to stabilize
        setTimeout(() => {
            resolve(clone);
        }, 200);
    });
}

// Download the dashboard as an image - FIXED VERSION
function downloadImage() {
    // Show loading state
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span>📸 Capturing...</span>';
    downloadBtn.disabled = true;
    
    // Play sound
    playSound('click');
    
    // Store original states
    const originalStates = {
        buttonsContainer: document.querySelector('.buttons-container').style.display,
        symbols: document.querySelector('.humanity-symbols').style.display,
        topNav: document.querySelector('.top-nav').style.display
    };
    
    // Hide elements for clean screenshot
    document.querySelector('.buttons-container').style.display = 'none';
    document.querySelector('.humanity-symbols').style.display = 'none';
    document.querySelector('.top-nav').style.display = 'none';
    
    // Create a optimized version for download
    createDownloadVersion().then((clone) => {
        // FIX: Use better html2canvas configuration
        html2canvas(clone, {
            scale: 3, // Higher scale for better quality
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#1a2f3b',
            logging: true,
            width: 800,
            height: clone.scrollHeight,
            windowWidth: 800,
            windowHeight: clone.scrollHeight,
            onclone: function(clonedDoc, clonedElement) {
                // FIX: Ensure all text is properly rendered
                const textElements = clonedElement.querySelectorAll('h1, h2, h3, p, span, div');
                textElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                    el.style.color = window.getComputedStyle(el).color;
                    el.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
                    el.style.fontWeight = 'normal';
                });
                
                // FIX: Specifically ensure contact info is readable
                const contactItems = clonedElement.querySelectorAll('.contact-item');
                contactItems.forEach(item => {
                    item.style.background = 'rgba(255, 255, 255, 0.05)';
                    item.style.borderRadius = '10px';
                    item.style.padding = '1rem';
                });
                
                const contactValues = clonedElement.querySelectorAll('.contact-value');
                contactValues.forEach(value => {
                    value.style.color = '#69F0AE';
                    value.style.fontWeight = '700';
                });
                
                // FIX: Ensure quote is properly formatted
                const quoteText = clonedElement.querySelector('.quote-text');
                if (quoteText) {
                    quoteText.style.fontSize = '1.5rem';
                    quoteText.style.lineHeight = '1.6';
                    quoteText.style.color = '#E8F5E8';
                }
                
                const quoteAuthor = clonedElement.querySelector('.quote-author');
                if (quoteAuthor) {
                    quoteAuthor.style.color = '#C8E6C9';
                    quoteAuthor.style.fontWeight = '600';
                }
            }
        }).then(canvas => {
            // Convert canvas to data URL
            const imageData = canvas.toDataURL('image/png', 1.0);
            
            // Create download link
            const link = document.createElement('a');
            const fileName = `sankalp-shakti-inspiration-${new Date().toISOString().split('T')[0]}.png`;
            link.download = fileName;
            link.href = imageData;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up clone
            if (clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
            
            // Restore elements
            document.querySelector('.buttons-container').style.display = originalStates.buttonsContainer;
            document.querySelector('.humanity-symbols').style.display = originalStates.symbols;
            document.querySelector('.top-nav').style.display = originalStates.topNav;
            
            // Restore button state
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            
            // Play success sound
            playSound('success');
            
            // Show success message
            showNotification('🎉 Image downloaded successfully!');
            
        }).catch(error => {
            console.error('Error capturing image:', error);
            
            // Clean up clone
            if (clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
            
            // Restore elements
            document.querySelector('.buttons-container').style.display = originalStates.buttonsContainer;
            document.querySelector('.humanity-symbols').style.display = originalStates.symbols;
            document.querySelector('.top-nav').style.display = originalStates.topNav;
            
            // Restore button state
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            
            // Show error message
            showNotification('❌ Error downloading image. Please try again.');
        });
    });
}

// Share to WhatsApp as Image
function shareToWhatsApp() {
    // Show loading state
    const originalText = whatsappBtn.innerHTML;
    whatsappBtn.innerHTML = '<span>🔄 Preparing...</span>';
    whatsappBtn.disabled = true;
    
    // Play sound
    playSound('click');
    
    // Hide elements for clean screenshot
    const buttonsContainer = document.querySelector('.buttons-container');
    const originalDisplay = buttonsContainer.style.display;
    buttonsContainer.style.display = 'none';
    
    const symbols = document.querySelector('.humanity-symbols');
    symbols.style.display = 'none';
    
    const topNav = document.querySelector('.top-nav');
    topNav.style.display = 'none';
    
    // Create optimized version for sharing
    createDownloadVersion().then((clone) => {
        // Use html2canvas to capture the optimized clone
        html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#1a2f3b',
            logging: false
        }).then(canvas => {
            // Convert canvas to data URL
            const imageData = canvas.toDataURL('image/png');
            
            // Clean up clone
            if (clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
            
            // Try to share using Web Share API
            if (navigator.share) {
                canvas.toBlob(function(blob) {
                    const file = new File([blob], "sankalp-shakti-inspiration.png", { type: "image/png" });
                    
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        navigator.share({
                            files: [file],
                            title: 'Sankalp Shakti Social Foundation',
                            text: 'Check out this inspiring message from Sankalp Shakti Social Foundation! 🌟'
                        }).then(() => {
                            console.log('Share successful');
                            playSound('success');
                        }).catch((error) => {
                            console.log('Sharing failed', error);
                            shareImageViaWhatsAppFallback(imageData);
                        });
                    } else {
                        shareImageViaWhatsAppFallback(imageData);
                    }
                });
            } else {
                shareImageViaWhatsAppFallback(imageData);
            }
            
            // Restore elements
            buttonsContainer.style.display = originalDisplay;
            symbols.style.display = 'block';
            topNav.style.display = 'block';
            
            // Restore button state
            whatsappBtn.innerHTML = originalText;
            whatsappBtn.disabled = false;
            
        }).catch(error => {
            console.error('Error capturing image for WhatsApp:', error);
            
            // Clean up clone
            if (clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
            
            // Restore elements
            buttonsContainer.style.display = originalDisplay;
            symbols.style.display = 'block';
            topNav.style.display = 'block';
            
            // Restore button state
            whatsappBtn.innerHTML = originalText;
            whatsappBtn.disabled = false;
            
            // Fallback to text sharing
            shareTextViaWhatsApp();
        });
    });
}

// Fallback function to share image via WhatsApp
function shareImageViaWhatsAppFallback(imageData) {
    // Create download link
    const link = document.createElement('a');
    link.download = 'sankalp-shakti-inspiration.png';
    link.href = imageData;
    
    // Create WhatsApp message
    const greeting = greetingText.textContent;
    const subtitle = greetingSubtitle.textContent;
    const quote = quoteTextElement.textContent;
    const author = quoteAuthorElement.textContent;
    
    const message = `🌟 *Sankalp Shakti Social Foundation* 🌟\n\n${greeting}! ${subtitle}\n\n💫 *Today's Inspiration:*\n${quote}\n${author}\n\n🌐 sankalpshaktisocialfoundation.org\n📧 sankalpshakti6@gmail.com\n📞 +91-951-951-8525\n\n*Together, we can make a difference!* 🤝`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    playSound('success');
}

// Fallback function to share text via WhatsApp
function shareTextViaWhatsApp() {
    const greeting = greetingText.textContent;
    const subtitle = greetingSubtitle.textContent;
    const quote = quoteTextElement.textContent;
    const author = quoteAuthorElement.textContent;
    const date = currentDateElement.textContent;
    
    const message = `🌟 *Sankalp Shakti Social Foundation* 🌟\n\n${greeting}! ${subtitle}\n\n💫 *Today's Inspiration:*\n${quote}\n${author}\n\n📅 ${date}\n\n🌐 sankalpshaktisocialfoundation.org\n📧 sankalpshakti6@gmail.com\n📞 +91-951-951-8525\n\n*Together, we can make a difference!* 🤝`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    playSound('success');
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Add custom styles for better rendering
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .foundation-name-download {
            color: #4CAF50 !important;
            background-image: none !important;
            -webkit-background-clip: initial !important;
            background-clip: initial !important;
            font-weight: bold !important;
        }
        
        .greeting-text-download {
            color: #FF9800 !important;
            background-image: none !important;
            -webkit-background-clip: initial !important;
            background-clip: initial !important;
        }
        
        /* Fix for download layout */
        .dashboard-download {
            transform: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Add resize handler for responsive symbols
window.addEventListener('resize', function() {
    const symbols = document.querySelectorAll('.symbol');
    symbols.forEach(symbol => {
        symbol.style.left = `${Math.random() * 100}%`;
        symbol.style.top = `${Math.random() * 100}%`;
    });
});

// REMOVE 3D EFFECTS - Comment out or remove these lines
/*
dashboard.addEventListener('mousemove', function(e) {
    // Remove 3D effect
});

dashboard.addEventListener('mouseleave', function() {
    // Remove 3D effect  
});
*/