// ===== GSAP Registration =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== Performance Optimized Custom Cursor =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

// Use RAF for smooth cursor movement instead of GSAP
function animateCursor() {
    // Smooth interpolation
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    if (cursor) {
        cursor.style.transform = `translate3d(${cursorX - 6}px, ${cursorY - 6}px, 0)`;
    }
    if (cursorFollower) {
        cursorFollower.style.transform = `translate3d(${followerX - 20}px, ${followerY - 20}px, 0)`;
    }
    
    requestAnimationFrame(animateCursor);
}

// Only track mouse on desktop
if (window.matchMedia('(min-width: 769px)').matches && cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });
    
    animateCursor();
    
    // Cursor hover effects - use event delegation for performance
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .project-card, .skill-card, .testimonial-card')) {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        }
    }, { passive: true });
    
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .project-card, .skill-card, .testimonial-card')) {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        }
    }, { passive: true });
}

// ===== Navbar Scroll Effect with Throttle =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(() => {
            if (lastScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Close mobile menu
            if (menuOpen) mobileMenuBtn.click();
            
            // Use native smooth scroll for better performance
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
let menuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    navLinks.classList.toggle('mobile-open', menuOpen);
    
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// ===== Hero Animations - Simplified =====
gsap.set(['.image-wrapper', '.hero-greeting', '.hero-title', '.hero-subtitle', '.hero-description', '.hero-cta'], {
    opacity: 0,
    y: 30
});

gsap.to('.image-wrapper', { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' });
gsap.to('.hero-greeting', { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' });
gsap.to('.hero-title', { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' });
gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power2.out' });
gsap.to('.hero-description', { opacity: 1, y: 0, duration: 0.6, delay: 0.7, ease: 'power2.out' });
gsap.to('.hero-cta', { opacity: 1, y: 0, duration: 0.6, delay: 0.8, ease: 'power2.out' });

// ===== Batch Scroll Animations - More Performant =====
// Use ScrollTrigger.batch for better performance
ScrollTrigger.batch('.section-title', {
    onEnter: (elements) => {
        gsap.to(elements, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' });
    },
    start: 'top 85%',
    once: true
});

ScrollTrigger.batch('.skill-card', {
    onEnter: (elements) => {
        gsap.to(elements, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
    },
    start: 'top 85%',
    once: true
});

ScrollTrigger.batch('.project-card', {
    onEnter: (elements) => {
        gsap.to(elements, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out' });
    },
    start: 'top 85%',
    once: true
});

ScrollTrigger.batch('.timeline-item', {
    onEnter: (elements) => {
        gsap.to(elements, { opacity: 1, x: 0, stagger: 0.2, duration: 0.5, ease: 'power2.out' });
    },
    start: 'top 85%',
    once: true
});

ScrollTrigger.batch('.testimonial-card', {
    onEnter: (elements) => {
        gsap.to(elements, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
    },
    start: 'top 85%',
    once: true
});

// About section
ScrollTrigger.create({
    trigger: '.about-grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        gsap.to('.about-content', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
        gsap.to('.about-image', { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
        gsap.to('.stat', { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, delay: 0.2, ease: 'power2.out' });
    }
});

// Contact section
ScrollTrigger.create({
    trigger: '.contact-grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
        gsap.to('.contact-info', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
        gsap.to('.contact-form', { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
    }
});

// ===== Skill Bars - Intersection Observer (more performant) =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-progress').forEach(bar => {
    skillObserver.observe(bar);
});

// ===== Set Initial States for Scroll Animations =====
gsap.set('.section-title', { opacity: 0, y: 40 });
gsap.set('.skill-card', { opacity: 0, y: 40 });
gsap.set('.project-card', { opacity: 0, y: 40 });
gsap.set('.timeline-item', { opacity: 0, x: -30 });
gsap.set('.testimonial-card', { opacity: 0, y: 30 });
gsap.set('.about-content', { opacity: 0, x: -40 });
gsap.set('.about-image', { opacity: 0, x: 40 });
gsap.set('.stat', { opacity: 0, y: 20 });
gsap.set('.contact-info', { opacity: 0, x: -40 });
gsap.set('.contact-form', { opacity: 0, x: 40 });

// ===== Form Submission =====
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.textContent = 'Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
    }, 3000);
});

function updateTime() {

    const now = new Date();
    const options = { 
        timeZone: 'Asia/Dhaka', // Fixed to Bangladesh Time
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const bdTime = formatter.format(new Date());
    
    // Status message based on time (Optional but cool!)
    let status = (new Date().getHours() >= 23 || new Date().getHours() < 7) ? " (Sleeping)" : " (Available)";
    
    const clockElement = document.getElementById('clock').innerHTML = "My Local Time: " + bdTime + status;
}
setInterval(updateTime, 1000);





// ===== Scroll Progress Bar =====
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress-bar';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
}, { passive: true });

console.log('🚀 Portfolio loaded successfully!');



