// ============================================
// App State Management
// ============================================
const AppState = {
    currentSection: 'intro',
    currentTab: 'learn',
    completedLessons: new Set(),
    
    init() {
        this.loadProgress();
    },
    
    saveProgress() {
        const data = {
            completedLessons: Array.from(this.completedLessons),
            currentSection: this.currentSection,
            currentTab: this.currentTab,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('api-docs-course-progress', JSON.stringify(data));
    },
    
    loadProgress() {
        const saved = localStorage.getItem('api-docs-course-progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.completedLessons = new Set(data.completedLessons || []);
                this.currentSection = data.currentSection || 'intro';
                this.currentTab = data.currentTab || 'learn';
            } catch (e) {
                console.error('Error loading progress:', e);
            }
        }
    },
    
    markLessonComplete(lessonId) {
        this.completedLessons.add(lessonId);
        this.saveProgress();
        this.updateProgress();
    },
    
    isLessonComplete(lessonId) {
        return this.completedLessons.has(lessonId);
    },
    
    updateProgress() {
        const totalLessons = 6;
        const completed = this.completedLessons.size;
        const percentage = Math.round((completed / totalLessons) * 100);
        
        // Update progress bars
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            fill.style.width = `${percentage}%`;
        });
        
        // Update progress text
        const progressTexts = document.querySelectorAll('.progress-text');
        progressTexts.forEach(text => {
            text.textContent = `${percentage}%`;
        });
        
        // Update sidebar info
        const completedElement = document.getElementById('completedLessons');
        const totalElement = document.getElementById('totalLessons');
        if (completedElement) completedElement.textContent = completed;
        if (totalElement) totalElement.textContent = totalLessons;
        
        // Update nav items to show completed status
        document.querySelectorAll('.nav-item').forEach(item => {
            const section = item.dataset.section;
            if (this.isLessonComplete(section)) {
                item.classList.add('completed');
            }
        });
        
        // Update complete buttons
        document.querySelectorAll('.mark-complete').forEach(button => {
            const lesson = button.dataset.lesson;
            if (this.isLessonComplete(lesson)) {
                button.classList.add('completed');
                button.textContent = '✓ Completed';
            }
        });
        
        // Save report data
        this.saveReportData(completed, totalLessons, percentage);
    },
    
    saveReportData(completed, total, percentage) {
        const reportData = {
            progress: {
                completedLessons: completed,
                totalLessons: total,
                percentage: percentage,
                completedLessonIds: Array.from(this.completedLessons)
            },
            sections: [
                { id: 'intro', name: 'Introduction', completed: this.isLessonComplete('intro') },
                { id: 'rest', name: 'REST API Basics', completed: this.isLessonComplete('rest') },
                { id: 'openapi', name: 'OpenAPI Specification', completed: this.isLessonComplete('openapi') },
                { id: 'gitbook', name: 'GitBook Documentation', completed: this.isLessonComplete('gitbook') },
                { id: 'best-practices', name: 'Best Practices', completed: this.isLessonComplete('best-practices') },
                { id: 'exercises', name: 'Exercises', completed: this.isLessonComplete('exercises') }
            ],
            lastUpdated: new Date().toISOString()
        };
        
        // In a real application, this would be sent to a server
        // For now, we'll save it to localStorage to simulate the data/report.json
        localStorage.setItem('api-docs-course-report', JSON.stringify(reportData, null, 2));
    }
};

// ============================================
// Sidebar Navigation
// ============================================
function initSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            navigateToSection(section);
        });
    });
}

function navigateToSection(sectionId) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeNavItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Show corresponding content section
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    const contentSection = document.getElementById(`content-${sectionId}`);
    if (contentSection) {
        contentSection.classList.remove('hidden');
    }
    
    // Update app state
    AppState.currentSection = sectionId;
    AppState.saveProgress();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// Tab Navigation
// ============================================
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Show corresponding tab pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    const activePane = document.getElementById(`${tabId}-tab`);
    if (activePane) {
        activePane.classList.add('active');
    }
    
    // Update app state
    AppState.currentTab = tabId;
    AppState.saveProgress();
}

// ============================================
// Lesson Completion
// ============================================
function initLessonCompletion() {
    const completeButtons = document.querySelectorAll('.mark-complete');
    
    completeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lessonId = button.dataset.lesson;
            
            if (!AppState.isLessonComplete(lessonId)) {
                AppState.markLessonComplete(lessonId);
                button.classList.add('completed');
                button.textContent = '✓ Completed';
                
                // Update nav item
                const navItem = document.querySelector(`.nav-item[data-section="${lessonId}"]`);
                if (navItem) {
                    navItem.classList.add('completed');
                }
                
                // Show celebration message
                showNotification('Lesson completed! 🎉');
            }
        });
    });
}

// ============================================
// Notifications
// ============================================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Keyboard Navigation
// ============================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Alt + Arrow keys for navigation
        if (e.altKey) {
            const sections = ['intro', 'rest', 'openapi', 'gitbook', 'best-practices', 'exercises'];
            const currentIndex = sections.indexOf(AppState.currentSection);
            
            if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
                navigateToSection(sections[currentIndex + 1]);
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                navigateToSection(sections[currentIndex - 1]);
                e.preventDefault();
            }
        }
    });
}

// ============================================
// Data Export
// ============================================
function exportProgress() {
    const reportData = localStorage.getItem('api-docs-course-report');
    if (reportData) {
        const blob = new Blob([reportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'progress-report.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Make export function available globally
window.exportProgress = exportProgress;

// ============================================
// Initialize Application
// ============================================
function initApp() {
    console.log('🚀 API Documentation Course - Initializing...');
    
    // Initialize state
    AppState.init();
    
    // Initialize UI components
    initSidebarNavigation();
    initTabNavigation();
    initLessonCompletion();
    initKeyboardNavigation();
    
    // Restore previous state
    navigateToSection(AppState.currentSection);
    switchTab(AppState.currentTab);
    
    // Update progress display
    AppState.updateProgress();
    
    console.log('✅ Application initialized successfully!');
    console.log('💡 Tip: Use Alt + Arrow keys to navigate between sections');
    console.log('💡 Tip: Call exportProgress() in console to download your progress');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
