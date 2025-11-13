// Share and What-if features for Finder
// This module handles shareable links and what-if simulation

window.initShareFeatures = function initShareFeatures() {
  // Wait for finder to be ready
  if (typeof window.finder === 'undefined') {
    setTimeout(initShareFeatures, 100);
    return;
  }

  setupShareLink();
  setupWhatIf();
  parseQueryToInput();
};

// Build query string from Finder form inputs
function buildQueryFromInput() {
  const form = document.getElementById('finder-form');
  if (!form) return '';

  const formData = new FormData(form);
  const params = new URLSearchParams();

  const tn = formData.get('tn-score');
  const dgnl = formData.get('dgnl-score');
  
  if (tn && !isNaN(parseFloat(tn))) {
    params.set('tn', tn);
  }
  if (dgnl && !isNaN(parseInt(dgnl))) {
    params.set('dgnl', dgnl);
  }
  
  const hsgqg = formData.get('hsgqg');
  if (hsgqg && hsgqg !== 'none') {
    params.set('hsgqg', hsgqg);
  }
  
  const gender = formData.get('gender');
  if (gender && gender !== 'male') {
    params.set('gender', gender);
  }
  
  const major = formData.get('major');
  if (major && major !== 'khac') {
    params.set('major', major);
  }
  
  const rank10 = formData.get('rank10');
  if (rank10 === 'true') {
    params.set('rank10', 'true');
  }
  
  const kv1 = formData.get('kv1');
  if (kv1 === 'true') {
    params.set('kv1', 'true');
  }

  return params.toString();
}

// Setup copy link button
function setupShareLink() {
  const copyBtn = document.getElementById('btn-copy-link');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const query = buildQueryFromInput();
    const url = `${window.location.origin}${window.location.pathname}${query ? '?' + query : ''}`;
    
    // Try modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Đã sao chép link kết quả vào clipboard', 'success');
        copyBtn.textContent = '✓ Đã copy!';
        setTimeout(() => {
          copyBtn.textContent = 'Sao chép link kết quả';
        }, 2000);
      }).catch(() => {
        fallbackCopy(url, copyBtn);
      });
    } else {
      fallbackCopy(url, copyBtn);
    }
  });
}

// Fallback copy method
function fallbackCopy(url, btn) {
  const textarea = document.createElement('textarea');
  textarea.value = url;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showToast('Đã sao chép link kết quả vào clipboard', 'success');
    btn.textContent = '✓ Đã copy!';
    setTimeout(() => {
      btn.textContent = 'Sao chép link kết quả';
    }, 2000);
  } catch (err) {
    showToast('Không thể sao chép link', 'error');
  }
  
  document.body.removeChild(textarea);
}

// Parse URL query and prefill form
function parseQueryToInput() {
  const params = new URLSearchParams(window.location.search);
  if (params.toString() === '') return;

  const form = document.getElementById('finder-form');
  if (!form) return;

  let hasParams = false;

  // Prefill form fields
  if (params.has('tn')) {
    const tnInput = document.getElementById('tn-score');
    if (tnInput) {
      tnInput.value = params.get('tn');
      hasParams = true;
    }
  }
  
  if (params.has('dgnl')) {
    const dgnlInput = document.getElementById('dgnl-score');
    if (dgnlInput) {
      dgnlInput.value = params.get('dgnl');
      hasParams = true;
    }
  }
  
  if (params.has('hsgqg')) {
    const hsgqgSelect = document.getElementById('hsgqg');
    if (hsgqgSelect) {
      hsgqgSelect.value = params.get('hsgqg');
      hasParams = true;
    }
  }
  
  if (params.has('gender')) {
    const genderSelect = document.getElementById('gender');
    if (genderSelect) {
      genderSelect.value = params.get('gender');
      hasParams = true;
    }
  }
  
  if (params.has('major')) {
    const majorSelect = document.getElementById('major');
    if (majorSelect) {
      majorSelect.value = params.get('major');
      hasParams = true;
    }
  }
  
  if (params.has('rank10')) {
    const rank10Select = document.getElementById('rank10');
    if (rank10Select) {
      rank10Select.value = params.get('rank10');
      hasParams = true;
    }
  }
  
  if (params.has('kv1')) {
    const kv1Select = document.getElementById('kv1');
    if (kv1Select) {
      kv1Select.value = params.get('kv1');
      hasParams = true;
    }
  }

  // Auto trigger finder if params found
  if (hasParams && window.finder && typeof window.finder.runFinderOnce === 'function') {
    setTimeout(() => {
      window.finder.runFinderOnce();
    }, 200);
  }
}

// Setup What-if simulation
function setupWhatIf() {
  const whatifSection = document.getElementById('finder-whatif');
  if (!whatifSection) return;

  const controls = whatifSection.querySelector('.whatif-controls');
  if (!controls) return;

  // Create UI
  controls.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
      <div class="form-group">
        <label for="whatif-tn" class="form-label">Tăng TN thêm</label>
        <select id="whatif-tn" class="form-select">
          <option value="0">0</option>
          <option value="0.5">0.5</option>
          <option value="1.0">1.0</option>
        </select>
      </div>
      <div class="form-group">
        <label for="whatif-dgnl" class="form-label">Tăng ĐGNL thêm</label>
        <select id="whatif-dgnl" class="form-select">
          <option value="0">0</option>
          <option value="5">5</option>
          <option value="10" selected>10</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
    <button type="button" id="whatif-simulate" class="btn btn-secondary btn-sm">Mô phỏng</button>
  `;

  // Setup simulate button
  const simulateBtn = document.getElementById('whatif-simulate');
  if (simulateBtn) {
    simulateBtn.addEventListener('click', runWhatIfSimulation);
  }
}

// Run what-if simulation
function runWhatIfSimulation() {
  const form = document.getElementById('finder-form');
  if (!form) return;

  const whatifResults = document.getElementById('whatif-results');
  if (!whatifResults) return;

  // Get current inputs
  const formData = new FormData(form);
  const tnBonus = parseFloat(document.getElementById('whatif-tn')?.value) || 0;
  const dgnlBonus = parseInt(document.getElementById('whatif-dgnl')?.value) || 0;

  // Read current inputs
  const currentInputs = {
    score_tn: (() => {
      const val = formData.get('tn-score');
      return val && !isNaN(parseFloat(val)) ? parseFloat(val) : null;
    })(),
    score_dgnl: (() => {
      const val = formData.get('dgnl-score');
      return val && !isNaN(parseInt(val)) ? parseInt(val) : null;
    })(),
    hsgqg: formData.get('hsgqg') || 'none',
    gender: formData.get('gender') || 'male',
    major: formData.get('major') || 'khac',
    sr_top10: formData.get('rank10') === 'true',
    kv1: formData.get('kv1') === 'true'
  };

  // Create what-if inputs
  const whatifInputs = {
    ...currentInputs,
    score_tn: currentInputs.score_tn !== null ? currentInputs.score_tn + tnBonus : null,
    score_dgnl: currentInputs.score_dgnl !== null ? currentInputs.score_dgnl + dgnlBonus : null
  };

  // Get current results
  if (typeof window.finder === 'undefined' || !window.finder.computeScores) {
    whatifResults.innerHTML = '<p style="color: var(--color-text-light);">Vui lòng tìm kiếm học bổng trước.</p>';
    return;
  }

  const currentScores = window.finder.computeScores(currentInputs);
  const whatifScores = window.finder.computeScores(whatifInputs);

  if (!whatifScores || whatifScores.size === 0) {
    whatifResults.innerHTML = `
      <p style="color: var(--color-text-light);">
        Ngay cả khi tăng điểm theo mức này, mức phù hợp với học bổng vẫn giữ nguyên.
      </p>
    `;
    return;
  }

  // Compare results
  const changes = [];
  const currentResults = currentScores ? Array.from(currentScores.values()) : [];
  const whatifResultsArray = Array.from(whatifScores.values());

  whatifResultsArray.forEach(whatifResult => {
    const currentResult = currentResults.find(r => r.scholarship.slug === whatifResult.scholarship.slug);
    
    if (!currentResult) {
      // New scholarship
      changes.push({
        type: 'new',
        scholarship: whatifResult.scholarship,
        score: whatifResult.score
      });
    } else if (whatifResult.score > currentResult.score) {
      // Score increased
      const oldLevel = getFitLevel(currentResult.score);
      const newLevel = getFitLevel(whatifResult.score);
      
      if (oldLevel !== newLevel) {
        changes.push({
          type: 'upgrade',
          scholarship: whatifResult.scholarship,
          oldLevel,
          newLevel,
          oldScore: currentResult.score,
          newScore: whatifResult.score
        });
      }
    }
  });

  if (changes.length === 0) {
    whatifResults.innerHTML = `
      <p style="color: var(--color-text-light);">
        Ngay cả khi tăng điểm theo mức này, mức phù hợp với học bổng vẫn giữ nguyên.
      </p>
    `;
    return;
  }

  // Render changes
  const tnText = tnBonus > 0 ? `TN tăng thêm ${tnBonus}` : '';
  const dgnlText = dgnlBonus > 0 ? `ĐGNL tăng thêm ${dgnlBonus} điểm` : '';
  const conditionText = [tnText, dgnlText].filter(Boolean).join(' và ');

  let html = `<p style="margin-bottom: var(--spacing-md);"><strong>Nếu ${conditionText}, bạn có thể:</strong></p>`;
  
  changes.forEach(change => {
    if (change.type === 'new') {
      html += `
        <div class="card" style="margin-bottom: var(--spacing-sm); padding: var(--spacing-md);">
          <strong>${change.scholarship.name}</strong>
          <p style="margin: var(--spacing-xs) 0 0 0; font-size: var(--font-size-sm); color: var(--color-text-light);">
            ${change.scholarship.highlight_benefit}
          </p>
          <span class="finder-fit-badge finder-fit-${getFitLevelClass(change.score)}" style="margin-top: var(--spacing-xs); display: inline-block;">
            ${getFitLevel(change.score)}
          </span>
        </div>
      `;
    } else if (change.type === 'upgrade') {
      html += `
        <div class="card" style="margin-bottom: var(--spacing-sm); padding: var(--spacing-md);">
          <strong>${change.scholarship.name}</strong>
          <p style="margin: var(--spacing-xs) 0 0 0; font-size: var(--font-size-sm); color: var(--color-text-light);">
            Từ "${change.oldLevel}" → "${change.newLevel}"
          </p>
        </div>
      `;
    }
  });

  whatifResults.innerHTML = html;
}

// Helper: Get fit level from score
function getFitLevel(score) {
  if (score >= 5) return 'Rất phù hợp';
  if (score >= 3) return 'Phù hợp cao';
  if (score >= 1) return 'Cân nhắc';
  return '';
}

// Helper: Get fit level class from score
function getFitLevelClass(score) {
  if (score >= 5) return 'very-high';
  if (score >= 3) return 'high';
  if (score >= 1) return 'medium';
  return '';
}

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/*
TEST CASES - Kết quả mong đợi:

1. Test case: Có query params trong URL (?tn=9.0&dgnl=85&hsgqg=nhi)
   - Expected: Form được prefill với các giá trị từ query
   - Expected: Tự động trigger finder và hiển thị kết quả
   - Expected: Kết quả hiển thị học bổng phù hợp với input

2. Test case: Bấm "Sao chép link kết quả"
   - Expected: URL được copy vào clipboard
   - Expected: Toast hiển thị "Đã sao chép link kết quả vào clipboard"
   - Expected: Button text tạm thời đổi thành "✓ Đã copy!"
   - Expected: URL chứa đầy đủ query params từ form hiện tại

3. Test case: What-if với input hiện tại (TN 8.6, ĐGNL 85) → Two-year
   - Expected: Tăng TN thêm 0.5 (→ 9.1) và ĐGNL thêm 10 (→ 95)
   - Expected: Kết quả hiển thị "Full Scholarship" từ "Cân nhắc" → "Phù hợp cao"
   - Expected: Hoặc hiển thị "Full Scholarship" là học bổng mới nếu chưa có
*/

