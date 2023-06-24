const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

//=====Add-Department======
router.post("/add-department", tokenCheck, async (req, res) => {
  const { name, description} = req.body;
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

//=====Get-department======
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


// ==== Delete department data By Id === //
router.post("/delete-department", tokenCheck, async (req, res) => {
  console.log(">>>>>/delete-department");
  try {
    const { id } = req.body;

    // const newUrl = "SELECT * FROM departments where  id=" + id;
    console.log('ghvgcgcfcf',id);
    // await db.query(newUrl, async (err, newResult) => {
    //   if (err) {
    //     console.log({ isSuccess: false, result: err });
    //     res.send({ isSuccess: false, result: "error" });
    //   }
    //   //  else if (newResult.length === 1) {

    //   //   const editurl = "UPDATE departments SET  id=" + id;
    //   //   await db.query(editurl, async (err, result) => {
    //   //     if (err) {
    //   //       console.log({ isSuccess: false, result: err })
    //   //       res.send({ isSuccess: false, result: 'error' })
    //   //     } else {

    //   //       res.send({ isSuccess: true, result: 'deletesuccess' })
    //   //     }
    //   //   })
    //   // }
    //   else {
    //     console.log(newResult);
    //     console.log({ isSuccess: false, result: "notExist" });
    //     res.send({ isSuccess: false, result: "notExist" });
    //   }
    // });
  } catch (e) {
    console.log(e);
  }
});


module.exports = router;
