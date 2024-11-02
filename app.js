import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app);

const messageContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");
const usernameForm = document.getElementById("username-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "adminpassword";
let username = "";
let isAdmin = false;

const addMessage = async (messageText) => {
  try {
    await addDoc(collection(db, "messages"), {
      text: messageText,
      from: username,
      isAdmin: isAdmin,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const deleteMessage = async (messageId) => {
  try {
    await deleteDoc(doc(db, "messages", messageId));
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

const messagesQuery = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(messagesQuery, (snapshot) => {
  messageContainer.innerHTML = "";
  snapshot.forEach((doc) => {
    const msg = doc.data();
    const messageElement = document.createElement("div");
    messageElement.className = msg.isAdmin ? "message admin" : msg.from === username ? "message right" : "message left";
    messageElement.textContent = `${msg.from}: ${msg.text}`;

    if (isAdmin) {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", () => deleteMessage(doc.id));
      messageElement.appendChild(deleteButton);
    }

    messageContainer.appendChild(messageElement);
  });
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (messageInput.value.trim() === "") return;
  addMessage(messageInput.value);
  messageInput.value = "";
});

usernameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (username === "") {
    alert("Please enter a username.");
    return;
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    isAdmin = true;
  } else if (password !== "") {
    alert("Incorrect username or password for admin.");
    return;
  }

  document.getElementById("auth-container").style.display = "none";
  document.getElementById("chat-container").style.display = "flex";
});
