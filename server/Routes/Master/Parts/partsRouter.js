const express = require('express');
const async = require('async');

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

//=====Add-Parts======
router.post('/add-parts', tokenCheck, async (req, res) => {
    const { name, part_no, description, hsn_no, is_active } = req.body;
    const addPartSql = "INSERT INTO `parts` (name, part_no, description, hsn_no, is_active) VALUES (?,?,?,?,?)"

    await db.query(addPartSql, [name, part_no, description, hsn_no, is_active], async (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: 'success' })
            res.send({ isSuccess: true, result: 'success' })
        }
    })
});

//=====Get-Parts======
router.get('/get-parts', tokenCheck, async (req, res) => {
    try{
        await db.query("SELECT * FROM parts", (err, results) => {
          if (err) {
              console.log({ isSuccess: false, result: 'error' })
              res.send({ isSuccess: false, result: 'error' })
          } else {
            results.map((re)=> {
                console.log(re.is_active,'is_active')
            })
              console.log({ isSuccess: true, result: results })
              res.status(200).send({ isSuccess: true, result: results })
          }
        })      
      }catch(e){
        console.log(e);
      }
});

// ======Update Parts======
router.post('/edit-parts/:id', tokenCheck, async (req, res) => {
    const editId = req.params.id
    const { name, part_no, description, hsn_no, is_active } = req.body;
    console.log(is_active,'>>........')
    const editPartSql = `UPDATE parts SET name = ?, part_no = ?, description = ?, hsn_no = ?, is_active = ? WHERE id = ${editId}`;

    await db.query(editPartSql, [name, part_no, description, hsn_no, is_active], async (err, result) => {
        if (err) {
            console.log({ isSuccess: false, result: err })
            res.send({ isSuccess: false, result: 'error' })
        } else {
            console.log({ isSuccess: true, result: 'success' })
            res.send({ isSuccess: true, result: 'success' })
        }
    })
});

module.exports = router;