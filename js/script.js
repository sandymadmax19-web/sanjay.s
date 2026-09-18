/* ==========================================================================
   PORTFOLIO LOGIC & INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Start Preloader immediately
    initPreloader();

    // Initialize Lucide Icons
    lucide.createIcons();

    // Custom Cursor follower
    initCustomCursor();

    // Theme Toggle Handler
    initThemeToggle();

    // Mobile Navigation Drawer Toggle
    initMobileNav();

    // Typing Effect in Hero
    initHeroTyping();

    // Button Click Ripple Effect
    initButtonRipples();

    // Active Navigation Highlight on Scroll (ScrollSpy)
    initScrollSpy();

    // Contact Form Handler (Interactive Submit State)
    initContactForm();

    // Scroll Progress Bar
    initScrollProgress();

    // Advanced cinematic features initializations
    initAudioSynthesizer();
    initColorSandbox();
    init3DTilt();
    initTimelineScrollProgress();
});

/* ==========================================================================
   CUSTOM CURSOR FOLLOWER WITH MAGNETIC LIFT
   ========================================================================== */
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    // Check if device supports touch (disable custom cursor on touch devices)
    if (window.matchMedia('(pointer: coarse)').matches) {
        if (dot) dot.style.display = 'none';
        if (outline) outline.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0; // Current mouse coords
    let outlineX = 0, outlineY = 0; // Interpolated outline coords
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving) {
            isMoving = true;
            if (dot) dot.style.opacity = '1';
            if (outline) outline.style.opacity = '1';
        }
        
        if (dot) {
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        }
    });

    // Custom spring interpolation for smooth cursor follow
    function animateOutline() {
        const ease = 0.18;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;

        if (outline) {
            outline.style.left = `${outlineX}px`;
            outline.style.top = `${outlineY}px`;
        }

        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Expand cursor hover effect on interactable elements
    const clickables = document.querySelectorAll('a, button, .filter-btn, .form-input, textarea, .social-link-btn, .tool-badge-card, .floating-theme-toggle');
    clickables.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (outline) {
                outline.style.transform = 'translate(-50%, -50%) scale(1.6)';
                outline.style.backgroundColor = 'var(--accent-glow)';
                outline.style.borderColor = 'var(--accent-primary)';
            }
            if (dot) {
                dot.style.transform = 'translate(-50%, -50%) scale(0)';
            }
        });

        link.addEventListener('mouseleave', () => {
            if (outline) {
                outline.style.transform = 'translate(-50%, -50%) scale(1)';
                outline.style.backgroundColor = 'transparent';
                outline.style.borderColor = 'var(--accent-secondary)';
            }
            if (dot) {
                dot.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });

    // Magnetic micro-pull on major CTA buttons
    const magnetics = document.querySelectorAll('.btn-primary, .floating-theme-toggle');
    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.03)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        if (dot) dot.style.opacity = '0';
        if (outline) outline.style.opacity = '0';
        isMoving = false;
    });
}

/* ==========================================================================
   THEME TOGGLE CONTROLLER (Floating FAB + Mobile Drawer Sync)
   ========================================================================== */
function initThemeToggle() {
    const triggers = document.querySelectorAll('.theme-toggle-trigger, #theme-toggle');
    const htmlEl = document.documentElement;

    // Read stored config or default to Dark mode
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || 'dark';
    htmlEl.setAttribute('data-theme', initialTheme);

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = htmlEl.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlEl.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            
            // Audio click feedback
            if (audioSynth) audioSynth.playClick();
        });
    });
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-menu-drawer');
    const links = document.querySelectorAll('.mobile-nav-link');
    const header = document.querySelector('.navbar');

    function toggleMenu() {
        toggleBtn.classList.toggle('active');
        drawer.classList.toggle('open');
        const isOpen = drawer.classList.contains('open');
        toggleBtn.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        
        // Convert bars of hamburger menu to Close symbol (X)
        const bars = toggleBtn.querySelectorAll('.bar');
        if (toggleBtn.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }

    if (toggleBtn && drawer) {
        toggleBtn.addEventListener('click', toggleMenu);

        // Close menu when a navigation item is selected
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (drawer.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }

    // Collapse header size on scroll down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Close menu when window is resized above mobile breakpoint (768px)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (drawer && drawer.classList.contains('open')) {
                toggleMenu();
            }
        }
    });
}

/* ==========================================================================
   HERO TYPING EFFECT
   ========================================================================== */
function initHeroTyping() {
    const target = document.querySelector('.typing-target');
    if (!target) return;

    const phrases = ['UI/UX Designer', 'Video Editor'];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            target.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50;
        } else {
            target.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 120;
        }

        // State Transitions
        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of text
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Pause before next phrase
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing cycle
    setTimeout(type, 1000);
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS & NUMBER COUNT-UP
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillsSection = document.querySelector('#skills');
    const statsSection = document.querySelector('.about-stats-grid');

    // Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12 // Triggers when 12% of element is in view
    };

    // Generic reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Fill all skill bars together after the section itself is visible.
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            if (entries.some(entry => entry.isIntersecting)) {
                skillsSection.querySelectorAll('.skill-progress').forEach(bar => {
                    bar.style.width = bar.style.getPropertyValue('--percent');
                });
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        skillsObserver.observe(skillsSection);
    }

    // Numbers count-up animation for about stats
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            if (entries.some(entry => entry.isIntersecting)) {
                statsSection.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target') || stat.textContent, 10);
                    const suffix = stat.getAttribute('data-suffix') || '';
                    if (!isNaN(target)) {
                        animateValue(stat, 0, target, 1400, suffix);
                    }
                });
                observer.disconnect();
            }
        }, { threshold: 0.25 });

        statsObserver.observe(statsSection);
    }
}

// Smooth numeric count-up helper
function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Quartic ease out
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(easeOut * (end - start) + start);
        obj.textContent = currentVal + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.textContent = end + suffix;
        }
    };
    window.requestAnimationFrame(step);
}

/* ==========================================================================
   BUTTON CLICK RIPPLE EFFECT
   ========================================================================== */
function initButtonRipples() {
    const buttons = document.querySelectorAll('.ripple');

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            
            // Mouse pointer coordinates relative to the button container
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const circle = document.createElement('span');
            circle.classList.add('ripple-circle');
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;

            this.appendChild(circle);

            // Clear ripple span after transition concludes
            circle.addEventListener('animationend', () => {
                circle.remove();
            });
        });
    });
}

/* ==========================================================================
   SCROLL SPY (ACTIVE NAVIGATION HIGHLIGHT)
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Trigger threshold is around middle of screen
            if (window.scrollY >= (sectionTop - sectionHeight / 3.5)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active class on navbar items
        updateActiveLink(navLinks, currentSectionId);
        updateActiveLink(mobileLinks, currentSectionId);
    });

    function updateActiveLink(linksArray, currentId) {
        linksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    if (!form || !submitBtn) return;

    const btnText = submitBtn.querySelector('.btn-text');
    const successText = submitBtn.querySelector('.success-text');
    const sendIcon = submitBtn.querySelector('.send-icon');
    const successIcon = submitBtn.querySelector('.success-icon');
    const spinner = submitBtn.querySelector('.spinner');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Start loading sequence state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');

        // Simulate AJAX request payload sending
        setTimeout(() => {
            // Success response state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            
            // Show success text and success icon
            if (successText) successText.classList.remove('hidden');
            if (successIcon) successIcon.classList.remove('hidden');
            
            // Hide default elements
            if (btnText) btnText.classList.add('hidden');
            if (sendIcon) sendIcon.classList.add('hidden');
            if (spinner) spinner.classList.add('hidden');

            // Reset form fields
            form.reset();

            // Display floating success toast
            showToast("Message sent successfully! Sanjay will get back to you soon.");

            // Clear success state after 4.5 seconds
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                
                // Reset class visibility states
                if (successText) successText.classList.add('hidden');
                if (successIcon) successIcon.classList.add('hidden');
                if (btnText) btnText.classList.remove('hidden');
                if (sendIcon) sendIcon.classList.remove('hidden');
                if (spinner) spinner.classList.add('hidden');
            }, 4500);

        }, 2200);
    });
}

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    });
}

/* ==========================================================================
   TOAST NOTIFICATION POPUPS
   ========================================================================== */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.classList.add('toast');
    
    toast.innerHTML = `
        <i data-lucide="check-circle" class="toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4000);
}

function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
        document.body.classList.add('page-loaded');
        initScrollReveal();
        return;
    }

    // Lock body scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    const scrubProgress = preloader.querySelector('.scrub-progress');
    const scrubHandle = preloader.querySelector('.scrub-handle');
    const playheadLine = preloader.querySelector('.timeline-playhead-line');
    const timecodeDisplay = preloader.querySelector('#preview-timecode');
    const canvasText = preloader.querySelector('.canvas-overlay-text');
    
    const fps = 24;
    const duration = 600; // Exactly 0.6s (600ms)
    let startTime = null;

    function padZero(num, size = 2) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function formatTimecode(pct) {
        const totalSimulatedFrames = Math.floor((pct / 100) * 240); // 10s timeline = 240 frames total
        const totalSeconds = Math.floor(totalSimulatedFrames / fps);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const frames = totalSimulatedFrames % fps;
        return `00:00:${padZero(seconds)}:${padZero(frames)}`;
    }

    function renderFrame(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const pct = progress * 100;

        // Smoothly interpolate playhead & scrub progress position
        if (scrubProgress) scrubProgress.style.width = `${pct}%`;
        if (scrubHandle) scrubHandle.style.left = `${pct}%`;
        if (playheadLine) playheadLine.style.left = `${pct}%`;
        
        // Update rendering timecode display
        if (timecodeDisplay) {
            timecodeDisplay.textContent = formatTimecode(pct);
        }
        
        // Update overlay render percentage text
        if (canvasText) {
            canvasText.textContent = progress < 1 ? `EXPORTING: ${Math.floor(pct)}%` : "EXPORT COMPLETE";
        }

        if (progress < 1) {
            requestAnimationFrame(renderFrame);
        } else {
            // Complete & smooth fade out
            setTimeout(() => {
                preloader.classList.add('fade-out');
                document.body.style.overflow = ''; // Unlock scrolling
                document.body.classList.add('page-loaded'); // Set loaded state class for hero entrance
                initScrollReveal(); // Start scroll reveals exactly when loader exits
            }, 100);
        }
    }

    requestAnimationFrame(renderFrame);

    // Fallback safety to remove preloader after 1.2 seconds max
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.style.overflow = '';
            document.body.classList.add('page-loaded');
            initScrollReveal();
        }
    }, 1200);
}

/* ==========================================================================
   ADVANCED UX & CINEMATIC ANIMATIONS SCRIPTING
   ========================================================================== */

// Global Audio Engine Instance
let audioSynth = null;

// 1. Interface Audio Synthesizer Engine
class AudioSynthesizer {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('sound_muted') === 'true';
        this.initToggleButton();
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            this.ctx = new AudioContextClass();
        }
    }

    initToggleButton() {
        const btn = document.getElementById('sound-toggle');
        if (!btn) return;

        const onIcon = btn.querySelector('.sound-on-icon');
        const offIcon = btn.querySelector('.sound-off-icon');

        const updateUI = () => {
            if (this.muted) {
                if (onIcon) onIcon.style.display = 'none';
                if (offIcon) offIcon.style.display = 'block';
                btn.setAttribute('title', 'Unmute Sounds');
            } else {
                if (onIcon) onIcon.style.display = 'block';
                if (offIcon) offIcon.style.display = 'none';
                btn.setAttribute('title', 'Mute Sounds');
            }
        };

        // Set initial state
        updateUI();

        btn.addEventListener('click', () => {
            this.muted = !this.muted;
            localStorage.setItem('sound_muted', this.muted);
            updateUI();
            
            if (!this.muted) {
                this.init();
                this.playClick();
            }
        });
    }

    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        
        try {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            // Clean high-tech click: high frequency decay
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
            
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) {
            console.warn('Audio click failed to play', e);
        }
    }

    playHover() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        
        try {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            // Ultra soft high beep: quick slide
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1650, this.ctx.currentTime + 0.015);
            
            gain.gain.setValueAtTime(0.008, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.015);
        } catch (e) {
            // Audio context policy fallback
        }
    }
}

function initAudioSynthesizer() {
    audioSynth = new AudioSynthesizer();

    // Hook click sound on nav links, buttons, and close buttons
    const clickables = document.querySelectorAll('a, button, input[type="range"], .project-card, .tool-badge-card');
    clickables.forEach(item => {
        item.addEventListener('click', () => {
            if (audioSynth) audioSynth.playClick();
        });
    });

    // Hook hover sound on navbar elements, social links, project cards, and tool badges
    const hoverables = document.querySelectorAll('.nav-link, .mobile-nav-link, .btn, .project-card, .tool-badge-card, .social-icon');
    hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (audioSynth) audioSynth.playHover();
        });
    });
}

// 2. Color Grading Sandbox Comparison Slider
function initColorSandbox() {
    const slider = document.getElementById('grading-slider');
    const handle = document.getElementById('sandbox-handle');
    const rawLayer = document.querySelector('.layer-raw');
    const wrapper = document.querySelector('.sandbox-wrapper');

    if (!slider || !handle || !rawLayer || !wrapper) return;

    const updateSlider = (percent) => {
        wrapper.style.setProperty('--clip-percent', `${percent}%`);
    };

    slider.addEventListener('input', (e) => {
        updateSlider(e.target.value);
    });

    // Allow clicking or touch drags on sandbox wrapper to directly move slider
    let isDragging = false;
    
    const handleDrag = (clientX) => {
        const rect = wrapper.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        slider.value = percent;
        updateSlider(percent);
    };

    wrapper.addEventListener('mousedown', (e) => {
        if (e.target === slider) return;
        isDragging = true;
        handleDrag(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            handleDrag(e.clientX);
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    wrapper.addEventListener('touchstart', (e) => {
        if (e.target === slider) return;
        isDragging = true;
        if (e.touches[0]) {
            handleDrag(e.touches[0].clientX);
        }
    });

    wrapper.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches[0]) {
            handleDrag(e.touches[0].clientX);
        }
    });

    wrapper.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Set initial layout
    updateSlider(50);
}

// 3. 3D Hover & Touch Side Movement Interaction
function init3DTilt() {
    const cards = document.querySelectorAll('.tool-badge-card, .color-sandbox-wrapper, .instagram-card');
    cards.forEach(card => {
        const handleMove = (clientX, clientY) => {
            const rect = card.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const rotateY = ((x - xc) / xc) * 8; // tilt angle Y axis
            const rotateX = -((y - yc) / yc) * 8; // tilt angle X axis
            const moveSide = ((x - xc) / xc) * 14; // smooth sideways move on touch/hover

            card.style.transform = `perspective(1000px) translateX(${moveSide}px) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(139, 92, 246, 0.3)';
        };

        const handleReset = () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        };

        // Mouse events
        card.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
        card.addEventListener('mouseleave', handleReset);

        // Touch events (for mobile touch interactions)
        card.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        card.addEventListener('touchend', handleReset, { passive: true });
        card.addEventListener('touchcancel', handleReset, { passive: true });
    });
}

// 4. Scroll-Driven Timeline Drawing
function initTimelineScrollProgress() {
    const line = document.querySelector('.timeline-line');
    const timelineSection = document.querySelector('#education');
    if (!line || !timelineSection) return;

    const animateTimeline = () => {
        const rect = timelineSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Trigger calculations only when section is in viewport bounds
        if (rect.top < viewportHeight && rect.bottom > 0) {
            const entryPoint = viewportHeight * 0.8; // line draws after section enters 80% screen height
            const progress = entryPoint - rect.top;
            const scrollableHeight = rect.height - (viewportHeight * 0.2);
            const scaleY = Math.min(Math.max(progress / scrollableHeight, 0), 1);
            
            line.style.transform = `scaleY(${scaleY})`;
        }
    };

    window.addEventListener('scroll', animateTimeline);
    window.addEventListener('resize', animateTimeline);
    // Trigger on load
    animateTimeline();
}
