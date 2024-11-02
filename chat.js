// Initialize Firebase and Firestore here
const db = getFirestore(app);

// Get the username from localStorage
const username = localStorage.getItem("username");
if (!username) {
    window.location.href = "login.html"; // Redirect to login if no username found
}

// Function to add messages to Firestore
const addMessage = async (messageText) => {
    try {
        await addDoc(collection(db, "messages"), {
            text: messageText,
            from: username, // Use the username from local storage
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

// Display messages in real-time
const messageContainer = document.getElementById("messages");
const messagesQuery = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(messagesQuery, (snapshot) => {
    messageContainer.innerHTML = ""; // Clear previous messages
    snapshot.forEach((doc) => {
        const msg = doc.data();
        const messageElement = document.createElement("div");
        messageElement.className = msg.from === username ? "message right" : "message left"; // Left or right side
        messageElement.textContent = `${msg.from}: ${msg.text}`; // Show username with message
        messageContainer.appendChild(messageElement);
    });
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
});

// Form submission to send messages
document.getElementById("message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("message-input");
    addMessage(messageInput.value); // Pass the input value directly
    messageInput.value = ""; // Clear input field
});
