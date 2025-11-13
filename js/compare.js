// Compare module - scholarship comparison
export const compare = {
  scholarships: [],
  eventBus: null,
  storageKey: 'sch_compare',
  maxItems: 3,
  items: [],

  init(scholarships, eventBus) {
    this.scholarships = scholarships;
    this.eventBus = eventBus;
    this.loadFromStorage();
    this.render();

    // Listen for add events
    if (eventBus) {
      eventBus.on('compare:add', (data) => {
        this.add(data.slug, data.name);
      });
    }
  },

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.items = JSON.parse(stored);
      } else {
        this.items = [];
      }
    } catch (e) {
      this.items = [];
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },

  add(slug, name) {
    // Check if already exists
    if (this.items.find(item => item.slug === slug)) {
      this.showToast('Học bổng này đã có trong danh sách so sánh', 'error');
      return;
    }

    // Check max items
    if (this.items.length >= this.maxItems) {
      this.showToast(`Chỉ có thể so sánh tối đa ${this.maxItems} học bổng`, 'error');
      return;
    }

    // Add to beginning
    this.items.unshift({ slug, name });
    this.saveToStorage();
    this.render();
    this.showToast('Đã thêm vào danh sách so sánh');
  },

  remove(slug) {
    this.items = this.items.filter(item => item.slug !== slug);
    this.saveToStorage();
    this.render();
  },

  clear() {
    this.items = [];
    this.saveToStorage();
    this.render();
    this.showToast('Đã xóa danh sách so sánh');
  },

  render() {
    const section = document.getElementById('compare');
    const content = document.getElementById('compare-wrapper');
    
    if (!section || !content) return;

    if (this.items.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    // Get full scholarship data
    const compareData = this.items.map(item => {
      const sch = this.scholarships.find(s => s.slug === item.slug);
      return sch ? { ...item, ...sch } : null;
    }).filter(Boolean);

    if (compareData.length === 0) {
      section.style.display = 'none';
      return;
    }

    // Create comparison table
    content.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
          <p>Đang so sánh <strong>${compareData.length}</strong> học bổng</p>
          <button id="compare-clear" class="btn btn-outline btn-sm">Xóa danh sách</button>
        </div>
        <div style="overflow-x: auto;">
          <table class="compare-table">
            <thead>
              <tr>
                <th>Tiêu chí</th>
                ${compareData.map(sch => `<th>${sch.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Quyền lợi</strong></td>
                ${compareData.map(sch => `<td>${sch.highlight_benefit}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Điều kiện</strong></td>
                ${compareData.map(sch => `<td><ul style="list-style: none; padding: 0; margin: 0;">${sch.eligibility.map(e => `<li style="margin-bottom: var(--spacing-xs);">${e}</li>`).join('')}</ul></td>`).join('')}
              </tr>
              <tr>
                <td><strong>Chỉ tiêu</strong></td>
                ${compareData.map(sch => `<td>${sch.quota_label || 'N/A'}</td>`).join('')}
              </tr>
              <tr>
                <td><strong>Thao tác</strong></td>
                ${compareData.map(sch => `
                  <td>
                    <div class="compare-actions">
                      <a href="${sch.external_link}" class="btn btn-outline btn-sm">Chi tiết</a>
                      <a href="#contact" class="btn btn-primary btn-sm">Đăng ký</a>
                      <button class="btn btn-secondary btn-sm compare-remove" data-slug="${sch.slug}">Xóa</button>
                    </div>
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach event listeners
    const clearBtn = document.getElementById('compare-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clear());
    }

    document.querySelectorAll('.compare-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.target.dataset.slug;
        this.remove(slug);
      });
    });

    // Scroll to compare section
    setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  },

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
};

