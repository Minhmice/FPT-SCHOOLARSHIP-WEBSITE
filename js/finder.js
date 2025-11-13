// Finder module - scholarship finder logic
export const finder = {
  scholarships: [],
  eventBus: null,
  currentInputs: null,

  init(scholarships, eventBus) {
    this.scholarships = scholarships;
    this.eventBus = eventBus;
    this.setupForm();
    // Expose to window for share.js
    window.finder = this;
  },

  setupForm() {
    const form = document.getElementById('finder-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.runFinderOnce();
    });
  },

  // Public function to run finder once (for share.js)
  runFinderOnce() {
    const form = document.getElementById('finder-form');
    if (!form) return;

    const formData = new FormData(form);
    const inputs = this.collectInput(formData);
    this.currentInputs = inputs;
    const scoresMap = this.computeScores(inputs);
    this.renderResults(scoresMap);
  },

  // Collect input from form - returns clean object
  collectInput(formData) {
    const tn = formData.get('tn-score');
    const dgnl = formData.get('dgnl-score');
    
    return {
      score_tn: tn && !isNaN(parseFloat(tn)) ? parseFloat(tn) : null,
      score_dgnl: dgnl && !isNaN(parseInt(dgnl)) ? parseInt(dgnl) : null,
      hsgqg: formData.get('hsgqg') || 'none',
      gender: formData.get('gender') || 'male',
      major: formData.get('major') || 'khac',
      sr_top10: formData.get('rank10') === 'true',
      kv1: formData.get('kv1') === 'true'
    };
  },

  // Compute scores for all scholarships - returns map {slug: {score, reasons[]}}
  computeScores(inputs) {
    const scoresMap = new Map();
    let hasAnyInput = false;

    // HSGQG: +3 (Nhất/Nhì/Ba đều +3 nhưng reason khác)
    if (inputs.hsgqg === 'nhat') {
      this.addScore(scoresMap, 'full-scholarship', 'Có giải HSGQG Nhất', 3);
      hasAnyInput = true;
    } else if (inputs.hsgqg === 'nhi') {
      this.addScore(scoresMap, 'two-year', 'Có giải HSGQG Nhì', 3);
      hasAnyInput = true;
    } else if (inputs.hsgqg === 'ba') {
      this.addScore(scoresMap, 'one-year', 'Có giải HSGQG Ba', 3);
      hasAnyInput = true;
    }

    // ĐGNL: +2
    if (inputs.score_dgnl !== null) {
      hasAnyInput = true;
      if (inputs.score_dgnl >= 90) {
        this.addScore(scoresMap, 'full-scholarship', 'ĐGNL ≥ 90%', 2);
      } else if (inputs.score_dgnl >= 85) {
        this.addScore(scoresMap, 'two-year', 'ĐGNL ≥ 85%', 2);
      } else if (inputs.score_dgnl >= 80) {
        this.addScore(scoresMap, 'one-year', 'ĐGNL ≥ 80%', 2);
      }
    }

    // TN THPT: +1
    if (inputs.score_tn !== null) {
      hasAnyInput = true;
      if (inputs.score_tn >= 9.0) {
        this.addScore(scoresMap, 'full-scholarship', 'TN THPT ≥ 9.0', 1);
      } else if (inputs.score_tn >= 8.5) {
        this.addScore(scoresMap, 'two-year', 'TN THPT ≥ 8.5', 1);
      } else if (inputs.score_tn >= 8.0) {
        this.addScore(scoresMap, 'one-year', 'TN THPT ≥ 8.0', 1);
      }
    }

    // Nữ + CNTT: +1
    if (inputs.gender === 'female' && inputs.major === 'cntt') {
      this.addScore(scoresMap, 'stem-female', 'Nữ sinh ngành CNTT', 1);
      hasAnyInput = true;
    }

    // Top10 SchoolRank + KV1: +1
    if (inputs.sr_top10 && inputs.kv1) {
      this.addScore(scoresMap, 'high-school', 'Top 10 SchoolRank + KV1 (cần đề cử BGH)', 1);
      hasAnyInput = true;
    }

    // Có giải QG + CNTT → Global Expert: +2
    if (inputs.hsgqg !== 'none' && inputs.major === 'cntt') {
      this.addScore(scoresMap, 'global-expert', 'Có giải HSGQG + Ngành CNTT (cần phỏng vấn)', 2);
      hasAnyInput = true;
    }

    // Check if user selected major
    if (inputs.major !== 'khac') {
      hasAnyInput = true;
    }

    // If no input at all, return special flag
    if (!hasAnyInput) {
      return null; // Signal: no input provided
    }

    // Filter out scholarships with score 0
    const filteredMap = new Map();
    scoresMap.forEach((value, key) => {
      if (value.score > 0) {
        filteredMap.set(key, value);
      }
    });

    return filteredMap;
  },

  addScore(scoresMap, slug, reason, points) {
    if (!scoresMap.has(slug)) {
      const scholarship = this.scholarships.find(s => s.slug === slug);
      if (scholarship) {
        scoresMap.set(slug, {
          scholarship,
          reasons: [reason],
          score: points
        });
      }
    } else {
      const existing = scoresMap.get(slug);
      existing.reasons.push(reason);
      existing.score += points;
    }
  },

  // Render results - takes scoresMap from computeScores
  renderResults(scoresMap) {
    const container = document.getElementById('finder-results');
    if (!container) return;

    // Handle no input case
    if (scoresMap === null) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: var(--spacing-xl);">
          <p style="color: var(--color-text-light); margin-bottom: var(--spacing-md);">
            Hãy nhập ít nhất một thông tin (điểm, giải, hoặc ngành) để hệ thống gợi ý học bổng.
          </p>
        </div>
      `;
      // Hide what-if section
      const whatifSection = document.getElementById('finder-whatif');
      if (whatifSection) whatifSection.style.display = 'none';
      return;
    }

    // Handle no scholarships found
    if (scoresMap.size === 0) {
      container.innerHTML = this.createFallbackCard();
      // Hide what-if section
      const whatifSection = document.getElementById('finder-whatif');
      if (whatifSection) whatifSection.style.display = 'none';
      return;
    }

    // Convert map to array and sort by score
    const results = Array.from(scoresMap.values()).sort((a, b) => b.score - a.score);

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: var(--spacing-md);">
        <h3>Kết quả tìm kiếm (${results.length} học bổng phù hợp)</h3>
      </div>
      <div class="finder-actions" style="margin-bottom: var(--spacing-lg);">
        <button type="button" id="btn-copy-link" class="btn btn-outline btn-sm">
          Sao chép link kết quả
        </button>
      </div>
      ${results.map(result => this.createResultCard(result)).join('')}
    `;

    // Show what-if section
    const whatifSection = document.getElementById('finder-whatif');
    if (whatifSection) whatifSection.style.display = 'block';

    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  createResultCard(result) {
    const { scholarship, reasons, score } = result;
    
    // Determine fit level and badge class
    let fitLevel, fitClass, story;
    if (score >= 5) {
      fitLevel = 'Rất phù hợp';
      fitClass = 'finder-fit-very-high';
      story = 'Tổng hợp các tiêu chí, cơ hội nhận học bổng này của bạn đang ở mức rất cao.';
    } else if (score >= 3) {
      fitLevel = 'Phù hợp cao';
      fitClass = 'finder-fit-high';
      story = 'Bạn có nhiều yếu tố phù hợp, nên cân nhắc nộp hồ sơ loại học bổng này.';
    } else if (score >= 1) {
      fitLevel = 'Cân nhắc';
      fitClass = 'finder-fit-medium';
      story = 'Một phần tiêu chí đã chạm ngưỡng, hãy xem thêm điều kiện chi tiết trước khi đăng ký.';
    } else {
      return ''; // Should not happen as we filter score > 0
    }

    const reasonsText = reasons.join(', ');

    return `
      <div class="card finder-result-card">
        <div class="card-header">
          <h3 class="card-title">${scholarship.name}</h3>
          <span class="finder-fit-badge ${fitClass}">${fitLevel}</span>
        </div>
        <div class="card-body">
          <p style="font-weight: var(--font-weight-semibold); color: var(--color-primary); margin-bottom: var(--spacing-sm);">
            ${scholarship.highlight_benefit}
          </p>
          <p class="finder-reason" style="margin-bottom: var(--spacing-sm);">
            <strong>Vì sao:</strong> ${reasonsText}
          </p>
          <p class="finder-story" style="font-style: italic; color: var(--color-text-light); font-size: var(--font-size-sm); margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--color-border);">
            ${story}
          </p>
        </div>
        <div class="card-footer">
          <a href="#catalog" class="btn btn-outline btn-sm">Xem chi tiết</a>
          <a href="contact.html" class="btn btn-primary btn-sm">Đăng ký tư vấn</a>
        </div>
      </div>
    `;
  },

  createFallbackCard() {
    return `
      <div class="card" style="text-align: center; padding: var(--spacing-xl);">
        <h3 style="margin-bottom: var(--spacing-md); color: var(--color-text);">
          Hiện tại bạn chưa chạm ngưỡng các học bổng chính của FPTU.
        </h3>
        <div style="text-align: left; max-width: 600px; margin: 0 auto; margin-bottom: var(--spacing-lg);">
          <p style="margin-bottom: var(--spacing-md);"><strong>Gợi ý:</strong></p>
          <ul style="list-style: none; padding-left: 0;">
            <li style="margin-bottom: var(--spacing-sm); padding-left: var(--spacing-xl); position: relative;">
              <span style="position: absolute; left: 0; color: var(--color-primary);">•</span>
              Xem lại điều kiện nâng điểm (TN/ĐGNL/HSGQG)
            </li>
            <li style="margin-bottom: var(--spacing-sm); padding-left: var(--spacing-xl); position: relative;">
              <span style="position: absolute; left: 0; color: var(--color-primary);">•</span>
              Tìm hiểu khối "Học trước – Trả sau"
            </li>
          </ul>
        </div>
        <div style="display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap;">
          <a href="#financial-aid" class="btn btn-primary btn-lg">Xem Học trước – Trả sau</a>
          <a href="contact.html" class="btn btn-outline btn-lg">Đăng ký tư vấn</a>
        </div>
      </div>
    `;
  },

  createWhatIfSection() {
    if (!this.currentInputs) return '';

    return `
      <div class="card" style="margin-top: var(--spacing-xl); background: var(--color-bg-light);">
        <h3 style="margin-bottom: var(--spacing-md);">What-if: Thử nghiệm điểm số</h3>
        <p style="margin-bottom: var(--spacing-lg); color: var(--color-text-light); font-size: var(--font-size-sm);">
          Nếu điểm số của bạn tăng thêm, bạn sẽ đạt được học bổng nào?
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
          <div>
            <label style="display: block; margin-bottom: var(--spacing-xs); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);">
              Điểm TN THPT (+)
            </label>
            <input type="number" id="whatif-tn" class="form-input" min="0" max="2" step="0.1" value="0.5" style="width: 100%;">
          </div>
          <div>
            <label style="display: block; margin-bottom: var(--spacing-xs); font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);">
              Điểm ĐGNL (+)
            </label>
            <input type="number" id="whatif-dgnl" class="form-input" min="0" max="20" step="5" value="10" style="width: 100%;">
          </div>
        </div>
        <button id="whatif-submit" class="btn btn-secondary btn-sm">Xem kết quả "What-if"</button>
        <div id="whatif-results" style="margin-top: var(--spacing-lg);"></div>
      </div>
    `;
  },

  setupCopyLink() {
    const copyBtn = document.getElementById('copy-link-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      if (!this.currentInputs) return;

      const params = new URLSearchParams();
      if (this.currentInputs.score_tn !== null) params.set('tn', this.currentInputs.score_tn);
      if (this.currentInputs.score_dgnl !== null) params.set('dgnl', this.currentInputs.score_dgnl);
      if (this.currentInputs.hsgqg !== 'none') params.set('hsgqg', this.currentInputs.hsgqg);
      if (this.currentInputs.gender !== 'male') params.set('gender', this.currentInputs.gender);
      if (this.currentInputs.major !== 'khac') params.set('major', this.currentInputs.major);
      if (this.currentInputs.sr_top10) params.set('rank10', 'true');
      if (this.currentInputs.kv1) params.set('kv1', 'true');

      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      
      navigator.clipboard.writeText(url).then(() => {
        copyBtn.textContent = '✓ Đã copy!';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy link kết quả';
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtn.textContent = '✓ Đã copy!';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy link kết quả';
        }, 2000);
      });
    });

    // Setup what-if simulation
    const whatifBtn = document.getElementById('whatif-submit');
    if (whatifBtn) {
      whatifBtn.addEventListener('click', () => {
        this.runWhatIf();
      });
    }
  },

  runWhatIf() {
    if (!this.currentInputs) return;

    const tnBonus = parseFloat(document.getElementById('whatif-tn')?.value) || 0;
    const dgnlBonus = parseInt(document.getElementById('whatif-dgnl')?.value) || 0;
    const whatifResults = document.getElementById('whatif-results');
    if (!whatifResults) return;

    // Clone current inputs and add bonus
    const whatifInputs = {
      ...this.currentInputs,
      score_tn: this.currentInputs.score_tn !== null ? this.currentInputs.score_tn + tnBonus : null,
      score_dgnl: this.currentInputs.score_dgnl !== null ? this.currentInputs.score_dgnl + dgnlBonus : null
    };

    const scoresMap = this.computeScores(whatifInputs);
    
    if (!scoresMap || scoresMap.size === 0) {
      whatifResults.innerHTML = `
        <p style="color: var(--color-text-light);">Với điểm số này, bạn vẫn chưa đạt ngưỡng học bổng nào.</p>
      `;
      return;
    }

    const results = Array.from(scoresMap.values()).sort((a, b) => b.score - a.score);
    const newScholarships = results.filter(r => {
      // Check if this scholarship is new (not in current results)
      const currentScores = this.computeScores(this.currentInputs);
      if (!currentScores) return true;
      return !currentScores.has(r.scholarship.slug) || currentScores.get(r.scholarship.slug).score < r.score;
    });

    if (newScholarships.length === 0) {
      whatifResults.innerHTML = `
        <p style="color: var(--color-text-light);">Với điểm số này, bạn vẫn ở cùng mức học bổng hiện tại.</p>
      `;
      return;
    }

    whatifResults.innerHTML = `
      <h4 style="margin-bottom: var(--spacing-md);">Học bổng mới bạn có thể đạt được:</h4>
      ${newScholarships.map(sch => `
        <div class="card" style="margin-bottom: var(--spacing-sm); padding: var(--spacing-md);">
          <strong>${sch.scholarship.name}</strong>
          <p style="margin: var(--spacing-xs) 0 0 0; font-size: var(--font-size-sm); color: var(--color-text-light);">
            ${sch.scholarship.highlight_benefit}
          </p>
        </div>
      `).join('')}
    `;
  },

  updateURL(inputs) {
    const params = new URLSearchParams();
    if (inputs.score_tn !== null) params.set('tn', inputs.score_tn);
    if (inputs.score_dgnl !== null) params.set('dgnl', inputs.score_dgnl);
    if (inputs.hsgqg !== 'none') params.set('hsgqg', inputs.hsgqg);
    if (inputs.gender !== 'male') params.set('gender', inputs.gender);
    if (inputs.major !== 'khac') params.set('major', inputs.major);
    if (inputs.sr_top10) params.set('rank10', 'true');
    if (inputs.kv1) params.set('kv1', 'true');

    const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.pushState({}, '', newURL);
  },

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.toString() === '') return;

    const form = document.getElementById('finder-form');
    if (!form) return;

    // Prefill form
    if (params.has('tn')) {
      const tnInput = document.getElementById('tn-score');
      if (tnInput) tnInput.value = params.get('tn');
    }
    if (params.has('dgnl')) {
      const dgnlInput = document.getElementById('dgnl-score');
      if (dgnlInput) dgnlInput.value = params.get('dgnl');
    }
    if (params.has('hsgqg')) {
      const hsgqgSelect = document.getElementById('hsgqg');
      if (hsgqgSelect) hsgqgSelect.value = params.get('hsgqg');
    }
    if (params.has('gender')) {
      const genderSelect = document.getElementById('gender');
      if (genderSelect) genderSelect.value = params.get('gender');
    }
    if (params.has('major')) {
      const majorSelect = document.getElementById('major');
      if (majorSelect) majorSelect.value = params.get('major');
    }
    if (params.has('rank10')) {
      const rank10Select = document.getElementById('rank10');
      if (rank10Select) rank10Select.value = params.get('rank10');
    }
    if (params.has('kv1')) {
      const kv1Select = document.getElementById('kv1');
      if (kv1Select) kv1Select.value = params.get('kv1');
    }

    // Auto submit form to show results
    setTimeout(() => {
      const formData = new FormData(form);
      const inputs = this.collectInput(formData);
      this.currentInputs = inputs;
      const scoresMap = this.computeScores(inputs);
      this.renderResults(scoresMap);
    }, 100);
  }
};

/*
TEST CASES - Kết quả mong đợi:

1. Test case: HSGQG Nhất + ĐGNL 92 + TN 9.2
   - Expected: Full Scholarship với score = 3 + 2 + 1 = 6
   - Badge: "Rất phù hợp" (badge-very-high)
   - Story: "Tổng hợp các tiêu chí, cơ hội nhận học bổng này của bạn đang ở mức rất cao."

2. Test case: ĐGNL 85 + TN 8.6 (không có giải)
   - Expected: Two-year Scholarship với score = 2 + 1 = 3
   - Badge: "Phù hợp cao" (badge-high)
   - Story: "Bạn có nhiều yếu tố phù hợp, nên cân nhắc nộp hồ sơ loại học bổng này."

3. Test case: TN 8.1 (chỉ có điểm TN)
   - Expected: One-year Scholarship với score = 1
   - Badge: "Cân nhắc" (badge-medium)
   - Story: "Một phần tiêu chí đã chạm ngưỡng, hãy xem thêm điều kiện chi tiết trước khi đăng ký."

4. Test case: Nữ + CNTT + HSGQG Ba + ĐGNL 82
   - Expected: 
     - One-year: score = 3 + 2 = 5 (Rất phù hợp)
     - STEM for female: score = 1 (Cân nhắc)
   - Both should appear

5. Test case: Tất cả trống hoặc "Không"
   - Expected: Message "Hãy nhập ít nhất một thông tin..."
   - No scholarships shown

6. Test case: Input không đạt ngưỡng nào (TN 7.0, ĐGNL 70, không giải)
   - Expected: Fallback card với gợi ý "Học trước – Trả sau"
   - CTA buttons: "Xem Học trước – Trả sau" và "Đăng ký tư vấn"
*/
