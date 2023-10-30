const async = require("async");
const express = require("express");
const { tokenCheck } = require("../../Auth/TokenCheck");

const { db } = require('../../Database/dbConfig')

const router = express.Router();

router.post('/add-leave', tokenCheck, async (req, res) => {
  const { leaveType, startDate, endDate, reason, email } = req.body;

  const insertQuery = 'INSERT INTO leave_details (LeaveType, StartDate, EndDate, Reason, Email) VALUES (?, ?, ?, ?, ?)';
  const values = [leaveType, startDate, endDate, reason, email];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error inserting leave data: ' + err.message);
      res.json({ isSuccess: false, result: 'Failed to add leave' });
    } else {
      res.json({ isSuccess: true, result: 'Leave data inserted successfully' });
    }
  });

})


router.get('/getleaves', async (req, res) => {
  const selectQuery = 'SELECT * FROM leave_details';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching leave data: ' + err.message);
      res.json({ isSuccess: false, result: 'Failed to fetch leave data' });
    } else {
      res.json({ isSuccess: true, result: results });
    }
  });
});



module.exports = router;
