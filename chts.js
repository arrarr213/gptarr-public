// Add this code to your existing JavaScript file
let isProcessing = false;

function addMessage(message, isUser) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    if (isProcessing) return;

    const apiKey = document.getElementById('api-key').value.trim();
    const userInput = document.getElementById('user-input').value.trim();
    const sendButton = document.getElementById('send-button');

    if (!apiKey) {
        alert('Please enter your OpenAI API key');
        return;
    }

    if (!userInput) return;

    isProcessing = true;
    sendButton.disabled = true;
    addMessage(userInput, true);
    document.getElementById('user-input').value = '';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: userInput
                }],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (response.ok) {
            const botResponse = data.choices[0].message.content;
            addMessage(botResponse, false);
        } else {
            addMessage(`Error: ${data.error.message}`, false);
        }
    } catch (error) {
        addMessage(`Error: ${error.message}`, false);
    } finally {
        isProcessing = false;
        sendButton.disabled = false;
    }
}

// Add Enter key support
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});