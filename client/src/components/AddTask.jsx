import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { useNavigate } from 'react-router-dom'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useSelector, useDispatch } from 'react-redux'
import { addTaskToDb, clearAddTaskState } from '../redux/slices/addTaskSlice'

const AddTask = ({ workFor }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(null); // State for Start Date
  const [endDate, setEndDate] = useState(null);     // State for End Date
  const [employees, setEmployees] = useState(null);
  const [taskTypes, setTaskTypes] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const currentBranch = localStorage.getItem("currentDealerId");
  const addTaskState = useSelector(state => state.addTaskSlice.addTaskState)
  const [newAddTask, setNewAddTask] = useState({
    listDsp: [],
    listTasktype: [],
    listTask: [],
  });

  const [taskData, setTaskData] = useState({
    employee: "",
    tasktype: "",
    task: "",
    taskcount: "",
    startDate: "",
    endDate: "",

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

  const onChangeTaskCount = (e) => {
    console.log(e, 'fjhhhhhhg');
    setTaskCount(e.target.value);
  }
  // useEffect(() => {
  //   if (addTaskState) {
  //     console.log(addTaskState, ' adddd')
  //   }
  // }, [addTaskState])
  const handleSubmit = async () => {
    const data = {};
    data.employees = employees;
    data.taskTypes = taskTypes;
    data.tasks = tasks;
    data.taskCount = taskCount;
    data.startDate = startDate;
    data.endDate = endDate;

    if (workFor === "addTask") {
      console.log(employees, taskTypes, tasks, taskCount, startDate, endDate, 'dtfaaaa');
      dispatch(addTaskToDb(data))
    } else {
      dispatch(setShowMessage("All fields must be filled"));
    }
  }



  useEffect(() => {
    if (addTaskState && addTaskState.isSuccess) {
      console.log(addTaskState, ' adddd')
      if (addTaskState.isSuccess === true) {
        dispatch(setShowMessage('User is created'))
        dispatch(clearAddTaskState())
        navigate('/administration/configuration/Task')
      } else {
        dispatch(setShowMessage('Something is wrong!'))
      }
    }
  }, [addTaskState])
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
            <label className="myLabel" htmlFor="task">
              Task
            </label>
            <select onChange={onChangeTask} className="myInput" name="task" value={tasks}>
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
            <label className="myLabel" htmlFor="taskCount">
              Task Count
            </label>
            <input className='myInput inputElement' autoComplete='false' type="text" name="taskCount" onChange={onChangeTaskCount} value={taskCount} />

          </section>

          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="startDate">
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
            <label className="myLabel" htmlFor="endDate">
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
