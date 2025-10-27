/* ================================
   New Image Hair Salon - Main JavaScript
   Designed by HanuNova
   ================================ */

// ===== Global Variables =====
let currentSlide = 0;
let slideInterval;
let isScrolling = false;

// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 2000);
    }
});

// ===== Navigation Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-wrapper')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===== Hero Slider =====
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!slides.length) return;
    
    // Create dots
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    // Show slide function
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (index >= slides.length) currentSlide = 0;
        if (index < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) currentSlide = 0;
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        showSlide(currentSlide);
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        resetInterval();
    }
    
    // Auto slide
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        startSlideShow();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    // Start slideshow
    startSlideShow();
    
    // Pause on hover
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSection.addEventListener('mouseleave', startSlideShow);
    }
}

// Initialize slider when DOM is ready
if (document.querySelector('.hero-slider')) {
    initHeroSlider();
}

// ===== Scroll to Top Button =====
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Animate on Scroll (AOS Alternative) =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations
initScrollAnimations();

// ===== Counter Animation =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Initialize counters
const counters = document.querySelectorAll('.counter');
if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(faq => faq.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Gallery Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== Blog Category Filter =====
const categoryBtns = document.querySelectorAll('.category-btn');
const blogCards = document.querySelectorAll('.blog-card');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        
        blogCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== Lightbox for Gallery =====
let currentImageIndex = 0;
const lightboxImages = [];

// Collect all gallery images
document.querySelectorAll('.gallery-item img, .gallery-item-large img').forEach((img, index) => {
    lightboxImages.push({
        src: img.src,
        alt: img.alt
    });
});

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    if (lightbox && lightboxImage) {
        lightboxImage.src = lightboxImages[index].src;
        lightboxImage.alt = lightboxImages[index].alt;
        if (lightboxCaption) {
            lightboxCaption.textContent = lightboxImages[index].alt;
        }
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= lightboxImages.length) {
        currentImageIndex = 0;
    }
    if (currentImageIndex < 0) {
        currentImageIndex = lightboxImages.length - 1;
    }
    
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    if (lightboxImage) {
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = lightboxImages[currentImageIndex].src;
            lightboxImage.alt = lightboxImages[currentImageIndex].alt;
            if (lightboxCaption) {
                lightboxCaption.textContent = lightboxImages[currentImageIndex].alt;
            }
            lightboxImage.style.opacity = '1';
        }, 200);
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeLightboxImage(-1);
        if (e.key === 'ArrowRight') changeLightboxImage(1);
    }
});

// ===== Load Google Reviews =====
async function loadGoogleReviews() {
    const reviewsSlider = document.getElementById('reviewsSlider');
    if (!reviewsSlider) return;
    
    // Sample reviews (Replace with actual Google Reviews API integration)
    const sampleReviews = [
        {
            author: "Sarah Mitchell",
            rating: 5,
            text: "Absolutely love New Image Hair Salon! Sarah did an amazing job with my balayage. The salon is beautiful, staff is friendly, and the results are stunning. Highly recommend!",
            date: "2 weeks ago"
        },
        {
            author: "Jennifer Lee",
            rating: 5,
            text: "Best salon experience in Calgary! Emma is a bridal hair genius. She made me feel like a princess on my wedding day. Thank you so much!",
            date: "1 month ago"
        },
        {
            author: "Michael Brown",
            rating: 5,
            text: "Great men's grooming services. Michael Chen knows exactly what he's doing. Professional, friendly, and great results every time.",
            date: "3 weeks ago"
        },
        {
            author: "Amanda Wilson",
            rating: 5,
            text: "I've been coming here for 2 years and wouldn't go anywhere else. The quality of service and attention to detail is unmatched in Calgary.",
            date: "1 week ago"
        }
    ];
    
    let reviewsHTML = '';
    sampleReviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        reviewsHTML += `
            <div class="review-card">
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${review.text}"</p>
                <p class="review-author">${review.author}</p>
                <p class="review-date">${review.date}</p>
            </div>
        `;
    });
    
    reviewsSlider.innerHTML = reviewsHTML;
}

loadGoogleReviews();

// ===== Load Blog Posts =====
function loadBlogPosts() {
    const blogPreview = document.getElementById('blogPreview');
    if (!blogPreview) return;
    
    const blogPosts = [
        {
            title: "Winter Hair Care Tips for Calgary",
            excerpt: "Protect your hair from harsh winter conditions with these expert tips.",
            image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600",
            category: "Hair Care Tips",
            date: "Jan 15, 2024",
            link: "blog.html"
        },
        {
            title: "Top Balayage Trends 2024",
            excerpt: "Discover the hottest balayage techniques taking Calgary by storm.",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600",
            category: "Trends",
            date: "Jan 10, 2024",
            link: "blog.html"
        },
        {
            title: "Bridal Hair Planning Guide",
            excerpt: "Everything you need to know about planning your wedding day hair.",
            image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600",
            category: "Bridal",
            date: "Jan 5, 2024",
            link: "blog.html"
        }
    ];
    
    let blogHTML = '';
    blogPosts.forEach((post, index) => {
        blogHTML += `
            <article class="blog-card" data-aos="fade-up" data-delay="${(index + 1) * 100}">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}">
                    <span class="blog-category">${post.category}</span>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span><i class="fas fa-calendar"></i> ${post.date}</span>
                        <span><i class="fas fa-clock"></i> 5 min read</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.link}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    });
    
    blogPreview.innerHTML = blogHTML;
}

loadBlogPosts();

// ===== Contact Form Submission =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (Replace with actual backend integration)
        setTimeout(() => {
            const responseDiv = document.getElementById('formResponse');
            if (responseDiv) {
                responseDiv.innerHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i>
                        Thank you for your message! We'll get back to you within 24 hours.
                    </div>
                `;
                contactForm.reset();
            }
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
        
        // For WhatsApp integration (optional)
        const message = `New Contact Form Submission:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nSubject: ${data.subject}\nMessage: ${data.message}`;
        const whatsappUrl = `https://wa.me/14037013610?text=${encodeURIComponent(message)}`;
        // window.open(whatsappUrl, '_blank');
    });
}

// ===== Newsletter Subscription =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Simulate subscription (Replace with actual backend)
        alert(`Thank you for subscribing with ${email}! Check your inbox for a confirmation email.`);
        newsletterForm.reset();
    });
}

// ===== Lazy Loading Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.parallax-slow');
    
    parallaxElements.forEach(el => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        el.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
});

// ===== Social Share Functions =====
function shareOnFacebook(url, title) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter(url, title) {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp(url, title) {
    window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
}

// ===== Performance Monitoring =====
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((items) => {
        items.getEntries().forEach((entry) => {
            console.log('Performance:', entry.name, entry.duration);
        });
    });
    
    perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
}

// ===== Service Worker Registration (Progressive Web App) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ===== Console Branding =====
console.log('%c Designed & Developed by HanuNova ', 'background: #D4AF37; color: #fff; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('%c https://hanunova.oneapp.dev/ ', 'background: #1a1a1a; color: #D4AF37; padding: 5px 20px; font-size: 14px;');

// ===== Export functions for global use =====
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeLightboxImage = changeLightboxImage;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnWhatsApp = shareOnWhatsApp;
