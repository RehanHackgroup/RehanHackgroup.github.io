// Import the Firebase functions you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVRMHhV4iSykKYYF49BeYPbklTgpzg6dQ",
  authDomain: "local-chats-8b325.firebaseapp.com",
  databaseURL: "https://local-chats-8b325-default-rtdb.firebaseio.com",
  projectId: "local-chats-8b325",
  storageBucket: "local-chats-8b325.appspot.com",
  messagingSenderId: "215947954649",
  appId: "1:215947954649:web:effd8cc0a634fe09d3b1c8",
  measurementId: "G-XSJJS1MG5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to display messages in real-time
const displayMessages = () => {
  const messagesQuery = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(messagesQuery, (snapshot) => {
    const messageContainer = document.getElementById("messages");
    messageContainer.innerHTML = ""; // Clear previous messages
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const messageElement = document.createElement("div");
      messageElement.className = msg.from === "user" ? "message right" : "message left"; // Set class based on user type
      messageElement.textContent = `${msg.username}: ${msg.text}`; // Include username
      messageContainer.appendChild(messageElement);
    });
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
  });
};

// Call displayMessages function to start listening for new messages
displayMessages();

// Function to add messages to Firestore
const addMessage = async (messageText, username) => {
  try {
    await addDoc(collection(db, "messages"), {
      text: messageText,
      username: username, // Include the username with the message
      from: "user",      // Indicate who sent the message
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Form submission to send messages
document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = document.getElementById("message-input");
  const usernameInput = document.getElementById("username-input"); // Assuming you have a username input
  addMessage(messageInput.value, usernameInput.value); // Pass the input values directly
  messageInput.value = ""; // Clear input field
});
