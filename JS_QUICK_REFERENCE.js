/* =====================================================
   WIN SOLUTION - JAVASCRIPT QUICK REFERENCE
   
   🔧 What this file does:
   - Handles form submissions
   - Creates carousel animations
   - Manages FAQ accordion
   - Tracks user interactions
   - Shows/hides success messages
   
   📖 HOW TO MODIFY:
   ===================================================== */

// =====================================================
// MAIN SECTIONS OF JAVASCRIPT:
// =====================================================

// 1. LEAD FORM (צור קשר טופס)
// Location: Search for "// Handle lead form submission"
// What it does:
//   - Collects name, email, company, phone, service, message
//   - Sends to Make.com webhook
//   - Shows success message
//   - Saves to localStorage as backup

// Change where form sends to:
// Find: const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/...'
// Example: You can change it to different webhook URL if needed

// 2. TESTIMONIALS FORM (טופס המלצות)
// Location: Search for "// Handle testimonial form submission"
// What it does:
//   - Collects customer name, company, testimonial, rating
//   - Validates the input
//   - Saves to localStorage
//   - Shows success message

// Change the minimum testimonial length:
// Find: minlength="20"  in HTML
// Change 20 to any number you want

// 3. TESTIMONIALS CAROUSEL (גלגל המלצות)
// Location: Search for "initializeCarousel()"
// What it does:
//   - Displays testimonials in a sliding carousel
//   - Handles previous/next buttons
//   - Shows dots for pagination
//   - Allows custom sample testimonials

// Change sample testimonials:
// Find: const sampleTestimonials = [
// Modify the sample data there

// 4. FAQ ACCORDION (שאלות נפוצות)
// Location: Search for "// Initialize FAQ"
// What it does:
//   - Opens/closes FAQ questions
//   - Only one answer visible at a time
//   - Smooth animations

// To add a new FAQ question:
// 1. Add HTML in index.html:
//    <div class="faq-item">
//        <button class="faq-question">
//            <span>Your Question?</span>
//            <span class="faq-icon">+</span>
//        </button>
//        <div class="faq-answer hidden">
//            <p>Your answer here</p>
//        </div>
//    </div>
// 2. JavaScript will automatically handle it!

// 5. SCROLL ANIMATIONS (אנימציות בגלילה)
// Location: Search for "// Initialize FAQ on page load"
// What it does:
//   - Elements fade in when they come into view
//   - Numbers count up when visible
//   - Cards slide in with stagger effect

// Adjust animation speed:
// Find: threshold: 0.1
// Change 0.1 to:
//   - 0.5 = trigger at 50% visible
//   - 0.9 = trigger at 90% visible (almost fully visible)
//   - 0.1 = trigger at 10% visible (sooner)

// =====================================================
// COMMON CHANGES YOU MIGHT WANT:
// =====================================================

// 1. CHANGE WHERE FORM SENDS DATA
// Find this line:
// const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/...';
// Replace the URL with your new webhook URL

// 2. CHANGE FORM VALIDATION RULES
// Find: "Email is required"
// Change the validation message to your preference

// 3. CHANGE SUCCESS MESSAGE
// Find: <h3>תודה על ההמלצה!</h3>
// Change the text in index.html

// 4. ADD NEW FORM FIELDS
// Example: Add phone field to contact form
// In HTML:
// <input type="tel" id="phone" name="phone" required>
// In JavaScript:
// phone: document.getElementById('phone').value.trim(),

// 5. DISABLE/ENABLE FEATURES
// FAQ disabled? Comment out the FAQ JavaScript:
// // document.querySelectorAll('.faq-question').forEach(...)
// Carousel disabled? Comment out:
// // initializeCarousel();

// =====================================================
// HOW TO DEBUG IF SOMETHING IS WRONG:
// =====================================================

// 1. OPEN BROWSER CONSOLE
//    Press F12 or Ctrl+Shift+I
//    Go to "Console" tab

// 2. LOOK FOR RED ERRORS
//    They show exactly what went wrong and where

// 3. CHECK THE OUTPUT
//    Look for console.log() messages
//    They start with ✅, 📝, 🌐, etc.

// 4. COMMON ERRORS:
//    - "Cannot read property X of null"
//      = An element with that ID doesn't exist in HTML
//    - "Unexpected token"
//      = Missing semicolon or bracket somewhere
//    - "fetch failed"
//      = The webhook URL is wrong or unreachable

// =====================================================
// HELPFUL CONSOLE COMMANDS (if in doubt):
// =====================================================

// In browser console, you can test things:

// 1. Get form data:
// document.getElementById('leadForm').elements[0].value

// 2. Manually trigger form:
// document.getElementById('leadForm').dispatchEvent(new Event('submit'))

// 3. Clear localStorage:
// localStorage.clear()

// 4. See all stored leads:
// JSON.parse(localStorage.getItem('winsolutionLeads'))

// 5. See all stored testimonials:
// JSON.parse(localStorage.getItem('winsolutionTestimonials'))

// =====================================================
// IMPORTANT FUNCTIONS:
// =====================================================

// exportLeadsAsCSV()
// - Downloads all leads as CSV file
// - Useful for backup

// clearAllLeads()
// - Deletes all stored leads from memory
// - Careful! This is permanent!

// resetLeadForm()
// - Clears all form fields
// - Resets to empty state

// initializeCarousel()
// - Sets up the testimonials carousel
// - Runs automatically on page load

// =====================================================
// FILE STRUCTURE:
// =====================================================

// script.js is organized like this:
// 1. API/Config variables (top)
// 2. Lead form handling
// 3. Testimonial form handling
// 4. Testimonial carousel
// 5. FAQ functionality
// 6. Scroll animations
// 7. Initialization on page load

// To find something:
// Ctrl+F and search for the function name or concept

// =====================================================
// EXAMPLE: How to add a new field to form
// =====================================================

// 1. In HTML, add:
// <input type="text" id="website" name="website" placeholder="Website">

// 2. In JavaScript, find the formData object:
// const formData = {
//     name: ...,
//     email: ...,
//     website: document.getElementById('website').value.trim(),  ← ADD THIS
// }

// 3. Done! The new field will be included in submissions

// =====================================================
// TIPS & BEST PRACTICES:
// =====================================================

// ✅ DO:
// - Add comments explaining your changes
// - Test in browser console before deploying
// - Back up the file before making changes
// - Use console.log() to debug

// ❌ DON'T:
// - Delete entire functions unless you know why
// - Change variable names without updating references
// - Leave broken code (use // to comment out instead)
// - Forget semicolons at end of statements

// =====================================================
// EXTERNAL RESOURCES:
// =====================================================

// JavaScript MDN Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript
// How to use console: https://developer.chrome.com/docs/devtools/console/
// Test JSON: https://jsonlint.com/

// ===================================================== */
