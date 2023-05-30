const express = require('express');
const async = require('async');

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

// =======Add Tax========
router.post('/addtax', tokenCheck, async (req, res) => {
    const { tax, percentage, slabrate } = req.body;
    const addTaxSql = "INSERT INTO `taxes` (tax, percentage, slabrate) VALUES (?,?,?)"

    await db.query(addTaxSql, [tax, percentage, slabrate], async (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: 'success' })
            res.send({ isSuccess: true, result: 'success' })
        }
    })
});

//========Get Tax=========
router.get('/gettax', tokenCheck, async (req, res) => {
    try {
        await db.query('SELECT * FROM taxes', (err, results) => {
            if (err) {
                console.log({ isSuccess: false, result: 'error' })
                res.send({ isSuccess: false, result: results })
            } else {
                console.log({ isSuccess: true, result: results })
                res.status(200).send({ isSuccess: true, result: results })
            }
        })
    } catch (err) {
        console.log(err)
    }
})

// =====Update Tax=========
router.post('/edittax/:id', tokenCheck, async (req, res) => {
    const editID = req.params.id;
    const { tax, percentage, slabrate } = req.body;
    const editTaxSql = `UPDATE taxes SET tax = ?, percentage = ?, slabrate = ? WHERE id=${editID}`;
    db.query(editTaxSql, [tax, percentage, slabrate], async (err, results) => {
        if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
        }else {
            console.log({isSuccess: true, result: results})
            res.status(200).send({isSuccess: true, result: results})
        }
    })
})


module.exports = router;