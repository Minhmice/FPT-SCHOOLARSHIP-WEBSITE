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
    const container = document.getElementById('catalog-grid');
    if (!container) return;

    container.innerHTML = this.scholarships.map(sch => this.createCard(sch)).join('');

    // Attach event listeners
    this.attachEventListeners();
  },

  createCard(sch) {
    const eligibilityList = sch.eligibility.map(item => 
      `<li style="margin-bottom: var(--spacing-xs);">${item}</li>`
    ).join('');

    return `
      <div class="grid-item">
        <div class="card" data-slug="${sch.slug}">
          <div class="card-header">
            <h3 class="card-title">${sch.name}</h3>
            ${sch.quota_label ? `<p class="text-muted" style="font-size: var(--font-size-sm);">${sch.quota_label}</p>` : ''}
          </div>
          <div class="card-body">
            <p style="font-weight: var(--font-weight-semibold); color: var(--color-primary); margin-bottom: var(--spacing-md);">
              ${sch.highlight_benefit}
            </p>
            <h4 style="font-size: var(--font-size-base); margin-bottom: var(--spacing-sm);">Điều kiện:</h4>
            <ul style="list-style: none; padding-left: 0; font-size: var(--font-size-sm);">
              ${eligibilityList}
            </ul>
          </div>
          <div class="card-footer">
            <a href="${sch.external_link}" class="btn btn-outline btn-sm">Chi tiết/Tra cứu</a>
            <a href="#contact" class="btn btn-primary btn-sm">Đăng ký tư vấn</a>
            <button class="btn btn-secondary btn-sm compare-btn" data-slug="${sch.slug}" data-name="${sch.name}">
              + So sánh
            </button>
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

