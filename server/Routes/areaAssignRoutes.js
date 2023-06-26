const async = require('async');
const express = require('express');
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");

const { db } = require("../Database/dbConfig");

const router = express.Router();

router.get('/get-allUser', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-allUser', req.myData)
  const urlNew = `CALL sp_all_user()`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: 'success', result: urlNew })
      res.send({ isSuccess: 'success', result: result[0] })
    }
  })
})

router.get('/get-areaAssignUser', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>get-areaAssignUser', req.myData)
  const urlNew = `CALL sp_areaAssign_user()`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: 'success', result: urlNew })
      res.send({ isSuccess: 'success', result: result[0] })
    }
  })
})

router.get('/edit-areaAssignUserById/:id', tokenCheck, async (req, res) => {
  console.log('>>>>>>>>>edit-areaAssignUserById')
  const userId = req.params.id
  const urlNew = `CALL sp_areaAssign_userPerId(${userId})`
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'error' })
    } else {
      console.log({ isSuccess: 'success', result: urlNew })
      res.send({ isSuccess: 'success', result: result[0] })
    }
  })
})
router.post('/add-assigneArea', tokenCheck, async (req, res) => {
    console.log('>>>>>add-assigneArea');
    try {
        const jsonDataAssignArea = JSON.stringify(req.body);
        console.log(jsonDataAssignArea, '>>>>>req.bodyadd-assigneArea');

        const sqlQuery = `CALL sp_assigned_area_perUser('${jsonDataAssignArea}')`;
        
        await db.query(sqlQuery, async (err, result) => {
            if (err) {
                console.log({ isSuccess: false, err });
                res.send({ isSuccess: false, result: 'error' });
            } else {
                console.log({ isSuccess: 'success', result: sqlQuery });
                res.send({ isSuccess: 'success', result: result[0] });
            }
        });
    } catch (error) {
        console.log(error);
    }
});



module.exports = router;