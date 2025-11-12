# 📚 API Documentation Interactive Crash Course — VideoDB Edition

> A fully local, interactive, static learning website that transforms beginners into professional API documentation writers.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-success)](/)
[![Fully Local](https://img.shields.io/badge/runtime-local%20only-blue)](/)

---

## 🎯 Overview

This interactive course teaches you how to create world-class API documentation using industry-standard tools and best practices. Perfect for technical writers, developers, and anyone who needs to document REST APIs.

### What You'll Master

- **REST API Fundamentals** — HTTP methods, status codes, request/response formats
- **Authentication & Authorization** — API keys, OAuth 2.0, JWT tokens
- **OpenAPI Specification** — Creating machine-readable API specs
- **GitBook Integration** — Building beautiful documentation sites
- **Testing Tools** — Postman, cURL, YAML validation
- **Advanced Concepts** — Rate limiting, pagination, webhooks
- **AI-Assisted Documentation** — Leveraging AI to accelerate writing

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- **No installation required** — fully self-contained!

### Running the Course

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/NischayJoshi/api-docs-interactive-course.git
   cd api-docs-interactive-course
   ```

2. **Open `index.html`** in your browser:
   ```bash
   # macOS
   open index.html
   
   # Windows
   start index.html
   
   # Linux
   xdg-open index.html
   ```

3. **Start learning!** Your progress is automatically saved.

---

## 📁 Project Structure

```
api-docs-interactive-course/
├── index.html              # Main HTML entry point
├── styles.css              # Dark theme + neon aesthetic CSS
├── app.js                  # Modular JavaScript (navigation, quizzes, progress)
├── data/
│   └── course.json         # Structured course content (8 modules)
├── README.md               # This file
└── API Documentation Training Crash Course.docx  # Reference document
```

### File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Main entry point with sidebar, tabs, and content areas |
| `styles.css` | Dark theme with neon green/blue highlights (CSS variables) |
| `app.js` | Application logic (navigation, quizzes, progress tracking) |
| `data/course.json` | All course content in structured JSON format |

---

## ✨ Features

### 🎓 Interactive Learning
- **8 Core Modules** with 15+ lessons covering API documentation fundamentals to advanced topics
- **Interactive Quizzes** with instant feedback (MCQ and short answer)
- **Code Examples** in multiple languages (cURL, Python, JavaScript, YAML)
- **Personal Notes** saved per lesson in localStorage
- **Progress Tracking** with visual progress bars and completion badges

### 🎨 User Interface
- **Dark Theme** with neon green/blue developer aesthetic
- **Collapsible Sidebar** with module and lesson navigation
- **Tab System** — Overview, Examples, Quiz, Notes
- **Breadcrumbs** showing current location
- **Responsive Design** — works on desktop, tablet, and mobile
- **Smooth Animations** for tab switching and progress updates

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| <kbd>N</kbd> | Next Lesson |
| <kbd>P</kbd> | Previous Lesson |
| <kbd>M</kbd> | Mark as Done / Undone |
| <kbd>/</kbd> | Focus Search |
| <kbd>1</kbd> | Overview Tab |
| <kbd>2</kbd> | Examples Tab |
| <kbd>3</kbd> | Quiz Tab |
| <kbd>4</kbd> | Notes Tab |

### 📊 Progress Management
- **Auto-save** — Progress saved to `localStorage` automatically
- **Export** — Download progress as JSON file
- **Import** — Restore progress from JSON file
- **Reset** — Clear all progress (with confirmation)

### 🔍 Search & Filter
- **Real-time search** — Filter lessons by title
- **Auto-expand modules** — Shows matching lessons
- Press <kbd>/</kbd> to quick-focus search

---

## 📚 Course Structure

### Module 1: API Basics & HTTP Fundamentals
- Understanding APIs: The Restaurant Analogy
- HTTP Methods: The Verbs of the Web
- HTTP Status Codes: Understanding Server Responses

### Module 2: Authentication & Authorization
- Authentication vs Authorization
- API Keys, OAuth 2.0, JWT

### Module 3: API Reference & OpenAPI Basics
- Introduction to OpenAPI Specification
- Creating API specs in YAML/JSON

### Module 4: Endpoints, Parameters & Error Handling
- Documenting API Endpoints
- Path, Query, and Body Parameters
- Writing Comprehensive Error Docs

### Module 5: GitBook Integration & Versioning
- Setting Up GitBook Documentation
- Organizing Content with SUMMARY.md
- Publishing and Maintaining Docs

### Module 6: Testing Tools & Workflows
- API Testing with Postman & cURL
- YAML Validation
- Generating Code Snippets

### Module 7: Advanced API Concepts
- Rate Limiting & Pagination
- Webhooks
- API Versioning Strategies

### Module 8: Using AI & Automation for API Docs
- AI-Assisted API Documentation
- Prompt Engineering for Docs
- Validating AI Output

---

## 🗂️ Data Schema (`data/course.json`)

The course content is stored in a structured JSON format:

```json
{
  "courseTitle": "API Docs Interactive Crash Course",
  "description": "...",
  "modules": [
    {
      "id": "module-api-basics",
      "title": "API Basics & HTTP Fundamentals",
      "description": "...",
      "icon": "🧭",
      "lessons": [
        {
          "id": "lesson-what-is-api",
          "slug": "what-is-api",
          "title": "Understanding APIs",
          "estimated_time_minutes": 20,
          "learning_objectives": ["..."],
          "contentHtml": "<h3>...</h3><p>...</p>",
          "examples": [
            {
              "title": "cURL GET Request",
              "language": "bash",
              "code": "curl ..."
            }
          ],
          "quiz": [
            {
              "id": "q1",
              "type": "mcq",
              "question": "...",
              "choices": ["A", "B", "C"],
              "answerIndex": 1,
              "explanation": "..."
            }
          ],
          "resources": [
            {
              "type": "article",
              "title": "...",
              "url": "https://..."
            }
          ]
        }
      ]
    }
  ]
}
```

### Adding New Lessons

1. Open `data/course.json`
2. Find the appropriate module
3. Add a new lesson object with required fields:
   - `id`, `slug`, `title`, `estimated_time_minutes`
   - `learning_objectives` (array)
   - `contentHtml` (HTML string)
   - `examples` (array of code examples)
   - `quiz` (array of questions)
   - `resources` (array of links)
4. Save and reload the page

---

## 💾 Progress Storage

### LocalStorage Keys

| Key | Description |
|-----|-------------|
| `vd_doc_progress_v1` | Completed lessons, current position |
| `vd_doc_notes_v1` | Personal notes per lesson |

### Export Format

Exported JSON includes:
```json
{
  "version": "1.0",
  "exportDate": "2024-01-15T10:30:00Z",
  "completedLessons": ["lesson-what-is-api", "lesson-http-methods"],
  "notes": {
    "lesson-what-is-api": "My notes here..."
  },
  "currentLesson": "lesson-http-methods"
}
```

---

## 🎨 Customization

### Changing the Theme

Edit CSS variables in `styles.css`:

```css
:root {
    /* Dark Base Colors */
    --bg-primary: #0a0e27;
    --bg-secondary: #151a2e;
    
    /* Neon Accent Colors */
    --neon-green: #00ff88;
    --neon-blue: #00d4ff;
    --neon-purple: #a855f7;
    
    /* Change these to customize colors */
}
```

### Adding Custom CSS

Append to `styles.css`:

```css
/* Custom styles */
.my-custom-class {
    /* Your styles */
}
```

---

## 🧪 Testing the Website

### Manual Testing

1. **Navigation**: Click through all modules and lessons
2. **Tabs**: Switch between Overview, Examples, Quiz, Notes
3. **Quizzes**: Answer questions and verify feedback
4. **Progress**: Mark lessons complete and verify progress bar updates
5. **Notes**: Write notes and verify auto-save
6. **Export/Import**: Export progress, reset, then import
7. **Search**: Use search to filter lessons
8. **Keyboard Shortcuts**: Test all shortcuts
9. **Mobile**: Resize browser to test responsive design

### Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🛠️ Troubleshooting

### Issue: Course content not loading

**Solution**: Ensure `data/course.json` exists and is valid JSON.

```bash
# Validate JSON
python3 -m json.tool data/course.json > /dev/null && echo "Valid JSON"
```

### Issue: Progress not saving

**Solution**: Check browser's localStorage is enabled.

```javascript
// In browser console
localStorage.setItem('test', '1');
console.log(localStorage.getItem('test')); // Should print "1"
```

### Issue: Search not working

**Solution**: Ensure JavaScript is enabled in your browser.

### Issue: Styles look broken

**Solution**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R).

---

## ✅ Acceptance Checklist

- [x] Site loads locally and displays modules/lessons
- [x] Sidebar navigation works (collapsible modules)
- [x] Tabs work (Overview, Examples, Quiz, Notes)
- [x] Progress tracking persists in localStorage
- [x] Quizzes auto-grade with feedback
- [x] Export/Import progress functional
- [x] Search/filter lessons works
- [x] Keyboard shortcuts functional
- [x] All code examples formatted properly
- [x] Mobile-friendly and responsive
- [x] Accessible (ARIA, keyboard navigation, focus styles)
- [x] Dark theme with neon aesthetic
- [x] 8 modules with comprehensive lessons
- [x] Fully offline (no CDNs or external dependencies)

---

## 🌟 Bonus Features

- ✅ Personal notes with auto-save
- ✅ Export/Import progress as JSON
- ✅ Search with auto-expand modules
- ✅ Keyboard shortcuts for power users
- ✅ Smooth animations and transitions
- ✅ Toast notifications for user actions
- ✅ Responsive breadcrumbs
- ✅ Estimated time per lesson
- ✅ Completion badges

---

## 📖 Learning Pathways

### 🚀 Fast Track (2-3 days)
Complete Modules 1, 2, 3, and 5 for core knowledge.

### 📚 Comprehensive (1-2 weeks)
Complete all 8 modules in order.

### 🎯 Practical Focus
Modules 4, 6, and 7 for hands-on documentation skills.

---

## 🤝 Contributing

Contributions are welcome! To add content:

1. Fork the repository
2. Edit `data/course.json` to add lessons
3. Test locally
4. Submit a pull request

### Content Guidelines

- Write in clear, simple language
- Include realistic code examples
- Provide 2-3 quiz questions per lesson
- Add external resources (articles, videos)
- Use callouts for tips, warnings, and recaps

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🙏 Acknowledgments

- Built with ❤️ for developers learning API documentation
- Reference content derived from "API Documentation Training Crash Course" document
- Inspired by industry-leading API docs (Stripe, Twilio, GitBook)

---

## 📬 Support

- **Issues**: [GitHub Issues](https://github.com/NischayJoshi/api-docs-interactive-course/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NischayJoshi/api-docs-interactive-course/discussions)

---

**Happy Learning!** 🎓✨

Transform into a professional API documentation writer — one lesson at a time.
