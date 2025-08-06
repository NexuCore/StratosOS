// Core OS Application
class StratosOS {
    constructor() {
        this.currentScreen = 'lockscreen';
        this.spotlightOpen = false;
        this.ctrlPressed = 0;
        this.ctrlTimeout = null;
        this.windows = [];
        this.activeWindow = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.wifiNetworks = [
            'StarLink-Orbital', 'CosmicNet', 'StratosWiFi', 'NebulaConnect',
            'GalaxyWeb', 'VoidNetwork', 'AetherLink', 'QuantumNet',
            'CelestialWeb', 'StellarNet', 'OrbitalWiFi', 'PulseNetwork', 'AstroLink', 'UniverseConnect', 'AxiomNet'
        ];
        this.currentWifi = null;
        this.systemCommands = [
            { name: 'Shutdown', icon: '🛑', action: () => this.shutdown() },
            { name: 'Restart', icon: '🔄', action: () => {
                this.showAlert('System Restart', 'The system will now restart.', () => location.reload());
            }},
            { name: 'Lock', icon: '🔒', action: () => this.showLockscreen() }
        ];
        
        // Update apps to include store apps
        this.apps = AppRegistry.getApps(); // Simplified, getApps() now includes everything
        
        this.minimizedApps = [];
        this.taskbarApps = [];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.setupDesktop();
        this.connectRandomWifi();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            // Play startup sound
            const startupSound = new Audio('/Startup.mp3');
            startupSound.play().catch(() => {});
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    connectRandomWifi() {
        this.currentWifi = this.wifiNetworks[Math.floor(Math.random() * this.wifiNetworks.length)];
        this.updateSystemTray();
    }

    updateSystemTray() {
        const wifiIcon = document.querySelector('.wifi-icon');
        const batteryIcon = document.querySelector('.battery-icon');
        
        if (wifiIcon) {
            wifiIcon.textContent = this.currentWifi;
            wifiIcon.title = `Connected to ${this.currentWifi}`;
        }
        
        if (batteryIcon) {
            batteryIcon.textContent = '100%';
            batteryIcon.title = '100% - Full';
        }
    }

    setupDesktop() {
        // Desktop setup is now minimal - just the clock
        // No desktop icons as per user request
    }

    setupEventListeners() {
        new EventManager(this).setupAll();
        this.setupModalControls();
    }

    setupModalControls() {
        // This will be handled inside showAlert and showPrompt
    }

    openApp(appId, payload = null) {
        const app = this.apps.find(a => a.id === appId);
        if (!app) return;

        // Check if already open
        const existingWindow = this.windows.find(w => w.appId === appId);
        if (existingWindow) {
            this.focusWindow(existingWindow.id);
            return;
        }

        const windowId = `window-${Date.now()}`;
        const windowEl = this.createWindow(app, windowId, payload);
        document.getElementById('desktop-screen').appendChild(windowEl);
        
        this.windows.push({
            id: windowId,
            appId: appId,
            element: windowEl
        });
        
        this.focusWindow(windowId);

        // Initialize app-specific functionality
        setTimeout(() => {
            switch(app.id) {
                case 'notes':
                    this.initNotesApp(windowId);
                    break;
                case 'canvas':
                    this.initCanvasApp(windowId, payload);
                    break;
                case 'calendar':
                    this.initCalendarApp(windowId);
                    break;
                case 'settings':
                    this.initSettingsApp(windowId);
                    break;
                case 'files':
                    this.initFilesApp(windowId);
                    break;
                case 'browser':
                    this.initBrowserApp(windowId);
                    break;
                case 'terminal':
                    this.initTerminalApp(windowId);
                    break;
                case 'stratosphere':
                    this.initStratosphereApp(windowId);
                    break;
                case 'store':
                    // Store app uses the content directly, no init needed
                    break;
                case 'ping-pong':
                    this.initPingPongApp(windowId);
                    break;
                case 'woordle':
                    this.initWoordleApp(windowId);
                    break;
                case 'game-2099':
                    this.initGame2099App(windowId);
                    break;
                case 'calculator':
                    this.initCalculatorApp(windowId);
                    break;
                case 'about':
                    // Now treated as a normal app
                    break;
            }
        }, 10);
    }

    createWindow(app, windowId, payload) {
        const windowEl = document.createElement('div');
        windowEl.className = 'app-window';
        if (app.id === 'canvas') windowEl.classList.add('canvas-app');
        if (app.id === 'stratosphere') windowEl.classList.add('stratosphere-app');
        windowEl.id = windowId;
        windowEl.style.left = '100px';
        windowEl.style.top = '100px';
        windowEl.dataset.app = app.id;
        
        let headerButtons = `
            <button class="window-minimize" data-window-id="${windowId}" title="Minimize">−</button>
            <button class="window-close" data-window-id="${windowId}" title="Close">×</button>
        `;
        
        if (app.id === 'notes') {
            windowEl.innerHTML = `
                <div class="window-header notes-header">
                    <span class="window-title">Notes</span>
                    <div class="notes-controls">
                        <button class="notes-control-btn primary" id="new-note-btn-${windowId}">+ New</button>
                        <button class="notes-control-btn" id="save-note-btn-${windowId}">Save</button>
                        <button class="notes-control-btn danger" id="delete-note-btn-${windowId}">Delete</button>
                    </div>
                    ${headerButtons}
                </div>
                <div class="window-content">
                    <div class="notes-container">
                        <div class="notes-sidebar" id="notes-sidebar-${windowId}">
                            <!-- Notes list will be populated here -->
                        </div>
                        <div class="notes-editor">
                            <input type="text" id="note-title-input-${windowId}" placeholder="Note title...">
                            <textarea id="note-content-input-${windowId}" placeholder="Start typing..."></textarea>
                        </div>
                    </div>
                </div>
            `;
        } else {
            windowEl.innerHTML = `
                <div class="window-header">
                    <span class="window-title">${app.name}</span>
                    ${headerButtons}
                </div>
                <div class="window-content">${this.getAppContent(app.id, windowId)}</div>
            `;
        }
        
        // Add event listeners
        windowEl.querySelector('.window-header').addEventListener('mousedown', (e) => this.startDrag(e, windowId));
        windowEl.querySelector('.window-close').addEventListener('click', () => this.closeApp(windowId));
        windowEl.querySelector('.window-minimize').addEventListener('click', () => this.minimizeApp(windowId));
        
        windowEl.addEventListener('mousedown', () => this.focusWindow(windowId));

        return windowEl;
    }

    initNotesApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        let notes = JSON.parse(localStorage.getItem('stratos-notes')) || {
            welcome: {
                title: 'Welcome to Stratos Notes',
                content: 'Welcome! \n\nThis is your personal space to capture thoughts, ideas, and reminders.\n\nFeatures:\n- Auto-save every 2 seconds\n- Persistent storage (local)\n- Clean, minimal interface\n- Keyboard shortcuts (Ctrl+N for new, Ctrl+S for save)\n\nTry creating a new note or editing this one!',
                date: new Date().toISOString()
            }
        };
        
        let currentNoteId = 'welcome';
        let autoSaveInterval;

        // Clear any existing content
        const contentEl = windowEl.querySelector('.window-content');
        contentEl.innerHTML = '';

        // Create custom notes layout
        const notesContainer = document.createElement('div');
        notesContainer.className = 'notes-container';

        // Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'notes-sidebar';
        sidebar.id = `notes-sidebar-${windowId}`;

        // Editor
        const editor = document.createElement('div');
        editor.className = 'notes-editor';

        // Title input
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = `note-title-input-${windowId}`;
        titleInput.placeholder = 'Untitled';
        titleInput.style.cssText = `
            font-family: 'Space Mono', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            border: 2px solid #000;
            border-radius: 4px;
            padding: 1rem 1rem 0.5rem;
            margin-bottom: 0.5rem;
            background: #fff;
            outline: none;
            box-shadow: inset 1px 1px 0px #000;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
            width: 100%;
            box-sizing: border-box;
        `;
        titleInput.value = notes[currentNoteId]?.title || 'Welcome';

        // Content textarea
        const contentTextarea = document.createElement('textarea');
        contentTextarea.id = `note-content-input-${windowId}`;
        contentTextarea.placeholder = 'Start typing your thoughts...';
        contentTextarea.style.cssText = `
            font-family: 'Space Mono', monospace;
            font-size: 1rem;
            line-height: 1.8;
            border: 2px solid #000;
            border-radius: 4px;
            resize: none;
            background: #fff;
            outline: none;
            padding: 1rem;
            width: 100%;
            height: 400px;
            box-sizing: border-box;
            box-shadow: inset 1px 1px 0px #000;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
        `;
        contentTextarea.value = notes[currentNoteId]?.content || '';

        // Build DOM
        editor.appendChild(titleInput);
        editor.appendChild(contentTextarea);
        notesContainer.appendChild(sidebar);
        notesContainer.appendChild(editor);
        contentEl.appendChild(notesContainer);

        // Controls in header
        const header = windowEl.querySelector('.window-header');
        const controlsDiv = header.querySelector('.notes-controls');
        if (controlsDiv) {
            controlsDiv.innerHTML = `
                <button class="notes-control-btn primary" id="new-note-btn-${windowId}">+ New</button>
                <button class="notes-control-btn" id="save-note-btn-${windowId}">Save</button>
                <button class="notes-control-btn danger" id="delete-note-btn-${windowId}">Delete</button>
            `;
        }

        // Get references
        const newBtn = windowEl.querySelector(`#new-note-btn-${windowId}`);
        const saveBtn = windowEl.querySelector(`#save-note-btn-${windowId}`);
        const deleteBtn = windowEl.querySelector(`#delete-note-btn-${windowId}`);

        function renderSidebar() {
            sidebar.innerHTML = '';
            Object.keys(notes).forEach(id => {
                const note = notes[id];
                const item = document.createElement('div');
                item.className = `note-item ${id === currentNoteId ? 'active' : ''}`;
                item.dataset.id = id;
                item.innerHTML = `
                    <span class="note-title">${note.title || 'Untitled'}</span>
                    <span class="note-date">${new Date(note.date).toLocaleDateString()}</span>
                `;
                item.addEventListener('click', () => loadNote(id));
                sidebar.appendChild(item);
            });
        }

        function loadNote(id) {
            currentNoteId = id;
            const note = notes[id];
            if (!note) return;
            titleInput.value = note.title || 'Untitled';
            contentTextarea.value = note.content || '';
            
            windowEl.querySelectorAll('.note-item').forEach(item => {
                item.classList.toggle('active', item.dataset.id === id);
            });
        }

        function saveNote() {
            if (currentNoteId && notes[currentNoteId]) {
                notes[currentNoteId] = {
                    title: titleInput.value || 'Untitled',
                    content: contentTextarea.value || '',
                    date: new Date().toISOString()
                };
                localStorage.setItem('stratos-notes', JSON.stringify(notes));
                renderSidebar();
            }
        }

        function newNote() {
            window.os.showPrompt('New Note', 'Enter a title for your new note:', 'Untitled Note', (name) => {
                if (name !== null) { // User clicked OK
                    const id = 'note-' + Date.now();
                    notes[id] = {
                        title: name || 'Untitled',
                        content: '',
                        date: new Date().toISOString()
                    };
                    renderSidebar();
                    loadNote(id);
                    titleInput.focus();
                }
            });
        }

        function deleteNote() {
            if (Object.keys(notes).length > 1) {
                const noteTitle = notes[currentNoteId]?.title || 'Untitled';
                window.os.showConfirm('Delete Note', `Are you sure you want to delete "${noteTitle}"?`, (confirmed) => {
                    if (confirmed) {
                        delete notes[currentNoteId];
                        const remainingIds = Object.keys(notes);
                        currentNoteId = remainingIds[0] || 'welcome';
                        localStorage.setItem('stratos-notes', JSON.stringify(notes));
                        renderSidebar();
                        loadNote(currentNoteId);
                    }
                });
            } else {
                window.os.showAlert('Cannot Delete', 'You cannot delete the last note.');
            }
        }

        // Event listeners
        newBtn?.addEventListener('click', newNote);
        saveBtn?.addEventListener('click', saveNote);
        deleteBtn?.addEventListener('click', deleteNote);
        
        titleInput.addEventListener('input', saveNote);
        contentTextarea.addEventListener('input', saveNote);
        
        // Auto-save every 2 seconds
        autoSaveInterval = setInterval(saveNote, 2000);

        // Initial render
        renderSidebar();
        loadNote(currentNoteId);
    }

    initCanvasApp(windowId, payload) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        const canvas = windowEl.querySelector('#canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const tools = windowEl.querySelectorAll('.canvas-tool');
        
        const brushSize = windowEl.querySelector('#brush-size');
        const canvasInfo = windowEl.querySelector('#canvas-info');

        // New color picker elements
        const colorPickerBtn = windowEl.querySelector('#color-picker-btn');
        const colorPickerPopup = windowEl.querySelector('#color-picker-popup');
        const colorPreview = windowEl.querySelector('#color-preview');
        const colorHexDisplay = windowEl.querySelector('#color-hex-display');
        const hexInput = windowEl.querySelector('#hex-color-input');
        const presetColors = windowEl.querySelectorAll('.preset-color');

        let currentTool = 'brush';
        let currentColor = '#000000';
        let currentSize = 5;
        let startX, startY;
        let isDrawing = false;

        // Load painting data if provided
        if (payload && payload.data) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = payload.data;
        }

        // Tool selection
        tools.forEach(tool => {
            tool.addEventListener('click', (e) => {
                // Ignore clicks on color picker button itself for tool selection
                if (e.currentTarget.id === 'color-picker-btn') return;

                const toolName = e.currentTarget.dataset.tool;

                if (toolName === 'clear') {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    return;
                }
                if (toolName === 'save') {
                    savePainting();
                    return;
                }
                
                tools.forEach(t => {
                    if (t.id !== 'color-picker-btn') t.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                currentTool = toolName;
                updateCanvasInfo();
            });
        });

        function updateColor(newColor) {
            // Basic hex validation
            if (!/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
                return;
            }
            currentColor = newColor;
            colorPreview.style.backgroundColor = newColor;
            colorHexDisplay.textContent = newColor.toUpperCase();
            if(hexInput.value.toUpperCase() !== newColor.toUpperCase()) {
                hexInput.value = newColor.toUpperCase();
            }
            updateCanvasInfo();
        }

        // Color Picker Logic
        colorPickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            colorPickerPopup.classList.toggle('active');
        });

        hexInput.addEventListener('input', (e) => {
            updateColor(e.target.value);
        });

        presetColors.forEach(color => {
            color.addEventListener('click', (e) => {
                updateColor(e.target.dataset.color);
            });
        });

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!colorPickerPopup.contains(e.target) && !colorPickerBtn.contains(e.target)) {
                colorPickerPopup.classList.remove('active');
            }
        });

        // Brush size
        brushSize.addEventListener('input', (e) => {
            currentSize = parseInt(e.target.value);
            updateCanvasInfo();
        });

        function savePainting() {
            window.os.showPrompt('Save Painting', 'Enter a name for your painting:', 'Untitled', (name) => {
                if (name) {
                    const paintings = JSON.parse(localStorage.getItem('stratos-paintings') || '{}');
                    const paintingId = 'painting-' + Date.now();
                    paintings[paintingId] = {
                        id: paintingId,
                        name: name,
                        data: canvas.toDataURL(),
                        date: new Date().toISOString()
                    };
                    localStorage.setItem('stratos-paintings', JSON.stringify(paintings));
                    window.os.showAlert('Success', `Painting "${name}" saved!`);
                }
            });
        }

        function updateCanvasInfo() {
            const toolNames = {
                brush: 'Brush',
                eraser: 'Eraser',
                line: 'Line',
                rectangle: 'Rectangle',
                circle: 'Circle'
            };
            canvasInfo.textContent = `${toolNames[currentTool]} • ${currentSize}px • ${currentColor}`;
        }

        // Drawing functions
        function startDrawing(e) {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            if (currentTool === 'brush' || currentTool === 'eraser') {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
            }
        }

        function draw(e) {
            if (!isDrawing) return;

            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;

            ctx.lineWidth = currentSize;
            ctx.lineCap = 'round';

            if (currentTool === 'brush') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = currentColor;
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            } else if (currentTool === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            }
        }

        function stopDrawing(e) {
            if (!isDrawing) return;
            isDrawing = false;

            if (currentTool === 'line' || currentTool === 'rectangle' || currentTool === 'circle') {
                const rect = canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;

                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = currentSize;

                if (currentTool === 'line') {
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                } else if (currentTool === 'rectangle') {
                    ctx.beginPath();
                    ctx.rect(startX, startY, endX - startX, endY - startY);
                    ctx.stroke();
                } else if (currentTool === 'circle') {
                    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }

        // Event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        updateCanvasInfo();
        // Set initial active tool
        windowEl.querySelector('[data-tool="brush"]').classList.add('active');
    }

    initCalendarApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        // Calendar state
        let currentDate = new Date();
        const minYear = 1900;
        const maxYear = 2025;

        // Update the calendar content with proper structure
        const contentEl = windowEl.querySelector('.window-content');
        contentEl.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-btn" id="calendar-prev">←</button>
                    <h3 id="calendar-month-year">January 2025</h3>
                    <button class="calendar-btn" id="calendar-next">→</button>
                </div>
                <div class="calendar-weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div class="calendar-days" id="calendar-days">
                    <!-- Calendar days will be populated here -->
                </div>
                <div class="calendar-footer">
                    <button class="calendar-btn" id="calendar-today">Today</button>
                    <select id="calendar-year-select">
                        <!-- Year options will be populated here -->
                    </select>
                </div>
            </div>
        `;

        // Now get the elements after they're in the DOM
        const monthYearEl = windowEl.querySelector('#calendar-month-year');
        const daysEl = windowEl.querySelector('#calendar-days');
        const prevBtn = windowEl.querySelector('#calendar-prev');
        const nextBtn = windowEl.querySelector('#calendar-next');
        const todayBtn = windowEl.querySelector('#calendar-today');
        const yearSelect = windowEl.querySelector('#calendar-year-select');

        // Populate year select
        for (let y = minYear; y <= maxYear; y++) {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            yearSelect.appendChild(opt);
        }
        yearSelect.value = currentDate.getFullYear();

        // Render calendar
        function renderCalendar() {
            const y = currentDate.getFullYear();
            const m = currentDate.getMonth();

            monthYearEl.textContent = new Date(y, m, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
            yearSelect.value = y;

            daysEl.innerHTML = '';
            const firstDayOfMonth = new Date(y, m, 1);
            const lastDayOfMonth = new Date(y, m + 1, 0);
            const daysInMonth = lastDayOfMonth.getDate();
            const startDayOfWeek = firstDayOfMonth.getDay();

            // Previous month's trailing days
            const prevLast = new Date(y, m, 0).getDate();
            for (let i = startDayOfWeek - 1; i >= 0; i--) {
                const div = document.createElement('div');
                div.classList.add('inactive');
                div.textContent = prevLast - i;
                daysEl.appendChild(div);
            }

            // Current month days
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const div = document.createElement('div');
                div.textContent = day;
                if (y === today.getFullYear() && m === today.getMonth() && day === today.getDate()) {
                    div.classList.add('today');
                }
                daysEl.appendChild(div);
            }

            // Next month's leading days
            const totalCells = 42;
            const remaining = totalCells - (startDayOfWeek + daysInMonth);
            for (let day = 1; day <= remaining; day++) {
                const div = document.createElement('div');
                div.classList.add('inactive');
                div.textContent = day;
                daysEl.appendChild(div);
            }
        }

        // Event listeners
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            renderCalendar();
        });

        yearSelect.addEventListener('change', (e) => {
            currentDate.setFullYear(parseInt(e.target.value));
            renderCalendar();
        });

        // Initial render
        renderCalendar();
    }

    getAppContent(appId, windowId) {
        const contents = {
            files: this.getFilesContent(),
            canvas: this.getCanvasContent(),
            browser: this.getBrowserContent(),
            settings: this.getSettingsContent(),
            about: this.getAboutContent(),
            search: '<div class="app-content"><h3>Search</h3><p>Find anything on your system.</p></div>',
            notes: this.getNotesContent(),
            store: this.generateStoreContent(),
            terminal: this.getTerminalContent(),
            calendar: this.getCalendarContent(),
            'ping-pong': this.getPingPongContent(),
            'woordle': this.getWoordleContent(),
            'game-2099': this.getGame2099Content(),
            calculator: this.getCalculatorContent(),
            stratosphere: this.getStratosphereContent(windowId)
        };
        
        // Handle store apps
        if (contents[appId]) {
            return contents[appId];
        }
        
        // Default for any app
        const app = this.apps.find(a => a.id === appId);
        if (app) {
            return `
                <div class="app-content">
                    <h3>${app.name}</h3>
                    <div style="text-align: center; margin: 2rem 0;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">${app.icon}</div>
                        <p>${app.description || 'App ready to use'}</p>
                    </div>
                </div>
            `;
        }
        
        return '<div class="app-content">App not found</div>';
    }

    getFilesContent() {
        return `
            <div class="app-content">
                <div class="files-container">
                    <div class="files-sidebar">
                        <div class="files-sidebar-item active" data-path="home">Home</div>
                        <div class="files-sidebar-item" data-path="notes">My Notes</div>
                        <div class="files-sidebar-item" data-path="paintings">My Paintings</div>
                        <div class="files-sidebar-item" data-path="documents">Documents</div>
                    </div>
                    <div class="files-main">
                        <div class="files-toolbar">
                            <button class="files-toolbar-btn" id="new-folder-btn">📁 New Folder</button>
                            <button class="files-toolbar-btn" id="new-file-btn">📄 New File</button>
                            <button class="files-toolbar-btn" id="refresh-files-btn">🔄 Refresh</button>
                        </div>
                        <div class="files-breadcrumb" id="files-breadcrumb">Home</div>
                        <div class="files-content">
                            <div class="files-grid" id="files-grid">
                                <div class="file-item" data-name="Welcome.txt">
                                    <div class="file-icon">📄</div>
                                    <div class="file-name">Welcome.txt</div>
                                    <div class="file-date">${new Date().toLocaleDateString()}</div>
                                </div>
                                <div class="file-item" data-name="Documents">
                                    <div class="file-icon">📁</div>
                                    <div class="file-name">Documents</div>
                                    <div class="file-date">${new Date().toISOString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCanvasContent() {
        return `
            <div class="app-content">
                <div class="canvas-container">
                    <div class="canvas-toolbar">
                        <div class="canvas-tools">
                            <button class="canvas-tool" data-tool="brush">🖌️ Brush</button>
                            <button class="canvas-tool" data-tool="eraser">🧽 Eraser</button>
                            <button class="canvas-tool" data-tool="line">📏 Line</button>
                            <button class="canvas-tool" data-tool="rectangle">⬜ Rectangle</button>
                            <button class="canvas-tool" data-tool="circle">⭕ Circle</button>
                            <button class="canvas-tool" data-tool="clear">🗑️ Clear</button>
                            <button class="canvas-tool" data-tool="save">💾 Save</button>
                        </div>
                        <div class="canvas-colors">
                            <label>Color:</label>
                            <div class="color-selector-container">
                                <button id="color-picker-btn" class="canvas-tool color-picker-trigger">
                                    <div id="color-preview" style="width: 20px; height: 20px; background-color: #000000; border: 1px solid #555;"></div>
                                    <span id="color-hex-display">#000000</span>
                                </button>
                                <div id="color-picker-popup" class="color-picker-popup">
                                    <input type="text" id="hex-color-input" value="#000000" maxlength="7" placeholder="#000000">
                                    <div class="preset-colors">
                                        <div class="preset-color" data-color="#000000" style="background: #000000"></div>
                                        <div class="preset-color" data-color="#FFFFFF" style="background: #FFFFFF; border: 1px solid #ddd"></div>
                                        <div class="preset-color" data-color="#FF6B6B" style="background: #FF6B6B"></div>
                                        <div class="preset-color" data-color="#4ECDC4" style="background: #4ECDC4"></div>
                                        <div class="preset-color" data-color="#45B7D1" style="background: #45B7D1"></div>
                                        <div class="preset-color" data-color="#C1D7FF" style="background: #C1D7FF"></div>
                                        <div class="preset-color" data-color="#F7D794" style="background: #F7D794"></div>
                                        <div class="preset-color" data-color="#77DD77" style="background: #77DD77"></div>
                                    </div>
                                </div>
                            </div>
                            <label>Size:</label>
                            <input type="range" id="brush-size" min="1" max="20" value="5">
                        </div>
                    </div>
                    <div class="canvas-main">
                        <canvas id="canvas" width="600" height="400"></canvas>
                        <div class="canvas-info" id="canvas-info">Brush • 5px • #000000</div>
                    </div>
                </div>
            </div>
        `;
    }

    getBrowserContent() {
        return `
            <div class="app-content">
                <div class="browser-container">
                    <div class="browser-toolbar">
                        <button class="browser-btn" id="back-btn">←</button>
                        <button class="browser-btn" id="forward-btn">→</button>
                        <button class="browser-btn" id="refresh-btn">↻</button>
                        <input type="text" id="url-input" placeholder="Enter URL or search..." value="https://example.com">
                        <button class="browser-btn" id="go-btn">Go</button>
                    </div>
                    <iframe id="browser-frame" src="https://example.com" width="100%" height="100%" style="flex: 1; min-height: 400px;"></iframe>
                </div>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div class="app-content">
                <div class="settings-container">
                    <h2>Settings</h2>
                    <div class="settings-section">
                        <h3>Data Management</h3>
                        <button class="settings-btn" id="export-data">📤 Export Data</button>
                        <button class="settings-btn" id="import-data">📥 Import Data</button>
                        <button class="settings-btn danger" id="clear-data">🗑️ Clear All Data</button>
                    </div>
                    <div class="settings-section">
                        <h3>System</h3>
                        <button class="settings-btn" id="show-about">ℹ️ About Stratos OS</button>
                    </div>
                </div>
            </div>
        `;
    }

    getAboutContent() {
        return ContentFactory.getAboutContent();
    }

    getNotesContent() {
        return `
            <div class="app-content">
                <h3>Notes</h3>
                <p>Quick notes and reminders.</p>
            </div>
        `;
    }

    getTerminalContent() {
        return `
            <div class="terminal-container">
                <div class="terminal-body">
                    <div class="terminal-output" id="terminal-output-${Date.now()}">
                        <div>Stratos Terminal v1.1.0</div>
                        <div>Type 'help' for available commands.</div>
                    </div>
                    <div class="terminal-input-line">
                        <span class="terminal-prompt">user@stratos:~$</span>
                        <input type="text" class="terminal-input" id="terminal-input-${Date.now()}" placeholder="Enter command..." autofocus>
                    </div>
                </div>
            </div>
        `;
    }

    getCalendarContent() {
        return `
            <div class="app-content">
                <div class="calendar-container">
                    <div class="calendar-header">
                        <button class="calendar-btn" id="calendar-prev">←</button>
                        <h3 id="calendar-month-year">January 2025</h3>
                        <button class="calendar-btn" id="calendar-next">→</button>
                    </div>
                    <div class="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div class="calendar-days" id="calendar-days">
                        <!-- Calendar days will be populated here -->
                    </div>
                    <div class="calendar-footer">
                        <button class="calendar-btn" id="calendar-today">Today</button>
                        <select id="calendar-year-select">
                            <!-- Year options will be populated here -->
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    getStratosphereContent(windowId) {
        return `
            <div class="stratosphere-container">
                <div class="stratosphere-sidebar">
                    <div class="sidebar-header">
                        <h4>EXPLORER</h4>
                    </div>
                    <ul class="file-tree" id="file-tree-${windowId}">
                        <!-- File tree will be dynamically populated -->
                    </ul>
                </div>
                <div class="stratosphere-main">
                    <div class="editor-pane">
                        <div class="editor-tabs" id="editor-tabs-${windowId}">
                            <!-- Tabs will be dynamically populated -->
                        </div>
                        <div class="editor-content">
                            <div class="line-numbers" id="line-numbers-${windowId}">1</div>
                            <textarea class="code-input" id="code-input-${windowId}" spellcheck="false" placeholder="Select a file to start coding..."></textarea>
                        </div>
                        <div class="stratosphere-statusbar" id="statusbar-${windowId}">
                            <span>Ready</span>
                            <span>Spaces: 4</span>
                            <span id="language-display-${windowId}"></span>
                            <span>Stratos OS</span>
                        </div>
                    </div>
                    <div class="preview-pane">
                        <div class="preview-toolbar">
                            <button class="preview-run-btn" id="run-btn-${windowId}">▶ Run</button>
                            <span>Live Preview</span>
                        </div>
                        <iframe class="preview-frame" id="preview-frame-${windowId}" sandbox="allow-scripts allow-same-origin"></iframe>
                    </div>
                </div>
            </div>
        `;
    }

    // Add missing store app content generators
    getPingPongContent() {
        return `
            <div class="app-content">
                <div class="ping-pong-container">
                    <h2>Ping Pong</h2>
                    <div class="game-controls">
                        <button class="game-btn" id="start-ping-pong">Start Game</button>
                        <button class="game-btn" id="reset-ping-pong">Reset</button>
                    </div>
                    <canvas id="ping-pong-canvas" width="400" height="300"></canvas>
                    <div class="game-info">
                        <span>Player: <span id="player-score">0</span></span>
                        <span>AI: <span id="ai-score">0</span></span>
                    </div>
                </div>
            </div>
        `;
    }

    getWoordleContent() {
        return `
            <div class="app-content">
                <div class="woordle-container">
                    <h2>Woordle</h2>
                    <div class="woordle-grid" id="woordle-grid"></div>
                    <div class="woordle-keyboard" id="woordle-keyboard"></div>
                    <div class="game-info">
                        <button class="game-btn" id="new-word-btn">New Word</button>
                        <div id="woordle-message"></div>
                    </div>
                </div>
            </div>
        `;
    }

    getGame2099Content() {
        return `
            <div class="app-content">
                <div class="game-2099-container">
                    <h2>2099</h2>
                    <div class="game-info">
                        <span>Score: <span id="score-2099">0</span></span>
                        <button class="game-btn" id="new-game-2099">New Game</button>
                    </div>
                    <div class="game-2099-grid" id="game-2099-grid"></div>
                    <div class="game-controls">
                        <button class="game-btn" id="up-btn">↑</button>
                        <button class="game-btn" id="down-btn">↓</button>
                        <button class="game-btn" id="left-btn">←</button>
                        <button class="game-btn" id="right-btn">→</button>
                    </div>
                </div>
            </div>
        `;
    }

    getCalculatorContent() {
        return `
            <div class="app-content">
                <div class="calculator-container">
                    <div class="calculator-display" id="calc-display">0</div>
                    <div class="calculator-keys">
                        <button class="calc-key function" data-key="c">C</button>
                        <button class="calc-key operator" data-key="/">÷</button>
                        <button class="calc-key operator" data-key="*">×</button>
                        <button class="calc-key operator" data-key="-">-</button>

                        <button class="calc-key" data-key="7">7</button>
                        <button class="calc-key" data-key="8">8</button>
                        <button class="calc-key" data-key="9">9</button>
                        <button class="calc-key operator" data-key="+" style="grid-row: span 2;">+</button>

                        <button class="calc-key" data-key="4">4</button>
                        <button class="calc-key" data-key="5">5</button>
                        <button class="calc-key" data-key="6">6</button>
                        
                        <button class="calc-key" data-key="1">1</button>
                        <button class="calc-key" data-key="2">2</button>
                        <button class="calc-key" data-key="3">3</button>
                        <button class="calc-key equals" data-key="=" style="grid-row: span 2;">=</button>

                        <button class="calc-key" data-key="0" style="grid-column: span 2;">0</button>
                        <button class="calc-key" data-key=".">.</button>
                    </div>
                </div>
            </div>
        `;
    }

    generateAppContent(appId) {
        const apps = [...this.apps, ...AppRegistry.getStoreApps()];
        const app = apps.find(a => a.id === appId);
        
        if (!app) return '<div class="app-content">App not found</div>';
        
        return `
            <div class="app-content">
                <h3>${app.name}</h3>
                <div style="text-align: center; margin: 2rem 0;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${app.icon}</div>
                    <p>${app.description || 'App ready to use'}</p>
                </div>
            </div>
        `;
    }

    // Update the app registry to include store apps
    static getApps() {
        return [
            { name: 'Files', icon: '📁', id: 'files' },
            { name: 'Canvas', icon: '🎨', id: 'canvas' },
            { name: 'Settings', icon: '⚙️', id: 'settings' },
            { name: 'Calendar', icon: '🗓️', id: 'calendar' },
            { name: 'Browser', icon: '🌐', id: 'browser' },
            { name: 'Notes', icon: '📝', id: 'notes' },
            { name: 'Store', icon: '🏪', id: 'store' },
            { name: 'About', icon: 'ℹ️', id: 'about' },
            { name: 'Terminal', icon: '⌨️', id: 'terminal' },
            { name: 'Ping Pong', icon: '🏓', id: 'ping-pong', description: 'Classic arcade game' },
            { name: 'Woordle', icon: '🎯', id: 'woordle', description: 'Word guessing game' },
            { name: '2099', icon: '🔢', id: 'game-2099', description: '2048 variant - reach 2099!' }
        ];
    }

    generateStoreContent() {
        const storeApps = AppRegistry.getStoreApps();
        let appsHtml = storeApps.map(app => `
            <div class="store-item" onclick="window.os.openApp('${app.id}')">
                <div class="store-icon">${app.icon}</div>
                <h3>${app.name}</h3>
                <p>${app.description}</p>
                <button class="store-btn">Play</button>
            </div>
        `).join('');

        return `
            <div class="app-content store-container">
                <h2>Stratos Store</h2>
                <p>Discover and install new apps for your Stratos OS</p>
                <div class="store-grid">
                    ${appsHtml}
                </div>
            </div>
        `;
    }

    initFilesApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        // Files state
        let currentPath = 'home';
        let fileStructure = JSON.parse(localStorage.getItem('stratos-files') || '{}');
        
        // Initialize default structure if empty
        if (!fileStructure.home) {
            fileStructure = {
                home: {
                    'Welcome.txt': { 
                        type: 'file', 
                        content: 'Welcome to Stratos Files! \n\nThis is your file manager.\n\nFeatures:\n- Browse notes and paintings\n- Create new files and folders\n- Organize your workspace', 
                        lastModified: new Date().toISOString() 
                    },
                    'My Notes': { type: 'folder', children: {}, lastModified: new Date().toISOString() },
                    'My Paintings': { type: 'folder', children: {}, lastModified: new Date().toISOString() },
                    'Documents': { type: 'folder', children: {}, lastModified: new Date().toISOString() },
                    'Stratos OS': { type: 'folder', children: {}, lastModified: new Date().toISOString() }
                }
            };
            localStorage.setItem('stratos-files', JSON.stringify(fileStructure));
        } else if (!fileStructure.home['Stratos OS']) {
            // Add Stratos OS folder if it doesn't exist for returning users
            fileStructure.home['Stratos OS'] = { type: 'folder', children: {}, lastModified: new Date().toISOString() };
            localStorage.setItem('stratos-files', JSON.stringify(fileStructure));
        }

        // Navigation functions
        function getCurrentItems() {
            if (currentPath === 'home') return fileStructure.home;
            if (currentPath === 'notes') return loadNotes();
            if (currentPath === 'paintings') return loadPaintings();
            if (currentPath === 'documents') return loadDocuments();
            // Handle nested folders
            const pathParts = currentPath.split('/');
            if (pathParts[0] === 'home' && pathParts.length > 1) {
                let currentDir = fileStructure.home;
                for (let i = 1; i < pathParts.length; i++) {
                    const part = pathParts[i];
                    if (currentDir && currentDir[part] && currentDir[part].type === 'folder') {
                        currentDir = currentDir[part].children;
                    } else {
                        return {}; // Not found
                    }
                }
                return currentDir;
            }

            return {};
        }

        function loadNotes() {
            const notes = JSON.parse(localStorage.getItem('stratos-notes') || '{}');
            const noteItems = {};
            Object.keys(notes).forEach(key => {
                noteItems[`${notes[key].title || 'Untitled'}.note`] = {
                    type: 'note',
                    id: key,
                    title: notes[key].title || 'Untitled',
                    content: notes[key].content,
                    date: notes[key].date
                };
            });
            return noteItems;
        }

        function loadPaintings() {
            const paintings = JSON.parse(localStorage.getItem('stratos-paintings') || '{}');
            const paintingItems = {};
            Object.keys(paintings).forEach(key => {
                paintingItems[`${paintings[key].name || 'Untitled'}.paint`] = {
                    type: 'painting',
                    id: key,
                    name: paintings[key].name || 'Untitled',
                    data: paintings[key].data,
                    date: paintings[key].date
                };
            });
            return paintingItems;
        }

        function loadDocuments() {
            const docs = JSON.parse(localStorage.getItem('stratos-documents') || '{}');
            const docItems = {};
            Object.keys(docs).forEach(key => {
                docItems[`${key}.txt`] = {
                    type: 'file',
                    content: docs[key].content || '',
                    lastModified: docs[key].date || new Date().toISOString()
                };
            });
            return docItems;
        }

        // UI rendering
        function renderFiles() {
            const grid = windowEl.querySelector('#files-grid');
            const breadcrumb = windowEl.querySelector('#files-breadcrumb');
            const items = getCurrentItems();
            
            grid.innerHTML = '';
            breadcrumb.textContent = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

            Object.keys(items).forEach(name => {
                const item = items[name];
                const div = document.createElement('div');
                div.className = 'file-item';
                div.dataset.name = name;
                
                let icon = '📄';
                if (item.type === 'folder' || name === 'Documents' || name === 'Stratos OS') icon = '📁';
                if (item.type === 'note') icon = '📝';
                if (item.type === 'painting') icon = '🎨';

                const date = item.date || item.lastModified;
                let dateHtml = '';
                if (date) {
                    const d = new Date(date);
                    if (!isNaN(d)) {
                         dateHtml = `<div class="file-date">${d.toLocaleDateString()}</div>`;
                    }
                }
                
                div.innerHTML = `
                    <div class="file-icon">${icon}</div>
                    <div class="file-name">${name}</div>
                    ${dateHtml}
                `;

                div.addEventListener('dblclick', () => openItem(name, item));
                div.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    showContextMenu(e, name, item);
                });
                grid.appendChild(div);
            });
        }

        function showContextMenu(e, name, item) {
            const existingMenu = document.querySelector('.files-context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            const menu = document.createElement('div');
            menu.className = 'files-context-menu';
            menu.style.top = `${e.clientY}px`;
            menu.style.left = `${e.clientX}px`;

            const deleteOption = document.createElement('div');
            deleteOption.className = 'context-item';
            deleteOption.textContent = 'Delete';
            deleteOption.onclick = () => {
                deleteItem(name);
                menu.remove();
            };

            menu.appendChild(deleteOption);

            document.body.appendChild(menu);

            const closeMenu = (event) => {
                if (!menu.contains(event.target)) {
                    menu.remove();
                    document.body.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => document.body.addEventListener('click', closeMenu), 0);
        }

        function deleteItem(name) {
            if (name === 'Stratos OS') {
                window.os.showConfirm('System Warning', `Deleting "${name}" will cause a system crash. Are you sure you want to proceed?`, (confirmed) => {
                    if (confirmed) {
                        window.os.crashSystem();
                    }
                });
                return;
            }
            
            window.os.showConfirm('Confirm Deletion', `Are you sure you want to delete "${name}"? This action cannot be undone.`, (confirmed) => {
                if (confirmed) {
                    if (currentPath === 'home' && fileStructure.home[name]) {
                        delete fileStructure.home[name];
                        localStorage.setItem('stratos-files', JSON.stringify(fileStructure));
                    } else if (currentPath === 'notes') {
                        const notes = loadNotes();
                        const noteItem = Object.values(notes).find(n => `${n.title}.note` === name);
                        if (noteItem) {
                            const allNotes = JSON.parse(localStorage.getItem('stratos-notes') || '{}');
                            delete allNotes[noteItem.id];
                            localStorage.setItem('stratos-notes', JSON.stringify(allNotes));
                        }
                    } else if (currentPath === 'paintings') {
                        const paintings = loadPaintings();
                        const paintingItem = Object.values(paintings).find(p => `${p.name}.paint` === name);
                        if (paintingItem) {
                            const allPaintings = JSON.parse(localStorage.getItem('stratos-paintings') || '{}');
                            delete allPaintings[paintingItem.id];
                            localStorage.setItem('stratos-paintings', JSON.stringify(allPaintings));
                        }
                    } else {
                        window.os.showAlert('Error', 'Deletion is only supported for user-created files and folders.');
                        return;
                    }
                    renderFiles();
                }
            });
        }

        function openItem(name, item) {
            if (item.type === 'folder' || name === 'Documents' || name === 'Stratos OS') {
                // Feature removed as per user request. Double clicking folders does nothing.
                return;
            } else if (item.type === 'file') {
                alert(`${name}\n\n${item.content}`);
            } else if (item.type === 'note') {
                window.os.openApp('notes', { noteId: item.id });
            } else if (item.type === 'painting') {
                window.os.openApp('canvas', { data: item.data });
            }
        }

        function createNewFolder() {
            window.os.showPrompt('New Folder', 'Enter folder name:', 'New Folder', (name) => {
                if (name) {
                    const folderName = name.replace(/[^a-zA-Z0-9\s]/g, '');
                    if (folderName) {
                        fileStructure.home[folderName] = {
                            type: 'folder',
                            children: {},
                            lastModified: new Date().toISOString()
                        };
                        localStorage.setItem('stratos-files', JSON.stringify(fileStructure));
                        renderFiles();
                    }
                }
            });
        }

        function createNewFile() {
            window.os.showPrompt('New File', 'Enter file name:', 'Untitled', (name) => {
                if (name) {
                    const fileName = name.replace(/[^a-zA-Z0-9\s]/g, '') + '.txt';
                    fileStructure.home[fileName] = {
                        type: 'file',
                        content: '',
                        lastModified: new Date().toISOString()
                    };
                    localStorage.setItem('stratos-files', JSON.stringify(fileStructure));
                    renderFiles();
                }
            });
        }

        // Event listeners
        const sidebarItems = windowEl.querySelectorAll('.files-sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                currentPath = item.dataset.path;
                renderFiles();
            });
        });

        const breadcrumb = windowEl.querySelector('#files-breadcrumb');
        breadcrumb.addEventListener('click', (e) => {
             if (e.target.tagName === 'SPAN') {
                const path = e.target.dataset.path;
                if(path) {
                    currentPath = path;
                    renderFiles();
                }
            } else if (currentPath !== 'home' && !['notes', 'paintings', 'documents'].includes(currentPath)) {
                // Allow clicking on the whole bar to go up one level
                const parts = currentPath.split('/');
                parts.pop();
                currentPath = parts.join('/');
                if (currentPath === '') currentPath = 'home';
                renderFiles();
            }
        });

        const newFolderBtn = windowEl.querySelector('#new-folder-btn');
        const newFileBtn = windowEl.querySelector('#new-file-btn');
        const refreshBtn = windowEl.querySelector('#refresh-files-btn');

        if (newFolderBtn) newFolderBtn.addEventListener('click', createNewFolder);
        if (newFileBtn) newFileBtn.addEventListener('click', createNewFile);
        if (refreshBtn) refreshBtn.addEventListener('click', renderFiles);

        // Initial render
        renderFiles();
    }

    initBrowserApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        const backBtn = windowEl.querySelector('#back-btn');
        const forwardBtn = windowEl.querySelector('#forward-btn');
        const refreshBtn = windowEl.querySelector('#refresh-btn');
        const urlInput = windowEl.querySelector('#url-input');
        const goBtn = windowEl.querySelector('#go-btn');
        const frame = windowEl.querySelector('#browser-frame');

        // Browser history
        let history = ['https://example.com'];
        let currentIndex = 0;

        function updateUI() {
            urlInput.value = history[currentIndex];
            backBtn.disabled = currentIndex === 0;
            forwardBtn.disabled = currentIndex === history.length - 1;
        }

        function navigate(url) {
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            if (!url.includes('.')) {
                url = 'https://duckduckgo.com/?q=' + encodeURIComponent(url);
            }

            history = history.slice(0, currentIndex + 1);
            history.push(url);
            currentIndex++;

            frame.src = url;
            updateUI();
        }

        backBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                frame.src = history[currentIndex];
                updateUI();
            }
        });

        forwardBtn.addEventListener('click', () => {
            if (currentIndex < history.length - 1) {
                currentIndex++;
                frame.src = history[currentIndex];
                updateUI();
            }
        });

        refreshBtn.addEventListener('click', () => {
            frame.src = frame.src;
        });

        goBtn.addEventListener('click', () => {
            navigate(urlInput.value);
        });

        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                navigate(urlInput.value);
            }
        });

        // Update on iframe load
        frame.addEventListener('load', () => {
            try {
                // Try to get the actual URL from the iframe
                const actualUrl = new URL(frame.contentWindow.location.href);
                if (history[currentIndex] !== actualUrl.href) {
                    history[currentIndex] = actualUrl.href;
                    updateUI();
                }
            } catch (e) {
                // Cross-origin protection - just use the stored URL
            }
        });

        updateUI();
    }

    crashSystem() {
        // Play crash sound
        const crashSound = new Audio('/crash.mp3');
        crashSound.play().catch(() => {});

        // Hide all screens
        document.getElementById('lockscreen').classList.remove('active');
        document.getElementById('desktop-screen').classList.remove('active');
        document.getElementById('shutdown-screen').style.display = 'none';
        document.getElementById('loading-screen').style.display = 'none';

        // Show WSOD
        const wsodScreen = document.getElementById('wsod-screen');
        wsodScreen.style.display = 'flex';
    }

    initPingPongApp(windowId) {
        const canvas = document.getElementById('ping-pong-canvas');
        const ctx = canvas.getContext('2d');
        const startBtn = document.getElementById('start-ping-pong');
        const resetBtn = document.getElementById('reset-ping-pong');
        const playerScoreEl = document.getElementById('player-score');
        const aiScoreEl = document.getElementById('ai-score');

        let gameRunning = false;
        let playerScore = 0;
        let aiScore = 0;

        // Game objects
        const ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            dx: 1.5,
            dy: 1,
            radius: 8
        };

        const player = {
            x: 10,
            y: canvas.height / 2 - 40,
            width: 10,
            height: 80,
            speed: 5
        };

        const ai = {
            x: canvas.width - 20,
            y: canvas.height / 2 - 40,
            width: 10,
            height: 80,
            speed: 2.5
        };

        // Input handling
        let keys = {};
        document.addEventListener('keydown', (e) => keys[e.key] = true);
        document.addEventListener('keyup', (e) => keys[e.key] = false);

        function draw() {
            // Clear canvas
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw center line
            ctx.setLineDash([5, 15]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.strokeStyle = '#000';
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw paddles
            ctx.fillStyle = '#000';
            ctx.fillRect(player.x, player.y, player.width, player.height);
            ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

            // Draw ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#C1D7FF';
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        function update() {
            if (!gameRunning) return;

            // Move player
            if (keys['ArrowUp'] && player.y > 0) {
                player.y -= player.speed;
            }
            if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
                player.y += player.speed;
            }

            // Move AI
            const aiCenter = ai.y + ai.height / 2;
            const ballCenter = ball.y;
            if (aiCenter < ballCenter - 10) {
                ai.y += ai.speed;
            } else if (aiCenter > ballCenter + 10) {
                ai.y -= ai.speed;
            }

            // Move ball
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Ball collision with top/bottom
            if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                ball.dy = -ball.dy;
            }

            // Ball collision with paddles
            if (ball.x - ball.radius < player.x + player.width &&
                ball.y > player.y && ball.y < player.y + player.height) {
                ball.dx = Math.abs(ball.dx);
            }
            
            if (ball.x + ball.radius > ai.x &&
                ball.y > ai.y && ball.y < ai.y + ai.height) {
                ball.dx = -Math.abs(ball.dx);
            }

            // Score
            if (ball.x < 0) {
                aiScore++;
                aiScoreEl.textContent = aiScore;
                resetBall();
            }
            if (ball.x > canvas.width) {
                playerScore++;
                playerScoreEl.textContent = playerScore;
                resetBall();
            }
        }

        function resetBall() {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = Math.random() > 0.5 ? 3 : -3;
            ball.dy = Math.random() > 0.5 ? 2 : -2;
        }

        function gameLoop() {
            update();
            draw();
            if (gameRunning) {
                requestAnimationFrame(gameLoop);
            }
        }

        startBtn.addEventListener('click', () => {
            gameRunning = true;
            gameLoop();
        });

        resetBtn.addEventListener('click', () => {
            gameRunning = false;
            playerScore = 0;
            aiScore = 0;
            playerScoreEl.textContent = '0';
            aiScoreEl.textContent = '0';
            resetBall();
            draw();
        });

        draw();
    }

    initWoordleApp(windowId) {
        const words = ['CLOUD', 'SPACE', 'STARS', 'MOON', 'PLANET', 'COMET', 'GALAXY', 'ORBIT', 'PROBE', 'SOLAR', 'ASTRO', 'PULSAR', 'SHIPS', 'LASER'];
        let targetWord = words[Math.floor(Math.random() * words.length)];
        let currentGuess = '';
        let currentRow = 0;
        const maxGuesses = 6;

        const grid = document.getElementById('woordle-grid');
        const keyboard = document.getElementById('woordle-keyboard');
        const message = document.getElementById('woordle-message');
        const newWordBtn = document.getElementById('new-word-btn');

        // Create grid
        for (let i = 0; i < maxGuesses; i++) {
            const row = document.createElement('div');
            row.className = 'woordle-row';
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.className = 'woordle-cell';
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }

        // Create keyboard
        const keyboardRows = [
            'QWERTYUIOP'.split(''),
            'ASDFGHJKL'.split(''),
            'ZXCVBNM'.split('')
        ];

        keyboardRows.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'woordle-keyboard-row';
            row.forEach(key => {
                const keyEl = document.createElement('button');
                keyEl.className = 'woordle-key';
                keyEl.textContent = key;
                keyEl.addEventListener('click', () => handleKeyPress(key));
                rowEl.appendChild(keyEl);
            });
            keyboard.appendChild(rowEl);
        });

        // Enter and backspace
        const enterKey = document.createElement('button');
        enterKey.className = 'woordle-key special';
        enterKey.textContent = 'ENTER';
        enterKey.addEventListener('click', handleEnter);

        const backspaceKey = document.createElement('button');
        backspaceKey.className = 'woordle-key special';
        backspaceKey.textContent = '⌫';
        backspaceKey.addEventListener('click', handleBackspace);

        keyboard.lastChild.appendChild(enterKey);
        keyboard.lastChild.insertBefore(backspaceKey, keyboard.lastChild.firstChild);

        function handleKeyPress(key) {
            if (currentGuess.length < 5) {
                currentGuess += key;
                updateCell();
            }
        }

        function handleBackspace() {
            currentGuess = currentGuess.slice(0, -1);
            updateCell();
        }

        function handleEnter() {
            if (currentGuess.length === 5) {
                checkGuess();
            }
        }

        function updateCell() {
            const row = grid.children[currentRow];
            for (let i = 0; i < 5; i++) {
                row.children[i].textContent = currentGuess[i] || '';
                row.children[i].className = 'woordle-cell';
            }
        }

        function checkGuess() {
            const row = grid.children[currentRow];
            let correct = 0;
            
            for (let i = 0; i < 5; i++) {
                const cell = row.children[i];
                const letter = currentGuess[i];
                
                if (letter === targetWord[i]) {
                    cell.classList.add('correct');
                    correct++;
                } else if (targetWord.includes(letter)) {
                    cell.classList.add('present');
                } else {
                    cell.classList.add('absent');
                }
            }

            if (correct === 5) {
                message.textContent = 'Congratulations! 🎉';
                disableKeyboard();
            } else if (currentRow === maxGuesses - 1) {
                message.textContent = `Game over! Word was ${targetWord}`;
                disableKeyboard();
            } else {
                currentRow++;
                currentGuess = '';
            }
        }

        function disableKeyboard() {
            keyboard.querySelectorAll('.woordle-key').forEach(key => key.disabled = true);
        }

        newWordBtn.addEventListener('click', () => {
            targetWord = words[Math.floor(Math.random() * words.length)];
            currentGuess = '';
            currentRow = 0;
            message.textContent = '';
            
            // Reset grid
            grid.querySelectorAll('.woordle-cell').forEach(cell => {
                cell.textContent = '';
                cell.className = 'woordle-cell';
            });
            
            // Reset keyboard
            keyboard.querySelectorAll('.woordle-key').forEach(key => key.disabled = false);
        });

        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleEnter();
            else if (e.key === 'Backspace') handleBackspace();
            else if (/^[a-zA-Z]$/.test(e.key)) handleKeyPress(e.key.toUpperCase());
        });
    }

    initGame2099App(windowId) {
        const grid = document.getElementById('game-2099-grid');
        const scoreEl = document.getElementById('score-2099');
        const newGameBtn = document.getElementById('new-game-2099');
        
        let board = [];
        let score = 0;
        const size = 4;

        function initBoard() {
            board = Array(size).fill(null).map(() => Array(size).fill(0));
            addNewTile();
            addNewTile();
            render();
        }

        function addNewTile() {
            const empty = [];
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === 0) empty.push([i, j]);
                }
            }
            
            if (empty.length > 0) {
                const [r, c] = empty[Math.floor(Math.random() * empty.length)];
                board[r][c] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        function render() {
            grid.innerHTML = '';
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const cell = document.createElement('div');
                    cell.className = `game-2099-cell tile-${board[i][j]}`;
                    cell.textContent = board[i][j] === 0 ? '' : board[i][j];
                    grid.appendChild(cell);
                }
            }
            scoreEl.textContent = score;
        }

        function move(direction) {
            let moved = false;
            const newBoard = board.map(row => [...row]);

            if (direction === 'left' || direction === 'right') {
                for (let i = 0; i < size; i++) {
                    let row = newBoard[i].filter(x => x !== 0);
                    if (direction === 'right') row = row.reverse();
                    
                    for (let j = 0; j < row.length - 1; j++) {
                        if (row[j] === row[j + 1]) {
                            row[j] *= 2;
                            score += row[j];
                            row.splice(j + 1, 1);
                        }
                    }
                    
                    while (row.length < size) {
                        row.push(0);
                    }
                    
                    if (direction === 'right') row = row.reverse();
                    newBoard[i] = row;
                }
            } else {
                for (let j = 0; j < size; j++) {
                    let col = [];
                    for (let i = 0; i < size; i++) {
                        col.push(newBoard[i][j]);
                    }
                    
                    col = col.filter(x => x !== 0);
                    if (direction === 'down') col = col.reverse();
                    
                    for (let i = 0; i < col.length - 1; i++) {
                        if (col[i] === col[i + 1]) {
                            col[i] *= 2;
                            score += col[i];
                            col.splice(i + 1, 1);
                        }
                    }
                    
                    while (col.length < size) {
                        col.push(0);
                    }
                    
                    if (direction === 'down') col = col.reverse();
                    
                    for (let i = 0; i < size; i++) {
                        newBoard[i][j] = col[i];
                    }
                }
            }

            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] !== newBoard[i][j]) {
                        moved = true;
                        break;
                    }
                }
            }

            if (moved) {
                board = newBoard;
                addNewTile();
                render();
                
                if (board.flat().includes(2099)) {
                    setTimeout(() => alert('Congratulations! You reached 2099!'), 100);
                }
            }
        }

        function canMove() {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === 0) return true;
                    if (j < size - 1 && board[i][j] === board[i][j + 1]) return true;
                    if (i < size - 1 && board[i][j] === board[i + 1][j]) return true;
                }
            }
            return false;
        }

        // Controls
        document.addEventListener('keydown', (e) => {
            if (!canMove()) return;
            
            switch(e.key) {
                case 'ArrowUp': e.preventDefault(); move('up'); break;
                case 'ArrowDown': e.preventDefault(); move('down'); break;
                case 'ArrowLeft': e.preventDefault(); move('left'); break;
                case 'ArrowRight': e.preventDefault(); move('right'); break;
            }
        });

        // Touch buttons
        ['up', 'down', 'left', 'right'].forEach(dir => {
            document.getElementById(`${dir}-btn`).addEventListener('click', () => move(dir));
        });

        newGameBtn.addEventListener('click', () => {
            score = 0;
            initBoard();
        });

        initBoard();
    }

    initCalculatorApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        const display = windowEl.querySelector('#calc-display');
        const keys = windowEl.querySelectorAll('.calc-key');

        let firstValue = '';
        let operator = '';
        let secondValue = '';
        let shouldResetDisplay = false;

        function calculate() {
            const a = parseFloat(firstValue);
            const b = parseFloat(secondValue);
            if (isNaN(a) || isNaN(b)) return;

            let result = 0;
            switch (operator) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = b === 0 ? 'Error' : a / b; break;
                default: return;
            }
            display.textContent = result;
            firstValue = result.toString();
            operator = '';
            secondValue = '';
        }

        keys.forEach(key => {
            key.addEventListener('click', () => {
                const keyValue = key.dataset.key;
                
                if (!isNaN(parseInt(keyValue)) || keyValue === '.') { // Number or decimal
                    if (shouldResetDisplay) {
                        display.textContent = '';
                        shouldResetDisplay = false;
                    }
                    if (display.textContent === '0' && keyValue !== '.') {
                        display.textContent = keyValue;
                    } else if (keyValue === '.' && display.textContent.includes('.')) {
                        return; // Prevent multiple decimals
                    } else {
                        display.textContent += keyValue;
                    }
                } else if (['+', '-', '*', '/'].includes(keyValue)) { // Operator
                    if (firstValue && operator && display.textContent) {
                        secondValue = display.textContent;
                        calculate();
                    }
                    firstValue = display.textContent;
                    operator = keyValue;
                    shouldResetDisplay = true;
                } else if (keyValue === '=') { // Equals
                    if (firstValue && operator) {
                        secondValue = display.textContent;
                        calculate();
                        shouldResetDisplay = true;
                    }
                } else if (keyValue === 'c') { // Clear
                    display.textContent = '0';
                    firstValue = '';
                    operator = '';
                    secondValue = '';
                    shouldResetDisplay = false;
                }
            });
        });
    }

    minimizeApp(windowId) {
        const windowIndex = this.windows.findIndex(w => w.id === windowId);
        if (windowIndex > -1) {
            const window = this.windows[windowIndex];
            window.element.style.display = 'none';
            
            // Add to taskbar
            if (!this.minimizedApps.find(app => app.id === windowId)) {
                this.minimizedApps.push(window);
                this.renderTaskbarApps();
            }
        }
    }

    restoreApp(windowId) {
        const appIndex = this.minimizedApps.findIndex(app => app.id === windowId);
        if (appIndex > -1) {
            const app = this.minimizedApps[appIndex];
            app.element.style.display = 'flex';
            this.minimizedApps.splice(appIndex, 1);
            this.focusWindow(windowId);
            this.renderTaskbarApps();
        }
    }

    closeApp(windowId) {
        this.closeWindow(windowId);
        // Remove from taskbar if minimized
        const appIndex = this.minimizedApps.findIndex(app => app.id === windowId);
        if (appIndex > -1) {
            this.minimizedApps.splice(appIndex, 1);
            this.renderTaskbarApps();
        }
    }

    renderTaskbarApps() {
        const taskbar = document.querySelector('.taskbar');
        const existingApps = taskbar.querySelectorAll('.taskbar-app');
        existingApps.forEach(app => app.remove());
        
        // Remove arrow button if it exists
        const arrowBtn = taskbar.querySelector('.taskbar-arrow');
        if (arrowBtn) arrowBtn.remove();
        
        // Remove dropdown if it exists
        const dropdown = taskbar.querySelector('.taskbar-dropdown');
        if (dropdown) dropdown.remove();

        const maxVisible = 5; // Increased from 3 to 5 for expanded taskbar
        
        if (this.minimizedApps.length <= maxVisible) {
            // Show all apps directly in taskbar
            this.minimizedApps.forEach(app => {
                const appBtn = document.createElement('button');
                appBtn.className = 'taskbar-app';
                appBtn.innerHTML = `<span>${this.apps.find(a => a.id === app.appId)?.icon}</span>`;
                appBtn.title = this.apps.find(a => a.id === app.appId)?.name;
                appBtn.addEventListener('click', () => this.restoreApp(app.id));
                taskbar.insertBefore(appBtn, taskbar.querySelector('.system-tray'));
            });
        } else {
            // Show first 5 apps + arrow button for expanded taskbar
            for (let i = 0; i < maxVisible; i++) {
                const app = this.minimizedApps[i];
                const appBtn = document.createElement('button');
                appBtn.className = 'taskbar-app';
                appBtn.innerHTML = `<span>${this.apps.find(a => a.id === app.appId)?.icon}</span>`;
                appBtn.title = this.apps.find(a => a.id === app.appId)?.name;
                appBtn.addEventListener('click', () => this.restoreApp(app.id));
                taskbar.insertBefore(appBtn, taskbar.querySelector('.system-tray'));
            }

            // Create arrow button
            const arrowBtn = document.createElement('button');
            arrowBtn.className = 'taskbar-arrow';
            arrowBtn.innerHTML = '▾';
            arrowBtn.title = 'Show more apps';
            taskbar.insertBefore(arrowBtn, taskbar.querySelector('.system-tray'));

            // Create dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'taskbar-dropdown';
            dropdown.style.display = 'none';
            dropdown.style.maxHeight = '300px';
            dropdown.style.overflowY = 'auto';
            
            // Add remaining apps to dropdown
            this.minimizedApps.slice(maxVisible).forEach(app => {
                const appItem = document.createElement('div');
                appItem.className = 'taskbar-dropdown-item';
                appItem.innerHTML = `${this.apps.find(a => a.id === app.appId)?.icon} ${this.apps.find(a => a.id === app.appId)?.name}`;
                appItem.addEventListener('click', () => {
                    this.restoreApp(app.id);
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(appItem);
            });

            taskbar.appendChild(dropdown);

            // Arrow button click handler
            arrowBtn.addEventListener('click', () => {
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!arrowBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        }
    }

    startDrag(e, windowId) {
        e.preventDefault();
        this.activeWindow = windowId;
        const windowEl = document.getElementById(windowId);
        const rect = windowEl.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
        this.isDragging = true;
        
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
    }

    drag(e) {
        if (!this.isDragging || !this.activeWindow) return;
        
        const windowEl = document.getElementById(this.activeWindow);
        windowEl.style.left = (e.clientX - this.offsetX) + 'px';
        windowEl.style.top = (e.clientY - this.offsetY) + 'px';
    }

    stopDrag() {
        this.isDragging = false;
        this.activeWindow = null;
        document.removeEventListener('mousemove', this.drag.bind(this));
        document.removeEventListener('mouseup', this.stopDrag.bind(this));
    }

    focusWindow(windowId) {
        // Bring to front
        this.windows.forEach(w => {
            w.element.style.zIndex = w.id === windowId ? '1001' : '1000';
        });
    }

    closeWindow(windowId) {
        const index = this.windows.findIndex(w => w.id === windowId);
        if (index > -1) {
            const windowEl = this.windows[index].element;
            windowEl.remove();
            this.windows.splice(index, 1);
        }
    }

    updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        const hours12 = String(now.getHours() % 12 || 12).padStart(2, '0');

        // Animated desktop clock
        const desktopClock = document.getElementById('desktop-clock');
        if (desktopClock) {
            desktopClock.innerHTML = `
                <div class="time-display">
                    <span class="hours">${hours}</span>
                    <span class="colon">:</span>
                    <span class="minutes">${minutes}</span>
                    <span class="seconds">:${seconds}</span>
                </div>
                <div class="date-display">${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            `;
        }

        document.getElementById('lock-clock').textContent = `${hours}:${minutes}`;
        
        // Update taskbar wifi and battery
        this.updateSystemTray();
    }

    showDesktop() {
        const lockscreen = document.getElementById('lockscreen');
        const desktopScreen = document.getElementById('desktop-screen');
        
        if (this.currentScreen !== 'lockscreen') return;

        lockscreen.style.opacity = '0';
        
        setTimeout(() => {
            lockscreen.classList.remove('active');
            desktopScreen.classList.add('active');
            this.currentScreen = 'desktop';
        }, 300);
    }

    showLockscreen() {
        const lockscreen = document.getElementById('lockscreen');
        const desktopScreen = document.getElementById('desktop-screen');
        
        desktopScreen.classList.remove('active');
        lockscreen.classList.add('active');
        lockscreen.style.opacity = '1';
        this.currentScreen = 'lockscreen';
    }

    toggleSpotlight() {
        if (this.spotlightOpen) {
            this.closeSpotlight();
        } else {
            this.openSpotlight();
        }
    }

    openSpotlight() {
        this.spotlightOpen = true;
        document.getElementById('spotlight').classList.add('active');
        document.getElementById('spotlight-input').focus();
        this.handleSearch(''); // Show default results
    }

    closeSpotlight() {
        this.spotlightOpen = false;
        document.getElementById('spotlight').classList.remove('active');
        document.getElementById('spotlight-input').value = '';
        this.handleSearch(''); // Clear results
    }

    handleSearch(query) {
        const results = document.getElementById('search-results');
        results.innerHTML = '';
        const lowerQuery = query.toLowerCase().trim();
        
        if (lowerQuery === '') {
            // Show all apps and system commands when query is empty
            const filteredApps = this.apps.filter(app => 
                !['ping-pong', 'woordle', 'game-2099'].includes(app.id)
            );
            filteredApps.forEach(app => {
                this.createResultItem(app.icon, app.name, 'app', app.id);
            });
            this.systemCommands.forEach(cmd => {
                this.createResultItem(cmd.icon, cmd.name, 'command', cmd.name);
            });
            return;
        }

        // Search Apps
        const filteredApps = this.apps.filter(app => 
            app.name.toLowerCase().includes(lowerQuery)
        );
        filteredApps.forEach(app => {
            this.createResultItem(app.icon, app.name, 'app', app.id);
        });

        // Search System Commands
        const filteredCommands = this.systemCommands.filter(cmd =>
            cmd.name.toLowerCase().includes(lowerQuery)
        );
        filteredCommands.forEach(cmd => {
            this.createResultItem(cmd.icon, cmd.name, 'command', cmd.name);
        });

        // Search Files (Notes and Paintings)
        const notes = JSON.parse(localStorage.getItem('stratos-notes') || '{}');
        Object.keys(notes).forEach(id => {
            const note = notes[id];
            if (note.title.toLowerCase().includes(lowerQuery)) {
                this.createResultItem('📝', note.title, 'note', id);
            }
        });

        const paintings = JSON.parse(localStorage.getItem('stratos-paintings') || '{}');
        Object.keys(paintings).forEach(id => {
            const painting = paintings[id];
            if (painting.name.toLowerCase().includes(lowerQuery)) {
                this.createResultItem('🎨', painting.name, 'painting', id);
            }
        });
    }

    createResultItem(icon, text, type, id) {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `
            <span class="result-icon">${icon}</span>
            <span class="result-text">${text}</span>
            <span class="result-type">${type}</span>
        `;
        item.addEventListener('click', () => {
            switch (type) {
                case 'app':
                    this.openApp(id);
                    break;
                case 'command':
                    const command = this.systemCommands.find(cmd => cmd.name === id);
                    command?.action();
                    break;
                case 'note':
                    // This is a simplified way. Ideally, we'd open the specific note.
                    this.openApp('notes'); 
                    break;
                case 'painting':
                    const paintings = JSON.parse(localStorage.getItem('stratos-paintings') || '{}');
                    const painting = paintings[id];
                    if (painting) {
                        this.openApp('canvas', { data: painting.data });
                    }
                    break;
            }
            this.closeSpotlight();
        });
        document.getElementById('search-results').appendChild(item);
    }

    showWinver() {
        document.getElementById('winver-app').classList.add('active');
    }

    closeWinver() {
        document.getElementById('winver-app').classList.remove('active');
    }

    initTerminalApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        const inputEl = windowEl.querySelector('.terminal-input');
        const outputEl = windowEl.querySelector('.terminal-output');
        
        if (!inputEl || !outputEl) return;

        // Terminal state
        const terminal = {
            history: [],
            historyIndex: -1,
        };

        // Simplified commands
        const commands = {
            help: () => [
                'Available commands:',
                '  help     - Show this help message',
                '  clear    - Clear the terminal',
                '  echo [text] - Print text',
                '  date     - Show current date and time',
                '  whoami   - Show current user',
                '  uname    - Show system information',
                '  fortune  - Show a random fortune',
                '  neofetch - Show system info',
                '  exit     - Close terminal',
                '  shutdown - Turns the system off',
                '  restart  - Restarts the system',
                '  lock     - Locks the screen'
            ],

            clear: () => {
                outputEl.innerHTML = '';
                return [];
            },
            date: () => [new Date().toLocaleString()],
            whoami: () => ['user'],
            uname: () => ['Stratos OS 1.2.2 (Build 2025.12)'],
            echo: (args) => [args.join(' ')],
            fortune: () => {
                const fortunes = [
                    'The cloud is the limit!',
                    'Code like the wind.',
                    'Debug with purpose.',
                    'Commit early, commit often.',
                    'The terminal is your friend.',
                    'Keep it simple, keep it clean.',
                    'Every line of code is a choice.',
                    'Ship it!',
                    'Embrace the chaos.',
                    'Make it work, make it right, make it fast.'
                ];
                return [fortunes[Math.floor(Math.random() * fortunes.length)]];
            },
            neofetch: () => [
                '   __  __           _      _ _  ',
                '  / _|/ _| ___ _   _| | ___| | | ',
                ' | |_| |_ / _ \\ | | | |/ _ \\ | | ',
                ' |  _|  _|  __/ |_| | |  __/ | | ',
                ' |_| |_|  \\___|\\__, |_|\\___|_|_| ',
                '               |___/              ',
                '',
                'OS: Stratos OS 1.2.2',
                'Kernel: Stratos Kernel 1.1',
                'Uptime: ' + Math.floor(performance.now() / 3600000) + ' hours',
                'Shell: stratos-sh',
                'Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
                'Theme: Neubrutalist',
                'CPU: Stratosphere Quantum',
                'Memory: ' + Math.floor(Math.random() * 16 + 8) + 'GB',
                'Terminal: Stratos Terminal v1.1.0'
            ],
            exit: () => {
                this.closeWindow(windowId);
                return [];
            },
            shutdown: () => {
                addOutput('Shutting down Stratos OS...');
                setTimeout(() => this.shutdown(), 1000);
                return [];
            },
            restart: () => {
                addOutput('Restarting Stratos OS...');
                setTimeout(() => location.reload(), 1000);
                return [];
            },
            lock: () => {
                addOutput('Locking screen...');
                setTimeout(() => this.showLockscreen(), 500);
                return [];
            }
        };

        // Helper functions
        function addOutput(text) {
            const div = document.createElement('div');
            // Sanitize to prevent HTML injection from echo
            div.textContent = text;
            outputEl.appendChild(div);
            outputEl.scrollTop = outputEl.scrollHeight;
        }

        function executeCommand(cmd) {
            const parts = cmd.trim().split(' ');
            const command = parts[0].toLowerCase();
            const args = parts.slice(1);

            if (command === '') return;

            if (commands[command]) {
                try {
                    const result = commands[command](args);
                    if (Array.isArray(result)) {
                        result.forEach(addOutput);
                    } else if (result !== undefined) {
                        addOutput(result);
                    }
                } catch (error) {
                    addOutput(`Error: ${error.message}`);
                }
            } else {
                addOutput(`Command not found: ${command}`);
            }
        }

        // Event listeners
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = inputEl.value;
                addOutput(`user@stratos:~$ ${command}`);
                executeCommand(command);
                
                terminal.history.push(command);
                terminal.historyIndex = terminal.history.length;
                
                inputEl.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (terminal.historyIndex > 0) {
                    terminal.historyIndex--;
                    inputEl.value = terminal.history[terminal.historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (terminal.historyIndex < terminal.history.length - 1) {
                    terminal.historyIndex++;
                    inputEl.value = terminal.history[terminal.historyIndex] || '';
                } else {
                    terminal.historyIndex = terminal.history.length;
                    inputEl.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                // Basic tab completion
                const current = inputEl.value;
                const matches = Object.keys(commands).filter(cmd => cmd.startsWith(current));
                if (matches.length === 1) {
                    inputEl.value = matches[0];
                }
            }
        });

        inputEl.focus();
    }

    initStratosphereApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;
    
        const fileTreeEl = windowEl.querySelector(`#file-tree-${windowId}`);
        const tabsEl = windowEl.querySelector(`#editor-tabs-${windowId}`);
        const codeInput = windowEl.querySelector(`#code-input-${windowId}`);
        const lineNumbers = windowEl.querySelector(`#line-numbers-${windowId}`);
        const statusBar = windowEl.querySelector(`#statusbar-${windowId}`);
        const languageDisplay = windowEl.querySelector(`#language-display-${windowId}`);
        const runBtn = windowEl.querySelector(`#run-btn-${windowId}`);
        const previewFrame = windowEl.querySelector(`#preview-frame-${windowId}`);

        // Editor state
        let files = {
            'index.html': {
                content: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Stratos Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello, Stratosphere!</h1>
    <p>This is a live preview.</p>
    <button onclick="showAlert()">Click Me</button>
    <script src="script.js"></script>
</body>
</html>`,
                language: 'HTML'
            },
            'styles.css': {
                content: `body {
    font-family: sans-serif;
    background-color: #f0f0f0;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
}

h1 {
    color: #005c99;
}

button {
    padding: 10px 20px;
    border: 2px solid #005c99;
    background-color: #e6f7ff;
    color: #005c99;
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
}

button:hover {
    background-color: #005c99;
    color: white;
}`,
                language: 'CSS'
            },
            'script.js': {
                content: `function showAlert() {
    alert('Hello from your Stratosphere script!');
}`,
                language: 'JavaScript'
            }
        };
        let openTabs = [];
        let activeTab = null;

        const renderFileTree = () => {
            fileTreeEl.innerHTML = '';
            const icons = { 'html': '📄', 'css': '🎨', 'js': 'JS' };
            Object.keys(files).forEach(path => {
                const li = document.createElement('li');
                li.className = 'file-item';
                li.dataset.path = path;
                const lang = files[path].language.toLowerCase();
                li.innerHTML = `<span>${icons[lang] || '📄'} ${path}</span>`;
                li.addEventListener('click', () => openFile(path));
                fileTreeEl.appendChild(li);
            });
        };

        const renderTabs = () => {
            tabsEl.innerHTML = '';
            openTabs.forEach(path => {
                const tabEl = document.createElement('div');
                tabEl.className = `editor-tab ${path === activeTab ? 'active' : ''}`;
                tabEl.dataset.path = path;
                tabEl.innerHTML = `
                    ${path}
                    <span class="close-tab" data-path="${path}">×</span>
                `;
                tabEl.addEventListener('click', (e) => {
                    if (e.target.classList.contains('close-tab')) {
                        e.stopPropagation();
                        closeFile(path);
                    } else {
                        switchToFile(path);
                    }
                });
                tabsEl.appendChild(tabEl);
            });
        };

        const openFile = (path) => {
            if (!openTabs.includes(path)) {
                openTabs.push(path);
            }
            switchToFile(path);
        };
        
        const closeFile = (path) => {
            // Save before closing
            if (activeTab && files[activeTab]) {
                files[activeTab].content = codeInput.value;
            }

            const index = openTabs.indexOf(path);
            if (index > -1) {
                openTabs.splice(index, 1);
                if (activeTab === path) {
                    activeTab = openTabs[index] || openTabs[index - 1] || null;
                    if (activeTab) {
                        loadFileInEditor(activeTab);
                    } else {
                        codeInput.value = '';
                        codeInput.disabled = true;
                        updateLineNumbers();
                        updateStatusBar();
                    }
                }
                renderTabs();
            }
        };

        const switchToFile = (path) => {
            // Save current file before switching
            if (activeTab && files[activeTab]) {
                files[activeTab].content = codeInput.value;
            }
            activeTab = path;
            loadFileInEditor(path);
            renderTabs();
        };

        const loadFileInEditor = (path) => {
            const file = files[path];
            if (file) {
                codeInput.disabled = false;
                codeInput.value = file.content;
                activeTab = path;
                updateLineNumbers();
                updateStatusBar();
            }
        };
        
        const updateLineNumbers = () => {
            const lineCount = codeInput.value.split('\n').length;
            lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => i + 1).join('<br>');
            syncScroll();
        };
    
        const updateStatusBar = () => {
            if (!activeTab) {
                statusBar.children[0].textContent = 'Ready';
                languageDisplay.textContent = '';
                return;
            }
            const textLines = codeInput.value.substr(0, codeInput.selectionStart).split('\n');
            const line = textLines.length;
            const col = textLines[textLines.length - 1].length + 1;
            statusBar.children[0].textContent = `Line ${line}, Col ${col}`;
            languageDisplay.textContent = files[activeTab]?.language || '';
        };

        const syncScroll = () => {
            lineNumbers.scrollTop = codeInput.scrollTop;
        };

        const updatePreview = () => {
            // Save current file's content first
             if (activeTab && files[activeTab]) {
                files[activeTab].content = codeInput.value;
            }

            const html = files['index.html']?.content || '';
            const css = files['styles.css']?.content || '';
            const js = files['script.js']?.content || '';

            const srcDoc = `
                <html>
                    <head>
                        <style>${css}</style>
                    </head>
                    <body>
                        ${html}
                        <script>${js}<\/script>
                    </body>
                </html>
            `;
            
            previewFrame.srcdoc = srcDoc;
        };
        
        // Event Listeners
        codeInput.addEventListener('input', () => {
            if(activeTab) files[activeTab].content = codeInput.value;
            updateLineNumbers();
            updateStatusBar();
        });
        codeInput.addEventListener('scroll', syncScroll);
        
        const resizeObserver = new ResizeObserver(syncScroll);
        resizeObserver.observe(windowEl);

        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                var start = codeInput.selectionStart;
                var end = codeInput.selectionEnd;
                codeInput.value = codeInput.value.substring(0, start) +
                  "    " + codeInput.value.substring(end);
                codeInput.selectionStart = codeInput.selectionEnd = start + 4;
            }
            setTimeout(updateStatusBar, 0);
        });
        codeInput.addEventListener('click', updateStatusBar);
        
        runBtn.addEventListener('click', updatePreview);

        // Initial setup
        renderFileTree();
        codeInput.disabled = true;
        openFile('index.html');
        updatePreview();
    }
    
    initSettingsApp(windowId) {
        const windowEl = document.getElementById(windowId);
        if (!windowEl) return;

        // Data management buttons
        const exportBtn = windowEl.querySelector('#export-data');
        const importBtn = windowEl.querySelector('#import-data');
        const clearBtn = windowEl.querySelector('#clear-data');
        const aboutBtn = windowEl.querySelector('#show-about');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = {
                    notes: JSON.parse(localStorage.getItem('stratos-notes') || '{}'),
                    files: JSON.parse(localStorage.getItem('stratos-files') || '{}'),
                    paintings: JSON.parse(localStorage.getItem('stratos-paintings') || '{}')
                };
                
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'stratos-backup.json';
                a.click();
                URL.revokeObjectURL(url);
            });
        }

        if (importBtn) {
            importBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                const data = JSON.parse(e.target.result);
                                if (data.notes) localStorage.setItem('stratos-notes', JSON.stringify(data.notes));
                                if (data.files) localStorage.setItem('stratos-files', JSON.stringify(data.files));
                                if (data.paintings) localStorage.setItem('stratos-paintings', JSON.stringify(data.paintings));
                                this.showAlert('Import Successful', 'Data imported successfully! The system will now restart.', () => location.reload());
                            } catch (err) {
                                this.showAlert('Error', 'Error importing data: ' + err.message);
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                input.click();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.showConfirm('Clear All Data', 'Are you sure you want to clear ALL data? This action cannot be undone.', (confirmed) => {
                    if (confirmed) {
                        localStorage.removeItem('stratos-notes');
                        localStorage.removeItem('stratos-files');
                        localStorage.removeItem('stratos-paintings');
                        this.showAlert('Data Cleared', 'All data has been cleared. The system will now restart.', () => {
                            location.reload();
                        });
                    }
                });
            });
        }

        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                this.openApp('about');
                this.closeWindow(windowId);
            });
        }
    }

    shutdown() {
        // Show shutdown screen
        const shutdownScreen = document.getElementById('shutdown-screen');
        const lockscreen = document.getElementById('lockscreen');
        const desktopScreen = document.getElementById('desktop-screen');
        
        // Hide all screens
        lockscreen.classList.remove('active');
        desktopScreen.classList.remove('active');
        
        // Show shutdown screen
        shutdownScreen.style.display = 'flex';
        
        // Close all windows
        this.windows.forEach(window => {
            window.element.remove();
        });
        this.windows = [];
        this.minimizedApps = [];
        
        // Simulate shutdown process
        setTimeout(() => {
            // Hide shutdown screen
            shutdownScreen.style.display = 'none';
            
            // Show powered off screen
            const poweredOffScreen = document.getElementById('powered-off-screen');
            poweredOffScreen.style.display = 'flex';
        }, 3000);
    }

    powerOn() {
        const poweredOffScreen = document.getElementById('powered-off-screen');
        const loadingScreen = document.getElementById('loading-screen');
        const lockscreen = document.getElementById('lockscreen');
        
        // Hide powered off screen
        poweredOffScreen.style.display = 'none';
        
        // Show loading screen
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('hidden');
        
        // Simulate boot process
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            lockscreen.classList.add('active');
            this.currentScreen = 'lockscreen';
            
            // Reload the page to fully restart the system
            window.location.reload();
        }, 2000);
    }

    // Custom Modal Functions
    showAlert(title, message, callback) {
        const modal = document.getElementById('os-modal');
        document.getElementById('os-modal-title').textContent = title;
        document.getElementById('os-modal-message').textContent = message;
        
        document.getElementById('os-modal-input').style.display = 'none';
        document.getElementById('os-modal-cancel').style.display = 'none';

        modal.style.display = 'flex';

        const okBtn = document.getElementById('os-modal-ok');
        
        const listener = () => {
            cleanup();
            if (callback) callback();
        };

        const cleanup = () => {
            okBtn.removeEventListener('click', listener);
            modal.style.display = 'none';
        };

        okBtn.addEventListener('click', listener, { once: true });
    }

    showPrompt(title, message, defaultValue = '', callback) {
        const modal = document.getElementById('os-modal');
        document.getElementById('os-modal-title').textContent = title;
        document.getElementById('os-modal-message').textContent = message;

        const input = document.getElementById('os-modal-input');
        input.value = defaultValue;
        input.style.display = 'block';
        
        document.getElementById('os-modal-cancel').style.display = 'inline-block';
        
        modal.style.display = 'flex';
        input.focus();
        input.select();

        const okBtn = document.getElementById('os-modal-ok');
        const cancelBtn = document.getElementById('os-modal-cancel');
        
        const keydownListener = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                okBtn.click();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelBtn.click();
            }
        };

        const okListener = () => {
            cleanup();
            callback(input.value);
        };

        const cancelListener = () => {
            cleanup();
            callback(null);
        };

        const cleanup = () => {
            okBtn.removeEventListener('click', okListener);
            cancelBtn.removeEventListener('click', cancelListener);
            input.removeEventListener('keydown', keydownListener);
            modal.style.display = 'none';
        };
        
        okBtn.addEventListener('click', okListener, { once: true });
        cancelBtn.addEventListener('click', cancelListener, { once: true });
        input.addEventListener('keydown', keydownListener);
    }

    showConfirm(title, message, callback) {
        const modal = document.getElementById('os-modal');
        document.getElementById('os-modal-title').textContent = title;
        document.getElementById('os-modal-message').textContent = message;
        
        document.getElementById('os-modal-input').style.display = 'none';
        document.getElementById('os-modal-cancel').style.display = 'inline-block';

        modal.style.display = 'flex';

        const okBtn = document.getElementById('os-modal-ok');
        const cancelBtn = document.getElementById('os-modal-cancel');
        
        const okListener = () => {
            cleanup();
            if (callback) callback(true);
        };

        const cancelListener = () => {
            cleanup();
            if (callback) callback(false);
        };

        const cleanup = () => {
            okBtn.removeEventListener('click', okListener);
            cancelBtn.removeEventListener('click', cancelListener);
            modal.style.display = 'none';
        };

        okBtn.addEventListener('click', okListener, { once: true });
        cancelBtn.addEventListener('click', cancelListener, { once: true });
    }
}

// Initialize OS
document.addEventListener('DOMContentLoaded', () => {
    window.os = new StratosOS();
});