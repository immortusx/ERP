const express = require('express');
const { tokenCheck } = require("../Auth/TokenCheck");
const { db } = require("../Database/dbConfig");
const moment = require('moment')
const router = express.Router();


router.get('/get-branch-data', async (req, res) => {
  console.log('>>>>>get-branch-data');
  const url = `SELECT * FROM branches WHERE is_active != 0`;
  await db.query(url, async (err, getBranchs) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'err ' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: getBranchs })
    }
  })
})

router.post('/add-new-branch', async (req, res) => {
  console.log('>>>>>add-new-branch');
  console.log('req.body', req.body)
  var cdate = moment().format('YYYY-MM-DD H:m:s');
  console.log('cdate', cdate)

  const url = `INSERT INTO branches(name, mobile_number,email_id,address,code,create_date,gst_number,description,contact_person,state,district,taluka) VALUES('${req.body.firmName}','${req.body.mobileNumber}','${req.body.email}','${req.body.address}','${req.body.code}','${cdate}','${req.body.gstNumber}','${req.body.description}','${req.body.contactPerson}',${req.body.state},${req.body.district},${req.body.taluka})`;

  await db.query(url, async (err, getBranchs) => {
    console.log('getBranchs', getBranchs)
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'err' })
    } else {

      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: 'success' })
    }
  })
})
router.post('/edit-branch-details', async (req, res) => {
  console.log('>>>>>edit-branch-details');
  console.log('req.body', req.body)
  // var cdate = moment().format('YYYY-MM-DD H:m:s');
  // console.log('cdate', cdate)
  const url = `UPDATE branches SET name='${req.body.firmName}',mobile_number='${req.body.mobileNumber}',email_id='${req.body.email}',address='${req.body.address}',code='${req.body.code}',gst_number='${req.body.gstNumber}',description='${req.body.description}',contact_person='${req.body.contactPerson}' ,state='${req.body.state}',district='${req.body.district}',taluka='${req.body.taluka}' WHERE id = ${req.body.id}`;
  // const url = `UPDATE branches (name, mobile_number,email_id,address,code,create_date,gst_number,description) VALUES('${req.body.firmName}','${req.body.mobileNumber}','${req.body.email}','${req.body.address}','${req.body.code}','${cdate}','${req.body.gstNumber}','${req.body.description}')`;
  console.log('url', url)

  await db.query(url, async (err, updateData) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'err' })
    } else {

      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: 'success' })
    }
  })
})
router.get('/delete-branch/:id', async (req, res) => {
  console.log('>>>>>delete-branch');
  console.log('req.params', req.params.id)
  const url = `UPDATE branches SET is_active = '0' WHERE id = '${req.params.id}'`;
  // console.log('url', url)

  await db.query(url, async (err, updateData) => {
    if (err) {
      console.log({ isSuccess: false, result: err })
      res.send({ isSuccess: false, result: 'err' })
    } else {
      console.log({ isSuccess: true, result: url })
      res.send({ isSuccess: true, result: 'success' })
    }
  })
})


module.exports = router;