# FPT University Scholarships 2025 - Landing Page

Landing page cho chương trình học bổng FPT University 2025, được xây dựng bằng HTML/CSS/JS thuần, không sử dụng framework hay build tool.

## Cấu trúc thư mục

```
/
├── index.html              # File HTML chính
├── styles/
│   ├── base.css           # Reset, CSS variables, typography, utilities
│   └── components.css     # Components: card, grid, buttons, forms, accordion, toast
├── js/
│   ├── main.js            # Khởi tạo modules, fetch data, navigation
│   ├── catalog.js          # Render danh mục học bổng
│   ├── finder.js           # Logic Scholarship Finder
│   ├── compare.js          # So sánh học bổng (localStorage)
│   ├── faq.js              # Accordion FAQ
│   └── lead.js             # Form đăng ký tư vấn
├── data/
│   ├── scholarships.json   # Dữ liệu 6 học bổng
│   └── faq.json           # 10 câu hỏi thường gặp
└── assets/
    ├── logo.svg            # Logo FPTU
    └── covers/             # Thư mục cho ảnh cover (placeholder)
```

## Tính năng

- **Hero Section**: Hiển thị số liệu học bổng và CTA buttons
- **Scholarship Finder**: Form tìm kiếm học bổng phù hợp dựa trên điểm số, giải thưởng, v.v.
- **Catalog**: Grid 6 cards học bổng với đầy đủ thông tin
- **Compare**: So sánh tối đa 3 học bổng (lưu trong localStorage)
- **Deferred Payment**: Thông tin về chương trình Học trước - Trả sau
- **FAQ**: Accordion 10 câu hỏi thường gặp
- **Lead Form**: Form đăng ký tư vấn với validation

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt
2. Tất cả dữ liệu được load từ file JSON trong thư mục `data/`
3. Không cần build hay cài đặt dependencies

## Lưu ý

- Cần thay thế các link placeholder trong `index.html` (xem comment cuối file):
  - Link "Tra cứu kết quả"
  - Link "Xem chi tiết" (Deferred Payment)
  - Link "Website chính thức" (Footer)
  - Link "Fanpage" (Footer)
  - Hotline (nếu cần)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Accessibility

- Semantic HTML5
- ARIA labels và attributes
- Skip to content link
- Focus states rõ ràng
- Keyboard navigation support

