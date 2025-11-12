# API Documentation Interactive Course

A fully local, interactive HTML/CSS/JS website that teaches beginners how to write professional API documentation.

## 🎯 Overview

This interactive course teaches you how to create high-quality API documentation using industry-standard tools and best practices. The course covers:

- **REST API Documentation** - Learn how to document RESTful APIs effectively
- **OpenAPI Specification** - Master the OpenAPI (Swagger) specification format
- **GitBook** - Create beautiful, searchable documentation sites
- **Best Practices** - Industry standards for writing clear, helpful API docs
- **Hands-on Exercises** - Practice what you've learned with real-world scenarios

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No installation or frameworks required - fully local and self-contained!

### Running the Course

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start learning!

```bash
# Clone the repository
git clone https://github.com/NischayJoshi/api-docs-interactive-course.git

# Navigate to the directory
cd api-docs-interactive-course

# Open in your default browser (or just double-click index.html)
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

## 📁 Project Structure

```
api-docs-interactive-course/
├── index.html          # Main HTML file with course content
├── styles.css          # Modular CSS styling
├── app.js              # Interactive JavaScript functionality
├── data/
│   └── report.json     # Course progress data structure
└── README.md           # This file
```

## ✨ Features

### Interactive Learning
- **Sidebar Navigation** - Easy navigation between course sections
- **Tab System** - Organized content in Learn, Practice, Resources, and Quiz tabs
- **Progress Tracking** - Visual progress bars show your completion status
- **Local Storage** - Your progress is saved automatically in your browser

### User Interface
- **Clean, Modern Design** - Professional appearance with intuitive layout
- **Responsive Layout** - Works on desktop and mobile devices
- **Smooth Animations** - Polished user experience with transitions
- **Code Examples** - Syntax-highlighted code samples

### Keyboard Shortcuts
- `Alt + →` - Navigate to next section
- `Alt + ←` - Navigate to previous section

## 💾 Progress Tracking

Your progress is automatically saved to your browser's local storage. To export your progress:

1. Open the browser's developer console (F12)
2. Type `exportProgress()` and press Enter
3. A JSON file with your progress will be downloaded

## 🎨 Customization

The website uses CSS variables for easy theming. Edit `styles.css` to customize colors:

```css
:root {
    --primary-color: #2563eb;
    --sidebar-bg: #1e293b;
    --card-bg: #ffffff;
    /* ... more variables */
}
```

## 📚 Course Content

### 1. Introduction
Overview of API documentation and course objectives

### 2. REST API Basics
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Request/Response formats
- Authentication and error handling

### 3. OpenAPI Specification
- OpenAPI 3.0 structure
- Creating API specifications
- Tools and validators

### 4. GitBook Documentation
- Setting up GitBook
- Content organization
- Publishing documentation

### 5. Best Practices
- Writing guidelines
- Code examples
- Error documentation
- Versioning strategies

### 6. Exercises
Hands-on practice exercises to reinforce learning

## 🛠️ Technical Details

- **No Dependencies** - Pure HTML, CSS, and JavaScript (no frameworks)
- **Fully Local** - No server required, runs entirely in the browser
- **Modern Standards** - Uses ES6+ JavaScript features
- **Clean Code** - Modular, well-commented, maintainable code

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Improve documentation
- Add more course content

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Built with ❤️ for developers learning API documentation

---

**Happy Learning!** 🎓
