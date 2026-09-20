document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const emailBtn = document.getElementById('emailBtn');
    const scrollProgress = document.getElementById('scrollProgress');
    const loadingBar = document.getElementById('loadingBar');
    const welcomeBubble = document.getElementById('welcome-bubble');
    const emailAddress = 'shahadatislamalif@gmail.com';

    if (loadingBar) {
        window.addEventListener('load', () => {
            setTimeout(() => { loadingBar.style.opacity = '0'; }, 500);
            setTimeout(() => { loadingBar.style.display = 'none'; }, 800);
        });
    }

    window.addEventListener('scroll', () => {
        if (scrollProgress) {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    });

    setTimeout(() => {
        if (welcomeBubble) welcomeBubble.classList.add('show');
    }, 4000);

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('active');
            mobileNav.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times text-lg' : 'fas fa-bars text-lg';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (mobileNav && !mobileNav.contains(e.target) && e.target !== mobileMenuBtn) {
            mobileNav.classList.remove('active');
            mobileNav.classList.add('hidden');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) icon.className = 'fas fa-bars text-lg';
        }
    });

    function handleEmailCopy(button) {
        if (!button) return;
        const originalText = button.innerHTML;
        
        navigator.clipboard.writeText(emailAddress).then(() => {
            button.classList.add('bg-green-600');
            button.innerHTML = '<i class="fas fa-check mr-2"></i> Email Copied!';
            
            setTimeout(() => {
                button.classList.remove('bg-green-600');
                button.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            alert('Please copy the email manually: ' + emailAddress);
        });
    }

    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleEmailCopy(emailBtn);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (mobileNav) {
                    mobileNav.classList.remove('active');
                    mobileNav.classList.add('hidden');
                    const icon = mobileMenuBtn?.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars text-lg';
                }
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.form && e.target.id !== 'user-input') {
            e.preventDefault();
        }
    });

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                });
            }
        });
    }, observerOptions);

    const skillsSection = document.getElementById('skills');
    if(skillsSection) observer.observe(skillsSection);
});

window.revealReference = function(num) {
    const ref = document.getElementById('reference' + num);
    if (ref) {
        ref.classList.toggle('hidden');
    }
};

window.toggleChat = function() {
    const chat = document.getElementById('chat-window');
    const bubble = document.getElementById('welcome-bubble');
    if (bubble) bubble.classList.remove('show');
    
    if (chat) {
        const isHidden = (chat.style.display === 'none' || chat.style.display === '');
        chat.style.display = isHidden ? 'flex' : 'none';
    }
};

window.sendToGemini = async function() {
    const input = document.getElementById('user-input');
    const content = document.getElementById('chat-content');
    if (!input || !content || !input.value.trim()) return;

    const userMessage = input.value.trim();
    content.innerHTML += `<div class="user-msg">${escapeHtml(userMessage)}</div>`;
    input.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    content.appendChild(typingDiv);
    content.scrollTop = content.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });
        const data = await response.json();
        document.getElementById('typing-indicator')?.remove();
        
        const aiReply = data.reply || "I'm having trouble thinking right now.";
        content.innerHTML += `<div class="ai-msg">${escapeHtml(aiReply)}</div>`;
    } catch (error) {
        document.getElementById('typing-indicator')?.remove();
        content.innerHTML += `<div class="ai-msg">Connection lost. Please try again.</div>`;
    }
    content.scrollTop = content.scrollHeight;
};

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'user-input') {
        e.preventDefault();
        sendToGemini();
    }
});

// ===== WHATSAPP FORM INTEGRATION =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const whatsappBtn = document.getElementById('contactEmailBtn');
    
    if (whatsappBtn && contactForm) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const subject = document.getElementById('subject')?.value;
            const message = document.getElementById('message')?.value.trim();
            
            if (!name || !email || !message) {
                alert('Please fill in Name, Email, and Message fields before sending.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            const yourWhatsAppNumber = '8801320828224';
            
            const subjectTexts = {
                'collaboration': 'Collaboration Opportunity',
                'networking': 'Professional Networking', 
                'opportunity': 'Job Opportunity',
                'question': 'General Question',
                '': 'No subject specified'
            };
            
            const subjectDisplay = subjectTexts[subject] || 'No subject specified';
            
            const whatsappMessage = `*📱 NEW WEBSITE MESSAGE 📱*\n\n` +
                                  `*👤 Name:* ${name}\n` +
                                  `*📧 Email:* ${email}\n` +
                                  `*📌 Subject:* ${subjectDisplay}\n` +
                                  `*📝 Message:*\n${message}\n\n` +
                                  `*🌐 From:* Shahadat Islam Alif Portfolio`;
            
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;
            
            const originalText = whatsappBtn.innerHTML;
            whatsappBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Opening WhatsApp...';
            whatsappBtn.disabled = true;
            
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                showWhatsAppToast(name);
                
                setTimeout(() => {
                    whatsappBtn.innerHTML = originalText;
                    whatsappBtn.disabled = false;
                    contactForm.reset();
                }, 1500);
            }, 800);
        });
    }
});

function showWhatsAppToast(name) {
    const existingToast = document.getElementById('whatsapp-success-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.id = 'whatsapp-success-toast';
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #25D366, #128C7E);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 6px 25px rgba(37, 211, 102, 0.3);
        z-index: 9999;
        max-width: 320px;
        border-left: 5px solid #0daa6c;
        font-family: 'Inter', sans-serif;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="font-size: 24px;">📱</div>
            <div>
                <strong style="display: block; font-size: 16px; margin-bottom: 4px;">WhatsApp Opened!</strong>
                <div style="font-size: 14px; opacity: 0.95; line-height: 1.4;">
                    Hi ${escapeHtml(name)}, your message is ready.<br>
                    <small style="font-size: 12px; opacity: 0.8;">Please click "Send" in WhatsApp.</small>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}
