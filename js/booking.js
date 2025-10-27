/* ================================
   New Image Hair Salon - Booking System
   WhatsApp Integration
   Designed by HanuNova
   ================================ */

// ===== Booking Form State =====
let bookingData = {
    service: '',
    stylist: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
};

// ===== Step Navigation =====
let currentStep = 1;
const totalSteps = 4;

function nextStep(step) {
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show next step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Scroll to top of form
    document.querySelector('.booking-form-container').scrollIntoView({ behavior: 'smooth' });
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show previous step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Scroll to top of form
    document.querySelector('.booking-form-container').scrollIntoView({ behavior: 'smooth' });
}

function updateProgressIndicator() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else if (index === currentStep - 1) {
            step.classList.add('active');
        }
    });
}

// ===== Step Validation =====
function validateStep(step) {
    let isValid = true;
    let errorMessage = '';
    
    switch(step) {
        case 1:
            const selectedService = document.querySelector('input[name="service"]:checked');
            if (!selectedService) {
                errorMessage = 'Please select a service';
                isValid = false;
            } else {
                bookingData.service = selectedService.value;
                updateSummary('service', selectedService.value);
            }
            break;
            
        case 2:
            const selectedStylist = document.querySelector('input[name="stylist"]:checked');
            if (!selectedStylist) {
                errorMessage = 'Please select a stylist';
                isValid = false;
            } else {
                bookingData.stylist = selectedStylist.value;
                updateSummary('stylist', selectedStylist.value);
            }
            break;
            
        case 3:
            const date = document.getElementById('appointmentDate').value;
            const time = document.getElementById('appointmentTime').value;
            
            if (!date) {
                errorMessage = 'Please select a date';
                isValid = false;
            } else if (!time) {
                errorMessage = 'Please select a time';
                isValid = false;
            } else {
                // Validate date is not in the past
                const selectedDate = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    errorMessage = 'Please select a future date';
                    isValid = false;
                } else {
                    bookingData.date = date;
                    bookingData.time = time;
                    updateSummary('date', formatDate(date));
                    updateSummary('time', time);
                }
            }
            break;
            
        case 4:
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const email = document.getElementById('clientEmail').value.trim();
            
            if (!name) {
                errorMessage = 'Please enter your name';
                isValid = false;
            } else if (!phone) {
                errorMessage = 'Please enter your phone number';
                isValid = false;
            } else if (!email) {
                errorMessage = 'Please enter your email';
                isValid = false;
            } else if (!isValidEmail(email)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            } else {
                bookingData.name = name;
                bookingData.phone = phone;
                bookingData.email = email;
                bookingData.notes = document.getElementById('specialRequests').value.trim();
            }
            break;
    }
    
    if (!isValid) {
        showNotification(errorMessage, 'error');
    }
    
    return isValid;
}

// ===== Update Booking Summary =====
function updateSummary(field, value) {
    const summaryElement = document.getElementById(`summary${field.charAt(0).toUpperCase() + field.slice(1)}`);
    if (summaryElement) {
        summaryElement.textContent = value;
    }
}

// ===== Helper Functions =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== Form Submission (WhatsApp Integration) =====
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Final validation
        if (!validateStep(4)) {
            return;
        }
        
        // Create WhatsApp message
        const message = createWhatsAppMessage();
        
        // WhatsApp number (format: country code + number, no + or spaces)
        const whatsappNumber = '14037013610';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Show confirmation
        showConfirmationModal(whatsappURL);
    });
}

function createWhatsAppMessage() {
    let message = `🎨 *NEW APPOINTMENT BOOKING*\n\n`;
    message += `👤 *Client Information:*\n`;
    message += `Name: ${bookingData.name}\n`;
    message += `Phone: ${bookingData.phone}\n`;
    message += `Email: ${bookingData.email}\n\n`;
    message += `💇 *Service Details:*\n`;
    message += `Service: ${bookingData.service}\n`;
    message += `Stylist: ${bookingData.stylist}\n`;
    message += `Date: ${formatDate(bookingData.date)}\n`;
    message += `Time: ${bookingData.time}\n\n`;
    
    if (bookingData.notes) {
        message += `📝 *Special Requests:*\n${bookingData.notes}\n\n`;
    }
    
    message += `✨ Thank you for choosing New Image Hair Salon!\n`;
    message += `We'll confirm your appointment shortly.`;
    
    return message;
}

function showConfirmationModal(whatsappURL) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'booking-confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Request Ready!</h2>
            <p>Click the button below to send your booking request via WhatsApp.</p>
            <div class="booking-summary">
                <h3>Booking Summary:</h3>
                <p><strong>Service:</strong> ${bookingData.service}</p>
                <p><strong>Stylist:</strong> ${bookingData.stylist}</p>
                <p><strong>Date:</strong> ${formatDate(bookingData.date)}</p>
                <p><strong>Time:</strong> ${bookingData.time}</p>
            </div>
            <div class="modal-buttons">
                <a href="${whatsappURL}" target="_blank" class="btn btn-primary btn-large">
                    <i class="fab fa-whatsapp"></i> Send via WhatsApp
                </a>
                <button onclick="closeConfirmationModal()" class="btn btn-outline">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeConfirmationModal() {
    const modal = document.querySelector('.booking-confirmation-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// ===== Set Minimum Date for Appointment =====
const dateInput = document.getElementById('appointmentDate');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
}

// ===== Service Selection Enhancement =====
const serviceOptions = document.querySelectorAll('.service-option input[type="radio"]');
serviceOptions.forEach(option => {
    option.addEventListener('change', (e) => {
        // Remove active class from all options
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add active class to selected option
        e.target.closest('.service-option').classList.add('selected');
    });
});

// ===== Stylist Selection Enhancement =====
const stylistOptions = document.querySelectorAll('.stylist-option input[type="radio"]');
stylistOptions.forEach(option => {
    option.addEventListener('change', (e) => {
        // Remove active class from all options
        document.querySelectorAll('.stylist-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add active class to selected option
        e.target.closest('.stylist-option').classList.add('selected');
    });
});

// ===== URL Parameters for Pre-selection =====
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Pre-select service from URL
const preSelectedService = getURLParameter('service');
if (preSelectedService) {
    const serviceInput = document.querySelector(`input[name="service"][value="${preSelectedService}"]`);
    if (serviceInput) {
        serviceInput.checked = true;
        serviceInput.closest('.service-option').classList.add('selected');
    }
}

// Pre-select stylist from URL
const preSelectedStylist = getURLParameter('stylist');
if (preSelectedStylist) {
    const stylistInput = document.querySelector(`input[name="stylist"][value="${preSelectedStylist}"]`);
    if (stylistInput) {
        stylistInput.checked = true;
        stylistInput.closest('.stylist-option').classList.add('selected');
    }
}

// ===== Auto-save to localStorage =====
function saveBookingData() {
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
}

function loadBookingData() {
    const saved = localStorage.getItem('bookingData');
    if (saved) {
        const data = JSON.parse(saved);
        // You can auto-fill form with saved data if needed
    }
}

// ===== Export functions =====
window.nextStep = nextStep;
window.prevStep = prevStep;
window.closeConfirmationModal = closeConfirmationModal;

console.log('%c Booking System Loaded Successfully ', 'background: #25D366; color: #fff; padding: 5px 10px;');
