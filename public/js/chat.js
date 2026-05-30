/**
 * Grandeur Keys - AI Chat Core Logic
 * Handles sending messages to the Express backend API and updating the UI
 */

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('chatbotSend');

    // Main message sending pipeline
    const triggerMessageSend = async () => {
        if (!inputField) return;
        const text = inputField.value.trim();
        if (!text) return;

        // Clear user input field immediately
        inputField.value = '';

        await window.sendChatMessage(text);
    };

    // Export sending function to global window scope so Suggestion Pills can trigger it
    window.sendChatMessage = async (messageText) => {
        if (!window.chatbotUI) return;

        // 1. Add user's message to the chat view
        window.chatbotUI.addOutgoingMessage(messageText);

        // 2. Display the elegant "typing..." indicator
        const typingIndicator = window.chatbotUI.showTypingIndicator();

        try {
            // 3. Post prompt to our backend local API route
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });

            if (!response.ok) {
                throw new Error('Grandeur API network error encountered.');
            }

            const data = await response.json();

            // 4. Remove typing indicator and print response
            window.chatbotUI.removeTypingIndicator(typingIndicator);

            if (data && data.reply) {
                window.chatbotUI.addIncomingMessage(data.reply);
            } else {
                window.chatbotUI.addIncomingMessage("I'm sorry, I was unable to connect with my central database. Please try again in a moment.");
            }

        } catch (error) {
            console.error('Chatbot API communication failure:', error);
            window.chatbotUI.removeTypingIndicator(typingIndicator);
            window.chatbotUI.addIncomingMessage("I'm experiencing a connection issue. Rest assured, our premium concierge services remain active. Please refresh or try again soon.");
        }
    };

    // Attach event listener for the Send Button
    if (sendButton) {
        sendButton.addEventListener('click', triggerMessageSend);
    }

    // Attach event listener for the 'Enter' key press
    if (inputField) {
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                triggerMessageSend();
            }
        });
    }
});