const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");

const { db } = require("../Database/dbConfig");

const router = express.Router();

router.get("/get-state-list", tokenCheck, async (req, res) => {
  console.log(">>>>>get-state-list");
  const url = `select * from state where is_active !='0'`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});
router.get("/get-district-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-district-list");
  const id = req.params.id;
  const url = `SELECT * FROM district where state_id = ${id} and is_active= '1'`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});
router.get("/get-taluka-list", tokenCheck, async (req, res) => {
  console.log(">>>>>get-taluka-list");
  const id = req.params.id;
  const url = `SELECT * FROM taluka where is_active= '1';`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});
router.get("/get-village-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-village-list");
  const id = req.params.id;
  const url = `SELECT * FROM village where taluka_id = ${id} and is_active= '1';`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

//=====================Retrieve Assigned Sale Person===================//
router.get(
  "/retrieve-area-assigned-person/:category/:village",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/retrieve-area-assigned-person");
    try {
      const CategoryId = req.params.category;
      const villageId = req.params.village;
      const url = `CALL sp_retrieve_sales_person(${villageId}, ${CategoryId})`;

      db.query(url, [villageId, CategoryId], async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: result });
          res.status(200).json({ isSuccess: true, result: result[0] });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ isSuccess: false, result: "error" });
    }
  }
);

module.exports = router;
