// ============================================
// Interactive API Documentation Course
// Main Application JavaScript
// ============================================

(function() {
    'use strict';

    // ============================================
    // Constants & Configuration
    // ============================================
    const CONFIG = {
        STORAGE_KEY: 'vd_doc_progress_v1',
        NOTES_KEY: 'vd_doc_notes_v1',
        DATA_URL: 'data/course.json',
        TOAST_DURATION: 3000
    };

    // ============================================
    // State Management
    // ============================================
    const State = {
        courseData: null,
        currentModuleId: null,
        currentLessonId: null,
        currentTab: 'overview',
        completedLessons: new Set(),
        quizAnswers: {},
        notes: {},
        
        init() {
            this.loadProgress();
            this.loadNotes();
        },
        
        loadProgress() {
            try {
                const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (saved) {
                    const data = JSON.parse(saved);
                    this.completedLessons = new Set(data.completedLessons || []);
                    this.currentModuleId = data.currentModuleId;
                    this.currentLessonId = data.currentLessonId;
                    this.currentTab = data.currentTab || 'overview';
                }
            } catch (e) {
                console.error('Error loading progress:', e);
            }
        },
        
        saveProgress() {
            try {
                const data = {
                    completedLessons: Array.from(this.completedLessons),
                    currentModuleId: this.currentModuleId,
                    currentLessonId: this.currentLessonId,
                    currentTab: this.currentTab,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('Error saving progress:', e);
            }
        },
        
        loadNotes() {
            try {
                const saved = localStorage.getItem(CONFIG.NOTES_KEY);
                if (saved) {
                    this.notes = JSON.parse(saved);
                }
            } catch (e) {
                console.error('Error loading notes:', e);
            }
        },
        
        saveNotes() {
            try {
                localStorage.setItem(CONFIG.NOTES_KEY, JSON.stringify(this.notes));
            } catch (e) {
                console.error('Error saving notes:', e);
            }
        },
        
        markLessonComplete(lessonId) {
            this.completedLessons.add(lessonId);
            this.saveProgress();
            UI.updateProgress();
        },
        
        unmarkLessonComplete(lessonId) {
            this.completedLessons.delete(lessonId);
            this.saveProgress();
            UI.updateProgress();
        },
        
        isLessonComplete(lessonId) {
            return this.completedLessons.has(lessonId);
        },
        
        exportProgress() {
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                completedLessons: Array.from(this.completedLessons),
                notes: this.notes,
                currentLesson: this.currentLessonId
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `api-docs-progress-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            showToast('Progress exported successfully!', 'success');
        },
        
        importProgress(data) {
            try {
                if (data.completedLessons) {
                    this.completedLessons = new Set(data.completedLessons);
                }
                if (data.notes) {
                    this.notes = data.notes;
                }
                this.saveProgress();
                this.saveNotes();
                UI.updateProgress();
                showToast('Progress imported successfully!', 'success');
                return true;
            } catch (e) {
                console.error('Error importing progress:', e);
                showToast('Error importing progress', 'error');
                return false;
            }
        },
        
        resetProgress() {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                this.completedLessons.clear();
                this.notes = {};
                this.saveProgress();
                this.saveNotes();
                UI.updateProgress();
                showToast('Progress reset successfully', 'success');
            }
        }
    };

    // ============================================
    // Data Loading
    // ============================================
    async function loadCourseData() {
        try {
            const response = await fetch(CONFIG.DATA_URL);
            if (!response.ok) {
                throw new Error('Failed to load course data');
            }
            State.courseData = await response.json();
            return true;
        } catch (error) {
            console.error('Error loading course data:', error);
            showToast('Error loading course data', 'error');
            return false;
        }
    }

    // ============================================
    // UI Rendering
    // ============================================
    const UI = {
        renderSidebar() {
            const sidebarNav = document.getElementById('sidebarNav');
            if (!State.courseData || !sidebarNav) return;
            
            let html = '';
            
            State.courseData.modules.forEach(module => {
                const isExpanded = module.id === State.currentModuleId;
                
                html += `
                    <div class="module">
                        <div class="module-header ${isExpanded ? 'expanded' : ''}" data-module-id="${module.id}">
                            <div class="module-title">
                                <span class="module-icon">${module.icon}</span>
                                <span>${module.title}</span>
                            </div>
                            <span class="module-toggle">▶</span>
                        </div>
                        <div class="lesson-list ${isExpanded ? 'expanded' : ''}">
                `;
                
                module.lessons.forEach(lesson => {
                    const isActive = lesson.id === State.currentLessonId;
                    const isComplete = State.isLessonComplete(lesson.id);
                    
                    html += `
                        <div class="lesson-item ${isActive ? 'active' : ''} ${isComplete ? 'completed' : ''}" 
                             data-lesson-id="${lesson.id}" 
                             data-module-id="${module.id}">
                            ${lesson.title}
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            sidebarNav.innerHTML = html;
            
            // Attach event listeners
            document.querySelectorAll('.module-header').forEach(header => {
                header.addEventListener('click', () => {
                    const moduleId = header.dataset.moduleId;
                    this.toggleModule(moduleId);
                });
            });
            
            document.querySelectorAll('.lesson-item').forEach(item => {
                item.addEventListener('click', () => {
                    const lessonId = item.dataset.lessonId;
                    const moduleId = item.dataset.moduleId;
                    navigateToLesson(moduleId, lessonId);
                });
            });
        },
        
        toggleModule(moduleId) {
            const header = document.querySelector(`.module-header[data-module-id="${moduleId}"]`);
            const lessonList = header.nextElementSibling;
            
            header.classList.toggle('expanded');
            lessonList.classList.toggle('expanded');
        },
        
        renderLesson(moduleId, lessonId) {
            const module = State.courseData.modules.find(m => m.id === moduleId);
            if (!module) return;
            
            const lesson = module.lessons.find(l => l.id === lessonId);
            if (!lesson) return;
            
            // Update state
            State.currentModuleId = moduleId;
            State.currentLessonId = lessonId;
            State.saveProgress();
            
            // Update breadcrumbs
            document.getElementById('breadcrumbs').innerHTML = `
                <span>Home</span>
                <span>${module.title}</span>
                <span>${lesson.title}</span>
            `;
            
            // Update header
            document.getElementById('lessonTitle').textContent = lesson.title;
            document.getElementById('lessonSubtitle').textContent = module.description;
            
            // Update meta
            const lessonMeta = document.getElementById('lessonMeta');
            const estimatedTime = document.getElementById('estimatedTime');
            const completionBadge = document.getElementById('completionBadge');
            
            lessonMeta.style.display = 'flex';
            estimatedTime.textContent = `${lesson.estimated_time_minutes} min`;
            
            if (State.isLessonComplete(lessonId)) {
                completionBadge.style.display = 'flex';
            } else {
                completionBadge.style.display = 'none';
            }
            
            // Render content
            this.renderOverview(lesson);
            this.renderExamples(lesson);
            this.renderQuiz(lesson);
            this.renderNotes(lessonId);
            
            // Update footer
            this.updateFooter(module, lesson);
            
            // Update sidebar
            this.renderSidebar();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        
        renderOverview(lesson) {
            const content = document.getElementById('lessonContent');
            
            let objectivesHtml = '';
            if (lesson.learning_objectives && lesson.learning_objectives.length > 0) {
                objectivesHtml = `
                    <div class="card">
                        <h3>🎯 Learning Objectives</h3>
                        <ul>
                            ${lesson.learning_objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
            
            let resourcesHtml = '';
            if (lesson.resources && lesson.resources.length > 0) {
                resourcesHtml = `
                    <div class="card">
                        <h3>📚 Additional Resources</h3>
                        <ul>
                            ${lesson.resources.map(r => `
                                <li>
                                    <a href="${r.url}" target="_blank" rel="noopener noreferrer">
                                        ${r.title}
                                    </a>
                                    ${r.type ? `<small>(${r.type})</small>` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }
            
            content.innerHTML = `
                ${objectivesHtml}
                <div class="lesson-body">
                    ${lesson.contentHtml || '<p>Content coming soon...</p>'}
                </div>
                ${resourcesHtml}
            `;
        },
        
        renderExamples(lesson) {
            const examplesContent = document.getElementById('examplesContent');
            
            if (!lesson.examples || lesson.examples.length === 0) {
                examplesContent.innerHTML = '<p class="empty-state">No code examples for this lesson</p>';
                return;
            }
            
            let html = '<div class="examples-container">';
            
            lesson.examples.forEach((example, index) => {
                html += `
                    <div class="example-item">
                        <div class="example-header">
                            <div>
                                <h4 class="example-title">${example.title}</h4>
                                ${example.language ? `<span class="example-language">${example.language}</span>` : ''}
                            </div>
                            <button class="copy-btn" data-code="${encodeURIComponent(example.code)}">
                                📋 Copy
                            </button>
                        </div>
                        <pre><code class="language-${example.language || 'text'}">${escapeHtml(example.code)}</code></pre>
                    </div>
                `;
            });
            
            html += '</div>';
            examplesContent.innerHTML = html;
            
            // Attach copy listeners
            document.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const code = decodeURIComponent(btn.dataset.code);
                    navigator.clipboard.writeText(code).then(() => {
                        btn.textContent = '✓ Copied!';
                        setTimeout(() => {
                            btn.textContent = '📋 Copy';
                        }, 2000);
                    });
                });
            });
        },
        
        renderQuiz(lesson) {
            const quizContent = document.getElementById('quizContent');
            
            if (!lesson.quiz || lesson.quiz.length === 0) {
                quizContent.innerHTML = '<p class="empty-state">No quiz for this lesson</p>';
                return;
            }
            
            let html = '<div class="quiz-container">';
            
            lesson.quiz.forEach((question, index) => {
                html += `
                    <div class="quiz-question" data-question-id="${question.id}">
                        <h4>Question ${index + 1}</h4>
                        <p>${question.question}</p>
                `;
                
                if (question.type === 'mcq') {
                    html += '<div class="quiz-choices">';
                    question.choices.forEach((choice, choiceIndex) => {
                        html += `
                            <div class="quiz-choice" data-choice-index="${choiceIndex}">
                                ${choice}
                            </div>
                        `;
                    });
                    html += '</div>';
                } else if (question.type === 'short') {
                    html += `
                        <input type="text" 
                               class="quiz-input" 
                               placeholder="Type your answer..." 
                               data-question-id="${question.id}" />
                    `;
                }
                
                html += `
                        <div class="quiz-feedback" data-feedback-for="${question.id}"></div>
                        <button class="btn btn-primary" data-submit-for="${question.id}">
                            Check Answer
                        </button>
                    </div>
                `;
            });
            
            html += '</div>';
            quizContent.innerHTML = html;
            
            // Attach event listeners
            this.attachQuizListeners(lesson);
        },
        
        attachQuizListeners(lesson) {
            // MCQ selection
            document.querySelectorAll('.quiz-choice').forEach(choice => {
                choice.addEventListener('click', function() {
                    // Deselect siblings
                    this.parentElement.querySelectorAll('.quiz-choice').forEach(c => {
                        c.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            });
            
            // Submit buttons
            document.querySelectorAll('[data-submit-for]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const questionId = btn.dataset.submitFor;
                    const question = lesson.quiz.find(q => q.id === questionId);
                    checkAnswer(question, questionId);
                });
            });
        },
        
        renderNotes(lessonId) {
            const textarea = document.getElementById('notesTextarea');
            const currentNotes = State.notes[lessonId] || '';
            textarea.value = currentNotes;
        },
        
        updateProgress() {
            const totalLessons = this.getTotalLessons();
            const completed = State.completedLessons.size;
            const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
            
            // Update all progress bars
            document.querySelectorAll('.progress-fill').forEach(fill => {
                fill.style.width = `${percentage}%`;
            });
            
            document.querySelectorAll('.progress-text').forEach(text => {
                text.textContent = `${percentage}%`;
            });
            
            // Update counts
            document.getElementById('completedLessons').textContent = completed;
            document.getElementById('totalLessons').textContent = totalLessons;
            
            // Update sidebar items
            document.querySelectorAll('.lesson-item').forEach(item => {
                const lessonId = item.dataset.lessonId;
                if (State.isLessonComplete(lessonId)) {
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }
            });
            
            // Update mark complete button
            if (State.currentLessonId) {
                const btn = document.getElementById('markCompleteBtn');
                const text = document.getElementById('markCompleteText');
                if (State.isLessonComplete(State.currentLessonId)) {
                    btn.classList.add('completed');
                    text.textContent = '✓ Completed';
                } else {
                    btn.classList.remove('completed');
                    text.textContent = 'Mark as Complete';
                }
            }
            
            // Update completion badge
            if (State.currentLessonId && State.isLessonComplete(State.currentLessonId)) {
                document.getElementById('completionBadge').style.display = 'flex';
            } else {
                document.getElementById('completionBadge').style.display = 'none';
            }
        },
        
        updateFooter(module, lesson) {
            const footer = document.getElementById('lessonFooter');
            const prevBtn = document.getElementById('prevLessonBtn');
            const nextBtn = document.getElementById('nextLessonBtn');
            
            footer.style.display = 'flex';
            
            const { prev, next } = this.getAdjacentLessons(module, lesson);
            
            if (prev) {
                prevBtn.disabled = false;
                prevBtn.onclick = () => navigateToLesson(prev.moduleId, prev.lessonId);
            } else {
                prevBtn.disabled = true;
            }
            
            if (next) {
                nextBtn.disabled = false;
                nextBtn.onclick = () => navigateToLesson(next.moduleId, next.lessonId);
            } else {
                nextBtn.disabled = true;
            }
        },
        
        getAdjacentLessons(currentModule, currentLesson) {
            const allLessons = [];
            State.courseData.modules.forEach(module => {
                module.lessons.forEach(lesson => {
                    allLessons.push({
                        moduleId: module.id,
                        lessonId: lesson.id
                    });
                });
            });
            
            const currentIndex = allLessons.findIndex(l => 
                l.moduleId === currentModule.id && l.lessonId === currentLesson.id
            );
            
            return {
                prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
                next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
            };
        },
        
        getTotalLessons() {
            if (!State.courseData) return 0;
            return State.courseData.modules.reduce((sum, module) => 
                sum + module.lessons.length, 0
            );
        }
    };

    // ============================================
    // Navigation
    // ============================================
    function navigateToLesson(moduleId, lessonId) {
        UI.renderLesson(moduleId, lessonId);
        State.currentTab = 'overview';
        switchTab('overview');
    }

    function switchTab(tabName) {
        State.currentTab = tabName;
        State.saveProgress();
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-pane`)?.classList.add('active');
    }

    // ============================================
    // Quiz Logic
    // ============================================
    function checkAnswer(question, questionId) {
        const feedback = document.querySelector(`[data-feedback-for="${questionId}"]`);
        let isCorrect = false;
        
        if (question.type === 'mcq') {
            const selected = document.querySelector(`[data-question-id="${questionId}"] .quiz-choice.selected`);
            if (!selected) {
                showToast('Please select an answer', 'warning');
                return;
            }
            
            const selectedIndex = parseInt(selected.dataset.choiceIndex);
            isCorrect = selectedIndex === question.answerIndex;
            
            // Mark choices
            const choices = document.querySelectorAll(`[data-question-id="${questionId}"] .quiz-choice`);
            choices.forEach((choice, index) => {
                if (index === question.answerIndex) {
                    choice.classList.add('correct');
                } else if (index === selectedIndex && !isCorrect) {
                    choice.classList.add('incorrect');
                }
            });
        } else if (question.type === 'short') {
            const input = document.querySelector(`[data-question-id="${questionId}"]`);
            const userAnswer = input.value.trim().toLowerCase();
            
            // Check against acceptable answers
            const acceptableAnswers = question.acceptableAnswers || [question.answerText];
            isCorrect = acceptableAnswers.some(ans => 
                userAnswer === ans.toLowerCase()
            );
        }
        
        // Show feedback
        feedback.classList.add('show');
        if (isCorrect) {
            feedback.classList.add('correct');
            feedback.classList.remove('incorrect');
            feedback.innerHTML = `
                <strong>✓ Correct!</strong>
                ${question.explanation ? `<div class="quiz-explanation">${question.explanation}</div>` : ''}
            `;
        } else {
            feedback.classList.add('incorrect');
            feedback.classList.remove('correct');
            feedback.innerHTML = `
                <strong>✗ Incorrect</strong>
                ${question.explanation ? `<div class="quiz-explanation">${question.explanation}</div>` : ''}
            `;
        }
    }

    // ============================================
    // Search Functionality
    // ============================================
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (!query) {
                document.querySelectorAll('.lesson-item').forEach(item => {
                    item.style.display = '';
                });
                document.querySelectorAll('.module').forEach(module => {
                    module.style.display = '';
                });
                return;
            }
            
            document.querySelectorAll('.lesson-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = '';
                    // Expand parent module
                    const moduleHeader = item.closest('.module').querySelector('.module-header');
                    const lessonList = item.closest('.lesson-list');
                    moduleHeader.classList.add('expanded');
                    lessonList.classList.add('expanded');
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Hide modules with no visible lessons
            document.querySelectorAll('.module').forEach(module => {
                const visibleLessons = module.querySelectorAll('.lesson-item:not([style*="display: none"])');
                if (visibleLessons.length === 0) {
                    module.style.display = 'none';
                } else {
                    module.style.display = '';
                }
            });
        });
    }

    // ============================================
    // Keyboard Shortcuts
    // ============================================
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger if user is typing
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Only / for search
                if (e.key === '/') {
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                }
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 'n':
                    document.getElementById('nextLessonBtn')?.click();
                    break;
                case 'p':
                    document.getElementById('prevLessonBtn')?.click();
                    break;
                case 'm':
                    document.getElementById('markCompleteBtn')?.click();
                    break;
                case '/':
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                    break;
                case '1':
                    switchTab('overview');
                    break;
                case '2':
                    switchTab('examples');
                    break;
                case '3':
                    switchTab('quiz');
                    break;
                case '4':
                    switchTab('notes');
                    break;
            }
        });
    }

    // ============================================
    // Utilities
    // ============================================
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, CONFIG.TOAST_DURATION);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // Event Handlers
    // ============================================
    function attachEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });
        
        // Mark complete button
        document.getElementById('markCompleteBtn').addEventListener('click', () => {
            if (State.currentLessonId) {
                if (State.isLessonComplete(State.currentLessonId)) {
                    State.unmarkLessonComplete(State.currentLessonId);
                    showToast('Lesson unmarked', 'info');
                } else {
                    State.markLessonComplete(State.currentLessonId);
                    showToast('Lesson completed! 🎉', 'success');
                }
            }
        });
        
        // Notes save button
        document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
        document.getElementById('notesTextarea').addEventListener('input', debounce(saveNotes, 1000));
        
        // Progress actions
        document.getElementById('exportProgressBtn').addEventListener('click', () => {
            State.exportProgress();
        });
        
        document.getElementById('importProgressBtn').addEventListener('click', () => {
            document.getElementById('importModal').classList.add('show');
        });
        
        document.getElementById('resetProgressBtn').addEventListener('click', () => {
            State.resetProgress();
        });
        
        // Modal
        document.getElementById('closeImportModal').addEventListener('click', () => {
            document.getElementById('importModal').classList.remove('show');
        });
        
        document.getElementById('cancelImportBtn').addEventListener('click', () => {
            document.getElementById('importModal').classList.remove('show');
        });
        
        // File import
        document.getElementById('importFileInput').addEventListener('change', handleFileImport);
        
        // Start first lesson
        document.getElementById('startFirstLesson')?.addEventListener('click', () => {
            if (State.courseData && State.courseData.modules.length > 0) {
                const firstModule = State.courseData.modules[0];
                const firstLesson = firstModule.lessons[0];
                navigateToLesson(firstModule.id, firstLesson.id);
            }
        });
        
        // Sidebar toggle (mobile)
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('collapsed');
        });
    }

    function saveNotes() {
        if (State.currentLessonId) {
            const textarea = document.getElementById('notesTextarea');
            State.notes[State.currentLessonId] = textarea.value;
            State.saveNotes();
            
            const status = document.getElementById('saveStatus');
            status.textContent = '✓ Saved';
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
        }
    }

    function handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                
                // Preview
                const preview = document.getElementById('importPreview');
                const previewText = document.getElementById('importPreviewText');
                preview.style.display = 'block';
                previewText.textContent = `${data.completedLessons?.length || 0} completed lessons`;
                
                // Enable import button
                const confirmBtn = document.getElementById('confirmImportBtn');
                confirmBtn.disabled = false;
                confirmBtn.onclick = () => {
                    if (State.importProgress(data)) {
                        document.getElementById('importModal').classList.remove('show');
                        UI.updateProgress();
                        UI.renderSidebar();
                    }
                };
            } catch (e) {
                showToast('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // Initialization
    // ============================================
    async function init() {
        console.log('🚀 API Documentation Course - Initializing...');
        
        // Initialize state
        State.init();
        
        // Load course data
        const success = await loadCourseData();
        if (!success) {
            document.getElementById('loading-screen').classList.add('hidden');
            return;
        }
        
        // Render UI
        UI.renderSidebar();
        UI.updateProgress();
        
        // Restore previous lesson or show welcome
        if (State.currentLessonId && State.currentModuleId) {
            navigateToLesson(State.currentModuleId, State.currentLessonId);
        }
        
        // Attach event listeners
        attachEventListeners();
        initSearch();
        initKeyboardShortcuts();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 500);
        
        console.log('✅ Application initialized successfully!');
        console.log('💡 Keyboard shortcuts: N (next), P (prev), M (mark done), / (search), 1-4 (tabs)');
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
