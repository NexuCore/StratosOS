initNotesApp(windowId) {
    const windowEl = document.getElementById(windowId);
    if (!windowEl) return;

    // Notes app functionality
    let notes = JSON.parse(localStorage.getItem('stratos-notes')) || {
        welcome: {
            title: 'Welcome',
            content: 'Welcome to Stratos Notes! \n\nThis is your personal space to capture thoughts, ideas, and reminders.',
            date: new Date().toISOString()
        }
    };
    
    let currentNoteId = 'welcome';
    let autoSaveInterval;

    // Update the window header structure
    const header = windowEl.querySelector('.window-header');
    header.innerHTML = `
        <span class="window-title">Notes</span>
        <div class="notes-toolbar">
            <button class="notes-btn" id="new-note-btn">+ New</button>
            <button class="notes-btn" id="save-note-btn">Save</button>
            <button class="notes-btn" id="delete-note-btn">Delete</button>
        </div>
        <button class="window-close" data-window-id="${windowId}"></button>
    `;

    // Rest of the notes app code remains the same...
    const contentEl = windowEl.querySelector('.window-content');
    contentEl.innerHTML = `
        <div class="notes-container">
            <div class="notes-sidebar" id="notes-sidebar">
                <div class="note-item active" data-id="welcome">
                    <span class="note-title">Welcome</span>
                    <span class="note-date">${new Date().toLocaleDateString()}</span>
                </div>
            </div>
            <div class="notes-editor">
                <input type="text" id="note-title-input" placeholder="Note title..." value="Welcome">
                <textarea id="note-content-input" placeholder="Start typing...">Welcome to Stratos Notes! 

This is your personal space to capture thoughts, ideas, and reminders. 

Features:
- Auto-save every 2 seconds
- Persistent storage (local)
- Clean, minimal interface
- Keyboard shortcuts (Ctrl+N for new, Ctrl+S for save)

Try creating a new note or editing this one!</textarea>
            </div>
        </div>
    `;
    
    // Add event listeners
    const newBtn = windowEl.querySelector('#new-note-btn');
    const saveBtn = windowEl.querySelector('#save-note-btn');
    const deleteBtn = windowEl.querySelector('#delete-note-btn');

    newBtn.addEventListener('click', () => {
        const id = 'note-' + Date.now();
        notes[id] = {
            title: 'New Note',
            content: '',
            date: new Date().toISOString()
        };
        renderSidebar();
        loadNote(id);
        document.getElementById('note-title-input').focus();
    });

    saveBtn.addEventListener('click', saveNote);
    deleteBtn.addEventListener('click', deleteNote);
    
    document.getElementById('note-title-input').addEventListener('input', saveNote);
    document.getElementById('note-content-input').addEventListener('input', saveNote);
    
    // Auto-save every 2 seconds
    autoSaveInterval = setInterval(saveNote, 2000);

    function renderSidebar() {
        const sidebar = document.getElementById('notes-sidebar');
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
        document.getElementById('note-title-input').value = note.title || '';
        document.getElementById('note-content-input').value = note.content || '';
        
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === id);
        });
    }

    function saveNote() {
        if (currentNoteId) {
            notes[currentNoteId] = {
                title: document.getElementById('note-title-input').value || 'Untitled',
                content: document.getElementById('note-content-input').value,
                date: new Date().toISOString()
            };
            localStorage.setItem('stratos-notes', JSON.stringify(notes));
            renderSidebar();
        }
    }

    function deleteNote() {
        if (Object.keys(notes).length > 1) {
            delete notes[currentNoteId];
            const remainingIds = Object.keys(notes);
            currentNoteId = remainingIds[0];
            localStorage.setItem('stratos-notes', JSON.stringify(notes));
            renderSidebar();
            loadNote(currentNoteId);
        }
    }

    // Initial render
    renderSidebar();
    loadNote(currentNoteId);
}