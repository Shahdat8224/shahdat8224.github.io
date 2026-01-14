document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const emailBtn = document.getElementById('emailBtn');
    const contactEmailBtn = document.getElementById('contactEmailBtn');
    const scrollProgress = document.getElementById('scrollProgress');
    const loadingBar = document.getElementById('loadingBar');
    const welcomeBubble = document.getElementById('welcome-bubble');
    const contactForm = document.getElementById('contactForm');
    const emailAddress = 'shahadatislam8224@gmail.com';

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
    
    if (contactEmailBtn && contactForm) {
        contactEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const message = document.getElementById('message')?.value;
            
            if (!name || !email || !message) {
                alert('Please fill all fields before sending.');
                return;
            }
            
            alert('Thank you for your message! I will respond within 24-48 hours.');
            contactForm.reset();
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

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.form) {
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
    content.innerHTML += `<div class="user-msg">${userMessage}</div>`;
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
        content.innerHTML += `<div class="ai-msg">${aiReply}</div>`;
    } catch (error) {
        document.getElementById('typing-indicator')?.remove();
        content.innerHTML += `<div class="ai-msg">Connection lost. Please try again.</div>`;
    }
    content.scrollTop = content.scrollHeight;
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.id === 'user-input') {
        e.preventDefault();
        sendToGemini();
    }
});


// ===== AI CHAT COMING SOON =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('Setting up AI Chat Coming Soon...');
  
  // Get the AI Chat button
  const aiChatBtn = document.getElementById('aiChatBtn');
  
  if (aiChatBtn) {
    console.log('Found AI Chat button');
    
    // Remove old onclick event
    aiChatBtn.onclick = null;
    
    // Add new click event
    aiChatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Show modal
      showComingSoonModal();
    });
    
    // Change cursor
    aiChatBtn.style.cursor = 'pointer';
  } else {
    console.log('AI Chat button not found, trying different selectors...');
    
    // Try to find it by text
    document.querySelectorAll('button').forEach(btn => {
      if (btn.textContent.includes('AI Chat') || btn.textContent.includes('🤖')) {
        btn.onclick = function(e) {
          e.preventDefault();
          showComingSoonModal();
        };
      }
    });
  }
  
  // Modal functions
  function showComingSoonModal() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Add event listeners for modal
      setupModalEvents();
    } else {
      // Fallback alert
      alert('🚀 AI Chat Feature Coming Soon!\n\nI\'m currently working on training the AI model to provide you with the best chat experience. This feature will be available very soon!');
    }
  }
  
  function setupModalEvents() {
    // Close button
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.onclick = function() {
        document.getElementById('comingSoonModal').style.display = 'none';
        document.body.style.overflow = 'auto';
      };
    }
    
    // Notify button
    const notifyBtn = document.getElementById('notifyBtn');
    if (notifyBtn) {
      notifyBtn.onclick = function() {
        // Show notification
        showToast('✅ You will be notified when AI Chat is ready!');
        
        // Close modal
        document.getElementById('comingSoonModal').style.display = 'none';
        document.body.style.overflow = 'auto';
      };
    }
    
    // Close on outside click
    const modal = document.getElementById('comingSoonModal');
    modal.onclick = function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    };
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  // Toast notification function
  function showToast(message) {
    // Remove existing toast
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: toastSlideIn 0.3s ease;
      max-width: 350px;
    `;
    
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 20px;">🤖</span>
        <div>
          <strong>AI Chat Feature</strong>
          <p style="margin: 5px 0 0 0; font-size: 14px;">${message}</p>
        </div>
      </div>
    `;
    
    // Add animation CSS
    if (!document.querySelector('#toastStyles')) {
      const style = document.createElement('style');
      style.id = 'toastStyles';
      style.textContent = `
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastSlideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 3000);
  }
  
  // Make function globally available (optional)
  window.showComingSoonModal = showComingSoonModal;
});

console.log('AI Chat Coming Soon script loaded');





















// ===== WHATSAPP FORM INTEGRATION =====
// This code integrates WhatsApp with your contact form

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const contactForm = document.getElementById('contactForm');
    const contactEmailBtn = document.getElementById('contactEmailBtn');
    
    if (contactEmailBtn && contactForm) {
        // Remove any existing event listeners to avoid conflicts
        const newBtn = contactEmailBtn.cloneNode(true);
        contactEmailBtn.parentNode.replaceChild(newBtn, contactEmailBtn);
        
        // Get the new button reference
        const whatsappBtn = document.getElementById('contactEmailBtn');
        
        // New WhatsApp handler
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get form values
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const subject = document.getElementById('subject')?.value;
            const message = document.getElementById('message')?.value.trim();
            
            // Validation
            if (!name || !email || !message) {
                alert('❌ Please fill in Name, Email, and Message fields before sending.');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('❌ Please enter a valid email address');
                return;
            }
            
            // YOUR WHATSAPP NUMBER - Use this exact format
            const yourWhatsAppNumber = '8801320828224'; // Your number
            
            // Subject text mapping
            const subjectTexts = {
                'collaboration': 'Collaboration Opportunity',
                'networking': 'Professional Networking', 
                'opportunity': 'Job Opportunity',
                'question': 'General Question',
                '': 'No subject specified'
            };
            
            const subjectDisplay = subjectTexts[subject] || 'No subject specified';
            
            // Create WhatsApp message with formatting
            const whatsappMessage = `*📱 NEW WEBSITE MESSAGE 📱*\n\n` +
                                  `*👤 Name:* ${name}\n` +
                                  `*📧 Email:* ${email}\n` +
                                  `*📌 Subject:* ${subjectDisplay}\n` +
                                  `*📝 Message:*\n${message}\n\n` +
                                  `*🌐 From:* shahdat8224.github.io\n` +
                                  `*⏰ Time:* ${new Date().toLocaleTimeString('en-IN', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: true 
                                  })}`;
            
            // Encode for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;
            
            // Change button to loading state
            const originalText = whatsappBtn.innerHTML;
            const originalClasses = whatsappBtn.className;
            
            whatsappBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Opening WhatsApp...';
            whatsappBtn.className = originalClasses.replace('from-sky-600', 'from-green-500').replace('to-blue-500', 'to-green-600');
            whatsappBtn.disabled = true;
            
            // Open WhatsApp after short delay for better UX
            setTimeout(() => {
                // Open WhatsApp in new tab
                window.open(whatsappURL, '_blank');
                
                // Show success toast
                showWhatsAppToast(name);
                
                // Reset button after 1.5 seconds
                setTimeout(() => {
                    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp mr-2"></i> Send via WhatsApp';
                    whatsappBtn.className = originalClasses;
                    whatsappBtn.disabled = false;
                    
                    // Clear the form
                    contactForm.reset();
                }, 1500);
            }, 800);
        });
        
        // Also update the button text immediately
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp mr-2"></i> Send via WhatsApp';
        
        console.log('✅ WhatsApp form integration loaded with number: ' + yourWhatsAppNumber);
    }
});

// WhatsApp success toast function
function showWhatsAppToast(name) {
    // Remove existing toast if any
    const existingToast = document.getElementById('whatsapp-success-toast');
    if (existingToast) existingToast.remove();
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.id = 'whatsapp-success-toast';
    
    // Style the toast
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
        animation: whatsappToastIn 0.4s ease;
        border-left: 5px solid #0daa6c;
        font-family: 'Inter', sans-serif;
        backdrop-filter: blur(10px);
    `;
    
    // Add animation styles if not already present
    if (!document.querySelector('#whatsapp-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'whatsapp-toast-styles';
        style.textContent = `
            @keyframes whatsappToastIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes whatsappToastOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Toast content
    toast.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="font-size: 24px;">📱</div>
            <div>
                <strong style="display: block; font-size: 16px; margin-bottom: 4px;">WhatsApp Opened!</strong>
                <div style="font-size: 14px; opacity: 0.95; line-height: 1.4;">
                    Hi ${name}, your message is ready.<br>
                    <small style="font-size: 12px; opacity: 0.8;">Please click "Send" in WhatsApp.</small>
                </div>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'whatsappToastOut 0.4s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 5000);
}

// Test the WhatsApp number format
console.log('WhatsApp Number Configured: 8801320828224');
console.log('WhatsApp URL will be: https://wa.me/8801320828224');
