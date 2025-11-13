# 🎓 FPT University Scholarships 2025 - Landing Page

> Landing page hiện đại cho chương trình học bổng FPT University 2025, được xây dựng bằng HTML/CSS/JavaScript thuần, không sử dụng framework hay build tool.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Build Tool](https://img.shields.io/badge/Build-None-success)]()

---

## ✨ Tính năng nổi bật

### 🎯 Scholarship Finder
- **Tìm kiếm thông minh**: Nhập điểm số, giải thưởng, ngành học để hệ thống tự động gợi ý học bổng phù hợp
- **Hệ thống điểm**: Tính toán mức độ phù hợp dựa trên nhiều tiêu chí (HSGQG, ĐGNL, TN THPT, ngành học, giới tính)
- **What-if Simulation**: Mô phỏng kết quả nếu điểm số tăng thêm
- **Chia sẻ kết quả**: Sao chép link kết quả để chia sẻ với người khác

### 📚 Scholarship Catalog
- Hiển thị đầy đủ **6 loại học bổng** với thông tin chi tiết
- Card design hiện đại, responsive
- Quick actions: Xem chi tiết, Đăng ký tư vấn, So sánh

### ⚖️ Scholarship Comparison
- So sánh tối đa **3 học bổng** cùng lúc
- Lưu trữ trong localStorage, không mất khi refresh
- Bảng so sánh trực quan với đầy đủ tiêu chí

### 💰 Financial Aid Information
- Thông tin chi tiết về chương trình **"Học trước - Trả sau"**
- Hỗ trợ 30%/50%/70% học phí
- Thời gian hoàn trả linh hoạt

### ❓ FAQ Section
- **10 câu hỏi thường gặp** về học bổng
- Accordion UI mượt mà, dễ sử dụng
- Accessibility support đầy đủ

### 📝 Lead Generation Form
- Form đăng ký tư vấn với validation
- Lưu trữ thông tin vào localStorage
- Real-time phone number validation

### 🎨 Modern UI/UX
- Design system với CSS Variables
- Responsive design cho mọi thiết bị
- Smooth animations và transitions
- Accessibility-first approach

---

## 📁 Cấu trúc Project

```
FPT-SCHOOLARSHIP-WEBSITE/
├── index.html                 # Entry point - HTML chính
├── README.md                 # Tài liệu dự án
│
├── assets/                   # Tài nguyên tĩnh
│   └── logo.svg             # Logo FPT University
│
├── components/              # Component-based architecture
│   ├── header/              # Header với navigation
│   │   ├── header.html
│   │   └── header.css
│   ├── hero/                # Hero section với stats
│   │   ├── hero.html
│   │   └── hero.css
│   ├── finder/              # Scholarship Finder form
│   │   ├── finder.html
│   │   └── finder.css
│   ├── catalog/             # Scholarship catalog grid
│   │   ├── catalog.html
│   │   └── catalog.css
│   ├── compare/             # Comparison table
│   │   ├── compare.html
│   │   └── compare.css
│   ├── financial-aid/       # Financial aid info
│   │   ├── financial-aid.html
│   │   └── financial-aid.css
│   ├── faq/                 # FAQ accordion
│   │   ├── faq.html
│   │   └── faq.css
│   ├── contact/             # Lead form
│   │   ├── contact.html
│   │   └── contact.css
│   └── footer/              # Footer
│       ├── footer.html
│       └── footer.css
│
├── data/                    # JSON data files
│   ├── scholarships.json    # 6 loại học bổng
│   └── faq.json            # 10 câu hỏi thường gặp
│
├── js/                      # JavaScript modules (ES6)
│   ├── main.js             # App initialization & event bus
│   ├── component-loader.js  # Dynamic component loader
│   ├── catalog.js          # Catalog rendering logic
│   ├── finder.js           # Finder algorithm & scoring
│   ├── compare.js          # Comparison & localStorage
│   ├── faq.js              # Accordion functionality
│   ├── lead.js             # Form validation & submission
│   ├── share.js            # Share links & what-if simulation
│   └── ui.js               # UI utilities
│
└── styles/                  # Global styles
    ├── base.css            # Reset, variables, typography
    └── components.css      # Reusable components (cards, buttons, forms)
```

---

## 🚀 Bắt đầu sử dụng

### Yêu cầu
- **Không cần cài đặt gì!** Project sử dụng vanilla JavaScript, không có dependencies
- Chỉ cần một trình duyệt web hiện đại

### Cách chạy

1. **Clone hoặc download project**
   ```bash
   git clone <repository-url>
   cd FPT-SCHOOLARSHIP-WEBSITE
   ```

2. **Mở file `index.html` trong trình duyệt**
   - Có thể mở trực tiếp bằng cách double-click vào file
   - Hoặc sử dụng local server (khuyến nghị):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (nếu có http-server)
     npx http-server
     
     # PHP
     php -S localhost:8000
     ```
   - Truy cập: `http://localhost:8000`

3. **Tất cả dữ liệu được load từ file JSON trong thư mục `data/`**

---

## 🏗️ Kiến trúc & Công nghệ

### Component Architecture
- **Modular Design**: Mỗi component là một module độc lập (HTML + CSS)
- **Dynamic Loading**: Components được load và inject vào DOM thông qua `component-loader.js`
- **Event Bus Pattern**: Communication giữa các modules thông qua event bus

### Technology Stack
- **HTML5**: Semantic markup, accessibility attributes
- **CSS3**: 
  - CSS Variables cho theming
  - Flexbox & Grid cho layout
  - Modern animations & transitions
  - Responsive design với media queries
- **Vanilla JavaScript (ES6+)**:
  - ES6 Modules
  - Async/Await
  - LocalStorage API
  - Fetch API
  - URLSearchParams

### Data Flow
```
index.html
  ↓
main.js (init)
  ↓
component-loader.js (load components)
  ↓
Fetch data (scholarships.json, faq.json)
  ↓
Initialize modules (catalog, finder, compare, faq, lead)
  ↓
Event Bus (communication between modules)
```

---

## 📊 Dữ liệu

### Scholarships Data Structure
```json
{
  "slug": "unique-identifier",
  "name": "Scholarship Name",
  "quota_label": "Number of slots",
  "highlight_benefit": "Main benefit description",
  "eligibility": ["Condition 1", "Condition 2", ...],
  "external_link": "#"
}
```

### FAQ Data Structure
```json
{
  "question": "Question text",
  "answer": "Answer text"
}
```

---

## 🎯 Tính năng chi tiết

### Scholarship Finder Algorithm

Hệ thống tính điểm dựa trên các tiêu chí:

| Tiêu chí | Điểm | Học bổng liên quan |
|---------|------|-------------------|
| HSGQG Nhất | +3 | Full Scholarship |
| HSGQG Nhì | +3 | Two-year Scholarship |
| HSGQG Ba | +3 | One-year Scholarship |
| ĐGNL ≥ 90% | +2 | Full Scholarship |
| ĐGNL ≥ 85% | +2 | Two-year Scholarship |
| ĐGNL ≥ 80% | +2 | One-year Scholarship |
| TN THPT ≥ 9.0 | +1 | Full Scholarship |
| TN THPT ≥ 8.5 | +1 | Two-year Scholarship |
| TN THPT ≥ 8.0 | +1 | One-year Scholarship |
| Nữ + CNTT | +1 | STEM for Female |
| Top 10 SchoolRank + KV1 | +1 | High School Scholarship |
| HSGQG + CNTT | +2 | Global Expert |

**Mức độ phù hợp:**
- **Rất phù hợp** (≥5 điểm): Cơ hội cao
- **Phù hợp cao** (≥3 điểm): Nên cân nhắc
- **Cân nhắc** (≥1 điểm): Xem thêm điều kiện

### Comparison Feature
- Lưu trữ trong `localStorage` với key `sch_compare`
- Tối đa 3 học bổng
- Tự động sync khi thêm/xóa
- Bảng so sánh responsive với horizontal scroll trên mobile

### Share & What-if
- **Shareable Links**: URL parameters chứa toàn bộ input của form
- **What-if Simulation**: Mô phỏng kết quả khi tăng điểm TN/ĐGNL
- Auto-load từ URL parameters khi có query string

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Fully supported |
| Firefox | Latest | ✅ Fully supported |
| Safari | Latest | ✅ Fully supported |
| Edge | Latest | ✅ Fully supported |
| Mobile browsers | Latest | ✅ Fully supported |

**Note**: Sử dụng các API hiện đại (ES6 Modules, Fetch, LocalStorage). Các trình duyệt cũ có thể không hỗ trợ đầy đủ.

---

## ♿ Accessibility

Project tuân thủ các tiêu chuẩn accessibility:

- ✅ **Semantic HTML5**: Sử dụng đúng các thẻ HTML semantic
- ✅ **ARIA Labels**: Đầy đủ ARIA attributes cho screen readers
- ✅ **Skip to Content**: Link bỏ qua navigation
- ✅ **Keyboard Navigation**: Hỗ trợ điều hướng bằng bàn phím
- ✅ **Focus States**: Focus indicators rõ ràng
- ✅ **Color Contrast**: Đảm bảo tỷ lệ tương phản màu đạt chuẩn WCAG
- ✅ **Reduced Motion**: Tôn trọng `prefers-reduced-motion`

---

## 📝 Lưu ý & To-do

### Cần cập nhật
- [ ] Thay thế các link placeholder trong `index.html`:
  - Link "Tra cứu kết quả" (hero section)
  - Link "Xem chi tiết" (Deferred Payment section)
  - Link "Website chính thức" (footer)
  - Link "Fanpage" (footer)
  - Hotline (nếu cần)

### Có thể mở rộng
- [ ] Thêm analytics tracking
- [ ] Integration với backend API thay vì localStorage
- [ ] Thêm dark mode
- [ ] Thêm i18n (đa ngôn ngữ)
- [ ] Progressive Web App (PWA) support
- [ ] Thêm unit tests

---

## 📄 License

Project này được tạo cho FPT University. Vui lòng liên hệ để biết thêm thông tin về license.

---

## 👥 Contributors

- Development: [Your Name/Team]
- Design: [Designer Name]
- Content: FPT University Marketing Team

---

## 📞 Liên hệ

- **Website**: [FPT University Website]
- **Fanpage**: [Facebook Page]
- **Hotline**: [Phone Number]

---

<div align="center">

**Made with ❤️ for FPT University Students**

</div>
