const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static("public")); // serve your HTML page from public folder
app.use(express.json());

const filePath = path.join(__dirname, "comments.json");

// Load comments
app.get("/api/comments", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send("Error reading file.");
    res.json(JSON.parse(data));
  });
});

// Save new comment
app.post("/api/comments", (req, res) => {
  const { name, text, level } = req.body;
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send("Error reading file.");
    const comments = JSON.parse(data);
    comments.push({ name, text, level });
    fs.writeFile(filePath, JSON.stringify(comments, null, 2), err => {
      if (err) return res.status(500).send("Error writing file.");
      res.sendStatus(200);
    });
  });
});

// Delete a comment by index
app.post("/api/comments/delete", (req, res) => {
  const { index } = req.body;
  fs.readFile(filePath, (err, data) => {
    if (err) return res.status(500).send("Error reading file.");
    const comments = JSON.parse(data);
    comments.splice(index, 1);
    fs.writeFile(filePath, JSON.stringify(comments, null, 2), err => {
      if (err) return res.status(500).send("Error writing file.");
      res.sendStatus(200);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
