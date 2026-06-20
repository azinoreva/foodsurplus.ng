// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close menu when a link is clicked
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        });
    });
}

// Nav close button (overlay)
const navClose = document.getElementById('navClose');
if (navClose) {
    navClose.addEventListener('click', () => {
        navbar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        menuToggle.focus();
    });
}

// Modal elements and behavior
const howModal = document.getElementById('howModal');
const modalClose = document.getElementById('modalClose');
const aboutLink = document.getElementById('aboutLink');
let previouslyFocusedElement = null;

function getFocusableElements(container) {
    const selectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';
    return Array.from(container.querySelectorAll(selectors)).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
}

function openModal(modal = howModal) {
    if (!modal) return;
    // close nav overlay if open
    navbar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    // show modal
    previouslyFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    // focus first focusable element (close button)
    const focusables = getFocusableElements(modal);
    (focusables.length ? focusables[0] : modalClose) && (focusables.length ? focusables[0].focus() : modalClose && modalClose.focus());
    // enable focus trap
    modal.addEventListener('keydown', trapTabKey);
}

function closeModal(modal = howModal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    // remove focus trap
    modal.removeEventListener('keydown', trapTabKey);
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
    } else {
        menuToggle && menuToggle.focus();
    }
}

if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => closeModal());
}

// Close modal when clicking backdrop
if (howModal) {
    howModal.addEventListener('click', (e) => {
        if (e.target === howModal) closeModal();
    });
}

// Keyboard handling: Escape to close modal or nav
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (howModal && !howModal.hidden) {
            closeModal();
        } else if (navbar.classList.contains('open')) {
            navbar.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            menuToggle.focus();
        }
    }
});

// Focus trap for modal
function trapTabKey(e) {
    if (e.key !== 'Tab') return;
    const focusables = getFocusableElements(howModal);
    if (focusables.length === 0) {
        e.preventDefault();
        return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

// Intersection Observer for scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.content-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    observer.observe(section);
});

// Smooth scroll behavior (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});


const contactModal = document.getElementById("contactModal");
const contactLink = document.getElementById("contactLink");
const contactModalClose = document.getElementById("contactModalClose");
contactLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(contactModal);
});

contactModalClose?.addEventListener("click", () => {
    closeModal(contactModal);
});

contactModal?.addEventListener("click", (e) => {
    if (e.target === contactModal) {
        closeModal(contactModal);
    }
});



// Fix for desktop navigation - make About and Contact work
const aboutNavItem = document.querySelector('.desktop-nav li:first-child');
const contactNavItem = document.querySelector('.desktop-nav li:last-child');

if (aboutNavItem) {
    aboutNavItem.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(howModal);
    });
}

if (contactNavItem) {
    contactNavItem.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(contactModal);
    });
}

// Fix mobile menu toggle - your existing nav is 'navbar' not 'nav'
const mobileMenuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('navbar');

if (mobileMenuToggle && mobileNav) {
    // Remove any existing listeners to avoid duplicates
    const newToggle = mobileMenuToggle.cloneNode(true);
    mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
    
    newToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        newToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('no-scroll', isOpen);
    });
}