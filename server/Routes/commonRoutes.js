const async = require('async');
const express = require('express');
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");

const { db } = require("../Database/dbConfig");

const router = express.Router();


router.get('/get-state-list', tokenCheck, async (req, res) => {
    console.log('>>>>>get-state-list');
    const url = `select * from state where is_active !='0'`
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})
router.get('/get-district-list/:id', tokenCheck, async (req, res) => {
    console.log('>>>>>get-district-list');
    const id = req.params.id;
    const url = `SELECT * FROM district where state_id = ${id} and is_active= '1'`
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})
router.get('/get-taluka-list', tokenCheck, async (req, res) => {
    console.log('>>>>>get-taluka-list');
    const id = req.params.id;
    const url = `SELECT * FROM taluka where is_active= '1';`
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})
router.get('/get-village-list/:id', tokenCheck, async (req, res) => {
    console.log('>>>>>get-village-list');
    const id = req.params.id;
    const url = `SELECT * FROM village where taluka_id = ${id} and is_active= '1';`
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})


router.get('/get-task_types-list', tokenCheck, async (req, res) => {
    console.log('>>>>>/get-task_types-list');
    const id = req.params.id;
    const url = `SELECT * FROM task_types`;
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})
router.get('/get-tasks-list/:id', tokenCheck, async (req, res) => {
    console.log('>>>>>/get-tasks-list');
    const id = req.params.id;
    console.log(id, 'tasktypeid');
    const url = `SELECT * FROM tasks where tasktype_id=${id}`;
    await db.query(url, async (err, result) => {
        if (err) {
            console.log({ isSuccess: true, result: err })
            res.send({ isSuccess: true, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: url })
            res.send({ isSuccess: true, result: result })
        }
    })
})


module.exports = router;