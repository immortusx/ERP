const express = require("express");
const async = require("async");

const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");

const { db } = require("../Database/dbConfig");

const router = express.Router();

//=====Add-Department======
router.post("/add-agency", tokenCheck, async (req, res) => {
  console.log("req.body", req.body);
  const { name, contact, email } = req.body;
  const addPartSql = `INSERT INTO configuration (configuration_setting, configuration_key, configuration_value) VALUES ('${name}','${contact}','${email}')`;

  try {
    await db.query(addPartSql);

    console.log({ isSuccess: true, result: "success" });
    res.send({ isSuccess: true, result: "success" });
  } catch (err) {
    console.log({ isSuccess: false, result: err });
    res.send({ isSuccess: false, result: "error" });
  }
});

module.exports = router;
