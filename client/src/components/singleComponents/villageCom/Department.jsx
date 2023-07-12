import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Department = ({ onSelectedState = () => {}, DeptId }) => {
  const navigate = useNavigate();
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    const getDepartmentList = async () => {
      const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-department-list`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      try {
        const response = await axios.get(url, config);
        if (response.data.isSuccess) {
          const deptdata = response.data.result;
          const deptdataObjects = deptdata.map((department) => ({
            id: department.id,
            name: department.name,
          }));
          console.log(deptdataObjects, "deptdataObjects"); // Array of objects with "id" and "name" properties
          setDepartmentList(deptdataObjects);
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching department list:", error);
      }
    };

    getDepartmentList();
  }, []);

  const changeHandlerNewEnquiry = (event) => {
    console.log(event.target.value);
    onSelectedState(event.target.value);
  };

  return (
    <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
      <label className="myLabel" htmlFor="department">
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
          <option key={department.id} value={department.name}>
            {department.name}
          </option>
        ))}
      </select>
    </section>
  );
};

export default Department;
