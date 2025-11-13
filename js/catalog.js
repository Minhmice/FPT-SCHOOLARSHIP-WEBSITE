// Catalog module - renders scholarship cards
export const catalog = {
  scholarships: [],
  eventBus: null,

  init(scholarships, eventBus) {
    this.scholarships = scholarships;
    this.eventBus = eventBus;
    this.render();
  },

  render() {
    const container = document.getElementById('catalog-list');
    if (!container) return;

    container.innerHTML = this.scholarships.map(sch => this.createCard(sch)).join('');

    // Attach event listeners
    this.attachEventListeners();
  },

  createCard(sch) {
    const eligibilityList = sch.eligibility.map(item => 
      `<li>${item}</li>`
    ).join('');

    // Generate placeholder image with scholarship name
    const imageUrl = `https://via.placeholder.com/800x500/0066cc/ffffff?text=${encodeURIComponent(sch.name)}`;

    return `
      <div class="scholarship-item" data-slug="${sch.slug}">
        <div class="scholarship-image-wrapper">
          <img src="${imageUrl}" alt="${sch.name}" loading="lazy" class="scholarship-image">
          <div class="scholarship-overlay">
            <div class="scholarship-content">
              <h3 class="scholarship-name">${sch.name}</h3>
              ${sch.quota_label ? `<p class="scholarship-quota">${sch.quota_label}</p>` : ''}
              <p class="scholarship-benefit">${sch.highlight_benefit}</p>
              <div class="scholarship-eligibility">
                <h4>Điều kiện:</h4>
                <ul>
                  ${eligibilityList}
                </ul>
              </div>
              <div class="scholarship-actions">
                <a href="${sch.external_link}" class="btn btn-outline btn-xs btn-with-arrow">
                  <span>Xem chi tiết</span>
                  <svg class="btn-arrow" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <button class="btn btn-secondary btn-xs compare-btn" data-slug="${sch.slug}" data-name="${sch.name}">
                  <span>+</span> So sánh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  attachEventListeners() {
    // Compare buttons
    document.querySelectorAll('.compare-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.target.dataset.slug;
        const name = e.target.dataset.name;
        if (this.eventBus) {
          this.eventBus.emit('compare:add', { slug, name });
        }
      });
    });
  }
};

