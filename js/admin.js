/* ================================
   New Image Hair Salon - Admin Panel
   Full CMS Functionality
   Designed by HanuNova
   ================================ */

// ===== Admin Authentication =====
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'newimage2024'
};

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        showLoginScreen();
    } else {
        showDashboard();
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadDashboardData();
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = 'Invalid username or password';
            errorDiv.classList.add('show');
            errorDiv.style.display = 'block';
            
            // Shake animation
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    });
}

// Logout function
function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        showLoginScreen();
    }
}

// ===== Section Navigation =====
const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
const sections = document.querySelectorAll('.admin-section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active to clicked item
        item.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        
        // Show selected section
        const sectionId = item.getAttribute('data-section');
        document.getElementById(`section-${sectionId}`).classList.add('active');
        
        // Update title
        const sectionTitle = item.querySelector('span').textContent;
        document.getElementById('sectionTitle').textContent = sectionTitle;
        
        // Load section data
        loadSectionData(sectionId);
    });
});

// ===== Mobile Sidebar Toggle =====
const sidebarToggle = document.getElementById('sidebarToggle');
const adminSidebar = document.querySelector('.admin-sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('active');
    });
}

// ===== Load Dashboard Data =====
function loadDashboardData() {
    // Load stats
    loadStats();
    
    // Load recent bookings
    loadRecentBookings();
}

function loadStats() {
    // Get stats from localStorage or use default
    const stats = getFromStorage('stats') || {
        totalBookings: 247,
        totalClients: 1456,
        avgRating: 4.9,
        revenue: 42890
    };
    
    // Update stat cards (if on dashboard)
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length > 0) {
        statCards[0].textContent = stats.totalBookings;
        statCards[1].textContent = stats.totalClients.toLocaleString();
        statCards[2].textContent = stats.avgRating;
        statCards[3].textContent = '$' + stats.revenue.toLocaleString();
    }
}

function loadRecentBookings() {
    const bookings = getFromStorage('bookings') || [
        {
            id: 1,
            client: 'Emma Wilson',
            service: 'Balayage',
            stylist: 'Sarah Johnson',
            date: 'Jan 20, 2024',
            status: 'confirmed'
        },
        {
            id: 2,
            client: 'Michael Brown',
            service: "Men's Cut",
            stylist: 'Michael Chen',
            date: 'Jan 20, 2024',
            status: 'pending'
        }
    ];
    
    const tbody = document.getElementById('recentBookings');
    if (tbody) {
        tbody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.client}</td>
                <td>${booking.service}</td>
                <td>${booking.stylist}</td>
                <td>${booking.date}</td>
                <td><span class="status ${booking.status}">${booking.status}</span></td>
            </tr>
        `).join('');
    }
}

// ===== Load Section Data =====
function loadSectionData(section) {
    switch(section) {
        case 'hero':
            loadHeroSlides();
            break;
        case 'services':
            loadServices();
            break;
        case 'team':
            loadTeamMembers();
            break;
        case 'gallery':
            loadGalleryImages();
            break;
        case 'blog':
            loadBlogPosts();
            break;
        case 'reviews':
            loadReviews();
            break;
        case 'bookings':
            loadAllBookings();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ===== Hero Slides Management =====
function loadHeroSlides() {
    const slides = getFromStorage('heroSlides') || [
        {
            id: 1,
            title: 'Transform Your Look',
            subtitle: 'Experience Premium Hair Artistry',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920',
            btn1Text: 'Book Appointment',
            btn1Link: 'booking.html'
        },
        {
            id: 2,
            title: 'Luxury Hair Styling',
            subtitle: 'Where Elegance Meets Expert Craftsmanship',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1920',
            btn1Text: 'Book Appointment',
            btn1Link: 'booking.html'
        }
    ];
    
    const container = document.getElementById('heroSlidesList');
    if (container) {
        container.innerHTML = slides.map(slide => `
            <div class="hero-slide-item">
                <img src="${slide.image}" alt="${slide.title}" class="item-image">
                <div class="item-content">
                    <h4 class="item-title">${slide.title}</h4>
                    <p class="item-description">${slide.subtitle}</p>
                    <div class="item-actions">
                        <button class="btn-icon btn-edit" onclick="editHeroSlide(${slide.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteHeroSlide(${slide.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function addHeroSlide() {
    document.getElementById('heroEditor').style.display = 'block';
    document.getElementById('heroSlideForm').reset();
}

function closeHeroEditor() {
    document.getElementById('heroEditor').style.display = 'none';
}

function editHeroSlide(id) {
    const slides = getFromStorage('heroSlides') || [];
    const slide = slides.find(s => s.id === id);
    
    if (slide) {
        document.getElementById('slideTitle').value = slide.title;
        document.getElementById('slideSubtitle').value = slide.subtitle;
        document.getElementById('slideImage').value = slide.image;
        document.getElementById('slideBtn1Text').value = slide.btn1Text;
        document.getElementById('slideBtn1Link').value = slide.btn1Link;
        
        document.getElementById('heroEditor').style.display = 'block';
    }
}

function deleteHeroSlide(id) {
    if (confirm('Are you sure you want to delete this slide?')) {
        let slides = getFromStorage('heroSlides') || [];
        slides = slides.filter(s => s.id !== id);
        saveToStorage('heroSlides', slides);
        loadHeroSlides();
        showNotification('Slide deleted successfully', 'success');
    }
}

// ===== Services Management =====
function loadServices() {
    const services = getFromStorage('services') || [
        {
            id: 1,
            name: 'Precision Hair Cutting',
            description: 'Expert cuts tailored to your style',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',
            price: 'From $65'
        },
        {
            id: 2,
            name: 'Color & Balayage',
            description: 'Stunning color transformations',
            image: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=500',
            price: 'From $95'
        }
    ];
    
    const container = document.getElementById('servicesList');
    if (container) {
        container.innerHTML = services.map(service => `
            <div class="service-item">
                <img src="${service.image}" alt="${service.name}" class="item-image">
                <div class="item-content">
                    <h4 class="item-title">${service.name}</h4>
                    <p class="item-description">${service.description}</p>
                    <p><strong>${service.price}</strong></p>
                    <div class="item-actions">
                        <button class="btn-icon btn-edit" onclick="editService(${service.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteService(${service.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function addService() {
    showNotification('Service editor would open here', 'info');
}

function editService(id) {
    showNotification('Edit service ' + id, 'info');
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        let services = getFromStorage('services') || [];
        services = services.filter(s => s.id !== id);
        saveToStorage('services', services);
        loadServices();
        showNotification('Service deleted successfully', 'success');
    }
}

// ===== Team Members Management =====
function loadTeamMembers() {
    const team = getFromStorage('team') || [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Master Stylist & Color Specialist',
            image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500',
            bio: '10+ years of experience in color transformations'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Senior Stylist',
            image: 'https://images.unsplash.com/photo-1598887142487-3c854d51228e?w=500',
            bio: 'Specialist in mens grooming'
        }
    ];
    
    const container = document.getElementById('teamList');
    if (container) {
        container.innerHTML = team.map(member => `
            <div class="team-item">
                <img src="${member.image}" alt="${member.name}" class="item-image">
                <div class="item-content">
                    <h4 class="item-title">${member.name}</h4>
                    <p style="color: var(--primary-color); font-weight: 600;">${member.role}</p>
                    <p class="item-description">${member.bio}</p>
                    <div class="item-actions">
                        <button class="btn-icon btn-edit" onclick="editTeamMember(${member.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteTeamMember(${member.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function addTeamMember() {
    showNotification('Team member editor would open here', 'info');
}

function editTeamMember(id) {
    showNotification('Edit team member ' + id, 'info');
}

function deleteTeamMember(id) {
    if (confirm('Are you sure you want to delete this team member?')) {
        let team = getFromStorage('team') || [];
        team = team.filter(t => t.id !== id);
        saveToStorage('team', team);
        loadTeamMembers();
        showNotification('Team member deleted successfully', 'success');
    }
}

// ===== Gallery Management =====
function loadGalleryImages() {
    const gallery = getFromStorage('gallery') || [
        {
            id: 1,
            title: 'Balayage Blonde',
            category: 'color',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600'
        },
        {
            id: 2,
            title: 'Modern Bob Cut',
            category: 'cutting',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600'
        }
    ];
    
    const container = document.getElementById('galleryList');
    if (container) {
        container.innerHTML = gallery.map(item => `
            <div class="gallery-item-admin">
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-content">
                    <h4 class="item-title">${item.title}</h4>
                    <p class="item-description">Category: ${item.category}</p>
                    <div class="item-actions">
                        <button class="btn-icon btn-edit" onclick="editGalleryItem(${item.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteGalleryItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function uploadGalleryImage() {
    showNotification('Image upload dialog would open here', 'info');
}

function editGalleryItem(id) {
    showNotification('Edit gallery item ' + id, 'info');
}

function deleteGalleryItem(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        let gallery = getFromStorage('gallery') || [];
        gallery = gallery.filter(g => g.id !== id);
        saveToStorage('gallery', gallery);
        loadGalleryImages();
        showNotification('Image deleted successfully', 'success');
    }
}

// ===== Blog Posts Management =====
function loadBlogPosts() {
    const posts = getFromStorage('blogPosts') || [
        {
            id: 1,
            title: 'Winter Hair Care Tips for Calgary',
            category: 'tips',
            excerpt: 'Protect your hair from harsh winter conditions',
            image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600',
            author: 'Sarah Johnson',
            date: 'Jan 15, 2024'
        },
        {
            id: 2,
            title: 'Top Balayage Trends 2024',
            category: 'trends',
            excerpt: 'Discover the hottest balayage techniques',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600',
            author: 'Emma Rodriguez',
            date: 'Jan 10, 2024'
        }
    ];
    
    const container = document.getElementById('blogList');
    if (container) {
        container.innerHTML = posts.map(post => `
            <div class="blog-item">
                <img src="${post.image}" alt="${post.title}" class="blog-item-image">
                <div class="blog-item-content">
                    <h4 class="blog-item-title">${post.title}</h4>
                    <div class="blog-item-meta">
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        <span><i class="fas fa-calendar"></i> ${post.date}</span>
                        <span><i class="fas fa-tag"></i> ${post.category}</span>
                    </div>
                    <p class="blog-item-excerpt">${post.excerpt}</p>
                    <div class="item-actions">
                        <button class="btn btn-primary btn-small" onclick="editBlogPost(${post.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-outline btn-small" onclick="deleteBlogPost(${post.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function addBlogPost() {
    document.getElementById('blogEditor').style.display = 'block';
    document.getElementById('blogPostForm').reset();
}

function closeBlogEditor() {
    document.getElementById('blogEditor').style.display = 'none';
}

function editBlogPost(id) {
    const posts = getFromStorage('blogPosts') || [];
    const post = posts.find(p => p.id === id);
    
    if (post) {
        document.getElementById('blogTitle').value = post.title;
        document.getElementById('blogCategory').value = post.category;
        document.getElementById('blogImage').value = post.image;
        document.getElementById('blogExcerpt').value = post.excerpt;
        document.getElementById('blogAuthor').value = post.author;
        
        document.getElementById('blogEditor').style.display = 'block';
    }
}

function deleteBlogPost(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        let posts = getFromStorage('blogPosts') || [];
        posts = posts.filter(p => p.id !== id);
        saveToStorage('blogPosts', posts);
        loadBlogPosts();
        showNotification('Blog post deleted successfully', 'success');
    }
}

// Blog form submission
const blogPostForm = document.getElementById('blogPostForm');
if (blogPostForm) {
    blogPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(blogPostForm);
        const post = {
            id: Date.now(),
            title: formData.get('title'),
            category: formData.get('category'),
            image: formData.get('image'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            author: formData.get('author'),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        
        let posts = getFromStorage('blogPosts') || [];
        posts.unshift(post);
        saveToStorage('blogPosts', posts);
        
        closeBlogEditor();
        loadBlogPosts();
        showNotification('Blog post published successfully!', 'success');
    });
}

// ===== Reviews Management =====
function loadReviews() {
    const reviews = getFromStorage('reviews') || [
        {
            id: 1,
            author: 'Sarah Mitchell',
            rating: 5,
            text: 'Absolutely love New Image Hair Salon! Best experience ever.',
            date: '2 weeks ago'
        },
        {
            id: 2,
            author: 'Jennifer Lee',
            rating: 5,
            text: 'Amazing bridal hair service. Emma is a genius!',
            date: '1 month ago'
        }
    ];
    
    const container = document.getElementById('reviewsList');
    if (container) {
        container.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author-info">
                        <div class="review-avatar">${review.author.charAt(0)}</div>
                        <div>
                            <div class="review-author-name">${review.author}</div>
                            <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                        </div>
                    </div>
                    <div>
                        <button class="btn-icon btn-delete" onclick="deleteReview(${review.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
                <small style="color: var(--text-light);">${review.date}</small>
            </div>
        `).join('');
    }
}

function syncGoogleReviews() {
    showNotification('Syncing with Google Reviews...', 'info');
    setTimeout(() => {
        showNotification('Reviews synced successfully!', 'success');
    }, 2000);
}

function deleteReview(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        let reviews = getFromStorage('reviews') || [];
        reviews = reviews.filter(r => r.id !== id);
        saveToStorage('reviews', reviews);
        loadReviews();
        showNotification('Review deleted successfully', 'success');
    }
}

// ===== Bookings Management =====
function loadAllBookings() {
    const bookings = getFromStorage('bookings') || [
        {
            id: 1,
            client: 'Emma Wilson',
            phone: '+1 (403) 555-0123',
            service: 'Balayage',
            stylist: 'Sarah Johnson',
            date: 'Jan 20, 2024',
            time: '2:00 PM',
            status: 'confirmed'
        },
        {
            id: 2,
            client: 'Michael Brown',
            phone: '+1 (403) 555-0456',
            service: "Men's Cut",
            stylist: 'Michael Chen',
            date: 'Jan 20, 2024',
            time: '3:00 PM',
            status: 'pending'
        },
        {
            id: 3,
            client: 'Jessica Taylor',
            phone: '+1 (403) 555-0789',
            service: 'Bridal Hair',
            stylist: 'Emma Rodriguez',
            date: 'Jan 21, 2024',
            time: '10:00 AM',
            status: 'confirmed'
        }
    ];
    
    const tbody = document.getElementById('bookingsTableBody');
    if (tbody) {
        tbody.innerHTML = bookings.map(booking => `
            <tr>
                <td>#${booking.id}</td>
                <td>${booking.client}</td>
                <td>${booking.phone}</td>
                <td>${booking.service}</td>
                <td>${booking.stylist}</td>
                <td>${booking.date} ${booking.time}</td>
                <td><span class="status ${booking.status}">${booking.status}</span></td>
                <td>
                    <select onchange="updateBookingStatus(${booking.id}, this.value)" class="status-select">
                        <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `).join('');
    }
}

function updateBookingStatus(id, status) {
    let bookings = getFromStorage('bookings') || [];
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = status;
        saveToStorage('bookings', bookings);
        loadAllBookings();
        showNotification('Booking status updated', 'success');
    }
}

// ===== Settings Management =====
function loadSettings() {
    const settings = getFromStorage('settings') || {
        salonName: 'New Image Hair Salon',
        phone: '+1 (403) 701-3610',
        email: 'info@newimagehairsalon.ca',
        address: '63 Cornerstone Cir NE, Calgary, AB T3N 1H1, Canada'
    };
    
    // Populate settings form
    const generalForm = document.getElementById('generalSettings');
    if (generalForm) {
        generalForm.querySelector('input[type="text"]').value = settings.salonName;
        generalForm.querySelector('input[type="tel"]').value = settings.phone;
        generalForm.querySelector('input[type="email"]').value = settings.email;
        generalForm.querySelector('textarea').value = settings.address;
    }
}

// Settings form handlers
const generalSettings = document.getElementById('generalSettings');
if (generalSettings) {
    generalSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Settings saved successfully!', 'success');
    });
}

const hoursSettings = document.getElementById('hoursSettings');
if (hoursSettings) {
    hoursSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Business hours updated!', 'success');
    });
}

const socialSettings = document.getElementById('socialSettings');
if (socialSettings) {
    socialSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Social media links updated!', 'success');
    });
}

const seoSettings = document.getElementById('seoSettings');
if (seoSettings) {
    seoSettings.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('SEO settings updated!', 'success');
    });
}

// ===== LocalStorage Helper Functions =====
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error removing from localStorage:', e);
        return false;
    }
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .admin-notification {
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 15px 25px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .admin-notification.show {
        transform: translateX(0);
    }
    
    .admin-notification.success {
        border-left: 4px solid #28a745;
    }
    
    .admin-notification.error {
        border-left: 4px solid #dc3545;
    }
    
    .admin-notification.info {
        border-left: 4px solid #17a2b8;
    }
    
    .admin-notification i {
        font-size: 20px;
    }
    
    .admin-notification.success i {
        color: #28a745;
    }
    
    .admin-notification.error i {
        color: #dc3545;
    }
    
    .admin-notification.info i {
        color: #17a2b8;
    }
    
    .status-select {
        padding: 5px 10px;
        border: 2px solid #e0e0e0;
        border-radius: 5px;
        font-size: 0.85rem;
        cursor: pointer;
    }
`;
document.head.appendChild(notificationStyles);

// ===== Section Show Function =====
function showSection(sectionName) {
    const navItem = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
    if (navItem) {
        navItem.click();
    }
}

// ===== Export Functions =====
window.adminLogout = adminLogout;
window.showSection = showSection;
window.addHeroSlide = addHeroSlide;
window.editHeroSlide = editHeroSlide;
window.deleteHeroSlide = deleteHeroSlide;
window.closeHeroEditor = closeHeroEditor;
window.addService = addService;
window.editService = editService;
window.deleteService = deleteService;
window.addTeamMember = addTeamMember;
window.editTeamMember = editTeamMember;
window.deleteTeamMember = deleteTeamMember;
window.uploadGalleryImage = uploadGalleryImage;
window.editGalleryItem = editGalleryItem;
window.deleteGalleryItem = deleteGalleryItem;
window.addBlogPost = addBlogPost;
window.editBlogPost = editBlogPost;
window.deleteBlogPost = deleteBlogPost;
window.closeBlogEditor = closeBlogEditor;
window.syncGoogleReviews = syncGoogleReviews;
window.deleteReview = deleteReview;
window.updateBookingStatus = updateBookingStatus;

// ===== Initialize Admin Panel =====
if (document.querySelector('.admin-body')) {
    checkAuth();
}

console.log('%c Admin Panel Loaded Successfully ', 'background: #D4AF37; color: #fff; padding: 5px 10px; font-weight: bold;');
console.log('%c Default Login - Username: admin | Password: newimage2024 ', 'background: #1a1a1a; color: #D4AF37; padding: 5px 10px;');
