const express = require("express");
const async = require("async");

const { tokenCheck } = require("../../Auth/TokenCheck");
const { checkUserPermission } = require("../../Auth/userPermission");
const { db } = require("../../Database/dbConfig");

const router = express.Router();

//==========Prodcuts Details=========//
router.get("/product-details", tokenCheck, async (req, res) => {
  try {
    await db.query(`SELECT * FROM enquiry_category`, (err, results) => {
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

//==================Add Customer-Booking Details=============//
router.post("/addbooking", tokenCheck, async (req, res) => {
  console.log(req.body,'body');
  try {
    const {
      first_name,
      last_name,
      phone_number,
      whatsapp_number,
      email,
      state,
      city,
      district,
      taluka,
      village,
      products,
      model,
      price,
      down_payment,
      payment_mode,
      booking_date,
      delivery_date,
      type_of_use,
      rto_tax,
      rto_passing,
      insurance,
      agent_fee,
    } = req.body;

    const addCustomerSql = `INSERT INTO customers (first_name, last_name, phone_number, whatsapp_number, email, state,city,district, taluka, village) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      addCustomerSql,
      [
        first_name,
        last_name,
        phone_number,
        whatsapp_number,
        email,
        state,
        city,
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

          const addBookingSql = `INSERT INTO booking (customer_id, products,model,price, down_payment, payment_mode, booking_date, delivery_date, type_of_use) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?)`;

          db.query(
            addBookingSql,
            [
              customer_id,
              products,
              model,
              price,
              down_payment,
              payment_mode,
              booking_date,
              delivery_date,
              type_of_use,
            ],
            (err, bookingResult) => {
              if (err) {
                console.log(err);
                res.send({ isSuccess: false, result: "Error" });
              } else {
                console.log({ isSuccess: true, result: bookingResult });
                res.send({ isSuccess: true, result: bookingResult });
                const booking_id = bookingResult.insertId;
                const addRtoDetails = `INSERT INTO rto_detail (booking_id, rto_tax, rto_passing, insurance, agent_fee) VALUES (?,?,?,?,?)`;

                db.query(
                  addRtoDetails,
                  [booking_id, rto_tax, rto_passing, insurance, agent_fee],
                  (err, rtoResults) => {
                    if (err) {
                      console.log(err);
                      res.send({ isSuccess: false, result: "Error" });
                    }
                    {
                      console.log({ isSuccess: true, result: 'success' });
                      res.send({ isSuccess: true, result: 'Booking Successfully' });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log({isSuccess: false, result: 'failed'});
    res.send({ isSuccess: false, result: "Booking Failed" });
  }
});

module.exports = router;
