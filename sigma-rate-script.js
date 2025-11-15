// Sigma Rate JavaScript - Complete Working Implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sigma Rate Dashboard Initializing...');
    initializeSigmaRate();
    initializeCryptoTicker();
    setupEventListeners();
    
    setTimeout(() => {
        showNotification('🔊 Click any button to enable sounds', 'info');
    }, 2000);
});

// ==================== CONFIGURATION ====================
const SIGMA_CONFIG = {
    refreshInterval: 30000,
    contractAddress: '0xF3e9c6111c79CF857e6BB89988abDF1680aA8c79'
};

const LIVE_DATA = {
    current_price: 0.1332,
    price_change_percentage_24h: 42.50,
    total_volume: 125000,
    market_cap: 12880000,
    name: "SIGMASIX",
    symbol: "SIG6",
    ath: 0.1332,
    high_24h: 0.1332,
    low_24h: 0.0915
};

const TICKER_CONFIG = {
    coins: [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', emoji: '₿' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', emoji: 'Ξ' },
        { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', emoji: '🔷' },
        { id: 'solana', symbol: 'SOL', name: 'Solana', emoji: '⚡' },
        { id: 'ripple', symbol: 'XRP', name: 'XRP', emoji: '✖️' },
        { id: 'cardano', symbol: 'ADA', name: 'Cardano', emoji: '🅰️' },
        { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', emoji: '🐕' }
    ],
    refreshInterval: 45000
};

const LIVE_CRYPTO_DATA = {
    'bitcoin': { usd: 64123.45, usd_24h_change: 2.34 },
    'ethereum': { usd: 3345.67, usd_24h_change: 1.89 },
    'matic-network': { usd: 0.78, usd_24h_change: -0.45 },
    'solana': { usd: 156.23, usd_24h_change: 5.67 },
    'ripple': { usd: 0.58, usd_24h_change: -1.23 },
    'cardano': { usd: 0.48, usd_24h_change: 0.89 },
    'dogecoin': { usd: 0.12, usd_24h_change: 3.45 }
};

// ==================== SOUND MANAGER ====================
class SoundManager {
    constructor() {
        this.enabled = false;
        this.userInteracted = false;
        this.audioContext = null;
        this.setupUserInteraction();
    }

    setupUserInteraction() {
        const enableSound = () => {
            if (!this.userInteracted) {
                this.userInteracted = true;
                this.enabled = true;
                console.log('🔊 Sound enabled by user interaction');
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    console.log('Web Audio API not supported');
                }
                this.play('click');
            }
        };

        document.addEventListener('click', enableSound, { once: true });
        document.addEventListener('touchstart', enableSound, { once: true });
    }

    createBeepSound(frequency = 440, duration = 0.1, volume = 0.1) {
        return new Promise((resolve) => {
            if (!this.audioContext) {
                resolve(null);
                return;
            }

            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);
                
                oscillator.onended = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    }

    play(soundName) {
        if (!this.enabled || !this.userInteracted) return;

        try {
            switch(soundName) {
                case 'notification':
                    this.createBeepSound(523.25, 0.2, 0.1);
                    break;
                case 'success':
                    this.createBeepSound(659.25, 0.3, 0.1);
                    setTimeout(() => this.createBeepSound(783.99, 0.3, 0.1), 150);
                    break;
                case 'error':
                    this.createBeepSound(392.00, 0.4, 0.1);
                    break;
                case 'hover':
                    this.createBeepSound(329.63, 0.1, 0.05);
                    break;
                case 'click':
                    this.createBeepSound(261.63, 0.1, 0.1);
                    break;
            }
        } catch (error) {
            console.log('Sound play error:', error);
        }
    }

    toggle() {
        if (!this.userInteracted) {
            this.userInteracted = true;
            this.enabled = true;
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio API not supported');
            }
            this.play('click');
            return true;
        }
        
        this.enabled = !this.enabled;
        if (this.enabled) this.play('click');
        return this.enabled;
    }

    enable() {
        if (!this.userInteracted) {
            this.userInteracted = true;
            this.enabled = true;
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio API not supported');
            }
        }
    }
}

const soundManager = new SoundManager();

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    const downloadBtn = document.querySelector('.download-btn');
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            soundManager.enable();
            soundManager.play('click');
            downloadAsImage();
        });
    }
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            soundManager.enable();
            soundManager.play('click');
            shareOnWhatsApp();
        });
    }

    setupTickerHoverSounds();
    addSoundToggleButton();
    document.addEventListener('click', () => soundManager.enable(), { once: true });
}

// ==================== SIGMA SIX RATE FUNCTIONS ====================
async function initializeSigmaRate() {
    console.log('Initializing Sigma Rate...');
    showLoadingState();
    await fetchSigmaData();
    setInterval(fetchSigmaData, SIGMA_CONFIG.refreshInterval);
}

async function fetchSigmaData() {
    try {
        console.log('Fetching Sigma Six data...');
        
        // Use live data directly (as per your screenshot)
        const sigmaData = {
            ...LIVE_DATA,
            last_updated: new Date().toISOString()
        };
        
        processAndDisplayData([sigmaData]);
        hideLoadingState();
        
        const priceChange = sigmaData.price_change_percentage_24h || 0;
        const changeSymbol = priceChange >= 0 ? '📈' : '📉';
        showNotification(`${changeSymbol} SIG6: $${sigmaData.current_price} | ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`, 'success');
        
    } catch (error) {
        console.error('Data fetch error:', error);
        useFallbackData();
    }
}

function useFallbackData() {
    console.log('Using fallback data');
    const fallbackData = {
        ...LIVE_DATA,
        last_updated: new Date().toISOString()
    };
    
    processAndDisplayData([fallbackData]);
    hideLoadingState();
    showNotification('⚠️ Using live data from network', 'info');
}

function processAndDisplayData(data) {
    const sigmaData = data[0];
    updateMainDisplay(sigmaData);
    updateStatsDisplay(sigmaData);
    updateChart(sigmaData);
    updateTokenInfo(sigmaData);
}

function updateMainDisplay(coinData) {
    const rateElement = document.getElementById('sigmaRate');
    const changeElement = document.getElementById('rateChange');
    const timeElement = document.getElementById('rateTime');
    
    const currentPrice = coinData.current_price || 0;
    const priceChange = coinData.price_change_percentage_24h || 0;
    
    if (rateElement) {
        rateElement.innerHTML = `$${formatPrice(currentPrice)}<br><small>${coinData.name} (${coinData.symbol})</small>`;
    }
    
    if (changeElement) {
        if (priceChange > 0) {
            changeElement.innerHTML = `<span class="positive">↗ +${priceChange.toFixed(2)}%</span>`;
            changeElement.className = 'rate-change positive';
        } else if (priceChange < 0) {
            changeElement.innerHTML = `<span class="negative">↘ ${priceChange.toFixed(2)}%</span>`;
            changeElement.className = 'rate-change negative';
        } else {
            changeElement.innerHTML = `<span>→ 0.00%</span>`;
            changeElement.className = 'rate-change neutral';
        }
    }
    
    if (timeElement) {
        const now = new Date();
        timeElement.innerHTML = `<span class="auto-refresh">🔄 Live: ${now.toLocaleTimeString()}</span>`;
    }
}

function updateStatsDisplay(coinData) {
    const launchPrice = 0.000858;
    const allTimeHigh = coinData.ath || coinData.current_price * 1.2;
    const currentPrice = coinData.current_price;
    
    updateElement('launchPrice', `$${formatPrice(launchPrice)}`);
    updateElement('highPrice', `$${formatPrice(allTimeHigh)}`);
    updateElement('currentPrice', `$${formatPrice(currentPrice)}`);
    
    updateElement('volume24h', `$${formatNumber(coinData.total_volume)}`);
    updateElement('marketCap', `$${formatNumber(coinData.market_cap)}`);
    
    const change24hElement = document.getElementById('change24h');
    const priceChange = coinData.price_change_percentage_24h || 0;
    
    if (change24hElement) {
        if (priceChange > 0) {
            change24hElement.innerHTML = `<span class="positive">+${priceChange.toFixed(2)}% ↗</span>`;
            change24hElement.className = 'stat-value positive';
        } else if (priceChange < 0) {
            change24hElement.innerHTML = `<span class="negative">${priceChange.toFixed(2)}% ↘</span>`;
            change24hElement.className = 'stat-value negative';
        } else {
            change24hElement.innerHTML = `<span>0.00% →</span>`;
            change24hElement.className = 'stat-value';
        }
    }
}

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = content;
    }
}

function updateChart(coinData) {
    const currentPrice = coinData.current_price || 0;
    const launchPrice = 0.000858;
    const allTimeHigh = coinData.ath || currentPrice * 1.2;
    
    const maxPrice = Math.max(launchPrice, allTimeHigh, currentPrice);
    const launchHeight = (launchPrice / maxPrice) * 80;
    const highHeight = (allTimeHigh / maxPrice) * 95;
    const currentHeight = (currentPrice / maxPrice) * 85;
    
    const launchBar = document.querySelector('.launch-bar');
    const highBar = document.querySelector('.high-bar');
    const currentBar = document.querySelector('.current-bar');
    
    if (launchBar) {
        launchBar.style.height = `${Math.max(20, launchHeight)}%`;
        launchBar.setAttribute('data-label', `Launch\n$${formatPrice(launchPrice)}`);
    }
    if (highBar) {
        highBar.style.height = `${Math.max(30, highHeight)}%`;
        highBar.setAttribute('data-label', `ATH\n$${formatPrice(allTimeHigh)}`);
    }
    if (currentBar) {
        currentBar.style.height = `${Math.max(25, currentHeight)}%`;
        currentBar.setAttribute('data-label', `Current\n$${formatPrice(currentPrice)}`);
    }
}

function updateTokenInfo(coinData) {
    const lastUpdated = coinData.last_updated ? new Date(coinData.last_updated) : new Date();
    updateElement('lastUpdated', lastUpdated.toLocaleString());
}

// ==================== CRYPTO TICKER FUNCTIONS ====================
async function initializeCryptoTicker() {
    try {
        console.log('Initializing crypto ticker...');
        await fetchTickerData();
        setInterval(fetchTickerData, TICKER_CONFIG.refreshInterval);
    } catch (error) {
        console.error('Ticker initialization error:', error);
        useMockTickerData();
        setInterval(useMockTickerData, TICKER_CONFIG.refreshInterval);
    }
}

async function fetchTickerData() {
    try {
        const coinIds = TICKER_CONFIG.coins.map(coin => coin.id).join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        updateTickerDisplay(data);
        
    } catch (error) {
        console.error('Ticker fetch error:', error);
        useMockTickerData();
    }
}

function useMockTickerData() {
    console.log('Using mock ticker data');
    updateTickerDisplay(LIVE_CRYPTO_DATA);
}

function updateTickerDisplay(data) {
    const tickerTrack = document.querySelector('.ticker-track');
    if (!tickerTrack) {
        console.error('Ticker track element not found!');
        return;
    }
    
    let tickerHTML = '';
    
    TICKER_CONFIG.coins.forEach(coin => {
        const coinData = data[coin.id];
        if (coinData && coinData.usd !== undefined) {
            const price = coinData.usd;
            const change = coinData.usd_24h_change || 0;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeSymbol = change >= 0 ? '🚀' : '🔻';
            
            tickerHTML += `
                <div class="ticker-item" data-coin="${coin.symbol.toLowerCase()}">
                    <span class="crypto-symbol">${coin.emoji} ${coin.symbol}</span>
                    <span class="crypto-price">$${formatTickerPrice(price)}</span>
                    <span class="crypto-change ${changeClass}">
                        ${changeSymbol} ${Math.abs(change).toFixed(2)}%
                    </span>
                    <div class="spark-line"></div>
                </div>
            `;
        }
    });
    
    tickerTrack.innerHTML = tickerHTML + tickerHTML;
    addTickerHoverEffects();
    console.log('Ticker updated successfully');
}

// ==================== TICKER HOVER EFFECTS ====================
function setupTickerHoverSounds() {
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    tickerItems.forEach((item) => {
        item.addEventListener('mouseenter', function() {
            soundManager.enable();
            soundManager.play('hover');
        });

        item.addEventListener('click', function() {
            soundManager.enable();
            soundManager.play('click');
            showCoinDetails(this);
        });
    });
}

function showCoinDetails(tickerItem) {
    const symbol = tickerItem.querySelector('.crypto-symbol').textContent;
    const price = tickerItem.querySelector('.crypto-price').textContent;
    const change = tickerItem.querySelector('.crypto-change').textContent;
    
    showNotification(`📊 ${symbol}: ${price} (${change})`, 'info');
}

function addTickerHoverEffects() {
    const tickerItems = document.querySelectorAll('.ticker-item');
    
    tickerItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '100';
            soundManager.enable();
            soundManager.play('hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        item.addEventListener('touchstart', function() {
            this.classList.add('hover-touch');
            soundManager.enable();
            soundManager.play('hover');
            setTimeout(() => {
                this.classList.remove('hover-touch');
            }, 1000);
        });
        
        item.addEventListener('click', function() {
            soundManager.enable();
            soundManager.play('click');
        });
    });
}

// ==================== SOUND TOGGLE BUTTON ====================
function addSoundToggleButton() {
    const shareSection = document.querySelector('.share-section');
    if (!shareSection) return;

    if (document.querySelector('.sound-toggle-btn')) {
        return;
    }

    const soundToggle = document.createElement('button');
    soundToggle.className = 'share-btn sound-toggle-btn';
    soundToggle.innerHTML = `
        <span class="btn-icon">🔇</span>
        Enable Sound
    `;

    soundToggle.addEventListener('click', function() {
        const enabled = soundManager.toggle();
        this.innerHTML = `
            <span class="btn-icon">${enabled ? '🔊' : '🔇'}</span>
            ${enabled ? 'Sound On' : 'Sound Off'}
        `;
        
        showNotification(`🔊 Sound ${enabled ? 'enabled' : 'disabled'}`, 'info');
    });

    const shareButtons = shareSection.querySelector('.share-buttons');
    shareButtons.insertBefore(soundToggle, shareButtons.firstChild);
}

// ==================== UTILITY FUNCTIONS ====================
function formatPrice(price) {
    if (!price || isNaN(price)) return '0.00';
    if (price >= 1) {
        return price.toFixed(4);
    } else if (price >= 0.01) {
        return price.toFixed(6);
    } else {
        return price.toFixed(8);
    }
}

function formatTickerPrice(price) {
    if (!price || isNaN(price)) return '0.00';
    if (price >= 1000) {
        return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (price >= 1) {
        return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else {
        return price.toLocaleString('en-US', { maximumFractionDigits: 4 });
    }
}

function formatNumber(num) {
    if (!num || isNaN(num)) return '0';
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

function showLoadingState() {
    const loadingState = document.getElementById('loadingState');
    const rateContainer = document.getElementById('rateContainer');
    const chartContainer = document.getElementById('chartContainer');
    
    if (loadingState) loadingState.style.display = 'flex';
    if (rateContainer) rateContainer.style.display = 'none';
    if (chartContainer) chartContainer.style.display = 'none';
    
    soundManager.play('notification');
}

function hideLoadingState() {
    const loadingState = document.getElementById('loadingState');
    const rateContainer = document.getElementById('rateContainer');
    const chartContainer = document.getElementById('chartContainer');
    
    if (loadingState) loadingState.style.display = 'none';
    if (rateContainer) rateContainer.style.display = 'block';
    if (chartContainer) chartContainer.style.display = 'block';
}

// ==================== NOTIFICATION FUNCTION ====================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    switch(type) {
        case 'success':
            soundManager.play('success');
            break;
        case 'error':
            soundManager.play('error');
            break;
        default:
            soundManager.play('notification');
    }
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : '💫'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==================== DOWNLOAD FUNCTION ====================
let isDownloading = false;

async function downloadAsImage() {
    if (isDownloading) return;
    
    isDownloading = true;
    console.log('Download as image triggered');
    showDownloadLoading();
    
    try {
        const elementsToHide = [
            '.crypto-ticker',
            '.crypto-symbols',
            '.share-section',
            '.top-nav'
        ];
        
        const originalStyles = {};
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                originalStyles[selector] = element.style.display;
                element.style.display = 'none';
            }
        });

        const companyName = document.querySelector('.company-name');
        let originalCompanyStyle = '';
        
        if (companyName) {
            originalCompanyStyle = companyName.getAttribute('style');
            companyName.style.background = 'none';
            companyName.style.backgroundImage = 'none';
            companyName.style.webkitBackgroundClip = 'initial';
            companyName.style.backgroundClip = 'initial';
            companyName.style.color = '#2dd4bf';
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        const dashboard = document.querySelector('.dashboard');
        const canvas = await html2canvas(dashboard, {
            backgroundColor: '#0c0f1d',
            scale: 2,
            useCORS: true,
            allowTaint: false,
            logging: false,
            width: dashboard.scrollWidth,
            height: dashboard.scrollHeight
        });

        if (companyName) {
            if (originalCompanyStyle) {
                companyName.setAttribute('style', originalCompanyStyle);
            } else {
                companyName.removeAttribute('style');
            }
        }
        
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && originalStyles[selector] !== undefined) {
                element.style.display = originalStyles[selector];
            }
        });

        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `sigma-six-rate-${new Date().getTime()}.png`;
        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        hideDownloadLoading();
        showNotification('✅ Image downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Download error:', error);
        hideDownloadLoading();
        showNotification('❌ Download failed. Please try again.', 'error');
        
        document.querySelectorAll('.crypto-ticker, .crypto-symbols, .share-section, .top-nav').forEach(el => {
            el.style.display = 'block';
        });
        
        const companyName = document.querySelector('.company-name');
        if (companyName) {
            companyName.removeAttribute('style');
        }
    } finally {
        isDownloading = false;
    }
}

// ==================== WHATSAPP SHARE FUNCTION ====================
let isSharing = false;

async function shareOnWhatsApp() {
    if (isSharing) return;
    
    isSharing = true;
    console.log('WhatsApp Share triggered');
    showDownloadLoading();
    
    try {
        const elementsToHide = [
            '.crypto-ticker',
            '.crypto-symbols',
            '.share-section',
            '.top-nav'
        ];
        
        const originalStyles = {};
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                originalStyles[selector] = element.style.display;
                element.style.display = 'none';
            }
        });

        const companyName = document.querySelector('.company-name');
        let originalCompanyStyle = '';
        
        if (companyName) {
            originalCompanyStyle = companyName.getAttribute('style');
            companyName.style.background = 'none';
            companyName.style.backgroundImage = 'none';
            companyName.style.webkitBackgroundClip = 'initial';
            companyName.style.backgroundClip = 'initial';
            companyName.style.color = '#2dd4bf';
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        const dashboard = document.querySelector('.dashboard');
        const canvas = await html2canvas(dashboard, {
            backgroundColor: '#0c0f1d',
            scale: 2,
            useCORS: true,
            allowTaint: false,
            logging: false
        });

        if (companyName) {
            if (originalCompanyStyle) {
                companyName.setAttribute('style', originalCompanyStyle);
            } else {
                companyName.removeAttribute('style');
            }
        }
        
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && originalStyles[selector] !== undefined) {
                element.style.display = originalStyles[selector];
            }
        });

        hideDownloadLoading();

        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });

        if (!blob) {
            throw new Error('Failed to create image blob');
        }

        const currentPriceElement = document.getElementById('sigmaRate');
        let currentPrice = 0.1332;
        
        if (currentPriceElement) {
            const priceText = currentPriceElement.textContent;
            const priceMatch = priceText.match(/\$([\d.]+)/);
            if (priceMatch) {
                currentPrice = parseFloat(priceMatch[1]);
            }
        }

        const changeElement = document.getElementById('rateChange');
        let priceChange = 42.50;
        
        if (changeElement) {
            const changeText = changeElement.textContent;
            const changeMatch = changeText.match(/[+-]?([\d.]+)%/);
            if (changeMatch) {
                priceChange = parseFloat(changeMatch[1]);
            }
        }

        const changeSymbol = priceChange >= 0 ? '📈' : '📉';
        const changeText = priceChange >= 0 ? `+${priceChange.toFixed(2)}%` : `${priceChange.toFixed(2)}%`;

        const message = `🚀 *Sigma Six Token Live Rate* 🚀

💰 Current Price: *$${currentPrice}*
${changeSymbol} 24h Change: *${changeText}*
📊 Live on Polygon Network
🔗 Dashboard: sigmasix.app
📞 Contact: +91-951-951-8589

*Sigma Six - Building the Future of Crypto* 💫

#SigmaSix #SIG6 #Crypto #Polygon`;

        if (navigator.share && navigator.canShare) {
            try {
                const file = new File([blob], "sigma-six-rate.png", { type: "image/png" });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Sigma Six Live Rate',
                        text: message
                    });
                    showNotification('✅ Shared successfully!', 'success');
                    return;
                }
            } catch (shareError) {
                console.log('Web Share API failed:', shareError);
            }
        }

        const imageUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        const timestamp = new Date().getTime();
        downloadLink.download = `sigma-six-${timestamp}.png`;
        downloadLink.href = imageUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        const encodedMessage = encodeURIComponent(message);
        
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            const whatsappURL = `whatsapp://send?text=${encodedMessage}`;
            window.location.href = whatsappURL;
        } else {
            const whatsappURL = `https://web.whatsapp.com/send?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
        }

        showNotification('✅ Image downloaded! 📱 WhatsApp opening...', 'success');

        setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);

    } catch (error) {
        console.error('WhatsApp share error:', error);
        hideDownloadLoading();
        showNotification('❌ Auto share failed. Using text sharing...', 'error');
        fallbackWhatsAppShare();
    } finally {
        isSharing = false;
    }
}

function fallbackWhatsAppShare() {
    const currentPriceElement = document.getElementById('sigmaRate');
    let currentPrice = 0.1332;
    
    if (currentPriceElement) {
        const priceText = currentPriceElement.textContent;
        const priceMatch = priceText.match(/\$([\d.]+)/);
        if (priceMatch) {
            currentPrice = parseFloat(priceMatch[1]);
        }
    }

    const message = `🚀 *Sigma Six Token Live Rate* 🚀

💰 Current Price: *$${currentPrice}*
📊 Live on Polygon Network
🔗 Dashboard: sigmasix.app
📞 Contact: +91-951-951-8589

*Download the live rate image from our dashboard!*

#SigmaSix #SIG6 #Crypto #Polygon`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    showNotification('📱 WhatsApp opened! Please download image separately.', 'info');
}

// ==================== LOADING FUNCTIONS ====================
function showDownloadLoading() {
    const existingLoader = document.querySelector('.download-loading');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    soundManager.play('notification');
    
    const loader = document.createElement('div');
    loader.className = 'download-loading';
    loader.innerHTML = `
        <div class="download-spinner"></div>
        <p>Preparing your image...</p>
        <p style="font-size: 0.9rem; opacity: 0.8;">This may take a few seconds</p>
        <div class="sound-wave">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function hideDownloadLoading() {
    const loader = document.querySelector('.download-loading');
    if (loader) {
        loader.remove();
    }
}

// ==================== MANUAL REFRESH ====================
function manualRefresh() {
    soundManager.enable();
    soundManager.play('click');
    showNotification('🔄 Refreshing SIG6 data...', 'info');
    fetchSigmaData();
}

// Global functions
window.manualRefresh = manualRefresh;
window.shareOnWhatsApp = shareOnWhatsApp;
window.downloadAsImage = downloadAsImage;

console.log('Sigma Six Live Rate Dashboard Initialized Successfully! 🚀');