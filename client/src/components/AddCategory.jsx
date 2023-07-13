import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import  Axios from "axios";
import {
  addCategoryToDb,
  clearaddCategory,
} from "../redux/slices/Master/Category/addCategorySlice";
import { clearEditcategoryData,clearEditcategoryState,editcategoryUpdateToDb } from "../redux/slices/Master/Category/editCategorySlice";
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
   const { editcategorySliceState } = useSelector(
     (state) => state.editCategoryDataState
   );
   const editcategoryData = useSelector(
     (state) => state.editCategoryDataState.editcategoryData
   );

  function clearInpHook() {
    setCategoryData({
      category_name: "",
      category_description: "",
      department: "",
    });
  }



  useEffect(() => {
    if (editcategorySliceState.isSuccess) {
      console.log(editcategorySliceState, "editdepartmentSliceState");
      if (editcategorySliceState.message.result === "success") {
        dispatch(setShowMessage("Data is Updated"));
        clearInpHook();
        dispatch(clearEditcategoryState());
        navigate("/administration/configuration/category");
      } else {
        dispatch(setShowMessage("Something is wrong!"));
      }
    }
  }, [editcategorySliceState]);

  useEffect(() => {
    if (workFor === "forEdit") {
      if (editcategoryData.data === null) {
        setTimeout(() => {
          navigate("/administration/configuration/category");
          dispatch(setShowMessage("Please select a category"));
        }, 1000);
      } else {
        console.log(
          "editemployeeData2222222222222222222222222",
          editcategoryData
        );
        setCategoryData({
          category_name: editcategoryData.data.category_name,
          category_description: editcategoryData.data.category_description,
          department: editcategoryData.data.department,
        });
      }
    }
    return () => {
      if (workFor === "forEdit") {
        dispatch(clearEditcategoryData());
      }
    };
  }, [workFor, editcategoryData]);

  async function getcategoryid(id) {
    console.log(id, "jjjjjjjjjjjjjjjjjjjj");
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-categorybyid/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    try {
      const response = await Axios.get(url, config);
      if (response.data?.isSuccess) {
        setCategoryData(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (workFor === "forEdit" && editcategoryData && editcategoryData.data) {
      const id = editcategoryData.data.id;
      console.log(id, "categorydata");
      getcategoryid(id);
    }
  }, []);

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
    await Axios.get(url, config).then((response) => {
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
    console.log(value,"valueeeeeeeeeeeeeee");
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
    console.log(categoryData, "categoryData");
    const categoryname = categoryData.category_name;
    const categorydescription = categoryData.category_description;
    const categorydepartment = categoryData.department;
    if (
      categoryname.length > 0 &&
      categorydescription !== "" &&
      categorydepartment !== ""
    ) {
     if (workFor === "forEdit")
     {
categoryData["id"] = editcategoryData.data.id;
dispatch(editcategoryUpdateToDb(categoryData));
     }else{
       dispatch(addCategoryToDb(categoryData));
     } 
    } else {
      dispatch(setShowMessage("All field must be field"));
    }
      setCategoryData({
        category_name: "",
        category_description: "",
        department: "",
        // console.log(categoryData, "categoryData");
    });
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
            {workFor === "forAdd" ? "Create Category" : "Edit Category"}
          </h5>

          <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
            <label className="myLabel" htmlFor="email">
              Category name
            </label>
            <input
              value={categoryData.category_name}
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
            value={categoryData.category_description}
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
              {workFor === "forAdd" ? "Create Category" : "Edit Category"}
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
