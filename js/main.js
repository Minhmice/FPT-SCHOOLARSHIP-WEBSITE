// Main initialization file
import { catalog } from './catalog.js';
import { finder } from './finder.js';
import { compare } from './compare.js';
import { faq } from './faq.js';
import { lead } from './lead.js';
import { componentLoader } from './component-loader.js';

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
    // Load all components first
    await componentLoader.loadAllComponents();

    // Insert components into page
    // Header should be at the top, after skip-link
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      headerPlaceholder.outerHTML = componentLoader.components['header'];
    } else {
      // Fallback: insert after skip-link
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.insertAdjacentHTML('afterend', componentLoader.components['header']);
      } else {
        document.body.insertAdjacentHTML('afterbegin', componentLoader.components['header']);
      }
    }
    
    // Insert main content components
    componentLoader.insertComponent('hero', '#main-content');
    componentLoader.insertComponent('finder', '#main-content');
    componentLoader.insertComponent('catalog', '#main-content');
    componentLoader.insertComponent('compare', '#main-content');
    componentLoader.insertComponent('financial-aid', '#main-content');
    componentLoader.insertComponent('faq', '#main-content');
    componentLoader.insertComponent('contact', '#main-content');
    
    // Footer at the end
    componentLoader.insertComponent('footer', 'body');

    // Fetch data
    const [scholarshipsData, faqData] = await Promise.all([
      fetch('data/scholarships.json').then(r => r.json()),
      fetch('data/faq.json').then(r => r.json())
    ]);

    // Initialize modules
    catalog.init(scholarshipsData, eventBus);
    finder.init(scholarshipsData, eventBus);
    compare.init(scholarshipsData, eventBus);
    faq.init(faqData);
    lead.init();

    // Initialize share features
    if (typeof window.initShareFeatures === 'function') {
      window.initShareFeatures();
    }

    // Setup hash navigation
    setupHashNavigation();

    // Setup back to top
    setupBackToTop();

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
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

