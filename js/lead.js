// Lead form module - registration form
export const lead = {
  init() {
    this.setupForm();
  },

  setupForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (this.validateForm(form)) {
        this.submitForm(form);
      }
    });

    // Real-time phone validation
    const phoneInput = document.getElementById('contact-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        this.validatePhone(phoneInput);
      });
    }
  },

  validateForm(form) {
    const name = form.querySelector('#contact-name');
    const phone = form.querySelector('#contact-phone');

    let isValid = true;

    // Validate name
    if (!name.value.trim()) {
      this.showFieldError(name, 'Vui lòng nhập họ tên');
      isValid = false;
    } else {
      this.clearFieldError(name);
    }

    // Validate phone
    if (!this.validatePhone(phone)) {
      isValid = false;
    }

    return isValid;
  },

  validatePhone(phoneInput) {
    const phone = phoneInput.value.trim();
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!phone) {
      this.showFieldError(phoneInput, 'Vui lòng nhập số điện thoại');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      this.showFieldError(phoneInput, 'Số điện thoại phải có 10-11 chữ số');
      return false;
    }

    this.clearFieldError(phoneInput);
    return true;
  },

  showFieldError(field, message) {
    field.setCustomValidity(message);
    field.style.borderColor = 'var(--color-error)';
    
    // Show error message if exists
    const errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains('form-error')) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  },

  clearFieldError(field) {
    field.setCustomValidity('');
    field.style.borderColor = '';
    
    const errorEl = field.nextElementSibling;
    if (errorEl && errorEl.classList.contains('form-error')) {
      errorEl.style.display = 'none';
    }
  },

  submitForm(form) {
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      province: formData.get('province'),
      campus: formData.get('campus'),
      major: formData.get('major'),
      score: formData.get('score'),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage (mock)
    try {
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      leads.push(data);
      localStorage.setItem('leads', JSON.stringify(leads));
    } catch (e) {
      console.error('Error saving lead:', e);
    }

    // Show toast
    this.showToast('Đã nhận thông tin. Chúng tôi sẽ liên hệ với bạn sớm nhất!');

    // Reset form
    form.reset();

    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'toast show';

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
};

