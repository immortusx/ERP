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
  console.log(req.body,"asjdxfkclgh");

  const roleArr = req.body.role;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  // const branchRole = req.body.branchRole;
  const bankname = req.body.bankname;
  const bankBranch = req.body.bankBranch;
  const accountNo = req.body.accountNo;
  const accountType = req.body.accountType;
  const ifscCode = req.body.ifscCode;
  const bloodgroup = req.body.bloodgroup;
  const branchId = req.body.branchId;
  const role = req.body.selectedRole;
  const branch = req.body.branch;
  const selectedDate = moment(req.body.selectedDate).format("YYYY/MM/DD");
  const department = req.body.department;
  // const departmentId = 1;
  const user_type_id = 2;

  const hashedPassword = await hasThePass(password);

  try {
    const newResult = await queryDatabase(
      `SELECT * FROM users WHERE email = '${req.body.email}'`
    );

    if (newResult.length === 0) {
      const result = await queryDatabase(
        `INSERT INTO users(first_name, last_name, email, password, phone_number, bloodgroup, dob, user_type_id) VALUES('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phoneNumber}', '${bloodgroup}', '${selectedDate}', '${user_type_id}')`
      );

      const userId = result.insertId;

      // for (const branchId of Object.keys(branchRole)) {
      //   const rolesAr = branchRole[branchId];
      //   for (const roleId of rolesAr) {
      //     await queryDatabase(
      //       `INSERT INTO branch_department_user(branch_id, department_id, user_id, role_id) VALUES('${branchId}','${departmentId}','${userId}','${roleId}')`
      //     );
      //   }
      // }

      await queryDatabase(
        `INSERT INTO employee_detail (branch_id, department_id, user_id,role_id) VALUES('${branch}','${department}','${userId}','${role}')`
      );

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

router.get("/get-employee-details/:id", tokenCheck, async (req, res) => {
  const userId = req.params.id;
  console.log(req, " req");
  const urlNew = "SELECT * FROM employee_detail where id=" + userId;
  db.query(urlNew, async (err, result) => {
    console.log(result, "result");
    if (err) {
      console.log({ isSuccess: false, result: "emptyBranch" });
      res.send({ isSuccess: false, result: "emptyBranch" });
    } else {
      console.log({ isSuccess: true, result: urlNew });
      res.send({ isSuccess: true, result: result });
    }
  });
});

//===========get List of Employee================//
router.get("/get-employee-list", tokenCheck, async (req, res) => {
  try {
    await db.query(
      // `SELECT *
      // FROM users
      //  RIGHT JOIN bank_details ON users.id = bank_details.user_id
      // WHERE users.user_type_id = 2 and is_delete = 0`,


      `select f.*,s.user_id,s.bank_name,s.bank_branch,s.account_number,s.account_type,s.ifsc_code  from users f inner join bank_details as s on s.user_id = f.id  WHERE f.user_type_id = 2 and is_delete = 0`,

//       `SELECT
//     f.*,
//     s.user_id,
//     s.bank_name,
//     s.bank_branch,
//     s.account_number,
//     s.account_type,
//     s.ifsc_code,
//     (
//         SELECT CONCAT('[', GROUP_CONCAT(DISTINCT category_id), ']')
//         FROM area_assign_user
//         WHERE user_id = f.id
//     ) AS categories
// FROM
//     users f
// INNER JOIN bank_details AS s ON s.user_id = f.id
// WHERE
//     f.user_type_id = 2 AND f.is_delete = 0;`,

      // `select f.*,s.user_id,s.bank_name,s.bank_branch,s.account_number,s.account_type,s.ifsc_code , t.category_id from users f inner join bank_details as s on s.user_id = f.id left join area_assign_user as t on t.user_id = f.id WHERE f.user_type_id = 2 and is_delete = 0;`,
      (err, results) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: results });
          res.send({ isSuccess: true, result: results });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//============Edit Employee List==============//
router.post("/edit-employee", tokenCheck, async (req, res) => {
  console.log(">>>>>editemployeee");
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
  const branch = req.body.branch;
  const department = req.body.department;
  const role = req.body.selectedRole;
  const selectedDate = moment(req.body.selectedDate).format("YYYY/MM/DD");
  // const departmentId = 1;
  const user_type_id = 2;
  const id = req.body.id;
  const hashedPassword = await hasThePass(password);

  try {
    const result = await queryDatabase(
      `UPDATE users SET first_name = '${firstName}', last_name = '${lastName}', email = '${email}', password = '${hashedPassword}', phone_number = '${phoneNumber}', bloodgroup = '${bloodgroup}', dob = '${selectedDate}', user_type_id = '${user_type_id}' WHERE id = '${id}'`
    );

    const userId = result.insertId;

    // for (const branchId of Object.keys(branchRole)) {
    //   const rolesAr = branchRole[branchId];
    //   for (const roleId of rolesAr) {
    //     await queryDatabase(
    //       `UPDATE branch_department_user 
    //       SET branch_id = '${branchId}', 
    //           department_id = '${departmentId}', 
    //           user_id = '${id}', 
    //           role_id = '${roleId}' 
    //       WHERE user_id = '${id}'`
    //     );        
    //   }
    // }


await queryDatabase(
  `INSERT INTO employee_detail(branch_id, department_id, user_id,role_id) VALUES('${branch}','${department}','${userId}','${role}')`
);

    await queryDatabase(
      `UPDATE bank_details SET bank_name = '${bankname}', bank_branch = '${bankBranch}', account_number = '${accountNo}', account_type = '${accountType}', ifsc_code = '${ifscCode}' WHERE user_id = '${id}'`
    );

    console.log({ isSuccess: true, result: "success" });
    res.send({ isSuccess: true, result: "success" });
  } catch (error) {
    console.log({ isSuccess: false, result: error });
    res.send({ isSuccess: false, result: "error" });
  }
});

//=============Delete Employee=============//
router.get("/delete-employee/:id", tokenCheck, async (req, res) => {
  try {
    const employeeId = req.params.id;
    console.log(employeeId);
    const newUrl =
      "SELECT * FROM users where is_delete = 0 and id=" + employeeId;
    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else if (newResult.length === 1) {
        console.log(newResult.length, "true");
        const editurl = "UPDATE users SET is_delete = 1 WHERE id=" + employeeId;
        await db.query(editurl, async (err, result) => {
          if (err) {
            console.log({ isSuccess: false, result: err });
            res.send({ isSuccess: false, result: "error" });
          } else {
            res.send({ isSuccess: true, result: "deletesuccess" });
          }
        });
      } else {
        console.log(newResult.length, "false");
        console.log({ isSuccess: false, result: "notExist" });
        res.send({ isSuccess: false, result: "notExist" });
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
