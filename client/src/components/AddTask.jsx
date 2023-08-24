import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useSelector, useDispatch } from 'react-redux'

const AddTask = ({ workFor }) => {
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(""); // State for Start Date
  const [endDate, setEndDate] = useState("");     // State for End Date
  const [employees, setEmployees] = useState(null);
  const [employeess, setEmployeess] = useState(null);
  const [taskTypes, setTaskTypes] = useState([null]);
  const [tasks, setTasks] = useState([null]);
  const [category, setCategory] = useState([null]);
  const [taskCount, setTaskCount] = useState();
  const currentBranch = localStorage.getItem("currentDealerId");
  const [newAddTask, setNewAddTask] = useState({
    listDsp: [],
    listTasktype:[],
    listTask:[],
    listCategory:[],
  });

  const [taskData, setTaskData] = useState({
    employee: "",
    tasktype: "",
    task: "",
    taskcount: "",
    taskcategory: "",
  });
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    if (currentBranch) {
      async function getDspList() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/employees/get-employee-list`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        await Axios.get(url, config).then((response) => {
          if (response.data) {
            if (response.data.isSuccess) {
              console.log("response", response.data);
              setNewAddTask((newAddTask) => ({
                ...newAddTask,
                ["listDsp"]: response.data.result,
              }));

            }
          }
        });
      }
      getDspList();
    }
  }, [currentBranch])
  const onChangeEmployee = (e) => {
    console.log(e, 'fjg');
    setEmployees(e.target.value);
  }
  const onChangeEmployees = (e) => {
    console.log(e, 'fjg');
    setEmployeess(e.target.value);
  }

  useEffect(() => {
    if (currentBranch) {
      async function getlistTasktype() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-task_types-list`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        await Axios.get(url, config).then((response) => {
          if (response.data) {
            if (response.data.isSuccess) {
              console.log("response ,cd", response.data);
              setNewAddTask((newAddTask) => ({
                ...newAddTask,
                ["listTasktype"]: response.data.result,
              }));

            }
          }
        });
      }
      getlistTasktype();
    }
  }, [currentBranch])
  
  const onChangeTasktype = (e) => {
    console.log(e.target.value, 'fjtrr');
    setTaskTypes(e.target.value);
  }

  

  useEffect(() => {
    if (taskTypes) {
      async function getlistTask() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-tasks-list/${taskTypes}`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        await Axios.get(url, config).then((response) => {
          if (response.data) {
            if (response.data.isSuccess) {
              console.log("response", response.data);
              setNewAddTask((newAddTask) => ({
                ...newAddTask,
                ["listTask"]: response.data.result,
              }));
            }
          }
        });
      }
      getlistTask();
    }
  }, [taskTypes])
  
  const onChangeTask = (e) => {
    console.log(e.target.value, 'fjhhhhhhg');
    setTasks(e.target.value);
  }

  useEffect(() => {
    if (currentBranch) {
      async function getlistCategory() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiry-categories`;
        const config = {
          headers: {
            token: localStorage.getItem("rbacToken"),
          },
        };
        await Axios.get(url, config).then((response) => {
          if (response.data) {
            if (response.data.isSuccess) {
              console.log("response", response.data);
              setNewAddTask((newAddTask) => ({
                ...newAddTask,
                ["listCategory"]: response.data.result,
              }));

            }
          }
        });
      }
      getlistCategory();
    }
  }, [currentBranch])
  
  const onChangeCategory = (e) => {
    console.log(e, 'fjhhhhhhg');
    setCategory(e.target.value);
  }

  const onChangeTaskCount = (e) => {
    console.log(e, 'fjhhhhhhg');
    setTaskCount(e.target.value);
  }
  const handleSubmit = async () => {
  // Prepare the data to send to the server
  const emp = taskData.employee;
  const typ = taskData.tasktype;
  const tk = taskData.task;
  const tc = taskData.taskcount;
  const tcg = taskData.taskcategory;

  if (
    emp.length > 0 &&
    typ.length > 0 &&
    tk.length > 0 &&
    tc.length > 0 &&
    tcg.length > 0 &&
    (workFor === "forAdd" )
    // &&
    // Object.keys(branchRoles).length > 0
  ) {
    // All fields are filled, you can proceed with your logic here.
  } else {
    dispatch(setShowMessage("All fields must be filled"));
  }
}


  return (
    <div className='addUser  bg-white rounded p-3'>
      <main>
        <h5 className='m-0'>
          Add Task Management
        </h5>

        <div className=' row mt-3 m-0'>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="employee">
              Employee
            </label>
            <select onChange={onChangeEmployee} className="myInput" name="employee" value={employees}>
              <option value="" className="myLabel">
                Select Employee
              </option>
              {newAddTask.listDsp &&
                newAddTask.listDsp.length > 0 &&
                newAddTask.listDsp.map((user) => {
                  const fullName = `${user.first_name} ${user.last_name}`;
                  return (
                    <option
                      key={user.id}
                      value={user.id}
                      className="myLabel"
                    >
                      {fullName}
                    </option>
                  );
                })}
            </select>
          </section>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="taskType">
              Task Type
            </label>
            <select onChange={onChangeTasktype} className="myInput" name="taskType" value={taskTypes}>
              <option value="" className="myLabel">
                Select Task Type
              </option>
              {newAddTask.listTasktype &&
                newAddTask.listTasktype.length > 0 &&
                newAddTask.listTasktype.map((i) => {
                  const tasktypes = `${i.tasktype_name}`;
                  return (
                    <option
                    key={i.tasktype_id} 
                    value={i.tasktype_id} 
                      className="myLabel"
                    >
                      {tasktypes}
                    </option>
                  );
                })}
            </select>
          </section>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="taskType">
              Task
            </label>
            <select onChange={onChangeTask} className="myInput" name="taskType" value={tasks}>
              <option value="" className="myLabel">
                Select Task 
              </option>
              {newAddTask.listTask &&
                newAddTask.listTask.length > 0 &&
                newAddTask.listTask.map((i) => {
                  const tasks = `${i.task_name}`;
                  return (
                    <option
                    key={i.id} 
                    value={i.id} 
                      className="myLabel"
                    >
                      {tasks}
                    </option>
                  );
                })}
            </select>
          </section>
        </div>


        <div className=' row mt-3 m-0'>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="employee">
              Task Count
            </label>
            <input className='myInput inputElement' autoComplete='false' type="text" name="firstName" onChange={onChangeTaskCount} value={taskCount}/>

          </section>

          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="employee">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select a date"
              className="myInput inputElement"
            />

          </section>


          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="employee">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select a date"
              className="myInput inputElement"
            />

          </section>

        </div>
        <div className=' row mt-3 m-0'>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="employee">
              Select Employee
            </label>
            <select onChange={onChangeEmployees} className="myInput" name="employee" value={employeess}>
              <option value="" className="myLabel">
                Select Employee
              </option>
              {newAddTask.listDsp &&
                newAddTask.listDsp.length > 0 &&
                newAddTask.listDsp.map((user) => {
                  const fullName = `${user.first_name} ${user.last_name}`;
                  return (
                    <option
                      key={user.id}
                      value={user.id}
                      className="myLabel"
                    >
                      {fullName}
                    </option>
                  );
                })}
            </select>
          </section>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="category">
              Select Category
            </label>
            <select className="myInput" name="category" onChange={onChangeCategory} value={category}>
              <option value="" className="myLabel">
                Select Employee First
              </option>
              {newAddTask.listCategory &&
                newAddTask.listCategory.length > 0 &&
                newAddTask.listCategory.map((i) => {
                  const fullName = `${i.category_name}`;
                  return (
                    <option
                      key={i.id}
                      value={i.id}
                      className="myLabel"
                    >
                      {fullName}
                    </option>
                  );
                })}
            </select>
          </section>
        </div>
      </main>

      <section className="d-flex mt-3  flex-column flex-sm-row">
        <button
          className="col-12 col-sm-5 col-lg-2 myBtn py-2"
          onClick={handleSubmit}
          type="button">
          Submit
        </button>
      </section>
    </div>
  );
}

export default AddTask;
