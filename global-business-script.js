// Financial quotes array
const financialQuotes = [
    "The stock market is filled with individuals who know the price of everything, but the value of nothing. - Philip Fisher",
    "In investing, what is comfortable is rarely profitable. - Robert Arnott",
    "The most important quality for an investor is temperament, not intellect. - Warren Buffett",
    "Every once in a while, the market does something so stupid it takes your breath away. - Jim Cramer",
    "The individual investor should act consistently as an investor and not as a speculator. - Benjamin Graham",
    "Risk comes from not knowing what you're doing. - Warren Buffett",
    "The four most dangerous words in investing are: 'this time it's different.' - Sir John Templeton",
    "If you aren't thinking about owning a stock for ten years, don't even think about owning it for ten minutes. - Warren Buffett",
    "We simply attempt to be fearful when others are greedy and to be greedy only when others are fearful. - Warren Buffett",
    "The goal of the non-professional should not be to pick winners but to own a cross-section of businesses that in aggregate are bound to do well. - Warren Buffett",
    "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for. - Robert Kiyosaki",
    "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver. - Ayn Rand",
    "Do not save what is left after spending, but spend what is left after saving. - Warren Buffett",
    "The best investment you can make is in yourself. - Warren Buffett",
    "Financial freedom is available to those who learn about it and work for it. - Robert Kiyosaki"
];

// DOM Elements
const greetingElement = document.getElementById('greeting');
const dateElement = document.getElementById('currentDate');
const quoteElement = document.getElementById('quoteText');
const refreshButton = document.getElementById('refreshQuote');
const downloadButton = document.getElementById('downloadCard');
const shareButton = document.getElementById('shareWhatsApp');
const cardElement = document.getElementById('greetingCard');

// Set current date
function setCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Set greeting based on time of day
function setGreeting() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) {
        greetingElement.textContent = "Good Morning";
    } else if (hour < 18) {
        greetingElement.textContent = "Good Afternoon";
    } else {
        greetingElement.textContent = "Good Evening";
    }
}

// Get random quote
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * financialQuotes.length);
    return financialQuotes[randomIndex];
}

// Update quote
function updateQuote() {
    quoteElement.textContent = getRandomQuote();
}

// Create optimized version for sharing
function createOptimizedVersion() {
    return new Promise((resolve) => {
        // Get original dimensions BEFORE cloning
        const originalWidth = cardElement.offsetWidth;
        const originalHeight = cardElement.scrollHeight;
        
        const clone = cardElement.cloneNode(true);
        
        // Remove buttons from clone
        const footerButtons = clone.querySelector('.card-footer');
        if (footerButtons) {
            footerButtons.remove();
        }

        // Apply fixed dimensions to prevent stretching
        clone.style.width = originalWidth + 'px';
        clone.style.height = 'auto';
        clone.style.minHeight = originalHeight + 'px';
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.zIndex = '-9999';
        clone.style.background = 'white';
        clone.style.color = '#333';
        clone.style.boxSizing = 'border-box';
        clone.style.overflow = 'visible';
        clone.style.margin = '0';
        clone.style.padding = '0';

        // Remove animations and ensure all content is visible
        clone.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });

        document.body.appendChild(clone);
        
        // Wait for rendering and fonts to load
        setTimeout(() => {
            resolve({
                clone: clone,
                width: originalWidth,
                height: originalHeight
            });
        }, 500);
    });
}

// Download card as image - WITHOUT BUTTONS
function downloadCard() {
    const originalText = downloadButton.innerHTML;
    downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    downloadButton.disabled = true;

    // Create a clone without buttons
    const clone = cardElement.cloneNode(true);
    
    // Remove buttons section from clone
    const cardFooter = clone.querySelector('.card-footer');
    if (cardFooter) {
        cardFooter.remove();
    }
    
    // Remove any white background from card body
    const cardBody = clone.querySelector('.card-body');
    if (cardBody) {
        cardBody.style.paddingBottom = '0'; // Remove bottom padding
    }

    // Apply styles to clone
    clone.style.width = cardElement.offsetWidth + 'px';
    clone.style.height = 'auto';
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.zIndex = '-9999';
    clone.style.background = 'white';
    clone.style.boxSizing = 'border-box';

    document.body.appendChild(clone);

    // Wait for clone to render
    setTimeout(() => {
        html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            width: clone.offsetWidth,
            height: clone.scrollHeight,
            windowWidth: clone.offsetWidth,
            windowHeight: clone.scrollHeight,
            onclone: function(clonedDoc, clonedElement) {
                // Final cleanup
                clonedElement.style.overflow = 'visible';
                
                // Ensure profile image is perfect
                const profileImage = clonedElement.querySelector('.profile-image img');
                if (profileImage) {
                    profileImage.style.objectFit = 'cover';
                    profileImage.style.objectPosition = 'center 20%';
                    profileImage.style.transform = 'scale(0.85)';
                }
            }
        }).then(canvas => {
            const imageData = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            const fileName = `global-business-greeting-${new Date().toISOString().split('T')[0]}.png`;
            link.download = fileName;
            link.href = imageData;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup
            clone.remove();
            
            downloadButton.innerHTML = '<i class="fas fa-download"></i> Download';
            downloadButton.disabled = false;
            showNotification('🎉 Image downloaded successfully!');
            
        }).catch(error => {
            console.error('Error capturing image:', error);
            clone.remove();
            downloadButton.innerHTML = '<i class="fas fa-download"></i> Download';
            downloadButton.disabled = false;
            showNotification('❌ Error downloading image. Please try again.');
        });
    }, 500);
}

// WhatsApp Image Share Function - SAME AS DOWNLOAD IMAGE
async function shareToWhatsApp() {
    const originalText = shareButton.innerHTML;
    shareButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
    shareButton.disabled = true;

    try {
        // Create the SAME clone as download function (without buttons)
        const clone = cardElement.cloneNode(true);
        
        // Remove buttons section from clone (SAME AS DOWNLOAD)
        const cardFooter = clone.querySelector('.card-footer');
        if (cardFooter) {
            cardFooter.remove();
        }
        
        // Remove any white background from card body (SAME AS DOWNLOAD)
        const cardBody = clone.querySelector('.card-body');
        if (cardBody) {
            cardBody.style.paddingBottom = '0';
        }

        // Apply styles to clone (SAME AS DOWNLOAD)
        clone.style.width = cardElement.offsetWidth + 'px';
        clone.style.height = 'auto';
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.zIndex = '-9999';
        clone.style.background = 'white';
        clone.style.boxSizing = 'border-box';

        document.body.appendChild(clone);

        // Wait for clone to render
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture as canvas with high quality (SAME AS DOWNLOAD)
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            width: clone.offsetWidth,
            height: clone.scrollHeight,
            windowWidth: clone.offsetWidth,
            windowHeight: clone.scrollHeight
        });

        // Cleanup clone
        clone.remove();

        // Convert canvas to blob
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 0.9);
        });

        // Create WhatsApp message
        const quote = quoteElement.textContent;
        const greeting = greetingElement.textContent;
        const date = dateElement.textContent;
        
        const message = `🌟 ${greeting} from Global Business! 🌟\n\n"${quote}"\n\n- Rajesh Mishra, Founder & CEO\nGlobal Business\n\n📅 ${date}\n\n*Invest Smart, Grow Global!* 🌍`;

        // Method 1: Try Web Share API first (for mobile devices)
        if (navigator.share && navigator.canShare) {
            const file = new File([blob], "global-business-greeting.png", { 
                type: "image/png" 
            });
            
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Global Business Greeting',
                    text: message
                });
                
                showNotification('✅ Image shared successfully via WhatsApp!');
                return;
            }
        }

        // Method 2: For Desktop - Download image + open WhatsApp with message
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Auto-download the image
        const imageUrl = URL.createObjectURL(blob);
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'global-business-greeting.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup blob URL after download
            setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
        }, 1000);

        showNotification('📱 WhatsApp opened! Download the image and share it.');

    } catch (error) {
        console.error('WhatsApp share error:', error);
        
        // Fallback: Text-only sharing
        shareTextViaWhatsApp();
        showNotification('📤 Sharing text version via WhatsApp');
    } finally {
        // Restore button state
        shareButton.innerHTML = '<i class="fab fa-whatsapp"></i> Share Image';
        shareButton.disabled = false;
    }
}

// Fallback: Text-only WhatsApp sharing
function shareTextViaWhatsApp() {
    const greeting = greetingElement.textContent;
    const quote = quoteElement.textContent;
    const date = dateElement.textContent;
    
    const message = `🌟 *${greeting} from Global Business!* 🌟\n\n"${quote}"\n\n- Rajesh Mishra, Founder & CEO\nGlobal Business\n\n📅 ${date}\n\n*Invest Smart, Grow Global!* 🌍`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Show notification
function showNotification(message) {
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'linear-gradient(135deg, #1a2a6c, #2a3a9c)';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 4px 15px rgba(26, 42, 108, 0.6)';
    notification.style.zIndex = '10000';
    notification.style.fontWeight = '600';
    notification.style.fontSize = '14px';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    notification.style.border = '1px solid rgba(255,255,255,0.2)';
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Event Listeners
refreshButton.addEventListener('click', updateQuote);
downloadButton.addEventListener('click', downloadCard);
shareButton.addEventListener('click', shareToWhatsApp);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setGreeting();
    setCurrentDate();
    updateQuote();
});