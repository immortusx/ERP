const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

//=====Add-Department======
router.post("/add-department", tokenCheck, async (req, res) => {
  const { name, part_no, description, hsn_no, is_active } = req.body;
  const addPartSql =
    "INSERT INTO `departments` (name, description) VALUES (?,?)";

  await db.query(
    addPartSql,
    [name,description],
    async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.send({ isSuccess: true, result: "success" });
      }
    }
  );
});

//=====Get-Parts======
router.get("/get-department-list", tokenCheck, async (req, res) => {
  try {
    await db.query("SELECT * FROM departments", (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: "error" });
        res.send({ isSuccess: false, result: "error" });
      } else {
        
        console.log({ isSuccess: true, result: results });
        res.status(200).send({ isSuccess: true, result: results });
      }
    });
  } catch (e) {
    console.log(e);
  }
});



module.exports = router;
