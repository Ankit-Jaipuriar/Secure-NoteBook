const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5000", // Frontend origin
    credentials: true, // Allow cookies to be sent
  })
);

// Middleware for cookies
app.use(cookieParser());

// Registration Route
app.post("/api/register", async (req, res) => {
  let { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already exists. Please use another email." });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const createdUser = await userModel.create({
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ email }, "shhhhh");

    // Set a secure HTTP-only cookie
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    // Send success response
    res.status(201).send({ message: "User registered successfully", user: createdUser });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).send({ error: "Email already exists. Please use another email." });
    } else {
      // Handle other server errors
      res.status(500).send({ error: "Internal server error", details: error.message });
    }
  }
});
// Login Route
app.post("/api/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });

  if (!user) return res.status(404).send("User not found");

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) console.error("Error comparing passwords:", err);

    if (result) {
      let token = jwt.sign({ email: user.email }, "shhhh");
      res.cookie("token", token, { httpOnly: true });
      res.send("logged in");
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});


// Example of verifying the token on the backend
app.get('/api/verify-token', (req, res) => {
  const token = req.cookies.token; // Assuming the token is stored in cookies

  if (!token) {
    return res.status(401).send('Not authenticated');
  }

  try {
    // Verify the token (using a library like jwt.verify if using JWT)
    const decoded = jwt.verify(token, 'shhhh'); // Replace 'your-secret-key' with your actual secret
    res.status(200).send('Authenticated'); // Token is valid
  } catch (error) {
    res.status(401).send('Invalid token'); // Token is invalid or expired
  }
});


app.get("/api/logout", function(req,res){
  res.cookie("token"," "); 
  res.send("Logged out")
})

// Example API Route
app.get("/api/files", (req, res) => {
  const files = ["hisaab1.txt", "hisaab2.txt", "hisaab3.txt"];
  res.json(files);
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve React app for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server
app.listen(5000, () => {
  console.log("Backend server running on port 5000");
});
