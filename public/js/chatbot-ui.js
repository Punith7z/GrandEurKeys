/**
 * Grandeur Keys - AI Concierge UI Animations
 * Controls the sliding frosted-glass chat widget and typing animations
 */

class ChatbotUI {
    constructor() {
        this.launcher = document.getElementById('chatbotLauncher');
        this.container = document.getElementById('chatbotContainer');
        this.closeBtn = document.getElementById('chatbotClose');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.inputField = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.suggestionPills = document.querySelectorAll('.suggestion-pill');

        this.initEventListeners();
    }

    initEventListeners() {
        // Toggle chat panel visibility on bubble click
        if (this.launcher) {
            this.launcher.addEventListener('click', () => this.toggleChat());
        }

        // Close panel when close button is clicked
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeChat());
        }

        // Handle suggestion pill clicks
        if (this.suggestionPills) {
            this.suggestionPills.forEach(pill => {
                pill.addEventListener('click', (e) => {
                    const prompt = e.currentTarget.getAttribute('data-prompt');
                    if (prompt) this.handleSuggestionClick(prompt);
                });
            });
        }

        // Keep input focused on window resize or layout actions
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.container.classList.contains('hidden')) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        const isHidden = this.container.classList.toggle('hidden');
        if (!isHidden) {
            this.inputField.focus();
            this.scrollToBottom();
            this.launcher.style.transform = 'scale(0.9) rotate(90deg)';
        } else {
            this.launcher.style.transform = '';
        }
    }

    closeChat() {
        this.container.classList.add('hidden');
        this.launcher.style.transform = '';
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // Append outgoing message cleanly to screen
    addOutgoingMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message outgoing';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.escapeHTML(text)}
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // Append incoming message safely to screen
    addIncomingMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message incoming';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.formatMarkdown(text)}
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // Beautiful Apple-style "typing..." indicator placeholder
    showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'message incoming typing-placeholder';
        indicatorDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(indicatorDiv);
        this.scrollToBottom();
        return indicatorDiv;
    }

    removeTypingIndicator(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    handleSuggestionClick(prompt) {
        // Handover to prompt runner in our main chat.js script
        if (window.sendChatMessage) {
            window.sendChatMessage(prompt);
        }
    }

    escapeHTML(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Converts simple Markdown styles (**bold**) into pristine text layouts
    formatMarkdown(text) {
        let formatted = this.escapeHTML(text);
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    }
}

// Instantiate UI driver once DOM is fully populated
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotUI = new ChatbotUI();
});