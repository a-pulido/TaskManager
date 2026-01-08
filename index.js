const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get("/register", (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form method="POST" action="/register">
      <input name="email" type="email" placeholder="Email" required />
      <br />
      <input name="password" type="password" placeholder="Password" required />
      <br />
      <button type="submit">Register</button>
    </form>
  `);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password required");
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, passwordHash],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res.status(400).send("Email already registered");
          }
          return res.status(500).send("Database error");
        }

        res.send("User registered successfully");
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


// const { createServer } = require('node:http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
