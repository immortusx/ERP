import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  addCategoryToDb,
  clearaddCategory,
} from "../redux/slices/Master/Category/addCategorySlice";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Department from "./singleComponents/villageCom/Department";

export default function AddCategory({ workFor }) {
  const [dept, setDept] = useState([]);
  const [categoryData, setCategoryData] = useState({
    category_name: "",
    category_description: "",
    department: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addCategory = useSelector((state) => state.addCategory.addCategory);

  function clearInpHook() {
    setCategoryData({
      category_name: "",
      category_description: "",
      department: "",
    });
  }

  useEffect(() => {
    if (addCategory.isSuccess) {
      if (addCategory.message.isSuccess) {
        dispatch(setShowMessage("Category is created"));
        dispatch(clearaddCategory());
        navigate("/administration/configuration/category");
        clearInpHook();
        clearaddCategory();
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [addCategory]);

  async function getDeptList() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-department-list`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data.isSuccess) {
        const data = response.data.result;
        setDept(data);
        console.log(data, "dept");
      }
    });
  }

  useEffect(() => {
    getDeptList();
  }, []);
  const onSelectedState = (value) => {
    setCategoryData((categoryData) => ({ ...categoryData, department: value }));
    console.log(value);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    console.log("categoryData", categoryData);
    setCategoryData((categoryData) => ({
      ...categoryData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryname = categoryData.category_name;
    const categorydescription = categoryData.category_description;
    const categorydepartment = categoryData.department;
    if (
      categoryname.length > 0 &&
      categorydescription !== "" &&
      categorydepartment !== ""
    ) {
      dispatch(addCategoryToDb(categoryData));
    } else {
      dispatch(setShowMessage("All field must be field"));
      setCategoryData({
        category_name: "",
        category_description: "",
        department: "",
      });
    }
    console.log(categoryData, "categoryData");
  };

  function handlCancel() {
    navigate("/administration/configuration/category");
    clearInpHook();
  }

  return (
    <div className="addUser myBorder bg-white rounded p-3">
      <main>
        <div className=" row mt-3 m-0">
          <h5 className="m-0">
            {(workFor = "addcategory" ? "Create Category" : "Edit Category")}
          </h5>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Category name
            </label>
            <input
              className="myInput inputElement"
              autoComplete="false"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              type="text"
              name="category_name"
            />
          </section>
        </div>
        <div className="row mt-3 m-0">
          <Department
            className="myInput inputElement"
            onSelectedState={onSelectedState}
            DeptId={categoryData.department}
          />
        </div>
        <div className=" row m-0">
          <section className="d-flex mt-3 flex-column col-12">
            <label className="myLabel" htmlFor="email">
              Category description
            </label>
            <textarea
              rows="5"
              className="myInput inputElement"
              autoComplete="false"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              type="text"
              name="category_description"
            />
          </section>

          <section className="d-flex mt-3 flex-column flex-sm-row">
            <button
              className="col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handleSubmit}
              type="button"
            >
              {(workFor = "addcategoryt" ? "Create Category" : "Edit Category")}
            </button>
            <button
              className="ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handlCancel}
              type="button"
            >
              Cancel
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
