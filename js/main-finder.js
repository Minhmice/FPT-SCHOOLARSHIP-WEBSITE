// Main initialization file for Finder page
import { finder } from './finder.js';
import { componentLoader } from './component-loader.js';
import { header } from './header.js';

// Simple event bus
const eventBus = {
  listeners: {},
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

// Fetch data and initialize modules
async function init() {
  try {
    // Load only necessary components
    await componentLoader.loadComponent('header');
    await componentLoader.loadComponent('finder');
    await componentLoader.loadComponent('footer');

    // Insert header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.outerHTML = componentLoader.components['header'];
    } else {
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.insertAdjacentHTML('afterend', componentLoader.components['header']);
      } else {
        document.body.insertAdjacentHTML('afterbegin', componentLoader.components['header']);
      }
    }
    
    // Insert finder component
    componentLoader.insertComponent('finder', '#main-content');
    
    // Footer at the end
    componentLoader.insertComponent('footer', 'body');

    // Fetch scholarships data
    const scholarshipsData = await fetch('data/scholarships.json').then(r => r.json());

    // Initialize finder module
    finder.init(scholarshipsData, eventBus);

    // Initialize header (mobile menu, search modal, etc.)
    header.init();

    // Initialize share features
    if (typeof window.initShareFeatures === 'function') {
      window.initShareFeatures();
    }

    // Setup hash navigation
    setupHashNavigation();

    // Setup back to top
    setupBackToTop();

    console.log('Finder page initialized successfully');
  } catch (error) {
    console.error('Error initializing finder page:', error);
  }
}

// Hash navigation with smooth scroll
function setupHashNavigation() {
  // Handle initial hash
  if (window.location.hash) {
    setTimeout(() => scrollToSection(window.location.hash), 100);
  }

  // Handle hash changes
  window.addEventListener('hashchange', () => {
    scrollToSection(window.location.hash);
  });

  // Handle anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        window.location.hash = href;
        scrollToSection(href);
      }
    });
  });
}

function scrollToSection(hash) {
  if (!hash || hash === '#') return;
  
  const element = document.querySelector(hash);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Back to top button
function setupBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.display = 'inline-block';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  // Scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Initially hide
  backToTopBtn.style.display = 'none';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export event bus for use in other modules
window.eventBus = eventBus;

