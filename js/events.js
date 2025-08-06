// Event Manager
class EventManager {
    constructor(os) {
        this.os = os;
        this.clickSound = new Audio('/click_upd.mp3');
    }

    playClickSound() {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(() => {});
    }

    setupAll() {
        this.setupUnlock();
        this.setupStartMenu();
        this.setupSpotlight();
        this.setupKeyboard();
        this.setupAppLibrary();
        this.setupClickSounds();
        this.setupPowerOn();
        this.setupWSOD();
    }

    setupClickSounds() {
        // Add click sounds to all buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .app-icon, .taskbar-app, .notes-control-btn, .files-toolbar-btn, .game-btn, .woordle-key, .calendar-btn, .browser-btn')) {
                this.playClickSound();
            }
        });

        // Add click sound for opening apps
        document.addEventListener('click', (e) => {
            if (e.target.matches('.app-icon, .result-item, .store-btn') || 
                (e.target.parentElement && e.target.parentElement.matches('.app-icon'))) {
                this.playClickSound();
            }
        });

        // Special handling for window close buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.window-close, .winver-close, .close-btn')) {
                this.playClickSound();
            }
        });
    }

    setupWSOD() {
        document.getElementById('restart-from-wsod-btn').addEventListener('click', () => {
            // No click sound for this, it's a crash screen
            location.reload();
        });
    }

    setupUnlock() {
        document.getElementById('unlock-btn').addEventListener('click', () => {
            this.playClickSound();
            this.os.showDesktop();
        });
    }

    setupStartMenu() {
        const startBtn = document.getElementById('start-btn');
        const appLibrary = document.getElementById('app-library');
        
        startBtn.addEventListener('click', () => {
            this.playClickSound();
            appLibrary.classList.toggle('active');
        });
    }

    setupSpotlight() {
        // Spotlight close button
        document.getElementById('spotlight-close').addEventListener('click', () => {
            this.playClickSound();
            this.os.closeSpotlight();
        });

        // Close spotlight when clicking outside
        document.getElementById('spotlight').addEventListener('click', (e) => {
            if (e.target === document.getElementById('spotlight')) {
                this.playClickSound();
                this.os.closeSpotlight();
            }
        });

        // Spotlight search functionality
        const input = document.getElementById('spotlight-input');
        input.addEventListener('input', (e) => {
            this.os.handleSearch(e.target.value);
        });

        // Add keyboard navigation
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.os.closeSpotlight();
            }
        });
    }

    setupWinver() {
        // This is now obsolete as about is a regular window.
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Enter key for unlock
            if (e.key === 'Enter' && this.os.currentScreen === 'lockscreen') {
                e.preventDefault();
                this.playClickSound();
                this.os.showDesktop();
            }

            // Spotlight with double Ctrl
            if (e.key === 'Control') {
                this.os.ctrlPressed++;
                if (this.os.ctrlPressed === 1) {
                    this.os.ctrlTimeout = setTimeout(() => {
                        this.os.ctrlPressed = 0;
                    }, 500);
                } else if (this.os.ctrlPressed === 2) {
                    e.preventDefault();
                    clearTimeout(this.os.ctrlTimeout);
                    this.os.ctrlPressed = 0;
                    this.playClickSound();
                    this.os.toggleSpotlight();
                }
            }

            // Close spotlight with Escape
            if (e.key === 'Escape' && this.os.spotlightOpen) {
                this.playClickSound();
                this.os.closeSpotlight();
            }

            // Open 'About' with win + r
            if (e.key === 'r' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                this.playClickSound();
                this.os.openApp('about');
            }
        });
    }

    setupAppLibrary() {
        const appLibrary = document.getElementById('app-library');
        const lockBtn = document.getElementById('lock-btn');
        const restartBtn = document.getElementById('restart-btn');
        const shutdownBtn = document.getElementById('shutdown-btn');
        
        // Close app library when clicking outside
        appLibrary.addEventListener('click', (e) => {
            if (e.target === appLibrary) {
                this.playClickSound();
                appLibrary.classList.remove('active');
            }
        });

        // Power controls
        lockBtn.addEventListener('click', () => {
            this.playClickSound();
            this.os.showLockscreen();
            appLibrary.classList.remove('active');
        });

        restartBtn.addEventListener('click', () => {
            this.playClickSound();
            location.reload();
        });

        shutdownBtn.addEventListener('click', () => {
            this.playClickSound();
            this.os.shutdown();
        });

        // Add app library listeners
        document.querySelectorAll('.app-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                this.playClickSound();
                const appName = icon.querySelector('span').textContent.toLowerCase();
                
                // Special handling for search app
                if (appName === 'search') {
                    this.os.toggleSpotlight();
                    appLibrary.classList.remove('active');
                    return;
                }

                const app = this.os.apps.find(a => a.name.toLowerCase() === appName);
                if (app) {
                    this.os.openApp(app.id);
                    appLibrary.classList.remove('active');
                }
            });
        });
    }

    setupPowerOn() {
        document.getElementById('power-on-btn').addEventListener('click', () => {
            this.playClickSound();
            window.os.powerOn();
        });
    }
}