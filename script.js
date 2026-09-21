document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const emailBtn = document.getElementById('emailBtn');
    const contactEmailBtn = document.getElementById('contactEmailBtn');
    const scrollProgress = document.getElementById('scrollProgress');
    const loadingBar = document.getElementById('loadingBar');
    const contactForm = document.getElementById('contactForm');
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

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('active');
            mobileNav.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times text-lg' : 'fas fa-ellipsis-v text-lg';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (mobileNav && !mobileNav.contains(e.target) && e.target !== mobileMenuBtn) {
            mobileNav.classList.remove('active');
            mobileNav.classList.add('hidden');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) icon.className = 'fas fa-ellipsis-v text-lg';
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
                }
            }
        });
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
    if (skillsSection) observer.observe(skillsSection);
});

window.revealReference = function(num) {
    const ref = document.getElementById('reference' + num);
    if (ref) {
        ref.classList.toggle('hidden');
    }
};

// AI Chat Integration Logic
// Use relative path when hosted on Vercel; call production Vercel backend when on GitHub Pages
const API_URL = window.location.hostname.includes('vercel.app') 
    ? '/api/chat' 
    : 'https://shahdat8224.vercel.app/api/chat';

window.toggleChat = function() {
    const chat = document.getElementById('chat-window');
    if (chat) {
        const isHidden = (chat.style.display === 'none' || chat.style.display === '');
        chat.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) {
            const userInput = document.getElementById('user-input');
            if (userInput) userInput.focus();
        }
    }
};

window.sendQuickReply = function(text) {
    const input = document.getElementById('user-input');
    if (input) {
        input.value = text;
        sendToGemini();
    }
};

window.sendToGemini = async function() {
    const input = document.getElementById('user-input');
    const content = document.getElementById('chat-content');
    if (!input || !content || !input.value.trim()) return;

    const userMessage = input.value.trim();

    // Append user message bubble
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-msg bg-sky-600/30 border border-sky-500/40 p-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl self-end max-w-[85%] text-slate-100 text-sm';
    userMsgDiv.textContent = userMessage;
    content.appendChild(userMsgDiv);

    input.value = '';

    // Append animated typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing bg-slate-800 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl self-start max-w-[85%] text-slate-400 border border-slate-700/50 flex items-center gap-1.5';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span class="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span><span class="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.2s]"></span><span class="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>';
    content.appendChild(typingDiv);
    content.scrollTop = content.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        document.getElementById('typing-indicator')?.remove();
        
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'ai-msg bg-slate-800 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl self-start max-w-[85%] text-slate-200 border border-slate-700/50 text-sm leading-relaxed';

        if (response.ok && data.reply) {
            aiMsgDiv.textContent = data.reply;
        } else {
            aiMsgDiv.textContent = "I'm having trouble connecting right now. You can reach Alif directly via Email: shahadatislamalif@gmail.com or Phone: 01320828224.";
        }
        content.appendChild(aiMsgDiv);
    } catch (error) {
        console.error('Chat fetch error:', error);
        document.getElementById('typing-indicator')?.remove();
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'ai-msg bg-slate-800 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl self-start max-w-[85%] text-slate-200 border border-slate-700/50 text-sm leading-relaxed';
        aiMsgDiv.textContent = "I'm having trouble connecting right now. You can reach Alif directly via Email: shahadatislamalif@gmail.com or Phone: 01320828224.";
        content.appendChild(aiMsgDiv);
    }
    content.scrollTop = content.scrollHeight;
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'user-input') {
        e.preventDefault();
        sendToGemini();
    }
});

// WhatsApp Form Integration
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
                                  `*🌐 From:* shahdat8224.github.io\n`;
            
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;
            
            window.open(whatsappURL, '_blank');
            contactForm.reset();
        });
    }
});
