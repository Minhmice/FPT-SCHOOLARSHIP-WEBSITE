/**
 * UI Behaviors - Smooth scroll, active nav, back-to-top, toast
 */
(function () {
  'use strict';

  // Khởi tạo khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initSmoothScroll();
    initActiveNav();
    initBackToTop();
    initToast();
    initSkipToContent();
  }

  /**
   * 2.1 Smooth scroll
   */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      // Tìm element có data-scroll-target (target hoặc cha gần nhất)
      let target = e.target;
      let scrollTarget = null;

      while (target && target !== document.body) {
        if (target.hasAttribute && target.hasAttribute('data-scroll-target')) {
          scrollTarget = target.getAttribute('data-scroll-target');
          break;
        }
        target = target.parentElement;
      }

      if (!scrollTarget) return;

      e.preventDefault();

      // Tìm phần tử đích
      const targetElement = document.querySelector(scrollTarget);
      if (!targetElement) {
        console.warn('Smooth scroll: target not found', scrollTarget);
        return;
      }

      // Scroll mượt
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Focus vào main nếu là skip to content
      if (scrollTarget === '#main' || scrollTarget === 'main') {
        const mainEl = document.querySelector('main');
        if (mainEl) {
          setTimeout(function () {
            mainEl.setAttribute('tabindex', '-1');
            mainEl.focus();
          }, 100);
        }
      }
    });
  }

  /**
   * 2.2 Active nav theo section
   */
  function initActiveNav() {
    const navItems = document.querySelectorAll('[data-scroll-target]');
    if (navItems.length === 0) return;

    // Tạo mapping target -> nav elements
    const navMap = new Map();
    const sections = [];

    navItems.forEach(function (navItem) {
      const target = navItem.getAttribute('data-scroll-target');
      if (!target) return;

      const section = document.querySelector(target);
      if (!section) return;

      if (!navMap.has(target)) {
        navMap.set(target, []);
        sections.push({ selector: target, element: section });
      }
      navMap.get(target).push(navItem);
    });

    if (sections.length === 0) return;

    // IntersectionObserver hoặc fallback scroll
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            const target = entry.target;
            const targetSelector = '#' + target.id;

            // Kiểm tra nếu section chiếm ≥ 40% viewport
            const ratio = entry.intersectionRatio;
            if (ratio >= 0.4) {
              // Set active cho nav tương ứng
              setActiveNav(targetSelector, navMap);
            }
          });
        },
        {
          threshold: [0, 0.4, 0.6, 1.0],
          rootMargin: '-20% 0px -20% 0px' // Ưu tiên section ở giữa viewport
        }
      );

      sections.forEach(function (item) {
        observer.observe(item.element);
      });
    } else {
      // Fallback: dùng scroll event
      let ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            updateActiveNavOnScroll(sections, navMap);
            ticking = false;
          });
          ticking = true;
        }
      });
      // Chạy ngay lần đầu
      updateActiveNavOnScroll(sections, navMap);
    }
  }

  /**
   * Set active nav cho một section
   */
  function setActiveNav(targetSelector, navMap) {
    // Remove active từ tất cả nav
    document.querySelectorAll('[data-scroll-target]').forEach(function (nav) {
      nav.classList.remove('nav-pill--active', 'is-active', 'active');
    });

    // Add active cho nav tương ứng
    const navs = navMap.get(targetSelector);
    if (navs) {
      navs.forEach(function (nav) {
        nav.classList.add('nav-pill--active', 'is-active');
      });
    }
  }

  /**
   * Fallback: update active nav dựa trên scroll position
   */
  function updateActiveNavOnScroll(sections, navMap) {
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const centerY = scrollY + viewportHeight * 0.5; // Điểm giữa viewport

    let activeSection = null;
    let minDistance = Infinity;

    sections.forEach(function (item) {
      const rect = item.element.getBoundingClientRect();
      const elementTop = scrollY + rect.top;
      const elementCenter = elementTop + rect.height / 2;

      // Khoảng cách từ center viewport đến center section
      const distance = Math.abs(centerY - elementCenter);

      // Nếu section đang trong viewport (≥ 40%)
      const visibleRatio = Math.max(0, Math.min(1, (viewportHeight - Math.max(0, -rect.top) - Math.max(0, rect.bottom - viewportHeight)) / rect.height));

      if (visibleRatio >= 0.4 && distance < minDistance) {
        minDistance = distance;
        activeSection = item.selector;
      }
    });

    if (activeSection) {
      setActiveNav(activeSection, navMap);
    }
  }

  /**
   * 2.3 Back-to-top button
   */
  function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    // Click handler
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Scroll handler - hiển thị/ẩn button
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 300) {
            backToTopBtn.classList.add('back-to-top--visible');
          } else {
            backToTopBtn.classList.remove('back-to-top--visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // Kiểm tra ngay lần đầu
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('back-to-top--visible');
    }
  }

  /**
   * 2.4 Toast global
   */
  function initToast() {
    // Chỉ định nghĩa nếu chưa có
    if (typeof window.showToast === 'function') {
      return; // Giữ nguyên implementation hiện có
    }

    const MAX_TOASTS = 3;
    let toastStack = [];

    window.showToast = function (message, type) {
      type = type || 'default';

      // Lấy hoặc tạo toast root
      let toastRoot = document.getElementById('toast-root');
      if (!toastRoot) {
        toastRoot = document.createElement('div');
        toastRoot.id = 'toast-root';
        toastRoot.setAttribute('aria-live', 'polite');
        toastRoot.setAttribute('aria-atomic', 'true');
        document.body.appendChild(toastRoot);
      }

      // Tạo toast element
      const toast = document.createElement('div');
      toast.className = 'toast toast--' + escapeHtml(type);
      toast.setAttribute('role', 'alert');
      toast.textContent = message;

      // Thêm vào stack
      toastStack.push(toast);
      if (toastStack.length > MAX_TOASTS) {
        const oldToast = toastStack.shift();
        if (oldToast.parentElement) {
          removeToast(oldToast);
        }
      }

      toastRoot.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(function () {
        toast.classList.add('toast--visible');
      });

      // Auto remove sau 3 giây
      setTimeout(function () {
        removeToast(toast);
        // Xóa khỏi stack
        const index = toastStack.indexOf(toast);
        if (index > -1) {
          toastStack.splice(index, 1);
        }
      }, 3000);
    };

    /**
     * Remove toast với animation
     */
    function removeToast(toast) {
      toast.classList.remove('toast--visible');
      setTimeout(function () {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300); // Match với CSS transition
    }

    /**
     * Escape HTML
     */
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  /**
   * 2.5 Skip to content
   */
  function initSkipToContent() {
    const skipLink = document.querySelector('a[href="#main"], a[href="#content"], .skip-to-content');
    if (!skipLink) return;

    skipLink.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Focus sau khi scroll
        setTimeout(function () {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }, 100);
      }
    });
  }
})();

