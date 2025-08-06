// App Registry
class AppRegistry {
    static getApps() {
        return [
            { name: 'Files', icon: '📁', id: 'files' },
            { name: 'Canvas', icon: '🎨', id: 'canvas' },
            { name: 'Settings', icon: '⚙️', id: 'settings' },
            { name: 'Calendar', icon: '🗓️', id: 'calendar' },
            { name: 'Browser', icon: '🌐', id: 'browser' },
            { name: 'Notes', icon: '📝', id: 'notes' },
            { name: 'Search', icon: '🔍', id: 'search' },
            { name: 'Store', icon: '🏪', id: 'store' },
            { name: 'About', icon: 'ℹ️', id: 'about' },
            { name: 'Terminal', icon: '⌨️', id: 'terminal' },
            { name: 'Calculator', icon: '🖩', id: 'calculator', description: 'Perform basic calculations' },
            { name: 'Stratosphere', icon: '👨‍💻', id: 'stratosphere', description: 'Code Editor' },
            { name: 'Ping Pong', icon: '🏓', id: 'ping-pong', description: 'Classic arcade game' },
            { name: 'Woordle', icon: '🎯', id: 'woordle', description: 'Word guessing game' },
            { name: '2099', icon: '🔢', id: 'game-2099', description: '2048 variant - reach 2099!' }
        ];
    }

    static getStoreApps() {
        return [
            { name: 'Ping Pong', icon: '🏓', id: 'ping-pong', description: 'Classic arcade game' },
            { name: 'Woordle', icon: '🎯', id: 'woordle', description: 'Word guessing game' },
            { name: '2099', icon: '🔢', id: 'game-2099', description: '2048 variant - reach 2099!' }
        ];
    }

    static getAppContent(appId) {
        const contents = {
            files: '<div class="app-content"><h3>Files</h3><p>Your file browser is ready.</p></div>',
            canvas: '<div class="app-content"><h3>Canvas</h3><p>Creative space for your ideas.</p></div>',
            settings: `
                <div class="app-content">
                    <div class="settings-container">
                        <h2>Settings</h2>
                        <div class="settings-section">
                            <h3>Appearance</h3>
                            <div class="setting-item">
                                <label>Accent Color:</label>
                                <div class="color-option active" data-color="#C1D7FF" style="background: #C1D7FF"></div>
                                <div class="color-option" data-color="#FF6B6B" style="background: #FF6B6B"></div>
                                <div class="color-option" data-color="#4ECDC4" style="background: #4ECDC4"></div>
                                <div class="color-option" data-color="#45B7D1" style="background: #45B7D1"></div>
                            </div>
                        </div>
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
            `,
            calendar: '<div class="app-content"><h3>Calendar</h3><p>Track your events and schedule.</p></div>',
            browser: '<div class="app-content"><h3>Browser</h3><p>Browse the web securely.</p></div>',
            notes: '<div class="app-content"><h3>Notes</h3><p>Quick notes and reminders.</p></div>',
            search: '<div class="app-content"><h3>Search</h3><p>Find anything on your system.</p></div>',
            store: this.getStoreContent(),
            terminal: this.getTerminalContent(),
            stratosphere: '<div class="app-content"><h3>Stratosphere Code Editor</h3><p>Coming soon...</p></div>',
            'ping-pong': this.getPingPongContent(),
            'woordle': this.getWoordleContent(),
            'game-2099': this.getGame2099Content(),
            about: '<div class="app-content"><div class="winver-brand"><h2>Stratos OS</h2><p>Version 1.20 (Build 2025.12)</p></div><div class="winver-section"><h4>System Information</h4><p><strong>Operating System:</strong> Stratos OS</p><p><strong>Version:</strong> 1.20</p><p><strong>Build:</strong> 2025.12</p><p><strong>Architecture:</strong> Universal</p><p><strong>Kernel:</strong> Stratos Kernel 1.0</p><p><strong>UI Framework:</strong> StratosUI</p></div><div class="winver-section"><h4>About Stratos</h4><p>Stratos OS is a modern operating system designed with a focus on minimalism, productivity, and aesthetic excellence. Featuring a unique blend of neubrutalist design principles and soft pastel aesthetics, Stratos provides a clean and efficient computing experience that stands out in today\'s landscape of overly complex interfaces.</p><p>Built from the ground up with the modern user in mind, Stratos emphasizes simplicity without sacrificing functionality. Every element has been carefully crafted to reduce cognitive load while maintaining visual delight.</p></div><div class="winver-section"><h4>Key Features</h4><ul><li>Neubrutalist design language with blue pastel accents</li><li>Universal binary support across all platforms</li><li>Integrated Spotlight search with double-Ctrl activation</li><li>Draggable, closable app windows</li><li>Minimal memory footprint</li><li>Zero-bloat philosophy</li></ul></div><div class="winver-section"><h4>Technology Stack</h4><p>Built with vanilla JavaScript, CSS Grid, and modern web standards. No external dependencies required for core functionality, ensuring maximum performance and compatibility across devices.</p></div><div class="winver-section"><h4>License & Copyright</h4><p><strong>© 2025 Stratos OS</strong></p><p>All rights reserved. Licensed under the MIT License.</p></div></div>'
        };
        return contents[appId] || '<div class="app-content">App not found</div>';
    }

    static getStoreContent() {
        const storeApps = this.getStoreApps();
        return `
            <div class="app-content store-container">
                <h2>Stratos Store</h2>
                <p>Discover and install new apps for your Stratos OS</p>
                
                <div class="store-grid">
                    ${storeApps.map(app => `
                        <div class="store-item" onclick="window.os.openApp('${app.id}')">
                            <div class="store-icon">${app.icon}</div>
                            <h3>${app.name}</h3>
                            <p>${app.description}</p>
                            <button class="store-btn">Play</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static getPingPongContent() {
        return `
            <div class="app-content ping-pong-app-content">
                <div class="ping-pong-container">
                    <div class="ping-pong-header">
                        <div class="score-display">
                            <span class="score-label">Player</span>
                            <span id="player-score" class="score-value">0</span>
                        </div>
                        <h2>Ping Pong</h2>
                        <div class="score-display">
                            <span class="score-label">AI</span>
                            <span id="ai-score" class="score-value">0</span>
                        </div>
                    </div>
                    <div class="ping-pong-game-area">
                        <canvas id="ping-pong-canvas" width="550" height="300"></canvas>
                    </div>
                    <div class="ping-pong-controls">
                        <button class="game-btn" id="start-ping-pong">▶ Start</button>
                        <button class="game-btn" id="reset-ping-pong">🔄 Reset</button>
                    </div>
                </div>
            </div>
        `;
    }

    static getWoordleContent() {
        return `
            <div class="app-content woordle-app-content">
                <div class="woordle-container">
                    <div class="woordle-header">
                        <h2>Woordle</h2>
                        <div id="woordle-message">Guess the 5-letter word!</div>
                    </div>
                    <div class="woordle-grid-container">
                        <div class="woordle-grid" id="woordle-grid"></div>
                    </div>
                    <div class="woordle-keyboard" id="woordle-keyboard"></div>
                    <div class="woordle-footer">
                        <button class="game-btn" id="new-word-btn">New Word</button>
                    </div>
                </div>
            </div>
        `;
    }

    static getGame2099Content() {
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

    static getTerminalContent() {
        return `
            <div class="app-content">
                <div class="terminal-container">
                    <div class="terminal-header">
                        <span>Terminal</span>
                        <button class="terminal-close" onclick="this.closest('.app-window').remove()">×</button>
                    </div>
                    <div class="terminal-body">
                        <div class="terminal-output" id="terminal-output">
                            <div>Stratos Terminal v1.0.0</div>
                            <div>Type 'help' for available commands</div>
                        </div>
                        <div class="terminal-input-line">
                            <span class="terminal-prompt">user@stratos:~$</span>
                            <input type="text" class="terminal-input" id="terminal-input" placeholder="Enter command..." autofocus>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}