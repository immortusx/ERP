import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Axios from "axios";
import {
  addCategoryToDb,
  clearaddCategory,
} from "../redux/slices/Master/Category/addCategorySlice";
import { getCategoryFeatureFromDb } from "../redux/slices/getcategoryfeactureSice";
import {
  clearEditcategoryData,
  clearEditcategoryState,
  editcategoryUpdateToDb,
} from "../redux/slices/Master/Category/editCategorySlice";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Department from "./singleComponents/villageCom/Department";

export default function AddCategory({ workFor }) {
  const [dept, setDept] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [checkField, setCheckField] = useState([]);
  const [fielddata, setfielddata] = useState([]);
  // const [checkFieldItem, setCheckFieldItem] = useState(true);
  const [checkFieldItem, setCheckFieldItem] = useState([]);
  const [categoryData, setCategoryData] = useState({
    category_name: "",
    category_description: "",
    department: "",
    chehkedFeature: [],
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
  const featuresState = useSelector(
    (state) => state.categoryfeaturesListState.featuresState
  );
  function clearInpHook() {
    setCategoryData({
      category_name: "",
      category_description: "",
      department: "",
      chehkedFeature: [],
    });
  }

  // function onChangeHandle(data, id) {
  //   console.log(data, "fhdfh");
  //   console.log(id, "fhddddfh");
  //   let tempAr = [];
  //   // const value = data.target.value;
  //   // const name = data.target.name;
  //   const checked = data.target.checked ;

  //   console.log(checked, "checked");
  //   categoryData.chehkedFeature.forEach((i) => {
  //     tempAr.push(i);
  //   });
  //   // if (id === undefined) {
  //   //   setCategoryData((featureData) => ({ ...featureData, [name]: value }));
  //   // } else {
  //     if (checked) {
  //       tempAr.push(id);
  //       console.log(tempAr, "tempAr");
  //       setCategoryData((featureData) => ({
  //         ...featureData,
  //         chehkedFeature: tempAr,
  //       }));
  //     } else {
  //       tempAr = tempAr.filter((i) => {
  //         return i != id;
  //       });
  //       setCategoryData((featureData) => ({
  //         ...featureData,
  //         chehkedFeature: tempAr,
  //       }));
  //     }
  //   // }
  // }

  function onChangeHandle(data, id) {
    const checked = data.target.checked;
    const disabled = data.target.disabled;

    // Update the featuresList
    const updatedFeaturesList = featuresList.map((item) => {
      if (item.id === id) {
        return { ...item, isChecked: checked, disabled: disabled };
      }
      return item;
    });

    setFeaturesList(updatedFeaturesList);

    // Rest of your code (if needed)
    let tempAr = [];
    updatedFeaturesList.forEach((item) => {
      if (item.isChecked) {
        tempAr.push(item.id);
      }
    });
    console.log(tempAr, "tempAr");

    setCategoryData((featureData) => ({
      ...featureData,
      chehkedFeature: tempAr,
    }));
  }
  useEffect(() => {
    if (fielddata && fielddata.length > 0) {
      console.log(fielddata, "feisl");
      const fields = fielddata.map((item)=>{
        if(checkFieldItem.includes(item.id)){
           // Set isChecked to true for IDs included in checkFieldItem
            return { ...item, isChecked: true, disabled: true };
          } else {
            // Set isChecked to false for other IDs
            return { ...item, isChecked: false, disabled: false };
        }

      });
        console.log(fields, "fielddata");
 let tempArry = [];
 fields.forEach((item) => {
   if (item.isChecked) {
     tempArry.push(item.id);
   }
 });
 console.log(tempArry, "tempArry");
   setCategoryData((featureData) => ({
     ...featureData,
     chehkedFeature: tempArry,
   }));
    }
  }, [fielddata]);
  // useEffect(() => {
  //   if (featuresState.isSuccess) {
  //     if (featuresState.data.isSuccess) {
  //       setFeaturesList(featuresState.data.result);
  //     }
  //   }
  // }, [featuresState]);

  useEffect(() => {
    if (featuresState.isSuccess) {
      if (featuresState.data.isSuccess) {
        const updatedFeaturesList = featuresState.data.result.map((item) => {
          if (checkFieldItem.includes(item.id)) {
            // Set isChecked to true for IDs included in checkFieldItem
            return { ...item, isChecked: true, disabled: true };
          } else {
            // Set isChecked to false for other IDs
            return { ...item, isChecked: false, disabled: false };
          }
        });
        console.log(updatedFeaturesList, "updatedFeaturesList");
        setFeaturesList(updatedFeaturesList);

        let tempAr = [];
        updatedFeaturesList.forEach((item) => {
          if (item.isChecked) {
            tempAr.push(item.id);
          }
        });
        console.log(tempAr, "tempAr");

        setCategoryData((featureData) => ({
          ...featureData,
          chehkedFeature: tempAr,
        }));
      }
    }
  }, [featuresState, checkFieldItem]);

  useEffect(() => {
    dispatch(getCategoryFeatureFromDb());
  }, []);

  useEffect(() => {
    if (editcategorySliceState.isSuccess) {
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
        setCategoryData({
          category_name: editcategoryData.data.category_name,
          category_description: editcategoryData.data.category_description,
          department: editcategoryData.data.department,
          chehkedFeature: checkField,
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
    const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-categorybyid/${id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    try {
      const response = await Axios.get(url, config);
      if (response.data?.isSuccess) {
        console.log(response.data.result, "editData");
        setCategoryData(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getCategoryField = async (id) => {
    console.log(id, "new");
    const suburl = `${process.env.REACT_APP_NODE_URL}/api/master/get-category-fields/${id}`;
    console.log(suburl, "suburl");
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    try {
      const response = await Axios.get(suburl, config);
      if (response.data?.isSuccess) {
        console.log(response.data.result, "editData**************");
        setfielddata(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (workFor === "forEdit" && editcategoryData && editcategoryData.data) {
      const id = editcategoryData.data.id;
      getcategoryid(id);
      getCategoryField(id);
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
      }
    });
  }

  useEffect(() => {
    getDeptList();
  }, []);
  const onSelectedState = (value) => {
    setCategoryData((categoryData) => ({ ...categoryData, department: value }));
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setCategoryData((categoryData) => ({
      ...categoryData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(categoryData, "cateogry Da");
    e.preventDefault();
    const categoryname = categoryData.category_name;
    const categorydescription = categoryData.category_description;
    const categorydepartment = categoryData.department;
    const categorychehkedFeature = categoryData.chehkedFeature;
    if (
      categoryname.length > 0 &&
      categorydescription !== "" &&
      categorydepartment !== "" &&
      categorychehkedFeature !== []
    ) {
      if (workFor === "forEdit") {
        categoryData["id"] = editcategoryData.data.id;
        console.log(categoryData, "categoryData");
        dispatch(editcategoryUpdateToDb(categoryData));
      } else {
        dispatch(addCategoryToDb(categoryData));
      }
    } else {
      dispatch(setShowMessage("All field must be field"));
    }
  };

  const getselectedData = () => {
    const newurl = `${process.env.REACT_APP_NODE_URL}/api/master/get-selected-category-field`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    Axios.get(newurl, config).then((response) => {
      if (response) {
        if (response.data.isSuccess) {
          console.log(response.data.result, "response.data.result");
          setCheckField(response.data.result);
        }
      }
    });
  };
  useEffect(() => {
    getselectedData();
  }, []);

  useEffect(() => {
    const selectedIds = checkField.map((item) => item.id);
    setCheckFieldItem(selectedIds);
  }, [checkField]);

  function handlCancel() {
    // navigate("/administration/configuration/category");
    console.log(categoryData, "categoryData");
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
              Category Name *
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
              Category Description *
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
          <section className="d-flex mt-3 flex-column col-12 featureTree">
            <ul className="mt-3 m-0 ">
              {featuresList &&
                featuresList.length > 0 &&
                featuresList.map((data, index) => {
                  return (
                    <li key={index} className="">
                      <div className="pb-3 d-flex align-items-center">
                        <input
                          type="checkbox"
                          checked={data.isChecked}
                          disabled={data.disabled}
                          className="myCheckBox inputElement"
                          onChange={(e) => {
                            onChangeHandle(e, data.id);
                          }}
                          name={`${data.feature}Inp`}
                        />
                        <label className="ms-2 myLabel" htmlFor="">
                          {data.name}
                        </label>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </section>

          <section className="d-flex mt-3 flex-column flex-sm-row">
            <button
              className="col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handleSubmit}
              type="button"
            >
              {workFor === "forAdd" ? "Create Category" : "Save"}
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
