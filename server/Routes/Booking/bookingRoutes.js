const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../Auth/TokenCheck");
const { checkUserPermission } = require("../../Auth/userPermission");
const { db } = require("../../Database/dbConfig");
const router = require("../usersRoutes");

const router = express.Router();

//==========Prodcuts Details=========//
router.get("/product-details", tokenCheck, async (req, res) => {
  try {
    await db.query(`SELECT * FROM enquiry_types`, (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: results });
        res.send({ isSuccess: true, result: results });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//===========Product-List by productId============//
router.get("/product-list/:id", tokenCheck, async (req, res) => {
  try {
    const id = req.params.id;
    await db.query(
      `SELECT * FROM products WHERE id = ${id}`,
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

//============For Price Details get tax type============//
router.get("/price-details", tokenCheck, async (req, res) => {
  try {
    await db.query(`SELECT * FROM tax_details`, (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: results });
        res.send({ isSuccess: true, result: results });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//================Get Down Payment(mode of payment)==============//
router.get("/getmodeofpayment", tokenCheck, async (req, res) => {
  try {
    await db.query(`SELECT * FROM down_payment`, (err, results) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: results });
        res.send({ isSuccess: true, result: results });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//==================Add Customer-Booking Details=============//
router.post("/addbooking", tokenCheck, async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      phone_number,
      email,
      state,
      district,
      taluka,
      village,
      products,
      price,
      down_payment,
      rto_details,
      consumer_skim,
      booking_date,
    } = req.body;

    const addCustomerSql = `INSERT INTO customers (first_name, middle_name, last_name, phone_number, email, state, district, taluka, village) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      addCustomerSql,
      [
        first_name,
        middle_name,
        last_name,
        phone_number,
        email,
        state,
        district,
        taluka,
        village,
      ],
      (err, customerResult) => {
        if (err) {
          console.log(err);
          res.send({ isSuccess: false, result: "Error" });
        } else {
          console.log({ isSuccess: true, result: customerResult });
          const customer_id = customerResult.insertId;

          const addBookingSql = `INSERT INTO booking (customer_id, products, price, down_payment, rto_details, consumer_skim, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;

          db.query(
            addBookingSql,
            [
              customer_id,
              products,
              price,
              down_payment,
              rto_details,
              consumer_skim,
              booking_date,
            ],
            (err, bookingResult) => {
              if (err) {
                console.log(err);
                res.send({ isSuccess: false, result: "Error" });
              } else {
                console.log({ isSuccess: true, result: bookingResult });
                res.send({ isSuccess: true, result: bookingResult });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.send({ isSuccess: false, result: "Error" });
  }
});

module.exports = router;
