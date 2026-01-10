

  // This checks if the user is on your GitHub link
  if (window.location.hostname === "shahdat8224.github.io") {
    // If yes, it jumps to your new Vercel link instantly
    window.location.href = "https://shahdat8224.vercel.app";
  }
    
<!-- JavaScript for enhanced animations and interactions -->
  
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileNav = document.getElementById('mobileNav');
            const emailBtn = document.getElementById('emailBtn');
            const contactEmailBtn = document.getElementById('contactEmailBtn');
            const emailAddress = 'shahadatislamalf@gmail.com';
            const scrollProgress = document.getElementById('scrollProgress');
            const loadingBar = document.getElementById('loadingBar');
            
            // Show loading bar on page load
            window.addEventListener('load', function() {
                setTimeout(() => {
                    loadingBar.style.display = 'none';
                }, 800);
            });
            
            // Scroll progress indicator
            window.addEventListener('scroll', function() {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                scrollProgress.style.width = scrolled + '%';
            });
            
            // Intersection Observer for animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-visible');
                    }
                });
            }, observerOptions);
            
            // Observe elements for animation
            document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .stagger-item').forEach(el => {
                observer.observe(el);
            });
            
            // Function to handle email copying with animation
            function handleEmailCopy(button) {
                // Show loading bar
                loadingBar.style.display = 'block';
                
                // Create a temporary textarea to copy text
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = emailAddress;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                tempTextArea.setSelectionRange(0, 99999);
                
                try {
                    // Copy the text
                    const successful = document.execCommand('copy');
                    if (successful) {
                        // Save original button text
                        const originalText = button.innerHTML;
                        
                        // Add animation class
                        button.classList.add('email-copied');
                        button.innerHTML = '<i class="fas fa-check mr-2"></i> Email Copied!';
                        
                        // Hide loading bar
                        setTimeout(() => {
                            loadingBar.style.display = 'none';
                        }, 500);
                        
                        // Revert after 2 seconds
                        setTimeout(() => {
                            button.classList.remove('email-copied');
                            button.innerHTML = originalText;
                        }, 2000);
                        
                        // Also provide option to open email client
                        setTimeout(() => {
                            if (confirm('Email copied! Would you like to open your email client?')) {
                                window.location.href = `mailto:${emailAddress}`;
                            }
                        }, 2100);
                    }
                } catch (err) {
                    console.error('Failed to copy: ', err);
                    // Hide loading bar
                    loadingBar.style.display = 'none';
                    // Fallback: open email client directly
                    window.location.href = `mailto:${emailAddress}`;
                }
                
                // Remove the temporary textarea
                document.body.removeChild(tempTextArea);
            }


// Toggle mobile menu with animation
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                mobileNav.classList.toggle('active');
                
                // Change icon based on menu state
                const icon = mobileMenuBtn.querySelector('i');
                if (mobileNav.classList.contains('active')) {
                    icon.classList.remove('fa-ellipsis-v');
                    icon.classList.add('fa-times');
                    // Add animation to mobile nav items
                    document.querySelectorAll('.mobile-nav a').forEach((link, index) => {
                        link.style.animationDelay = `${index * 0.1}s`;
                        link.classList.add('slide-in-left');
                    });
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-ellipsis-v');
                }
            });
            
            // Email button functionality
            emailBtn.addEventListener('click', function() {
                handleEmailCopy(emailBtn);
            });
            
            // Contact section email button functionality
            if (contactEmailBtn) {
                contactEmailBtn.addEventListener('click', function() {
                    handleEmailCopy(contactEmailBtn);
                });
            }
            
            // Close mobile menu when a link is clicked
            const mobileLinks = document.querySelectorAll('.mobile-nav a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-ellipsis-v');
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                    mobileNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-ellipsis-v');
                }
            });
            
            // Close mobile menu on escape key
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-ellipsis-v');
                }
            });
            
            // Enhanced smooth scrolling with offset
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
 const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Close mobile menu if open
                        if (mobileNav.classList.contains('active')) {
                            mobileNav.classList.remove('active');
                            const icon = mobileMenuBtn.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-ellipsis-v');
                        }
                        
                        // Smooth scroll to target
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Animate skill bars when they come into view
            const skillBars = document.querySelectorAll('.skill-bar');
            const skillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = entry.target.style.width;
                        entry.target.style.width = '0%';
                        setTimeout(() => {
                            entry.target.style.width = width;
                        }, 300);
                        skillObserver.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.5,
                rootMargin: '0px 0px -50px 0px'
            });
            
            skillBars.forEach(bar => {
                skillObserver.observe(bar);
            });
            
            // Better touch experience
            document.querySelectorAll('button, a').forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });
                
                element.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            });
            
            // Parallax effect on scroll
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const parallax = document.querySelector('.parallax-section');
                if (parallax) {
                    parallax.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
            });
            
            // Add ripple effect to buttons
            document.querySelectorAll('.btn-hover').forEach(button => {
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.7);
                        transform: scale(0);
                        animation: ripple-animation 0.6s linear;
                        width: ${size}px;
                        height: ${size}px;
                        top: ${y}px;
                        left: ${x}px;
                        pointer-events: none;
                    `;
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
            
            // Add CSS for ripple animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                .animate-visible {
                    opacity: 1 !important;
                    transform: translate(0, 0) !important;
                }
            `;
            document.head.appendChild(style);
        });

// Toggle Mobile Nav Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
    mobileNav.classList.toggle('flex');
});

// Auto-close menu on link click
document.querySelectorAll('#mobileNav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
    });
});

// Welcome Bubble Timing
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const bubble = document.getElementById('welcome-bubble');
        if (bubble) bubble.classList.add('show');
    }, 4000);
});


