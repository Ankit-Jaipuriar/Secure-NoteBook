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

  bcrypt.genSalt(10, (err, salt) => {
    if (err) console.error("Error generating salt:", err);

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) console.error("Error hashing password:", err);

      let createdUser = await userModel.create({
        email,
        password: hash,
      });
      let token = jwt.sign({ email }, "shhhhh");
      res.cookie("token", token, { httpOnly: true }); // Ensure secure cookie handling
      res.send(createdUser);
    });
  });
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
