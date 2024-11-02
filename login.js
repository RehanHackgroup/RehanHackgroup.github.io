// Admin credentials (new hashed password)
const storedUsername = "SwiftByte"; // Updated admin username
const storedPasswordHash = "$2a$10$BnXQGrXU3COF.Eb9sAQNceZ8m9U87QImXBvtnDp9Kh0uGz/JwMg4K"; // Updated hash for "@swiftbytead"

// Function to validate login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Check for admin login
  if (username === storedUsername) {
    const passwordMatch = await bcrypt.compare(password, storedPasswordHash);
    
    if (passwordMatch) {
      document.getElementById("login-status").innerText = "Admin login successful!";
      // Redirect to chat page
      window.location.href = "chat.html";
    } else {
      document.getElementById("login-status").innerText = "Invalid password.";
    }
  } else {
    // Regular user login
    localStorage.setItem("username", username); // Store user username in localStorage
    document.getElementById("login-status").innerText = "User login successful!";
    // Redirect to chat page
    window.location.href = "chat.html";
  }
});
