const express = require("express");
const app = express();
const cors = require("cors");
const client = require("./databasepg");

app.use(cors());
app.use(express.json());

// *Create Api students Post Data Normal

// app.post("/students", async (req, res) => {
//   try {
//     const { firstname, lastname, gender } = req.body;
//     const queryText =
//       "INSERT INTO students (firstname, lastname, gender) VALUES ($1, $2, $3) RETURNING *";
//     const values = [firstname, lastname, gender];
//     const newTodo = await client.query(queryText, values);
//     return res
//       .status(200)
//       .json({
//         success: true,
//         message: "Record updated successfully",
//         records: newTodo.rows[0],
//       });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

// *Create Api students Post Data Conditional

app.post("/students", async (req, res) => {
  try {
    let { firstname, lastname, gender } = req.body;
    firstname =
      firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();
    lastname =
      lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
    gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    if (!firstname || !lastname || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingStudent = await client.query(
      "SELECT * FROM students WHERE firstname = $1 AND lastname = $2 AND gender = $3",
      [firstname, lastname, gender]
    );
    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ error: "Student already exists" });
    }
    const queryText =
      "INSERT INTO students (firstname, lastname, gender) VALUES ($1, $2, $3) RETURNING *";
    const values = [firstname, lastname, gender];
    const newStudent = await client.query(queryText, values);

    return res.status(200).json({
      success: true,
      message: "Record inserted successfully",
      records: newStudent.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Create Api students Get Data

app.get("/studentsData", async (req, res) => {
  try {
    const queryText = "SELECT * FROM students";
    const result = await client.query(queryText);
    return res.json({results:result.rows});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create Api students Get Data by id

app.get("/studentsData/:id", async (req, res) => {
  console.log("req", req.params);
  const studentId = req.params.id;
  try {
    const queryText = "SELECT * FROM students WHERE id = $1";
    const result = await client.query(queryText, [studentId]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Student not found" });
    } else {
        res.json({ results : result.rows[0] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Api students Get Data by First Name

// app.get("/studentsDataSearch/:firstname", async (req, res) => {
//   let firstname = req.params.firstname;

//   try {
//     const queryText = "SELECT * FROM students WHERE firstname = $1";
//     const result = await client.query(queryText, [firstname]);
//     if (result.rows.length === 0) {
//       res.status(404).json({ message: "No Data found" });
//     } else {
//       res.json(result.rows);
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Create Api students Get Data by Single Char or First Name

app.get("/studentsDataChar/:firstname", async (req, res) => {
  const firstname = req.params.firstname;
  try {
    const queryText = `SELECT * FROM students WHERE firstname ILIKE $1`;
    const result = await client.query(queryText, [`%${firstname}%`]);
    if (result.rows.length === 0) {
      res.status(200).json({ results:[],message: "No Data found" });
    } else {
      res.json({results:result.rows});
    }
  } catch (error) {
    // res.status(500).json({ error: error.message });
  }
});

// Create Api students Get Data by pagination offset

app.get("/studentsDataSet", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    const queryText = `SELECT * FROM students LIMIT $1 OFFSET $2`;
    const result = await client.query(queryText, [pageSize, offset]);
    return res.json({
      currentPage: page,
      totalPages: Math.ceil(result.rowCount / pageSize),
      results: result.rows,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create Api students Update Data by id

app.put("/studentsDataUpdate/:id", async (req, res) => {
  const studentId = req.params.id;
  const { firstname, lastname, gender } = req.body;

  try {
    const queryText =
      "UPDATE students SET firstname = $1, lastname = $2, gender = $3 WHERE id = $4 RETURNING *";
    const result = await client.query(queryText, [
      firstname,
      lastname,
      gender,
      studentId,
    ]);

      if (result.rows.length === 0) {
          res.status(404).json({ results:[], message: "Data not found" });
      } else {
          res.json({results:result.rows[0]});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Api students Delete Data by id

app.delete("/studentsDataDelete/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const queryText = "DELETE FROM students WHERE id = $1 RETURNING *";
    const result = await client.query(queryText, [studentId]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Data not found" });
    } else {
      res.json({ message: "Data deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
