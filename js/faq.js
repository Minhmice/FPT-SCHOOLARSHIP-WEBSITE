// FAQ module - accordion functionality
export const faq = {
  faqs: [],

  init(faqs) {
    this.faqs = faqs;
    this.render();
  },

  render() {
    const container = document.getElementById('faq-list');
    if (!container) return;

    container.innerHTML = this.faqs.map((faq, index) => this.createAccordionItem(faq, index)).join('');

    // Attach event listeners
    this.attachEventListeners();
  },

  createAccordionItem(faq, index) {
    const id = `faq-${index}`;
    const headerId = `faq-header-${index}`;
    const contentId = `faq-content-${index}`;

    return `
      <div class="accordion">
        <button 
          class="accordion-header" 
          id="${headerId}"
          aria-expanded="false"
          aria-controls="${contentId}"
          data-faq-index="${index}"
        >
          <span>${faq.question}</span>
          <span class="accordion-icon" aria-hidden="true">▼</span>
        </button>
        <div 
          class="accordion-content" 
          id="${contentId}"
          role="region"
          aria-labelledby="${headerId}"
        >
          <div class="accordion-content-inner">
            ${faq.answer}
          </div>
        </div>
      </div>
    `;
  },

  attachEventListeners() {
    const headers = document.querySelectorAll('.accordion-header[data-faq-index]');
    let currentOpen = null;

    headers.forEach(header => {
      header.addEventListener('click', () => {
        const index = parseInt(header.dataset.faqIndex);
        const content = document.getElementById(`faq-content-${index}`);

        // Close current if different
        if (currentOpen !== null && currentOpen !== index) {
          const prevHeader = document.getElementById(`faq-header-${currentOpen}`);
          const prevContent = document.getElementById(`faq-content-${currentOpen}`);
          if (prevHeader && prevContent) {
            prevHeader.setAttribute('aria-expanded', 'false');
            prevContent.style.maxHeight = '0';
          }
        }

        // Toggle current
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          header.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0';
          currentOpen = null;
        } else {
          header.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
          currentOpen = index;
        }
      });
    });
  }
};

