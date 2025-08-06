// Smooth Scroll with enhanced effect
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        // Enhanced smooth scroll with easing
        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.offsetTop - 80;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        requestAnimationFrame(animation);
    });
});

// Enhanced Cursor Trail Animation with smoother movement
let mouseX = 0;
let mouseY = 0;
let trailElements = [];
let isMouseMoving = false;
let mouseMoveTimeout;

function createCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trailElements.push(trail);
    
    // Remove old trails if too many
    if (trailElements.length > 25) {
        const oldTrail = trailElements.shift();
        if (oldTrail && oldTrail.parentNode) {
            oldTrail.parentNode.removeChild(oldTrail);
        }
    }
}

function updateCursorTrail() {
    trailElements.forEach((trail, index) => {
        const delay = index * 1.5; // Reduced delay for smoother effect
        const opacity = Math.max(0, 1 - (index * 0.04)); // Smoother opacity fade
        const scale = Math.max(0.3, 1 - (index * 0.08)); // Smoother scale reduction
        
        setTimeout(() => {
            trail.style.left = mouseX + 'px';
            trail.style.top = mouseY + 'px';
            trail.style.opacity = opacity;
            trail.style.transform = `scale(${scale})`;
        }, delay);
    });
}

// Enhanced mouse move event for smoother cursor trail
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 3;
    mouseY = e.clientY - 3;
    
    isMouseMoving = true;
    clearTimeout(mouseMoveTimeout);
    
    // Create new trail element with smoother frequency
    if (Math.random() < 0.4) { // Slightly increased frequency
        createCursorTrail();
    }
    
    updateCursorTrail();
    
    // Stop creating trails when mouse stops moving
    mouseMoveTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

// Scroll Animations with better control
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate section
            entry.target.classList.add('visible');
            
            // Animate section title
            const title = entry.target.querySelector('.section-title');
            if (title) {
                setTimeout(() => {
                    title.classList.add('visible');
                }, 200);
            }
            
            // Animate cards with staggered delay
            const cards = entry.target.querySelectorAll('.skill-card, .project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 300 + (index * 100));
            });
            
            // Animate certification items
            const certItems = entry.target.querySelectorAll('.cert-item');
            certItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, 200 + (index * 150));
            });

            // Animate contact elements
            const contactDesc = entry.target.querySelector('.contact-description');
            const contactBtns = entry.target.querySelectorAll('.contact-btn');
            
            if (contactDesc) {
                setTimeout(() => {
                    contactDesc.classList.add('visible');
                }, 200);
            }
            
            contactBtns.forEach((btn, index) => {
                setTimeout(() => {
                    btn.classList.add('visible');
                }, 400 + (index * 200));
            });
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Navbar scroll effect and background movement
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
    }
    
    // Background movement effect - stars move up and down with scroll
    const stars = document.querySelector('.stars');
    const twinkling = document.querySelector('.twinkling');
    const clouds = document.querySelector('.clouds');
    
    if (stars && twinkling && clouds) {
        const scrollSpeed = currentScrollY * 0.8;
        const twinkleSpeed = currentScrollY * 0.6;
        const cloudSpeed = currentScrollY * 0.4;
        
        stars.style.transform = `translateY(${scrollSpeed}px)`;
        twinkling.style.transform = `translateY(${twinkleSpeed}px)`;
        clouds.style.transform = `translateY(${cloudSpeed}px)`;
    }
    
    lastScrollY = currentScrollY;
});

// Typing effect for the logo (only on page load)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        const originalText = logo.textContent;
        typeWriter(logo, originalText, 150);
    }
    
    // Show first section immediately
    const firstSection = document.querySelector('.section');
    if (firstSection) {
        firstSection.classList.add('visible');
        const firstTitle = firstSection.querySelector('.section-title');
        if (firstTitle) {
            setTimeout(() => {
                firstTitle.classList.add('visible');
            }, 300);
        }
    }
});

// Enhanced hover effects for skill cards
document.addEventListener('DOMContentLoaded', () => {
    // Wait for DOM to be fully loaded before adding event listeners
    setTimeout(() => {
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.05)';
                card.style.boxShadow = '0 0 30px rgba(0, 255, 241, 0.4)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });

        // Enhanced hover effects for project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-15px) scale(1.03)';
                card.style.boxShadow = '0 0 30px rgba(255, 0, 200, 0.4)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });

        // Enhanced hover effects for contact buttons
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-8px) scale(1.05)';
                
                // Add particle effect for contact buttons
                for (let i = 0; i < 3; i++) {
                    createParticle(btn);
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
            });
        });
    }, 500);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 241, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid #00fff1;
        border-radius: 10px;
        padding: 1rem 1.5rem;
        color: #00fff1;
        font-family: 'Orbitron', monospace;
        font-size: 0.9rem;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 255, 241, 0.3);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #00fff1;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Particle effect function (used for contact buttons and other hover effects)
function createParticle(button) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #00fff1;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
    `;
    
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    document.body.appendChild(particle);
    
    // Animate particle
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let opacity = 1;
    const animate = () => {
        if (opacity <= 0) {
            particle.remove();
            return;
        }
        
        opacity -= 0.02;
        particle.style.opacity = opacity;
        particle.style.left = (parseFloat(particle.style.left) + vx) + 'px';
        particle.style.top = (parseFloat(particle.style.top) + vy) + 'px';
        
        requestAnimationFrame(animate);
    };
    
    animate();
}

// Clean up cursor trails when leaving page
window.addEventListener('beforeunload', () => {
    trailElements.forEach(trail => {
        if (trail && trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    });
});

// Soft Skills Read More (expand/collapse in card)
document.addEventListener('DOMContentLoaded', () => {
    const softSkillsReadMoreBtn = document.getElementById('softSkillsReadMoreBtn');
    const moreSoftSkills = document.getElementById('more-soft-skills');

    if (softSkillsReadMoreBtn && moreSoftSkills) {
        softSkillsReadMoreBtn.addEventListener('click', () => {
            if (moreSoftSkills.style.display === 'none' || moreSoftSkills.style.display === '') {
                moreSoftSkills.style.display = 'inline';
                softSkillsReadMoreBtn.textContent = 'Show less';
            } else {
                moreSoftSkills.style.display = 'none';
                softSkillsReadMoreBtn.textContent = 'Read more';
            }
        });
    }
});

// Add cursor trail styles if not already present
if (!document.querySelector('style[data-cursor-trail]')) {
    const cursorTrailStyles = document.createElement('style');
    cursorTrailStyles.setAttribute('data-cursor-trail', 'true');
    cursorTrailStyles.textContent = `
        .cursor-trail {
            position: fixed;
            width: 6px;
            height: 6px;
            background: #00fff1;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.8;
            transition: all 0.1s ease;
        }
    `;
    document.head.appendChild(cursorTrailStyles);
}