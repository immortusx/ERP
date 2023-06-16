const express = require("express");
const async = require("async");
const moment = require("moment");
const { tokenCheck } = require("../Auth/TokenCheck");
const { checkUserPermission } = require("../Auth/userPermission");
const { hasThePass, compareTheHass } = require("../Auth/Bcrypt");

const { db } = require("../Database/dbConfig");

const router = express.Router();

//================addEmployee===============//
router.post("/add-employee", tokenCheck, async (req, res) => {
  console.log(">>>>>employee");
  console.log(req.body);

  const roleArr = req.body.role;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const branchRole = req.body.branchRole;
  const bankname = req.body.bankname;
  const bankBranch = req.body.bankBranch;
  const accountNo = req.body.accountNo;
  const accountType = req.body.accountType;
  const ifscCode = req.body.ifscCode;
  const bloodgroup = req.body.bloodgroup;
  const selectedDate = moment(req.body.selectedDate).format("YYYY/MM/DD");
  const departmentId = 1;

  const hashedPassword = await hasThePass(password);

  try {
    const newResult = await queryDatabase(
      `SELECT * FROM users WHERE email = '${req.body.email}'`
    );

    if (newResult.length === 0) {
      const result = await queryDatabase(
        `INSERT INTO users(first_name, last_name, email, password, phone_number, bloodgroup, dob) VALUES('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phoneNumber}', '${bloodgroup}', '${selectedDate}')`
      );

      const userId = result.insertId;

      for (const branchId of Object.keys(branchRole)) {
        const rolesAr = branchRole[branchId];
        for (const roleId of rolesAr) {
          await queryDatabase(
            `INSERT INTO branch_department_user(branch_id, department_id, user_id, role_id) VALUES('${branchId}','${departmentId}','${userId}','${roleId}')`
          );
        }
      }

      await queryDatabase(
        `INSERT INTO bank_details (bank_name, bank_branch, account_number, account_type, ifsc_code, user_id) VALUES('${bankname}','${bankBranch}','${accountNo}','${accountType}','${ifscCode}','${userId}')`
      );

      console.log({ isSuccess: true, result: "success" });
      res.send({ isSuccess: true, result: "success" });
    } else {
      console.log({ isSuccess: false, result: "alreadyExist" });
      res.send({ isSuccess: false, result: "alreadyExist" });
    }
  } catch (error) {
    console.log({ isSuccess: false, result: error });
    res.send({ isSuccess: false, result: "error" });
  }
});

async function queryDatabase(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

//===========get List of Employee================//
router.get("/get-employee-list", tokenCheck, async (req, res) => {
  try {
    await db.query(`SEL`)
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
