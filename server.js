const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Student_info",
});
db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

app.post("/addStudent", (req, res) => {
  const {
    firstName,
    lastName,
    department,
    studentId,
    session,
    semester,
    bloodGroup,
    dateOfBirth,
    mobile,
    email,
    password,
    permanentAddress,
    parmanentAddress,
  } = req.body;
  const sql = `INSERT INTO students (firstName, lastName, department, studentId, session, semester, bloodGroup, dateOfBirth, mobile, email, password, permanentAddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  console.log(req.body);
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
    } else {
      db.query(
        sql,
        [
          firstName,
          lastName,
          department,
          studentId,
          session,
          semester,
          bloodGroup,
          dateOfBirth,
          mobile,
          email,
          hashedPassword,
          permanentAddress,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting student data:", err);
            res.status(500).json({ error: "Failed to add student" });
          } else {
            console.log("Student added successfully");
            res.status(200).json({ message: "Student added successfully" });
          }
        },
      );
    }
  });
});

app.get("/getstudents", (req, res) => {
  const sql = "SELECT * FROM students";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      res.status(500).json({ error: "Failed to fetch students" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/showstudents", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "showstudents.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
