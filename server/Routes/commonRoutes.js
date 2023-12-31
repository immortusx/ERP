const async = require("async");
const express = require("express");
const { tokenCheck } = require("../Auth/TokenCheck");
const { getDateInFormate } = require("../Utils/timeFunctions");

const { db } = require("../Database/dbConfig");
const uploadFile = require("../Utils/multerMiddaeware");
const path = require("path");

const fs = require("fs");
const csv = require("fast-csv");
const {
  sendTaskAssignmentNotification,
} = require("../Utils/instantEnquiryCommunitor");
const router = express.Router();
const moment = require("moment");
const cron = require("node-cron");

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
  const url = `SELECT * FROM taluka where is_active= '1'`;
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
router.get("/get-taluka-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>get-taluka-list");
  const id = req.params.id;
  const url = `SELECT * FROM taluka where district_id = ${id} and is_active= '1'`;
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
  console.log(">>>>>get-village-listbyid");
  const id = req.params.id;
  const url = `SELECT * FROM village where taluka_id = ${id} and is_active= '1'`;
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

//===========================For add Task======================================

router.get("/get-task_types-list", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-task_types-list");
  const id = req.params.id;
  const url = `SELECT * FROM task_types`;
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

router.get("/get-tasks-list/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-tasks-list");
  const id = req.params.id;
  console.log(id, "tasktypeid");
  const url = `SELECT * FROM tasks where tasktype_id=${id}`;
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

router.get("/get-tasktimeperiod-list", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-tasktimeperiod-list");
  const id = req.params.id;
  const url = `SELECT * FROM tasktime_period`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.get("/get-taskstatus-list", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-taskstatus-list");
  const id = req.params.id;
  const url = `SELECT * FROM task_status`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.post("/addholiday-data", tokenCheck, async (req, res) => {
  try {
    console.log("/addtask-data>>>>>>>>>>>>", req.body);
    const holidayname = req.body.holidayname;
    const description = req.body.description;

    const holiday_date = req.body.holiday_date.split("T")[0];

    const url = `INSERT INTO holiday_data (holidayname,holiday_date, description) VALUES (?,?,?)`;

    console.log("url", url);

    try {
      await db.query(url, [holidayname, holiday_date, description]);
      console.log({ isSuccess: true, result: "Task Add Successfully" });
    } catch (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
      return;
    }

    res.send({ isSuccess: true, result: "Task Add Successfully" });
  } catch (err) {
    console.log(err);
  }
});
router.post("/addtask-data", tokenCheck, async (req, res) => {
  try {
    console.log("/addtask-data>>>>>>>>>>>>", req.body);
    const employees = req.body.employees;
    const taskType = req.body.taskTypes;
    const tasks = req.body.tasks;
    const taskCount = req.body.taskCount;
    const tasktypePeriod = req.body.tasktimePeriod;
    const taskStatus = req.body.taskStatus;
    const taskCategory = req.body.taskCategory;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    const url = `INSERT INTO addtask_data (employee, tasktype, task, taskcount, startdate, enddate,tasktime_period,task_status,category_name) VALUES (?,?,?,?,?,?,?,?,?)`;

    console.log("url", url);

    for (const item of employees) {
      console.log(item, "item");

      try {
        await db.query(url, [
          item,
          taskType,
          tasks,
          taskCount,
          startDate,
          endDate,
          tasktypePeriod,
          taskStatus,
          taskCategory,
        ]);
        console.log({ isSuccess: true, result: "Task Add Successfully" });
      } catch (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
        return;
      }
    }

    res.send({ isSuccess: true, result: "Task Add Successfully" });
    sendTaskAssignmentNotification(employees);
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-holiday-list", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>get-holiday-list");
    const id = req.params.id;
    const query = "SELECT * FROM holiday_data";

    await db.query(query, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.status(200).json({ isSuccess: true, result: result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.get("/get-holiday/:id", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>get-holiday");
    const id = req.params.id;
    const query = "SELECT * FROM holiday_data WHERE id = ?";

    await db.query(query, [id], async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.status(200).json({ isSuccess: true, result: result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.post("/update-holidayStatus", async (req, res) => {
  console.log(">>>>>update-taskstatus", req.body);
  const holidayname = req.body.holidayname;
  const description = req.body.description;

  const holiday_date = req.body.holiday_date.split("T")[0];
  const id = req.body.id;
  sql = `UPDATE holiday_data SET holidayname = '${holidayname}', holiday_date = '${holiday_date}',description = '${description}' WHERE id = ${id};`;
  await db.query(sql, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: "Success" });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.get("/delete-holidayStatus/:id", async (req, res) => {
  console.log(">>>>>delete-holidayStatus", req.params);
  const id = req.params.id;
  sql = `DELETE  FROM holiday_data  WHERE id = ${id}`;
  await db.query(sql, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: "Success" });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.get("/get-task-list", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>>get-task-list");
  const urlNew = `CALL sp_get_task_list()`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: result[0] });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});

router.post("/set-task-edit/:id", tokenCheck, async (req, res) => {
  console.log(">>>>>set-task-edit", req.body);
  try {
    const EmployeeId = req.params.id;
    const employees = req.body.employees;
    const taskType = req.body.taskTypes;
    const tasks = req.body.tasks;
    const taskCount = req.body.taskCount;
    const tasktypePeriod = req.body.tasktimePeriod;
    const taskStatus = req.body.taskStatus;
    const taskCategory = req.body.taskCategory;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const newUrl = `UPDATE addtask_data SET employee = '${employees}', tasktype = '${taskType}', task = '${tasks}', taskcount = '${taskCount}', startdate = '${startDate}', enddate = '${endDate}', tasktime_period = ${tasktypePeriod}, task_status=${taskStatus}, category_name=${taskCategory} WHERE id = '${EmployeeId}'`;

    await db.query(newUrl, async (err, newResult) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.status(200).json({ isSuccess: true, result: "success" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.get("/get-addtask/:id", tokenCheck, async (req, res) => {
  try {
    console.log(">>>>>get-addtask");
    const id = req.params.id;
    const query = "SELECT * FROM addtask_data WHERE id = ?";

    await db.query(query, [id], async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.status(500).json({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: true, result: "success" });
        res.status(200).json({ isSuccess: true, result: result });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isSuccess: false, result: "error" });
  }
});

router.get("/delete-taskassign/:id", async (req, res) => {
  try {
    console.log(">>>>> delete-taskassign");
    console.log("req.params", req.params.id);
    const id = req.params.id;
    await db.query(
      `DELETE FROM addtask_data WHERE id = ${id}`,
      async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: "Task Deleted" });
          res.send({ isSuccess: true, result: "success" });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    // res.status(500).send({ isSuccess: false, result: "Internal Server Error" });
  }
});
router.get("/update-taskstatus/:id/:newStatus", async (req, res) => {
  console.log(">>>>>update-taskstatus");
  const newStatus = req.params.newStatus;
  const id = req.params.id;
  sql = `UPDATE addtask_data SET task_status = ${newStatus} WHERE id = ${id};`;
  await db.query(sql, async (err, result) => {
    if (err) {
      console.log({ isSuccess: true, result: err });
      res.send({ isSuccess: true, result, result: err });
    } else {
      console.log({ isSuccess: true, result: sql });
      res.send({ isSuccess: true, result: "success" });
    }
  });
});

//=====================Retrieve User Task List======================//
router.get("/get-user-task-list", tokenCheck, async (req, res) => {
  console.log(">>>>>>>>/get-user-task-list", req.myData);
  const userId = req.myData.userId;
  let isAdmin = req.myData.isSuperAdmin;
  const urlNew = `CALL sp_get_user_task_list_by_user(${userId}, ${isAdmin})`;
  await db.query(urlNew, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: "success", result: urlNew });
      res.send({ isSuccess: "success", result: result[0] });
    }
  });
});

// ========================task assign employee list============================//

router.get(
  "/get-task-assign-employee-list/:startDate/:endDate",
  tokenCheck,
  async (req, res) => {
    // console.log(">>>>>>>>/get-task-assign-employee-list", req.myData);
    const userId = req.myData.userId;
    let isAdmin = req.myData.isSuperAdmin;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    console.log(startDate, endDate, "ekti");
    const urlNew = `CALL sp_get_task_assign_employee_list(${userId}, ${isAdmin}, '${startDate}', '${endDate}')`;

    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: "error" });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] });
      }
    });
  }
);

//=====================get user-task-by-UserId========================//

router.get(
  "/get-user-task-by-UserId/:id/:startDate/:endDate",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>>>>/get-user-task-list", req.myData);
    const userId = req.myData.userId;
    let isAdmin = req.myData.isSuperAdmin;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const id = req.params.id;
    console.log(startDate, endDate, id, "eotjjjjjjjjjjjjjj");
    const urlNew = `CALL sp_get_user_task_by_UserId(${id}, ${isAdmin}, '${startDate}', '${endDate}')`;
    await db.query(urlNew, async (err, result) => {
      if (err) {
        console.log({ isSuccess: false, result: err });
        res.send({ isSuccess: false, result: "error" });
      } else {
        console.log({ isSuccess: "success", result: urlNew });
        res.send({ isSuccess: "success", result: result[0] }); // Send the entire result
      }
    });
  }
);

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

//=======================Get Work Report (EmployeeList)============================//
router.get("/get-employee-work-report", tokenCheck, async (req, res) => {
  console.log(">>>>>get-employee-work-report");
  try {
    const url = `CALL sp_get_work_report()`;
    db.query(url, async (err, result) => {
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
});

//=======================Get Work Report Details============================//
router.get(
  "/get-work-report-details/:userId/:taskTypeId/:taskId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/get-work-report-details");
    try {
      let EmployeeId = req.params.userId;
      let taskTypeId = req.params.taskTypeId;
      let taskId = req.params.taskId;
      const userId = req.myData.userId;
      let isAdmin = req.myData.isSuperAdmin;
      const url = `CALL sp_get_work_report_by_employee(${userId}, ${isAdmin}, ${EmployeeId}, ${taskTypeId}, ${taskId})`;
      db.query(url, async (err, result) => {
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
router.get(
  "/get-task-completed-by-employee/:userId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/get-work-report-details");
    try {
      let EmployeeId = req.params.userId;
      let taskTypeId = req.params.taskTypeId;
      let taskId = req.params.taskId;
      const userId = req.myData.userId;
      let isAdmin = req.myData.isSuperAdmin;
      const url = `CALL sp_get_task_completed_by_employee(${userId}, ${isAdmin}, ${EmployeeId})`;
      db.query(url, async (err, result) => {
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

router.get("/get-employee-work-report-today", tokenCheck, async (req, res) => {
  console.log(">>>>>get-employee-work-report-today");
  try {
    const url = `CALL sp_get_work_report_today()`;
    db.query(url, async (err, result) => {
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
});

router.get("/get-employee-work-report-weekly", tokenCheck, async (req, res) => {
  console.log(">>>>>get-employee-work-report-weekly");
  try {
    const url = `CALL sp_get_work_report_weekly()`;
    db.query(url, async (err, result) => {
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
});

router.get(
  "/get-employee-work-report-monthly",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>get-employee-work-report-monthly");
    try {
      const url = `CALL sp_get_work_report_monthly()`;
      db.query(url, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: true, result: result });
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

//==================get Enquiries by categoryId====================//
router.get(
  "/get-enquiries-by-category/:categoryId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>/get-enquiries-by-category/:categoryId");
    try {
      const categoryId = req.params.categoryId;
      console.log(categoryId, "dfhbdhhdsbfdhbhd");
      const url = `CALL sp_get_enquiries_by_enquiry_category(${categoryId})`;

      db.query(url, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: true, result: result });
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

//=================get Old Product Details=================//
router.get("/get-old-product/:enquiryId", tokenCheck, async (req, res) => {
  console.log(">>>>>>/get-old-product/:enquiryId", req.params.enquiryId);
  const enquiryId = req.params.enquiryId;
  const newSqlQuery = `CALL sp_get_old_products(${enquiryId})`;
  db.query(newSqlQuery, (err, newSqlResult) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: newSqlQuery });
      res.send({ isSuccess: true, result: newSqlResult[0] });
    }
  });
});

//=======================Get-User-Created-Enquiry============================//
router.get(
  "/get-user-created-enquiry/:categoryId",
  tokenCheck,
  async (req, res) => {
    console.log(">>>>>//get-user-created-enquiry/:categoryId");
    try {
      const userId = req.myData.userId;
      const categoryId = req.params.categoryId;
      const url = `CALL sp_get_user_created_enquiry(${userId},${categoryId})`;
      db.query(url, async (err, result) => {
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

//=======================Get-Hot-Enquiry============================//
router.get("/get-hot-enquiry/:categoryId", tokenCheck, async (req, res) => {
  console.log(">>>>>//get-hot-enquiry");
  try {
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    let categoryId = req.params.categoryId;
    const url = `CALL sp_get_hot_enquiry(${branchId}, ${isSuperAdmin}, ${userId},${categoryId})`;
    db.query(url, async (err, result) => {
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
});

//=======================Get-Cold-Enquiry============================//
router.get("/get-Cold-enquiry/:categoryId", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-Cold-enquiry");
  try {
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    let categoryId = req.params.categoryId;
    const url = `CALL sp_get_cold_enquiry(${branchId}, ${isSuperAdmin}, ${userId},${categoryId})`;
    db.query(url, async (err, result) => {
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
});

//=======================Get-Warm-Enquiry============================//
router.get("/get-Warm-enquiry/:categoryId", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-Warm-enquiry");
  try {
    let branchId = req.myData.branchId;
    let isSuperAdmin = req.myData.isSuperAdmin;
    let userId = req.myData.userId;
    let categoryId = req.params.categoryId;
    const url = `CALL sp_get_warm_enquiry(${branchId}, ${isSuperAdmin}, ${userId},${categoryId})`;
    db.query(url, async (err, result) => {
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
});

//===========Get Enquiry By Mobile Number=============
router.get(
  "/get-enquiries-by-text/:text/:categoryId",
  tokenCheck,
  async (req, res) => {
    console.log(req.params,">>>>>/get-enquiries-by-text/:text/:categoryId");
    try {
      const text = req.params.text;
      const mobileno  = req.params.text;
      const categoryId = req.params.categoryId;
    let url;

    if (!isNaN(text)) {
      url = `CALL sp_get_enquiries_by_mobile_number(${mobileno}, ${categoryId})`;
    } else {
      url = `CALL sp_get_enquiries_by_text('${text}', ${categoryId})`;
    }

      db.query(url, async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ isSuccess: true, result: result });
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

//=================================Upload enquiry CSV file=================================//
router.post(
  "/upload-csv",
  tokenCheck,
  uploadFile.single("enquiryCSV"),
  async (req, res) => {
    try {
      console.log("/uploadCsv", req.file);
      const parentPath = path.join(__dirname, "..");
      console.log(parentPath, "parentPath");

      const newFilePath = path.join(parentPath, "upload", req.file.filename);
      console.log("New file path:", newFilePath);

      // Parse the CSV file and insert data into the database
      uploadCSV(newFilePath, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "CSV failed" });
        } else {
          console.log("CSV success");
          res.status(200).json({
            isSuccess: true,
            message: "CSV success",
          });
        }
      });

      // ...
    } catch (err) {
      console.log(err);
    }
  }
);
const getVillageIDFromDatabase = async (villageName) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM village WHERE name ='${villageName}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const villageData = results[0]; // Access the first element in the results array
            const DataId = {
              stateId: villageData.state_id,
              distId: villageData.district_id,
              villageId: villageData.id,
            };

            resolve(DataId); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getTalukaIDFromDatabase = async (talukaName) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM taluka WHERE name ='${talukaName}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const talukaData = results[0]; // Access the first element in the results array
            const DataId = {
              talukaId: talukaData.id,
            };

            resolve(DataId); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getCategory = async (categoryNmae) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM enquiry_category WHERE category_name ='${categoryNmae}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const CategoryID = results[0].id;

            resolve(CategoryID); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getPrimaryEnquirySource = async (primaryEnquirySource) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM enquiry_primary_sources WHERE name ='${primaryEnquirySource}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const primaryEnquirySource = results[0];
            const Data = {
              primary_source_id: primaryEnquirySource.id,
            };
            resolve(Data); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getEnquirySource = async (EnquirySource) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM enquiry_sources WHERE name ='${EnquirySource}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const enquirySource = results[0];
            const Data = {
              enquiry_source_id: enquirySource.id,
            };
            resolve(Data); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getModalId = async (modal) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM modal WHERE modalName ='${modal}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const modal = results[0];
            const ModalData = {
              modalid: modal.id,
            };

            resolve(ModalData); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getmanufracturerId = async (manufacturer) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM manufacturers WHERE name ='${manufacturer}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const momanufactureral = results[0];
            const manufacturerData = {
              manufacturerId: momanufactureral.id,
            };
            resolve(manufacturerData); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getModalNAmeId = async (modalName) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM modal WHERE modalName ='${modalName}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const modalName = results[0];
            const Data = {
              modalId: modalName.id,
            };

            resolve(Data); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};
const getmakerId = async (maker) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM manufacturers WHERE name ='${maker}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const maker = results[0];
            const Data = {
              makerId: maker.id,
            };
            resolve(Data); // Resolve with the extracted data
          } else {
            resolve(null);
          }
        }
      }
    );
  });
};

const uploadCSV = (path, callback) => {
  console.log(path, "functionc");
  let stream = fs.createReadStream(path);
  let csvDataColl = [];
  let headers = [];
  let fileStream = csv
    .parse({ headers: true })
    .on("headers", (headerList) => {
      headers = headerList;
    })
    .on("data", async (data) => {
      console.log(data, "datadatadtatt");
      const rowData = {};
      headers.forEach((header) => {
        const cleanedHeader = header.trim().replace(/ /g, "_");
        const value = data[header].trim();
        rowData[cleanedHeader] = value;
      });

      csvDataColl.push(rowData);
    })
    .on("end", async () => {
      console.log(csvDataColl, "csvData");
      const villageData = await getVillageIDFromDatabase(
        csvDataColl[0].Village
      );
      const talukaData = await getTalukaIDFromDatabase(csvDataColl[0].Taluka);
      const categoryID = await getCategory(csvDataColl[0].EnquiryCategory);
      const enquirySourceID = await getEnquirySource(
        csvDataColl[0].EnquirySourceId
      );
      const primarySourceID = await getPrimaryEnquirySource(
        csvDataColl[0].PrimarySourceId
      );
      const modalID = await getModalId(csvDataColl[0].modalId);
      const manufracturerId = await getmanufracturerId(
        csvDataColl[0].Manufacturer
      );
      console.log(modalID,"modalID");
      const modalNameID = await getModalNAmeId(csvDataColl[0].modalName);
      const makerID = await getmakerId(csvDataColl[0].maker);

      csvDataColl = csvDataColl.map((obj) => {
        console.log(obj.Email);
        return {
          first_name: obj.FirstName,
          middle_name: obj.MiddleName,
          last_name: obj.LastName,
          phone_number: obj.PhoneNumber,
          whatsapp_number: obj.WhatsappNumber,
          email: obj.Email,
          state: villageData.stateId || 2,
          district: villageData.distId || 2,
          taluka: talukaData.talukaId || 2,
          village: villageData.villageId || 2,
          branch_id: obj.Branch || 1,
          enquiry_category_id: categoryID || 1,
          salesperson_id: obj.SalespersonId || null,
          modal_id: obj.modal_id || 1,
          date: moment(obj.EnquiryDate, "DD-MM-YYYY HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          delivery_date: moment(obj.DeliveryDate, "DD-MM-YYYY HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          primary_source_id: primarySourceID.primary_source_id || null,
          enquiry_source_id: enquirySourceID.enquiry_source_id || null,
          manufacturer: manufracturerId.manufacturerId || 1,
          modal: modalID.modalid || 1,
          maker: makerID.makerId || 1,
          modalName: modalNameID.modalId || 1,
          year_of_manufactur: obj.modalYear || null,
          condition_of: 4,
          old_tractor: obj.oldTractorOwned,
        };
      });
      console.log(csvDataColl, "csvDataColl");
      let P_JSON = JSON.stringify(csvDataColl);
      console.log(P_JSON, "csvjsondata");
      insertDataUsingSP(P_JSON, callback);
    });

  stream.pipe(fileStream);
};

const insertDataUsingSP = (jsonData, callback) => {
  db.query(`CALL InsertEnquiryData('${jsonData}')`, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      callback(err, null);
    } else {
      console.log("csv file inserted", results.insertId);
      callback(null, results);
    }
  });
};
//=======================Messages Api=========================

router.get("/get-message-action", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-message-action");
  const id = req.params.id;
  const url = `SELECT * FROM message_action`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.get("/get-types", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-types");
  const id = req.params.id;
  const url = `SELECT * FROM types`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result });
    }
  });
});

router.post("/add-messages", tokenCheck, async (req, res) => {
  try {
    console.log("/add-messages>>>>>>>>>>>>", req.body);

    const category = req.body.category;
    const messageAction = req.body.messageAction;
    const types = req.body.types;
    const message = req.body.message;
    const url = `INSERT INTO messages (category, action, type, message) VALUES (?,?,?,?)`;
    console.log("url", url);
    await db.query(
      url,
      [category, messageAction, types, message],
      async (err, result) => {
        if (err) {
          console.log({ isSuccess: false, result: err });
          res.send({ isSuccess: false, result: "error" });
        } else {
          console.log({ isSuccess: true, result: url });
          res.send({ isSuccess: true, result: result });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

//===================get People List===================//
router.get("/get-people-list/:types", tokenCheck, async (req, res) => {
  console.log(">>>>>/get-people-list");
  const peopleType = req.params.types;
  const url = `call sp_get_people_list(${peopleType})`;
  await db.query(url, async (err, result) => {
    if (err) {
      console.log({ isSuccess: false, result: err });
      res.send({ isSuccess: false, result: "error" });
    } else {
      console.log({ isSuccess: true, result: url });
      res.send({ isSuccess: true, result: result[0] });
    }
  });
});
module.exports = router;
