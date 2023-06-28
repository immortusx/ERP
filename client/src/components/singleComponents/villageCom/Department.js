import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const Department = ({ onSelectedState = () => {}, DeptId = "" }) => {
  const navigate = useNavigate();
  const [departmentList, setDepartmentList] = useState([]);
  const getDepartmentList = async () => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-department-list`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data.isSuccess) {
        setDepartmentList(response.data.result);
      }
    });
  };
  useEffect(() => {
    getDepartmentList();
  }, []);

  const changeHandlerNewEnquiry = (event) => {
    console.log(event.target.value);
    onSelectedState(event.target.value);
  };

  return (
    <>
      <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabel" htmlFor="email">
          Select Department
        </label>
        <select
          className="form-control"
          name="department"
          onChange={(e) => onSelectedState(e.target.value, DeptId)}
          value={DeptId}
        >
          <option value="">Select Department</option>
          {departmentList.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </section>
    </>
  );
};

export default Department;
