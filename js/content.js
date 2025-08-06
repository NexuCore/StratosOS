// Content Factory for app contents
class ContentFactory {
    static getAboutContent() {
        return `
            <div class="app-content">
                <div class="winver-brand">
                    <h2>Stratos OS</h2>
                    <p>Version 1.22 (Build 2025.12)</p>
                </div>
                
                <div class="winver-section">
                    <h4>System Information</h4>
                    <p><strong>Operating System:</strong> Stratos OS</p>
                    <p><strong>Version:</strong> 1.22</p>
                    <p><strong>Build:</strong> 2025.12</p>
                    <p><strong>Architecture:</strong> Universal</p>
                    <p><strong>Kernel:</strong> Stratos Kernel 1.1</p>
                    <p><strong>UI Framework:</strong> StratosUI</p>
                </div>
                
                <div class="winver-section">
                    <h4>About Stratos</h4>
                    <p>Stratos OS is a modern operating system designed with a focus on minimalism, productivity, and aesthetic excellence.</p>
                </div>
                
                <div class="winver-section">
                    <h4>Key Features</h4>
                    <ul>
                        <li>Neubrutalist design language with blue pastel accents</li>
                        <li>Universal binary support across all platforms</li>
                        <li>Integrated Spotlight search with double-Ctrl activation</li>
                        <li>Draggable, closable app windows</li>
                        <li>Minimal memory footprint</li>
                        <li>Zero-bloat philosophy</li>
                    </ul>
                </div>
                
                <div class="winver-section">
                    <h4>License & Copyright</h4>
                    <p><strong>© 2025 Stratos OS</strong></p>
                    <p>All rights reserved. Licensed under the MIT License.</p>
                </div>
            </div>
        `;
    }
}