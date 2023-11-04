const async = require("async");
const express = require("express");
const { tokenCheck } = require("../../Auth/TokenCheck");

const { db } = require('../../Database/dbConfig')

const router = express.Router();

// router.post('/add-leave', tokenCheck, async (req, res) => {
//   const { leaveTypes, startDate, endDate, reason, email } = req.body;

//   const insertQuery = 'INSERT INTO leave_details (LeaveType, StartDate, EndDate, Reason, Email) VALUES (?, ?, ?, ?, ?)';
//   const values = [leaveTypes, startDate, endDate, reason, email];

//   db.query(insertQuery, values, (err, result) => {
//     if (err) {
//       console.error('Error inserting leave data: ' + err.message);
//       res.json({ isSuccess: false, result: 'Failed to add leave' });
//     } else {
//       res.json({ isSuccess: true, result: 'Leave data inserted successfully' });
//     }
//   });

// })
router.post('/add-leave', tokenCheck, async (req, res) => {
  const { leaveTypes, startDate, endDate, reason, email } = req.body;
  const userID = req.myData.userId;
  // 1. Change the function name to avoid conflicts.
  const getFullName = (callback) => {
    const userID = req.myData.userId;
    const sql = `SELECT CONCAT(u.first_name, ' ', u.last_name) AS full_name FROM users AS u WHERE u.id = ?`;
    // 2. Use parameterized queries to prevent SQL injection.
    db.query(sql, [userID], async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
      } else {
        const fullName = result[0].full_name;
        callback(fullName);
      }
    });
  };

  // 3. Move the insertQuery and values declaration inside the callback to ensure the full name is obtained first.
  getFullName((fullName) => {
    const insertQuery = 'INSERT INTO leave_details (userName,LeaveType, StartDate, EndDate, Reason, Email, user_id) VALUES (?,?, ?, ?, ?, ?, ?)';

    const values = [fullName,leaveTypes, startDate, endDate, reason, email, userID];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting leave data: ' + err.message);
        res.json({ isSuccess: false, result: 'Failed to add leave' });
      } else {
        res.json({ isSuccess: true, result: 'Leave data inserted successfully' });
      }
    });
  });
});



// router.get('/get-leave-details', async (req, res) => {
//   const selectQuery = 'CALL sp_get_leave_details()';

//   db.query(selectQuery, (err, results) => {
//     if (err) {
//       console.error('Error fetching leave data: ' + err.message);
//       res.json({ isSuccess: false, result: 'Failed to fetch leave data' });
//     } else {
//       res.json({ isSuccess: true, result: results });
//     }
//   });
// });

router.get("/get-leave-details", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-leave-details");
  const userId = req.myData.userId;
  let isAdmin = req.myData.isSuperAdmin;
  const urlNew = `CALL sp_get_leave_details(${userId},${isAdmin})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: result[0] });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});


router.get("/get-leave-type-list", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-leave-type-list");
  const id = req.params.id;
  const url = `SELECT * FROM leave_type`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

module.exports = router;
