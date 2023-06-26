const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../../Auth/TokenCheck");
const { checkUserPermission } = require("../../../Auth/userPermission");

const { db } = require("../../../Database/dbConfig");

const router = express.Router();

//=====Add-category======
router.post("/add-category", tokenCheck, async (req, res) => {
  const { category_name, category_description, department } = req.body;
  const addPartSql =
    "INSERT INTO `enquiry_category` (category_name, category_description, department) VALUES (?,?,?)";

  await db.query(
    addPartSql,
    [category_name, category_description, department],
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

//=====Get-category======
router.get("/get-category-list", tokenCheck, async (req, res) => {
  try {
    await db.query(
      "SELECT * FROM enquiry_category where is_active = 1",
      (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: "error" });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: results });
          res.status(200).send({ isSuccess: true, result: results });
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
});

// ==== Delete category data By Id === //
router.post("/delete-category", tokenCheck, async (req, res) => {
  console.log(">>>>>/delete-category");
  try {
    const { id } = req.body;

    const newUrl = "SELECT * FROM enquiry_category where  id=" + id;
    console.log("ghvgcgcfcf", id);
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else if (newResult.length === 1) {
        const editurl =
          "UPDATE enquiry_category SET is_active = 0 WHERE  id=" + id;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            res.send({ isSuccess: true, result: "deletesuccess" });
          }
        });
      } else {
        console.log(newResult);
        console.log({ isSuccess: false, result: "notExist" });
        res.send({ isSuccess: false, result: "notExist" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
