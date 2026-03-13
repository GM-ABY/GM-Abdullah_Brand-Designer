document.addEventListener('DOMContentLoaded', () => {
    // ===== 1. Local Time (Bangladesh) Functionality =====
    const timeDisplay = document.getElementById('local-time');
    
    function updateTime() {
        if(!timeDisplay) return;
        const options = { 
            timeZone: 'Asia/Dhaka',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        timeDisplay.textContent = formatter.format(new Date());
    }
    
    updateTime();
    setInterval(updateTime, 1000);

    // ===== 2. GSAP Registration =====
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ===== 3. Performance Optimized Custom Cursor =====
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

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

    if (window.matchMedia('(min-width: 769px)').matches && cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });
        
        animateCursor();
        
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .project-card, .skill-card, .testimonial-card, input, textarea')) {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            }
        }, { passive: true });
        
        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .project-card, .skill-card, .testimonial-card, input, textarea')) {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            }
        }, { passive: true });
    }

    // ===== 4. Navbar Scroll Effect with Throttle =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScroll = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(() => {
                if(navbar) {
                    if (lastScroll > 100) {
                        navbar.classList.add('bg-deepBlack/95', 'border-b', 'border-charcoal');
                        navbar.classList.remove('bg-deepBlack/80');
                    } else {
                        navbar.classList.remove('bg-deepBlack/95', 'border-b', 'border-charcoal');
                        navbar.classList.add('bg-deepBlack/80');
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ===== 5. Smooth Scroll for Navigation =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            
            if (target) {
                // Close mobile menu if open
                if (typeof menuOpen !== 'undefined' && menuOpen && mobileMenuBtn) mobileMenuBtn.click();
                
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== 6. Mobile Menu =====
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let menuOpen = false;

    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                }
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuOpen = false;
                const icon = mobileMenuBtn.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ===== 7. Scroll Progress Bar =====
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress-bar';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.transform = `scaleX(${scrollPercent / 100})`;
    }, { passive: true });

    // ===== 8. Back to Top Button =====
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if(!backToTopBtn) return;
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            backToTopBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            backToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            backToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    });

    if(backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== 9. Testimonial Slider =====
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let isTransitioning = false;

    function showSlide(index) {
        if(isTransitioning || slides.length === 0) return;
        isTransitioning = true;
        
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('hidden');
                setTimeout(() => {
                    slide.classList.remove('opacity-0');
                    slide.style.opacity = '1'; // Force opacity since tailwind classes might be overwritten
                }, 20);
            } else {
                slide.classList.add('opacity-0');
                slide.style.opacity = '0';
                setTimeout(() => slide.classList.add('hidden'), 500); 
            }
        });
        
        setTimeout(() => { isTransitioning = false; }, 500);
    }

    if (slides.length > 0 && prevBtn && nextBtn) {
        slides.forEach((slide, i) => {
            if (i !== currentSlide) {
                slide.classList.add('hidden', 'opacity-0');
                slide.style.opacity = '0';
            } else {
                slide.classList.remove('opacity-0', 'hidden');
                slide.style.opacity = '1';
                // Remove any inline gsaps
                gsap.set(slide, { clearProps: "all" });
            }
        });

        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }

    // ===== 10. GSAP Animations =====
    // Hero Animations
    if(document.querySelector('.hero-title')) {
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
    }

    // Set Initial States for Scroll Animations
    gsap.set('.section-title', { opacity: 0, y: 40 });
    gsap.set('.skill-card', { opacity: 0, y: 40 });
    gsap.set('.project-card', { opacity: 0, y: 40 });
    gsap.set('.timeline-item', { opacity: 0, x: -30 });
    // removed .testimonial-card to avoid conflict with the nested slides opacity
    
    // Batch Scroll Animations for performance
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

    // Custom Triggers for Specific Sections
    if(document.querySelector('.about-grid')) {
        gsap.set('.about-content', { opacity: 0, x: -40 });
        gsap.set('.about-image', { opacity: 0, x: 40 });
        gsap.set('.stat', { opacity: 0, y: 20 });
        
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
    }

    if(document.querySelector('.contact-grid')) {
        gsap.set('.contact-info', { opacity: 0, x: -40 });
        gsap.set('.contact-form', { opacity: 0, x: 40 });
        
        ScrollTrigger.create({
            trigger: '.contact-grid',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to('.contact-info', { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
                gsap.to('.contact-form', { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: 'power2.out' });
            }
        });
    }

    // ===== 11. Skill Bars (Intersection Observer + Percentage Counter) =====
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progressTarget = parseInt(bar.getAttribute('data-progress'), 10);
                
                // Find the associated text element showing the percentage
                const container = bar.closest('.skill-bar-container');
                const percentageTextNode = container ? container.querySelector('.text-electricPurple.font-bold') : null;

                // Target width specifically instead of height for horizontal bars
                if(bar.classList.contains('skill-progress-bar')) {
                    bar.style.width = progressTarget + '%';
                    
                    // Animate the text if it exists
                    if (percentageTextNode) {
                        let current = 0;
                        const duration = 1500; // time in ms matching css transition
                        const stepTime = Math.abs(Math.floor(duration / progressTarget));
                        const timer = setInterval(() => {
                            current += 1;
                            percentageTextNode.textContent = current + '%';
                            if (current >= progressTarget) {
                                clearInterval(timer);
                                percentageTextNode.textContent = progressTarget + '%';
                                // remove the data-progress so it doesn't try to reanimate if unobserved and observed again
                                bar.removeAttribute('data-progress');
                            }
                        }, stepTime);
                    }
                }
                
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress-bar').forEach(bar => {
        skillObserver.observe(bar);
    });

    // ===== 12. Form Submission UX =====
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Note: Remove e.preventDefault() if you want FormSubmit to handle standard redirect
            // Or keep it and perform an async fetch if you prefer staying on page (requires FormSubmit paid plan or distinct setup).
            // Defaulting to standard FormSubmit behavior visually enhanced.
            const btn = contactForm.querySelector('button[type="submit"]');
            if(btn) {
                btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
                btn.style.opacity = '0.8';
            }
        });
    }

    // Dynamic Year Update Footer
    const currentYearEl = document.getElementById('currentYear');
    if(currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});
