import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useSelector, useDispatch } from 'react-redux'
import { addTaskToDb, clearAddTaskState } from '../redux/slices/addTaskSlice'
import Select from 'react-select';
import { Modal, Button } from "react-bootstrap";
import moment from "moment/moment";
import translations from '../assets/locals/translations';
import { editTaskAssignUpdateToDb, clearEditTaskAssignState, clearEditTaskAssignData } from '../redux/slices/editTaskAssignSlice'
const AssignTask = ({ workFor }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [EmployeeId, setEmployeeId] = useState(null);
  const [taskTypes, setTaskTypes] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [taskCount, setTaskCount] = useState(null);
  const [tasktimePeriod, setTasktimePeriod] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskCategory, setTaskCategory] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const currentBranch = localStorage.getItem("currentDealerId");
  const location = useLocation();
  const workAssign = location.state?.username;
  const taskAssignDatas = location.state?.data;
  const workAssignEmployee = location.state?.selectedEmployeeIDs;
  const addTaskState = useSelector(state => state.addTaskSlice.addTaskState);
  const editTaskAssignSliceState = useSelector(state => state.editTaskAssignSlice.editTaskAssignSliceState)
  const editTaskAssignData = useSelector(state => state.editTaskAssignSlice.editTaskAssignData)
  const currentLanguage = useSelector((state) => state.language.language);
  const [newAddTask, setNewAddTask] = useState({
    listDsp: [],
    listTasktype: [],
    listTask: [],
    listTasktimeperiod: [],
    listTaskStatus: [],
    listTaskCategory: [],
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
  async function gettaskdata(id) {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-addtask/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    try {
      const response = await Axios.get(url, config);
      if (response.data) {
        response.data.result.map((item) => {
          setTaskTypes(item.tasktype);
          setTasks(item.task);
          setTaskCount(item.taskcount)
          const formattedDate = new Date(item.startdate);
          setStartDate(formattedDate);
          const formattedEndDate = new Date(item.enddate);
          setEndDate(formattedEndDate);
          setTasktimePeriod(item.tasktime_period);
          setTaskStatus(item.task_status);
          setTaskCategory(Number(item.category_name));
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {

    if (taskAssignDatas) {
      gettaskdata(taskAssignDatas.id);
      let tempAr = [];
      const updatedEmployee = [
        {
          value: taskAssignDatas.EmployeeId,
          label: `${taskAssignDatas.employee}`
        }
      ]
      setSelectedEmployee(updatedEmployee);
    }
  }, [taskAssignDatas])


  useEffect(() => {
    if (workAssignEmployee && newAddTask.listDsp) {
      const updatedEmployees = []; // Initialize an empty array

      newAddTask.listDsp.forEach((item) => {
        if (workAssignEmployee.includes(item.id)) {
          updatedEmployees.push({
            value: item.id,
            label: `${item.first_name} ${item.last_name}`,
          });
        }
      });
      setSelectedEmployee(updatedEmployees);

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

  const onChangeTasktype = (e) => {
    setTaskTypes(e.target.value);
  }
  const onChangeTaskCount = (e) => {
    setTaskCount(e.target.value);
  }

  const onChangeTasktimePeriod = (e) => {
    setTasktimePeriod(e.target.value);
  }
  const onChangeTaskStatus = (e) => {
    setTaskStatus(e.target.value);
  }
  const onChangeEmployees = (selectedOptions) => {
    setEmployees(selectedOptions);
    setSelectedEmployee(selectedOptions);
  };
  const onChangeTaskCategory = (e) => {
    setTaskCategory(e.target.value);
  }
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


  const [taskAssignData, setTaskAssignData] = useState({
    employees: "",
    taskTypes: "",
    tasks: "",
    taskCount: "",
    startDate: "",
    endDate: "",
    tasktimePeriod: "",
  })
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

  async function getlisttaskStatus() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-taskstatus-list`;
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
            ["listTaskStatus"]: response.data.result,
          }));
        }
      }
    });
  }
  useEffect(() => {
    getlisttaskStatus();

  }, [])

  async function getlisttaskCategory() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiry-categories`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response) {

        setNewAddTask((newAddTask) => ({
          ...newAddTask,
          ["listTaskCategory"]: response.data.result,
        }));

      }
    });
  }
  useEffect(() => {
    getlisttaskCategory();

  }, [])

  function handleCancel() {
    navigate('/administration/configuration/Task')
  }
  const handleSubmit = async () => {
    const formatedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formatedEndDate = moment(endDate).format('YYYY-MM-DD');

    const selectedEmployeeIds = selectedEmployee.map(employee => employee.value);

    const data = {
      employees: selectedEmployeeIds,
      taskTypes: taskTypes,
      tasks: tasks,
      taskCount: taskCount,
      startDate: formatedStartDate,
      endDate: formatedEndDate,
      tasktimePeriod: tasktimePeriod,
      taskStatus: taskStatus,
      taskCategory: taskCategory
    };

    if (workFor === "editTask") {
      data.eIds = taskAssignDatas.id;
      dispatch(editTaskAssignUpdateToDb(data));
    } else {
      dispatch(addTaskToDb(data));
      // dispatch(setShowMessage("All fields must be filled"));
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
  useEffect(() => {
    if (editTaskAssignSliceState && editTaskAssignSliceState.isSuccess) {
      if (editTaskAssignSliceState.isSuccess === true) {
        dispatch(setShowMessage('Data is added'))
        dispatch(clearEditTaskAssignState())
        navigate('/administration/configuration/Task')
      } else {
        dispatch(setShowMessage('Something is wrong!'))
      }
    }
  }, [editTaskAssignSliceState])

  useEffect(() => {
    if (workFor === 'forEdit') {
      if (editTaskAssignData === null) {
        dispatch(setShowMessage('Please select a user'))
        setTimeout(() => {
          navigate('/administration/users')
        }, 1000)
      } else {

        setTaskAssignData({
          employees: editTaskAssignData.employee,
          taskTypes: editTaskAssignData.tasktype,
          tasks: editTaskAssignData.task,
          taskCount: editTaskAssignData.taskcount,
          startDate: editTaskAssignData.startdate,
          endDate: editTaskAssignData.enddate,
          tasktimePeriod: editTaskAssignData.tasktime_period,
        })
      }
    }
    return () => {
      if (workFor === 'forEdit') {
        dispatch(clearEditTaskAssignData())
      }
    }
  }, [workFor, editTaskAssignData])

  return (
    <div className='addUser  bg-white rounded p-3'>
      <main>
        <div className="row m-0">
          <div className="col-6">
            <h5 className='m-0'>
              {workFor === 'addTask' ? translations[currentLanguage].assigntaskmgmt : translations[currentLanguage].edittaskmgmt}
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
              {translations[currentLanguage].back}
            </Button>
          </div>
        </div>
        <div className=' row mt-3 m-0'>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="employee">
              {translations[currentLanguage].employee}
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
              {translations[currentLanguage].tasktype}
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
              {translations[currentLanguage].task}
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
              {translations[currentLanguage].taskcount}
            </label>
            <input className='myInput inputElement' autoComplete='false' type="text" name="taskCount" onChange={onChangeTaskCount} value={taskCount} />

          </section>

          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="startDate">
              {translations[currentLanguage].startd}
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
              {translations[currentLanguage].endd}
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
              {translations[currentLanguage].tasktimep}
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
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="task">
              {translations[currentLanguage].taskstatus}
            </label>
            <select onChange={onChangeTaskStatus} className="myInput" name="taskstatuss" value={taskStatus}>
              <option value="" className="myLabel">
                Select Task Status
              </option>
              {newAddTask.listTaskStatus &&
                newAddTask.listTaskStatus.length > 0 &&
                newAddTask.listTaskStatus.map((i) => {
                  const taskstatus = `${i.task_status}`;
                  return (
                    <option
                      key={i.id}
                      value={i.id}
                      className="myLabel"
                    >
                      {taskstatus}
                    </option>
                  );
                })}
            </select>
          </section>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="category">
              {translations[currentLanguage].category}
            </label>
            <select onChange={onChangeTaskCategory} className="myInput" name="taskcategory" value={taskCategory}>
              <option value="" className="myLabel">
                Select Category
              </option>
              {newAddTask.listTaskCategory &&
                newAddTask.listTaskCategory.length > 0 &&
                newAddTask.listTaskCategory.map((i) => {
                  const taskcategory = `${i.category_name}`;
                  return (
                    <option
                      key={i.id}
                      value={i.id}
                      className="myLabel"
                    >
                      {taskcategory}
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
          {workFor === 'addTask' ? translations[currentLanguage].AssignTask : translations[currentLanguage].save}
        </button>
        <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleCancel} type='button'> {translations[currentLanguage].cancel} </button>
      </section>
    </div>
  );
}

export default AssignTask;
