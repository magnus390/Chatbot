import key from './config.js';

const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const apiKey = key;
const endpoint = "https://api.openai.com/v1/chat/completions";

async function sendMessage(message) {
    appendMessage(message, "user");

    userInput.disabled = true; // Disable input
    sendButton.disabled = true; // Disable send button

    // Show processing indicator
    appendMessage("Processing...", "processing");

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        })
    });

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    // Remove processing indicator
    chatContainer.removeChild(chatContainer.lastChild);

    const botLines = botMessage.split("\n");

    for (const line of botLines) {
        await appendMessageLetterByLetter(line, "bot");
        await new Promise(resolve => setTimeout(resolve, 200)); // Adjust the delay as needed
    }

    userInput.disabled = false; // Enable input
    sendButton.disabled = false; // Enable send button
}

async function appendMessageLetterByLetter(message, role) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", role);
    chatContainer.appendChild(messageDiv);

    const delay = 20; // Delay between each letter in milliseconds
    for (let i = 0; i < message.length; i++) {
        messageDiv.textContent += message[i];
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendMessage(message, role) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", role);
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendButton.addEventListener("click", () => {
    const message = userInput.value;
    console.log("Message = " + message);
    sendMessage(message);
    userInput.value = "";
});

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.shiftKey) {
        // Insert a new line in the textarea
        // userInput.value += "\n";
    } else if (event.key === "Enter") {
        // Prevent the default Enter behavior (submitting the form)
        event.preventDefault();
        sendButton.click(); // Trigger the Send button click
    }
});
