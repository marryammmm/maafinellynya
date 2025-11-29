// =============================================
// MINIMALIST MODERN JAVASCRIPT
// =============================================

// Get elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const buttonWrapper = document.querySelector('.button-wrapper');
const hugModal = document.getElementById('hugModal');

// Create particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles on load
createParticles();

// Yes button - show modal with confetti
yesBtn.addEventListener('click', function() {
    modal.style.display = 'block';
    createConfetti();
});

// Close modal
modalClose.addEventListener('click', function() {
    modal.style.display = 'none';
    // Show hug GIF modal
    hugModal.style.display = 'block';
    
    // Auto close hug modal after 5 seconds
    setTimeout(() => {
        hugModal.style.display = 'none';
    }, 5000);
});

// Close hug modal when clicking overlay
hugModal.addEventListener('click', function(e) {
    if (e.target === hugModal || e.target.className === 'modal-overlay') {
        hugModal.style.display = 'none';
    }
});

// Close modal when clicking overlay
modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target.className === 'modal-overlay') {
        modal.style.display = 'none';
    }
});

// No button - move to random position ANYWHERE on screen but NEVER cover Yes button
let isMoving = false;
const minDistance = 180; // Minimum distance from Yes button (in pixels)

noBtn.addEventListener('mouseenter', function() {
    moveButtonAnywhere();
});

noBtn.addEventListener('click', function(e) {
    e.preventDefault();
    moveButtonAnywhere();
});

// Touch support for mobile
noBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    moveButtonAnywhere();
});

function moveButtonAnywhere() {
    if (isMoving) return;
    isMoving = true;
    
    // Change to fixed positioning for full page movement
    noBtn.style.position = 'fixed';
    
    // Get button dimensions and Yes button position
    const yesRect = yesBtn.getBoundingClientRect();
    const noBtnWidth = noBtn.offsetWidth;
    const noBtnHeight = noBtn.offsetHeight;
    
    // Calculate safe positions anywhere on viewport
    let newPosition = { x: 0, y: 0 };
    let attempts = 0;
    const maxAttempts = 30;
    let foundSafeSpot = false;
    
    // Define safe boundaries (avoid edges)
    const margin = 20;
    const maxX = window.innerWidth - noBtnWidth - margin;
    const maxY = window.innerHeight - noBtnHeight - margin;
    
    while (!foundSafeSpot && attempts < maxAttempts) {
        // Generate random position anywhere on screen
        newPosition.x = Math.random() * maxX + margin;
        newPosition.y = Math.random() * maxY + margin;
        
        // Calculate center points for distance check
        const noCenterX = newPosition.x + (noBtnWidth / 2);
        const noCenterY = newPosition.y + (noBtnHeight / 2);
        const yesCenterX = yesRect.left + (yesRect.width / 2);
        const yesCenterY = yesRect.top + (yesRect.height / 2);
        
        // Calculate distance between buttons
        const distance = Math.sqrt(
            Math.pow(noCenterX - yesCenterX, 2) + 
            Math.pow(noCenterY - yesCenterY, 2)
        );
        
        // Also check for overlap
        const noLeft = newPosition.x;
        const noRight = noLeft + noBtnWidth;
        const noTop = newPosition.y;
        const noBottom = noTop + noBtnHeight;
        
        const yesLeft = yesRect.left;
        const yesRight = yesRect.right;
        const yesTop = yesRect.top;
        const yesBottom = yesRect.bottom;
        
        const noOverlap = (noRight < yesLeft - 10 || 
                          noLeft > yesRight + 10 || 
                          noBottom < yesTop - 10 || 
                          noTop > yesBottom + 10);
        
        // Safe if distance is greater than minimum and no overlap
        if (distance > minDistance && noOverlap) {
            foundSafeSpot = true;
        }
        
        attempts++;
    }
    
    // If no safe spot found, move to opposite corner
    if (!foundSafeSpot) {
        const yesCenterX = yesRect.left + (yesRect.width / 2);
        const yesCenterY = yesRect.top + (yesRect.height / 2);
        
        if (yesCenterX > window.innerWidth / 2) {
            // Yes is on right, move No to left
            newPosition.x = margin;
        } else {
            // Yes is on left, move No to right
            newPosition.x = window.innerWidth - noBtnWidth - margin;
        }
        
        if (yesCenterY > window.innerHeight / 2) {
            // Yes is on bottom, move No to top
            newPosition.y = margin;
        } else {
            // Yes is on top, move No to bottom
            newPosition.y = window.innerHeight - noBtnHeight - margin;
        }
    }
    
    // Apply position change with smooth transition
    noBtn.style.left = newPosition.x + 'px';
    noBtn.style.top = newPosition.y + 'px';
    
    // Add rotation animation
    const rotation = (Math.random() - 0.5) * 30;
    noBtn.style.transform = `rotate(${rotation}deg) scale(0.92)`;
    
    setTimeout(() => {
        noBtn.style.transform = 'rotate(0deg) scale(1)';
        isMoving = false;
    }, 250);
}

// Confetti effect
function createConfetti() {
    const colors = ['#ff85a2', '#ff6b9d', '#ffc4d6', '#ff4d7d'];
    const confettiCount = 80;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 8 + 4 + 'px';
            confetti.style.height = Math.random() * 8 + 4 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.opacity = '1';
            
            document.body.appendChild(confetti);
            
            // Animate confetti falling
            const fall = confetti.animate([
                { 
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: 1
                },
                { 
                    transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 720 - 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: Math.random() * 2000 + 2500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            fall.onfinish = () => {
                confetti.remove();
            };
        }, i * 15);
    }
}

// Reset No button position on window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reset button if it was moved
        if (noBtn.style.position === 'fixed') {
            const buttonWrapper = document.querySelector('.button-wrapper');
            const wrapperRect = buttonWrapper.getBoundingClientRect();
            
            // Reset to original position in the wrapper
            noBtn.style.position = 'relative';
            noBtn.style.left = '0';
            noBtn.style.top = '0';
            noBtn.style.transform = 'none';
        }
    }, 250);
});