// Testimonials carousel module
export const testimonials = {
  testimonials: [],
  currentIndex: 0,
  autoPlayInterval: null,

  init(testimonials) {
    this.testimonials = testimonials;
    this.render();
    this.setupNavigation();
    this.startAutoPlay();
  },

  render() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    track.innerHTML = this.testimonials.map(t => this.createTestimonialCard(t)).join('');
    this.renderPagination();
    this.updateView();
  },

  createTestimonialCard(testimonial) {
    return `
      <div class="testimonial-item">
        <div class="testimonial-image">
          <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
        </div>
        <div class="testimonial-content">
          <div class="testimonial-name">${testimonial.name}</div>
          <div class="testimonial-scholarship">${testimonial.scholarship}</div>
          <div class="testimonial-quote">
            <p>${testimonial.quote}</p>
          </div>
        </div>
      </div>
    `;
  },

  renderPagination() {
    const pagination = document.getElementById('testimonials-pagination');
    if (!pagination) return;

    pagination.innerHTML = this.testimonials.map((_, index) => 
      `<button class="testimonials-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to testimonial ${index + 1}"></button>`
    ).join('');
  },

  setupNavigation() {
    // Previous button
    const prevBtn = document.querySelector('.testimonials-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }

    // Next button
    const nextBtn = document.querySelector('.testimonials-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    // Pagination dots
    const dots = document.querySelectorAll('.testimonials-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goTo(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
      carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  },

  updateView() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    // Move the track
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    // Update pagination dots
    const dots = document.querySelectorAll('.testimonials-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update navigation buttons
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentIndex === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentIndex === this.testimonials.length - 1;
    }
  },

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateView();
      this.resetAutoPlay();
    }
  },

  next() {
    if (this.currentIndex < this.testimonials.length - 1) {
      this.currentIndex++;
      this.updateView();
      this.resetAutoPlay();
    }
  },

  goTo(index) {
    if (index >= 0 && index < this.testimonials.length) {
      this.currentIndex = index;
      this.updateView();
      this.resetAutoPlay();
    }
  },

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      // Loop back to start if at end
      if (this.currentIndex === this.testimonials.length - 1) {
        this.goTo(0);
      } else {
        this.next();
      }
    }, 5000); // Change every 5 seconds
  },

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  },

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
};

