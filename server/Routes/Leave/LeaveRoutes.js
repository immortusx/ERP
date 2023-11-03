const async = require("async");
const express = require("express");
const { tokenCheck } = require("../../Auth/TokenCheck");

const { db } = require('../../Database/dbConfig')

const router = express.Router();

router.post('/add-leave', tokenCheck, async (req, res) => {
  const { leaveTypes, startDate, endDate, reason, email } = req.body;

  const insertQuery = 'INSERT INTO leave_details (LeaveType, StartDate, EndDate, Reason, Email) VALUES (?, ?, ?, ?, ?)';
  const values = [leaveTypes, startDate, endDate, reason, email];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error inserting leave data: ' + err.message);
      res.json({ isSuccess: false, result: 'Failed to add leave' });
    } else {
      res.json({ isSuccess: true, result: 'Leave data inserted successfully' });
    }
  });

})


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
  const urlNew = `CALL sp_get_leave_details()`;
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
  console.log(id, "jdfffffffssssssssssssss")
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
