import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useSelector, useDispatch } from 'react-redux'
import { addTaskToDb, clearAddTaskState } from '../redux/slices/addTaskSlice'
import Select from 'react-select';
import { Modal, Button } from "react-bootstrap";
const AddTask = ({ workFor }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(null); // State for Start Date
  const [endDate, setEndDate] = useState(null);     // State for End Date
  const [employees, setEmployees] = useState(null);
  const [taskTypes, setTaskTypes] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [tasktimePeriod, setTasktimePeriod] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const currentBranch = localStorage.getItem("currentDealerId");
  const location = useLocation();
  const workAssign = location.state?.username;
  const workAssignEmployee = location.state?.selectedEmployeeIDs;
  const addTaskState = useSelector(state => state.addTaskSlice.addTaskState);
  const [newAddTask, setNewAddTask] = useState({
    listDsp: [],
    listTasktype: [],
    listTask: [],
    listTasktimeperiod: [],
  });

  useEffect(() => {
    if (workAssign) {
      let tempAr = [];
      const updatedEmployee = [
        {
          value: workAssign.id,
          label: `${workAssign.first_name} ${workAssign.last_name}`
        }
      ]
      setSelectedEmployee(updatedEmployee);
    }
  }, [workAssign])

  useEffect(() => {
    if (workAssignEmployee && newAddTask.listDsp) {
      const updatedEmployees = []; // Initialize an empty array

      newAddTask.listDsp.forEach((item) => {
        if (workAssignEmployee.includes(item.id)) {
          console.log(item.id, 'iudud');
          updatedEmployees.push({
            value: item.id,
            label: `${item.first_name} ${item.last_name}`,
          });
        }
      });
      setSelectedEmployee(updatedEmployees); // Set the selected employees array

    }
  }, [workAssignEmployee, newAddTask.listDsp]);


  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const redirectModal = () => {
    navigate(-1);
  };
  const onChangeTask = (e) => {
    setTasks(e.target.value);
  }

  const onChangeTaskCount = (e) => {
    setTaskCount(e.target.value);
  }

  const onChangeTasktimePeriod = (e) => {
    setTasktimePeriod(e.target.value);
  }

  const onChangeEmployees = (selectedOptions) => {
    setEmployees(selectedOptions);
    setSelectedEmployee(selectedOptions);
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



  async function getlisttasktimeperiod() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-tasktimeperiod-list`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data) {
        if (response.data.isSuccess) {
          setNewAddTask((newAddTask) => ({
            ...newAddTask,
            ["listTasktimeperiod"]: response.data.result,
          }));
        }
      }
    });
  }
  useEffect(() => {
    getlisttasktimeperiod();

  }, [])
  const handleSubmit = async () => {
    const selectedEmployeeIds = selectedEmployee.map(employee => employee.value);
   
    const data = {
      employees: selectedEmployeeIds, // Send the array of selected employee IDs
      taskTypes: taskTypes,
      tasks: tasks,
      taskCount: taskCount,
      startDate: startDate,
      endDate: endDate,
      tasktimePeriod: tasktimePeriod,
    };

    if (workFor === "addTask") {
      dispatch(addTaskToDb(data));
    } else {
      dispatch(setShowMessage("All fields must be filled"));
    }
  }
  useEffect(() => {
    if (addTaskState && addTaskState.isSuccess) {
      if (addTaskState.isSuccess === true) {
        dispatch(setShowMessage('Data is added'))
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
        <div className="row m-0">
          <div className="col-6">
            <h5 className='m-0'>
              Add Task Management
            </h5>
          </div>
          <div className="col-6 d-flex align-items-end justify-content-end">
            <Button
              variant="btn btn-warning mx-1"
              style={{
                width: '70px',
                height: '35px',
                fontSize: '14px',
                borderRadius: '20px',
              }}
              onClick={() => {
                redirectModal();
              }}
            >
              BACK
            </Button>
          </div>
        </div>
        <div className=' row mt-3 m-0'>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="employee">
              Employee
            </label>
            <Select
              isMulti
              options={newAddTask.listDsp.map(user => ({
                value: user.id,
                label: `${user.first_name} ${user.last_name}`,
              }))}
              onChange={onChangeEmployees}
              value={selectedEmployee}
            />

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

        <div className=' row mt-3 m-0'>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="task">
              Task Time Period
            </label>
            <select onChange={onChangeTasktimePeriod} className="myInput" name="tasktimePeriod" value={tasktimePeriod}>
              <option value="" className="myLabel">
                Select Task Time Period
              </option>
              {newAddTask.listTasktimeperiod &&
                newAddTask.listTasktimeperiod.length > 0 &&
                newAddTask.listTasktimeperiod.map((i) => {
                  const taskTasktimeperiod = `${i.period_name}`;
                  return (
                    <option
                      key={i.id}
                      value={i.id}
                      className="myLabel"
                    >
                      {taskTasktimeperiod}
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
          Add Task
        </button>
      </section>
    </div>
  );
}

export default AddTask;
