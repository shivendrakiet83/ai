// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Navbar Background Change on Scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Date and Time Picker (only on reservation page)
const datePicker = document.getElementById('date');
if (datePicker) {
    flatpickr("#date", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        time_24hr: true,
        minuteIncrement: 15,
        disable: [
            function(date) {
                // Disable weekends
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ]
    });
}

// Form Validation and Submission (only on reservation page)
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(reservationForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(data)) {
            // Show success message
            showConfirmation(data);
            // Reset form
            reservationForm.reset();
            // Scroll to confirmation message
            setTimeout(() => {
                document.querySelector('.confirmation-message').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    });
}

function validateForm(data) {
    let isValid = true;
    const errors = [];

    // Name validation
    if (!data.name || data.name.length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) {
        errors.push('Please enter a valid phone number (at least 10 digits)');
        isValid = false;
    }

    // Date validation
    if (!data.date) {
        errors.push('Please select a date and time');
        isValid = false;
    }

    // Guests validation
    if (!data.guests) {
        errors.push('Please select the number of guests');
        isValid = false;
    }

    // Show errors if any
    if (errors.length > 0) {
        showErrors(errors);
    }

    return isValid;
}

function showErrors(errors) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.innerHTML = `
        <h3>Please fix the following errors:</h3>
        <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;

    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Insert error message before the form
    reservationForm.parentNode.insertBefore(errorContainer, reservationForm);

    // Scroll to error message
    errorContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // Remove error message after 5 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

function showConfirmation(data) {
    const confirmationContainer = document.createElement('div');
    confirmationContainer.className = 'confirmation-message';
    confirmationContainer.innerHTML = `
        <h3>Reservation Confirmed!</h3>
        <p>Thank you, ${data.name}!</p>
        <p>Your reservation details:</p>
        <ul>
            <li><strong>Date & Time:</strong> ${data.date}</li>
            <li><strong>Number of Guests:</strong> ${data.guests}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
        </ul>
        <p>We'll send a confirmation email shortly.</p>
    `;

    // Remove any existing confirmation messages
    const existingConfirmation = document.querySelector('.confirmation-message');
    if (existingConfirmation) {
        existingConfirmation.remove();
    }

    // Insert confirmation message before the form
    reservationForm.parentNode.insertBefore(confirmationContainer, reservationForm);

    // Remove confirmation message after 10 seconds
    setTimeout(() => {
        confirmationContainer.remove();
    }, 10000);
}

// Add active class to navigation links on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add animation to features on scroll (only on about page)
const features = document.querySelectorAll('.feature');
if (features.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        feature.style.transition = 'all 0.5s ease';
        observer.observe(feature);
    });
}

// Animate Progress Bars on Scroll
const progressBars = document.querySelectorAll('.progress');
const skillsSection = document.querySelector('.skills');

const animateProgressBars = () => {
    progressBars.forEach(progress => {
        const width = progress.style.width;
        progress.style.width = '0';
        setTimeout(() => {
            progress.style.width = width;
        }, 100);
    });
};

// Intersection Observer for Progress Bars
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    progressObserver.observe(skillsSection);
}

// Add animation to service cards on scroll
const serviceCards = document.querySelectorAll('.service-card');
const servicesSection = document.querySelector('.services');

const animateServiceCards = () => {
    serviceCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
};

// Intersection Observer for Service Cards
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateServiceCards();
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (servicesSection) {
    serviceObserver.observe(servicesSection);
}

// Add hover effect to portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.querySelector('.portfolio-overlay').style.opacity = '1';
    });
    
    item.addEventListener('mouseleave', () => {
        item.querySelector('.portfolio-overlay').style.opacity = '0';
    });
});

// Template Editor Functionality
const textInput = document.getElementById('text-input');
const textPreview = document.getElementById('text-preview');
const variablesList = document.getElementById('variables-list');
const addVariableBtn = document.getElementById('add-variable');
const clearTemplateBtn = document.getElementById('clear-template');

let variables = {};

// Add new variable
addVariableBtn.addEventListener('click', () => {
    const variableName = prompt('Enter variable name (without {{}}):');
    if (variableName) {
        addVariableInput(variableName);
    }
});

// Clear template
clearTemplateBtn.addEventListener('click', () => {
    textInput.value = '';
    variables = {};
    variablesList.innerHTML = '';
    updatePreview();
});

// Add variable input field
function addVariableInput(name) {
    const variableItem = document.createElement('div');
    variableItem.className = 'variable-item';
    variableItem.innerHTML = `
        <input type="text" 
               placeholder="Value for ${name}" 
               data-variable="${name}"
               value="${variables[name] || ''}">
        <button class="remove-variable">×</button>
    `;

    // Add event listener for input changes
    const input = variableItem.querySelector('input');
    input.addEventListener('input', (e) => {
        variables[name] = e.target.value;
        updatePreview();
    });

    // Add event listener for remove button
    const removeBtn = variableItem.querySelector('.remove-variable');
    removeBtn.addEventListener('click', () => {
        delete variables[name];
        variableItem.remove();
        updatePreview();
    });

    variablesList.appendChild(variableItem);
}

// Update preview with template variables
function updatePreview() {
    let template = textInput.value;
    
    // Replace all variables in the template
    Object.entries(variables).forEach(([name, value]) => {
        const regex = new RegExp(`{{${name}}}`, 'g');
        template = template.replace(regex, value);
    });

    // Convert line breaks to <br> tags
    template = template.replace(/\n/g, '<br>');
    
    // Update the preview
    textPreview.innerHTML = template;
}

// Update preview when template changes
textInput.addEventListener('input', updatePreview); 