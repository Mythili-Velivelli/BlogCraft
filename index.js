import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    DATABASE_URL: process.env.PG_DATABASE_URL,
  // host: process.env.PG_HOST,
  // database: process.env.PG_DATABASE,
  // password: process.env.PG_PASSWORD,
  // port: Number(process.env.PG_PORT),
});


// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// GET home page - fetch all posts
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id DESC");
    console.log("Fetched:", result.rows);
    res.render("index", { posts: result.rows });
  } catch (err) {
    console.log("Trying to fetch posts...");
    res.status(500).send("Can't send the posts to browser");
  }
});

// GET new post page
app.get("/new", (req, res) => {
  res.render("modify", { heading: "Create a new Post", submit: "Publish" });
});

// POST create new post
app.post("/submit", async (req, res) => {
  const { title, content } = req.body;
  const date = new Date().toDateString();
  try {
    await pool.query(
      "INSERT INTO posts (title, content, date) VALUES ($1, $2, $3)",
      [title, content, date]
    );
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error saving post");
  }
});

// GET edit post page
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    const post = result.rows[0];
    res.render("modify", {
      heading: "Edit Post",
      submit: "Update",
      post: post,
    });
  } catch (err) {
     res.status(500).send("Error fetching post for edit");
  }
});

// POST update post
app.post("/update/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;
  try {
    await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
      [title, content, id]
    );
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error updating post");
  }
});

// POST delete post
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting post");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

