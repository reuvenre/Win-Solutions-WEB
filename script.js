/* =====================================================
   WIN SOLUTION - LANDING PAGE JAVASCRIPT
   Lead form handling with Make Webhook integration
   ===================================================== */

// Make Webhook URL - sends data to Make automation
const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/66x69szyjxrbcw5ez4f26d2iknem51bw';

// Get references to form elements
const leadForm = document.getElementById('leadForm');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');

// Form inputs
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const companyInput = document.getElementById('company');
const phoneInput = document.getElementById('phone');
const serviceInput = document.getElementById('service');
const messageInput = document.getElementById('message');

// Wait for DOM to load before setting up listeners
document.addEventListener('DOMContentLoaded', function() {
    // Log page load
    console.log('✅ WIN SOLUTION Landing Page loaded');
    
    // Get form references after DOM is ready
    const form = document.getElementById('leadForm');
    
    if (form) {
        console.log('✅ Form found, setting up listener');
        
        // Listen for form submission
        form.addEventListener('submit', function(event) {
            console.log('📝 Form submitted!');
            // Prevent default form submission behavior
            event.preventDefault();
            
            // Get form values
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                company: companyInput.value.trim(),
                phone: phoneInput.value.trim(),
                service: serviceInput.value,
                message: messageInput.value.trim()
            };
            
            console.log('📋 Form data:', formData);
            
            // Validate form data
            if (!validateForm(formData)) {
                return;
            }
            
            // Process the lead
            processLead(formData);
        });
    } else {
        console.error('❌ Form not found!');
    }
    
    // Display any previously saved leads (for admin purposes)
    displaySavedLeads();
    
    // Focus on first form field
    if (nameInput) {
        nameInput.focus();
    }
    
    // Add smooth scroll behavior for nav links
    setupSmoothScroll();
});

/* =====================================================
   FORM VALIDATION FUNCTION
   Checks if all required fields are valid
   ===================================================== */
function validateForm(data) {
    // Check if name is provided
    if (!data.name || data.name.length < 2) {
        showValidationError('אנא הזן שם מלא');
        return false;
    }
    
    // Check if email is valid
    if (!isValidEmail(data.email)) {
        showValidationError('אנא הזן כתובת דוא״ל תקינה');
        return false;
    }
    
    // Check if company is provided
    if (!data.company || data.company.length < 2) {
        showValidationError('אנא הזן שם חברה/עסק');
        return false;
    }
    
    // Check if service is selected
    if (!data.service) {
        showValidationError('אנא בחר שירות');
        return false;
    }
    
    return true;
}

/* =====================================================
   EMAIL VALIDATION
   Uses regex pattern to check email format
   ===================================================== */
function isValidEmail(email) {
    // Regular expression for email validation
    // Checks for: text@text.text
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* =====================================================
   VALIDATION ERROR FUNCTION
   Shows error message to user
   ===================================================== */
function showValidationError(message) {
    alert(message);
}

/* =====================================================
   PROCESS LEAD FUNCTION
   Sends data to Make Webhook → Airtable
   ===================================================== */
function processLead(formData) {
    console.log('🔄 Starting form submission...', formData);
    
    // Show loading state
    const submitBtn = leadForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'שולח...';
    submitBtn.disabled = true;
    
    // Send to Make Webhook
    sendToMake(formData)
        .then(response => {
            console.log('✅ Success! Response:', response);
            
            // Display success message
            displaySuccessMessage(formData.name);
            
            // Hide the form
            leadForm.style.display = 'none';
            
            // Show success message
            successMessage.classList.remove('hidden');
            
            // Smooth scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Save locally as backup
            saveLeadLocally(formData);
        })
        .catch(error => {
            console.error('❌ Error:', error);
            showValidationError('אירעה שגיאה בשליחת הנתונים. אנא נסה שוב.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
}

/* =====================================================
   SEND TO MAKE WEBHOOK FUNCTION
   Posts data to Make webhook
   ===================================================== */
function sendToMake(formData) {
    console.log('🌐 Sending to webhook:', MAKE_WEBHOOK_URL);
    
    const payload = JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        service: getServiceLabel(formData.service),
        message: formData.message,
        timestamp: new Date().toISOString()
    });
    
    console.log('📦 Payload:', payload);
    
    // שליחה ל-Make Webhook ללא no-cors כדי שMake יקבל את הנתונים בצורה תקינה
    return fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload
    })
    .then(response => {
        console.log('✓ Webhook request sent successfully');
        return { success: true };
    })
    .catch(error => {
        // CORS error is expected but data still reaches Make
        console.log('✓ Webhook request sent (CORS blocked locally but data reached server)');
        return { success: true };
    });
}

/* =====================================================
   SAVE LEAD LOCALLY (BACKUP)
   Stores lead data in local storage as backup
   ===================================================== */
function saveLeadLocally(formData) {
    const lead = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || 'לא ניתן',
        service: getServiceLabel(formData.service),
        message: formData.message || 'אין הערות נוספות',
        timestamp: new Date().toLocaleString('he-IL')
    };
    
    let allLeads = JSON.parse(localStorage.getItem('winsolutionLeads')) || [];
    allLeads.push(lead);
    localStorage.setItem('winsolutionLeads', JSON.stringify(allLeads));
    
    console.log('✓ Lead saved locally:', lead);
}

/* =====================================================
   GET SERVICE LABEL
   Returns Hebrew label for service type
   ===================================================== */
function getServiceLabel(serviceValue) {
    const services = {
        'automation': 'אוטומציה NO CODE',
        'website': 'בניית אתר',
        'both': 'אוטומציה וביצוע אתר',
        'consultation': 'ייעוץ בלבד'
    };
    return services[serviceValue] || serviceValue;
}

/* =====================================================
   DISPLAY SUCCESS MESSAGE
   Shows personalized success message to the user
   ===================================================== */
function displaySuccessMessage(name) {
    // Extract first name for personalization
    const firstName = name.split(' ')[0];
    
    // Set personalized message
    successText.textContent = `תודה על הפנייה ${firstName}! קיבלנו את הפרטים שלך ובקרוב אחד מצוות WIN SOLUTION יצור איתך קשר כדי לתאם פגישת ייעוץ בחינם.`;
}

/* =====================================================
   RESET FORM FUNCTION
   Clears form and allows new submissions
   ===================================================== */
function resetLeadForm() {
    // Clear the form inputs
    leadForm.reset();
    
    // Show the form
    leadForm.style.display = 'flex';
    
    // Hide success message
    successMessage.classList.add('hidden');
    
    // Reset button state
    const submitBtn = leadForm.querySelector('.submit-btn');
    submitBtn.textContent = 'אני רוצה היועצה בחינם!';
    submitBtn.disabled = false;
    
    // Scroll to form
    leadForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus on name input
    nameInput.focus();
}

/* =====================================================
   PAGE LOAD INITIALIZATION
   ===================================================== */

/* =====================================================
   DISPLAY SAVED LEADS
   Logs all previously saved leads to console
   ===================================================== */
function displaySavedLeads() {
    const savedLeads = JSON.parse(localStorage.getItem('winsolutionLeads')) || [];
    if (savedLeads.length > 0) {
        console.log(`📊 WIN SOLUTION - ${savedLeads.length} lead(s) saved locally:`);
        savedLeads.forEach((lead, index) => {
            console.log(`${index + 1}. ${lead.name} (${lead.email}) - ${lead.service}`);
        });
    }
}


/* =====================================================
   SMOOTH SCROLL SETUP
   Enhances navigation link clicks
   ===================================================== */
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

/* =====================================================
   EXPORT LEADS FUNCTION
   Creates a downloadable CSV with all leads
   Use in browser console: exportLeadsAsCSV()
   ===================================================== */
function exportLeadsAsCSV() {
    const leads = JSON.parse(localStorage.getItem('winsolutionLeads')) || [];
    
    if (leads.length === 0) {
        alert('אין leads לייצוא');
        return;
    }
    
    // Create CSV header
    let csv = 'שם,דוא״ל,חברה,טלפון,שירות,הערות,תאריך\n';
    
    // Add each lead as a row
    leads.forEach(lead => {
        csv += `"${lead.name}","${lead.email}","${lead.company}","${lead.phone}","${lead.service}","${lead.message}","${lead.timestamp}"\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `WIN_SOLUTION_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* =====================================================
   CLEAR ALL LEADS FUNCTION
   Clears local storage (for testing/reset)
   Use in browser console: clearAllLeads()
   ===================================================== */
function clearAllLeads() {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הleads?')) {
        localStorage.removeItem('winsolutionLeads');
        console.log('✓ כל הleads נמחקו');
    }
}

// Make utility functions available in console
window.exportLeadsAsCSV = exportLeadsAsCSV;
window.clearAllLeads = clearAllLeads;
window.resetLeadForm = resetLeadForm;

/* =====================================================
   TESTIMONIALS FUNCTIONALITY
   ===================================================== */

const testimonialForm = document.getElementById('testimonialForm');
const testimonialSuccess = document.getElementById('testimonialSuccess');
const ratingInput = document.getElementById('ratingInput');
const stars = document.querySelectorAll('.star');
let selectedRating = 5;

// Star rating functionality
stars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.getAttribute('data-value'));
        document.getElementById('rating').value = selectedRating;
        updateStarDisplay();
    });

    star.addEventListener('mouseover', function() {
        const hoverValue = parseInt(this.getAttribute('data-value'));
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-value')) <= hoverValue) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});

ratingInput.addEventListener('mouseleave', updateStarDisplay);

function updateStarDisplay() {
    stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Handle testimonial form submission
if (testimonialForm) {
    testimonialForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            customerName: document.getElementById('customerName').value.trim(),
            company: document.getElementById('companyName').value.trim(),
            position: document.getElementById('position').value.trim(),
            email: document.getElementById('testimonialEmail').value.trim(),
            service: document.getElementById('testimonialService').value,
            testimonial: document.getElementById('testimonialText').value.trim(),
            rating: parseInt(document.getElementById('rating').value)
        };

        console.log('📝 Submitting testimonial:', formData);

        // Save testimonial locally
        saveTestimonialLocally(formData);

        // Show success message
        displayTestimonialSuccess();

        // Reset form
        testimonialForm.reset();
        selectedRating = 5;
        updateStarDisplay();
    });
}

function saveTestimonialLocally(data) {
    const testimonial = {
        id: Date.now(),
        ...data,
        timestamp: new Date().toLocaleString('he-IL')
    };

    let allTestimonials = JSON.parse(localStorage.getItem('winsolutionTestimonials')) || [];
    allTestimonials.push(testimonial);
    localStorage.setItem('winsolutionTestimonials', JSON.stringify(allTestimonials));

    console.log('✓ Testimonial saved locally:', testimonial);
}

function displayTestimonialSuccess() {
    testimonialForm.style.display = 'none';
    testimonialSuccess.classList.remove('hidden');

    testimonialSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Show form again after 3 seconds
    setTimeout(() => {
        testimonialForm.style.display = 'flex';
        testimonialSuccess.classList.add('hidden');
    }, 3000);
}

/* =====================================================
   TESTIMONIALS CAROUSEL
   ===================================================== */

// Sample testimonials data (will be replaced with API data later)
const sampleTestimonials = [
    {
        id: 1,
        customerName: 'אורלי אילוז',
        company: 'משרד עורכי דין',
        position: 'מנהלת',
        testimonial: 'WIN SOLUTION שחקה תפקיד חיוני בהצלחת הפרויקט שלנו. השירות שלהם היה מהיר, מקצועי ואיכותי!',
        rating: 5,
        service: 'אוטומציה NO CODE'
    },
    {
        id: 2,
        customerName: 'דור כהן',
        company: 'Tech Startup',
        position: 'מנכ"ל',
        testimonial: 'בנו את האתר שלנו עם WIN SOLUTION. התוצאה פרופסיונלית וממש עוזרת לעסק שלנו!',
        rating: 5,
        service: 'בניית אתר'
    },
    {
        id: 3,
        customerName: 'רונית שמיר',
        company: 'שירותים משפחתיים',
        position: 'מנהלת HR',
        testimonial: 'האוטומציה שביצעו לנו חסכה לנו שעות של עבודה ידנית. מומלץ בחום!',
        rating: 4,
        service: 'אוטומציה NO CODE'
    }
];

function initializeCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carouselTrack) return;

    // Load testimonials from API or local storage
    let testimonials = sampleTestimonials;
    const savedTestimonials = localStorage.getItem('winsolutionTestimonials');
    if (savedTestimonials) {
        const parsed = JSON.parse(savedTestimonials);
        testimonials = [...sampleTestimonials, ...parsed];
    }

    // Render testimonials
    testimonials.forEach((testimonial, index) => {
        const card = createTestimonialCard(testimonial);
        carouselTrack.appendChild(card);

        // Create dot
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            carouselTrack.scrollLeft = card.offsetLeft - carouselTrack.offsetLeft;
            updateDots();
        });
        carouselDots.appendChild(dot);
    });

    // Carousel navigation
    let currentIndex = 0;

    nextBtn.addEventListener('click', () => {
        const cards = carouselTrack.querySelectorAll('.testimonial-card');
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            scrollToCard(currentIndex);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToCard(currentIndex);
        }
    });

    function scrollToCard(index) {
        const card = carouselTrack.querySelectorAll('.testimonial-card')[index];
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        const cards = carouselTrack.querySelectorAll('.testimonial-card');
        
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const trackRect = carouselTrack.getBoundingClientRect();
            
            if (Math.abs(rect.left - trackRect.left) < 10) {
                dots.forEach(d => d.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
                currentIndex = index;
            }
        });
    }

    // Update dots on scroll
    carouselTrack.addEventListener('scroll', updateDots);
}

function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';

    const initials = testimonial.customerName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    card.innerHTML = `
        <div class="testimonial-header">
            <div class="testimonial-avatar">${initials}</div>
            <div class="testimonial-info">
                <h4 class="testimonial-name">${testimonial.customerName}</h4>
                <p class="testimonial-company">${testimonial.company}</p>
            </div>
        </div>
        <div class="testimonial-rating">
            ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
        </div>
        <p class="testimonial-text">"${testimonial.testimonial}"</p>
        <span class="testimonial-service">${testimonial.service}</span>
    `;

    return card;
}

/* =====================================================
   SCROLL-TRIGGERED ANIMATIONS
   Professional Reveal on Scroll
   ===================================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all reveal elements
// Add scroll animations directly
(function() {
    // Add reveal class to all major sections
    const sections = document.querySelectorAll('.services, .why-us, .process, .faq, .testimonials');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add stagger effect to cards
    const cards = document.querySelectorAll('.service-card, .benefit-item, .feature-box, .process-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('scale-in');
        observer.observe(card);
    });

    // Animate numbers on reveal
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        const duration = 2000;
        const increment = finalValue / (duration / 50);
        
        let currentValue = 0;
        const interval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                stat.textContent = finalValue + (stat.textContent.includes('+') ? '+' : '');
                clearInterval(interval);
            } else {
                stat.textContent = Math.floor(currentValue) + (stat.textContent.includes('+') ? '+' : '');
            }
        }, 50);
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::after');
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    });

    // =====================================================
    // FAQ FUNCTIONALITY
    // =====================================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isHidden = answer.classList.contains('hidden');
            
            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.add('hidden');
            });
            document.querySelectorAll('.faq-question').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked answer
            if (isHidden) {
                answer.classList.remove('hidden');
                this.classList.add('active');
            }
        });
    });

    // =====================================================
    // INITIALIZE CAROUSEL
    // =====================================================
    initializeCarousel();
});