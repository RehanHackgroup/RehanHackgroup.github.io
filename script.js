// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let userId = null;

// Authenticate user anonymously
firebase.auth().signInAnonymously().then((user) => {
  userId = user.user.uid;
  console.log("User signed in with ID:", userId);
}).catch((error) => {
  console.error("Authentication error:", error);
});

// Function to add message to Firestore
const addMessage = (message) => {
  db.collection("messages").add({
    userId: userId,
    text: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
};

// Display messages in real-time
const messageContainer = document.getElementById("messages");
db.collection("messages").orderBy("timestamp")
  .onSnapshot((snapshot) => {
    messageContainer.innerHTML = ""; // Clear previous messages
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const messageElement = document.createElement("div");
      messageElement.textContent = msg.userId === userId ? `You: ${msg.text}` : `User: ${msg.text}`;
      messageContainer.appendChild(messageElement);
    });
    // Scroll to the bottom for new messages
    messageContainer.scrollTop = messageContainer.scrollHeight;
  });

// Form submission to send messages
document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("message-input");
  addMessage(messageInput.value);
  messageInput.value = ""; // Clear input field
});
