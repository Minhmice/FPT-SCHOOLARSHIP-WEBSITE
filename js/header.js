// Header functionality - Mobile menu, search modal, scroll behavior
export const header = {
  init() {
    this.setupMobileMenu();
    this.setupSearchModal();
    this.setupScrollBehavior();
    this.setupCloseMenu();
  },

  setupMobileMenu() {
    const hamburger = document.getElementById('show-menu');
    const headerMain = document.querySelector('.header-main');
    const coating = document.querySelector('.coating_header');
    const closeMenuBtn = document.querySelector('.close-menu');

    if (!hamburger || !headerMain) return;

    hamburger.addEventListener('click', () => {
      this.toggleMobileMenu(true);
    });

    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', () => {
        this.toggleMobileMenu(false);
      });
    }

    if (coating) {
      coating.addEventListener('click', () => {
        this.toggleMobileMenu(false);
      });
    }

    // Close menu when clicking on menu links
    const menuLinks = document.querySelectorAll('.menu-item a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.toggleMobileMenu(false);
        }
      });
    });
  },

  toggleMobileMenu(show) {
    const headerMain = document.querySelector('.header-main');
    const coating = document.querySelector('.coating_header');
    const closeMenuBtn = document.querySelector('.close-menu');
    const hamburger = document.getElementById('show-menu');
    const body = document.body;

    if (!headerMain) return;

    if (show) {
      headerMain.classList.add('show-menu');
      headerMain.classList.remove('hide-menu');
      if (coating) {
        coating.classList.add('show-menu');
        coating.classList.remove('hide-menu');
      }
      if (closeMenuBtn) {
        closeMenuBtn.classList.add('show-menu');
        closeMenuBtn.classList.remove('hide-menu');
      }
      if (hamburger) {
        hamburger.classList.add('active');
      }
      body.style.overflow = 'hidden';
    } else {
      headerMain.classList.remove('show-menu');
      headerMain.classList.add('hide-menu');
      if (coating) {
        coating.classList.remove('show-menu');
        coating.classList.add('hide-menu');
      }
      if (closeMenuBtn) {
        closeMenuBtn.classList.remove('show-menu');
        closeMenuBtn.classList.add('hide-menu');
      }
      if (hamburger) {
        hamburger.classList.remove('active');
      }
      body.style.overflow = '';
    }
  },

  setupSearchModal() {
    const searchButtons = document.querySelectorAll('.menu-main__search-button, .menu-main__search-button--mobile');
    const closeSearchButtons = document.querySelectorAll('.menu-main__cls-search-button, .menu-main__cls-search-button--mobile');
    const searchModal = document.getElementById('modal__search');
    const searchInput = document.getElementById('key_search');

    if (!searchModal) return;

    // Open search modal
    searchButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.openSearchModal();
      });
    });

    // Close search modal
    closeSearchButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeSearchModal();
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('show')) {
        this.closeSearchModal();
      }
    });

    // Close on click outside
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        this.closeSearchModal();
      }
    });

    // Focus input when modal opens
    if (searchInput) {
      searchButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          setTimeout(() => {
            searchInput.focus();
          }, 100);
        });
      });
    }
  },

  openSearchModal() {
    const searchModal = document.getElementById('modal__search');
    const searchButtons = document.querySelectorAll('.menu-main__search-button, .menu-main__search-button--mobile');
    const closeSearchButtons = document.querySelectorAll('.menu-main__cls-search-button, .menu-main__cls-search-button--mobile');

    if (!searchModal) return;

    searchModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Toggle button visibility
    searchButtons.forEach(btn => {
      btn.style.display = 'none';
    });
    closeSearchButtons.forEach(btn => {
      btn.style.display = 'flex';
    });
  },

  closeSearchModal() {
    const searchModal = document.getElementById('modal__search');
    const searchButtons = document.querySelectorAll('.menu-main__search-button, .menu-main__search-button--mobile');
    const closeSearchButtons = document.querySelectorAll('.menu-main__cls-search-button, .menu-main__cls-search-button--mobile');

    if (!searchModal) return;

    searchModal.classList.remove('show');
    document.body.style.overflow = '';

    // Toggle button visibility
    searchButtons.forEach(btn => {
      btn.style.display = 'flex';
    });
    closeSearchButtons.forEach(btn => {
      btn.style.display = 'none';
    });
  },

  setupScrollBehavior() {
    const headerMain = document.querySelector('.header-main');
    if (!headerMain) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset;

          // Add scrolled class when scrolling down
          if (currentScroll > 50) {
            headerMain.classList.add('scrolled');
          } else {
            headerMain.classList.remove('scrolled');
          }

          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });

    // Check on load
    if (window.pageYOffset > 50) {
      headerMain.classList.add('scrolled');
    }
  },

  setupCloseMenu() {
    // Close mobile menu on window resize if window becomes larger
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
          this.toggleMobileMenu(false);
        }
      }, 250);
    });
  }
};

// Header will be initialized by main.js after components are loaded

