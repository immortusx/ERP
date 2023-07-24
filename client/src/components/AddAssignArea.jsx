import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addassigneAreaToDb,
  clearAddassigneAreaState,
} from "../redux/slices/assignedAreaSlice";
import {
  setEdiassignareaData,
  clearEditassignareaData,
  clearEditassignareaState,
  editassignareaUpdateToDb,
} from "../redux/slices/editassignareaSlice";

import Axios from "axios";
import { getToPathname } from "@remix-run/router";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllVillageAction } from "./Master/Village/getEditeVillage";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";

export default function AddAssignArea({ workFor }) {
  const location = useLocation();
  const areaAssign = location.state ? location.state.assigneAreaPerUser : [];
  // console.log(areaAssign, "9999999999999999");

  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const [selecteddTypeList, setSelecteddTypeList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allVillageData, setAllVillageData] = useState([]);
  //console.log(allVillageData, "allVillageData in assign area")
  const [selectedOptionVillage, setSelectedOptionVillage] = useState([]);
  const [selectedVillagesList, setSelectedVillagesList] = useState([]);
  const [selectedVillages, setSelectedVillages] = useState([]);
  const [selectedCtaegory, setSelectedCtaegory] = useState([]);
  const [selectedDistributionType, setSelectedDistributionType] = useState([]);
  const [enquireCtaegory, setEnquiryCtaegory] = useState([]);
  const [show, setShow] = useState(0);
  const [show1, setShow1] = useState(false);
  const [allUser, setallUser] = useState([]);
  const [selectedOptionUser, setSelectedOptionUser] = useState();
  const [assignData, setAssignData] = useState({
    category_name: "",
    name: "",
    distribution_type: "",
  });

  const addAssignState = useSelector(
    (state) => state.addassigneAreaSlice.addassigneAreaState
  );
  const editassignareaData = useSelector(
    (state) => state.editassignareaDataState.editassignareaData
  );

  // console.log(addAssignState, "88888888");
  useEffect(() => {
    if (addAssignState.isSuccess) {
      if (addAssignState.message.isSuccess) {
        dispatch(setShowMessage("Area is assignrd"));
        dispatch(clearAddassigneAreaState());
        navigate("/sale/areaAssign");
        // clearInpHook()
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [addAssignState]);

  //  async function getassignid(id) {
  //    console.log(id, "jjjjjjjjjjjjjjjjjjjj");
  //    const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/get-areaAssignUser/${id}`;
  //    const config = {
  //      headers: {
  //        token: localStorage.getItem("rbacToken"),
  //      },
  //    };
  //    try {
  //      const response = await Axios.get(url, config);
  //      if (response.data.isSuccess && response.data.result) {
  //       console.log(response,"editResult");
  //        setAssignData(response.data.result);
  //      }
  //    } catch (error) {
  //      console.log(error);
  //    }
  //  }

  async function getAllUserFromDb() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/get-allUser`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        setallUser(response.data.result);
        // console.log(combinedArray, "areaassign result66666666666666")
        // console.log(areaAssign, "areaassign result0000000")
      }
    });
  }
  //  useEffect(() => {
  //    if (editassignareaData.data) {
  //      const id = editassignareaData.data.id;
  //      console.log(id, "editassignareaData");
  //     //  getassignid(id);
  //    }
  //  }, [editassignareaData]);
  useEffect(() => {
    if (workFor === "forEdit") {
      if (editassignareaData.data === null) {
        setTimeout(() => {
          // navigate("/administration/configuration/category");
          dispatch(setShowMessage("Please select a category"));
        }, 1000);
      } else {
        console.log(
          "editemployeeData2222222222222222222222222",
          editassignareaData
        );
        setAssignData({
          category_name: editassignareaData.data.category_name,
          name: editassignareaData.data.name,
          distribution_type: editassignareaData.data.distribution_type,
        });
      }
    }
    return () => {
      if (workFor === "forEdit") {
        dispatch(clearEditassignareaData());
      }
    };
  }, [workFor, editassignareaData]);

  useEffect(() => {
    getAllUserFromDb();
  }, []);

  useEffect(() => {
    getAllVillageAction()
      .then((data) => {
        console.log(data, "All villageeeee");
        setAllVillageData(data.result);
      })
      .catch((error) => {
        console.error("Error in getAllVillageAction:", error);
      });
    getEnquiryCategoryFromDb();
    // setSelectedVillagesList(areaAssign[0].names)
    // setSelectedVillagesList(Array.from(areaAssign[0]?.names || []));
    //console.log(areaAssign[0].names,"222222222222222")
    // console.log(areaAssign[0].nameId,"111111111111111")
    // const names = areaAssign[0].names;
    // const nameId = areaAssign[0].nameId;
    // const combinedArray = names.map((value, index) => ({
    //   value: nameId[index],
    //   label: value,
    // }));
    // console.log(combinedArray,"combinedArrayfor name and name id")
    // setSelectedVillagesList(combinedArray);
  }, []);
  // const handleChange = (selectedOption) => {
  //   // console.log(selectedOption,"333333333")
  //   // setSelectedOptionVillage(selectedOption);
  //   // const newVillagesList = new Set(selectedVillagesList);
  //   // selectedOption.forEach((option) => {
  //   //     newVillagesList.add(option.label);
  //   // })
  //   // setSelectedVillagesList(newVillagesList);
  //   setSelectedOptionVillage(selectedOption);
  //   setSelectedVillagesList(selectedOption.map((option) => option));
  //   //console.log(selectedVillagesList,"222222222222222")
  // };

  const handleChangeCategory = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    setSelectedCtaegory(selectedOption);
  };

  const handleChangeDistribution = (selectedOption) => {
    console.log(selectedOption, "selectedOption");
    setSelectedDistributionType(selectedOption);
  };
  const categoryoptions = enquireCtaegory.map((category) => ({
    value: category.id,
    label: category.category_name,
  }));
  const options = allVillageData.map((village) => ({
    value: village.id,
    label: village.name,
  }));
  // const distributionoptions = [{ value: 1, label: "Area wise" }];
  // // const handleRemove = (selectedVillage) => {
  // //     const updatedVillages = selectedVillages.filter(
  // //         (village) => village.value !== selectedVillage.value
  // //     );
  // //     setSelectedVillages(updatedVillages);
  // // };
  const handleShow = () => {
    setShow(1);
  };

  const handleClose = () => {
    setShow(0);
  };
  const handleClose1 = () => {
    console.log("close");
    setShow1(false);
  };
  const handleChangeVillage = (selectedOption) => {
    setSelectedOptionVillage(selectedOption);
  };
  // const useroptions = allUser.map((user) => ({
  //   value: user.id,
  //   label: user.name,
  // }));

  // const handleChangeUser = (selectedOption) => {
  //   setSelectedOptionUser(selectedOption);
  // };
  // function handleSubmit() {
  //   console.log("222222222222222222222222222222222");
  //   for (let i = 0; i < selectedOptionVillage.length; i++) {
  //     //  selectedOptionVillage[i].id = selectedOptionUser.value;
  //     selectedOptionVillage[i].id = areaAssign[0].id;
  //     selectedOptionVillage[i].category = selectedCtaegory.value;
  //     selectedOptionVillage[i].distributionType =
  //       selectedDistributionType.value;
  //   }
  //   console.log(selectedOptionVillage, "11111111111111111111");
  //   dispatch(addassigneAreaToDb(selectedOptionVillage));
  // }

  function handleSubmit() {
    console.log("222222222222222222222222222222222");
    console.log("selectedCtaegory", selectedCtaegory);
    console.log("selectedOptionVillage", selectedOptionVillage);

    if (selectedCtaegory.length > 0 && selectedOptionVillage.length > 0) {
      const groupedData = selectedCtaegory.reduce((acc, categoryData) => {
        selectedOptionVillage.filter(
          (villageData) => villageData.categoryId === categoryData.value
        );

        acc.push({
          id: areaAssign[0].id,
          category: categoryData.value,
          distributionType: selectedDistributionType.value,
          value: selectedOptionVillage
            .map((villageData) => villageData.value)
            .join(","),
        });

        return acc;
      }, []);

      console.log("groupedData", groupedData);
        // Perform the edit operation
        editassignareaUpdateToDb(groupedData);
        // Perform the new entry operation
        dispatch(addassigneAreaToDb(groupedData));
    }
  }

 

  const editActionCall = (data) => {
    setShow(2);
    //  // setTableEditData(data);
    console.log(data, "sssssssssssssssssss");
    // console.log("editAssign");
    dispatch(setEdiassignareaData(data));
    // console.log(setEdiassignareaData(data), "setEdiassignareaData(data)");
    // console.log(data, "sdfghjkl;fghjkl;vb");
    // console.log(data.category_name, "123456789");
    setAssignData(data);
    console.log("options", options);
    console.log("categoryoptions", categoryoptions);

    let newArr = [];
    if (data.distribution_id && data.distribution_id.length > 0) {
      newArr = data.distribution_id.split(",");
    }
    let tempAr = [];
    newArr.forEach((element) => {
      console.log("element", element);
      if (options && options.length > 0) {
        const data = options.find((item) => item.value ==element);
        tempAr.push(data);
      }
        setSelectedOptionVillage(tempAr);
        console.log("tempAr", tempAr);
    });
    let newArry = [];
    if (data.category_name && data.category_name.length > 0) {
      newArry = data.category_name.split(",");
    }
      let tempArr = [];
    newArry.forEach((element) => {
      console.log("elementcategory", element);
      if (categoryoptions && categoryoptions.length > 0) {
        const data = categoryoptions.find((item) => item.label == element);
        tempArr.push(data);
      }
      setSelectedCtaegory(tempArr);
      console.log("tempArr", tempArr);
    });
  
  };

  function handlCancel() {

    navigate("/sale/areaAssign");
  }
  async function getEnquiryCategoryFromDb() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiry-categories`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        setEnquiryCtaegory(response.data.result);
      }
    });
  }

  return (
    <>
      <div className="addUser myBorder bg-white rounded p-3">
        <main>
          <div className=" row mt-3 m-0">
            <h3 className="myLabel">Assign Area</h3>
          </div>
          <div className="row mt-2">
            <h5 className="myLabel">User Information</h5>
          </div>
          <div className=" row mt-2 m-0">
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel"> Name </label>{" "}
              {areaAssign && (
                <>
                  <p className="myInput inputElement">
                    {areaAssign[0].first_name} {areaAssign[0].last_name}
                  </p>
                </>
              )}
            </section>

            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel">PhoneNumber </label>
              {areaAssign && (
                <>
                  <p className="myInput inputElement">
                    {areaAssign[0].phone_number}
                  </p>
                </>
              )}
            </section>
            <section className="d-flex justify-content-end  align-items-start  mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleShow}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                &nbsp; Assign Area
              </button>
            </section>
          </div>

          <div className="row mt-5">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Enquiry Category</th>
                  <th scope="col">Distribution Type</th>
                  <th scope="col">Villages</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {areaAssign.map((item, index) => (
                  // console.log(item, "444444444444444444444444"),
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <ul>
                        <li>{item.category_name}</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>{item.dType}</li>
                      </ul>
                    </td>
                    <td>
                      {/* <Select
                            isMulti
                            options={options}
                            value={selectedVillagesList.map((village) => ({
                              value: village.value,
                              label: village.label,
                            }))}
                            onChange={handleChange}
                            isSearchable={true}
                            filterOption={(option, inputValue) =>
                              option.label
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            }
                          /> */}
                      <ul className="border p-2 list-unstyled">
                        <li>{item.name}</li>
                      </ul>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          editActionCall(item);
                        }}
                        className="myActionBtn m-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========table======= */}

          <div className="row mt-3">
            <button
              className="col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handleSubmit}
              type="button"
            >
              Save
            </button>
            <button
              className="ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2"
              onClick={handlCancel}
              type="button"
            >
              Cancel{" "}
            </button>
          </div>
        </main>
      </div>
      {/* new modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h5 className="modal-title" id="TalukaModalLabel">
            {show === 1 ? "Add Assign Area" : "Edit Assign Area"}
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            {/*<div className="row mt-5">
                <h5>Select User</h5>
                <Select
                  value={selectedOptionUser}
                  onChange={handleChangeUser}
                  options={useroptions}
                  isSearchable={true}
                  placeholder="Search for a user..."
                />
                      </div> */}
            <div className="row mt-5">
              <h5>Select Category</h5>
              <Select
                value={selectedCtaegory}
                onChange={handleChangeCategory}
                options={categoryoptions}
                isSearchable={true}
                isMulti
                placeholder="Search for a category..."
              />
              {/*<h5 className="mt-4 ">Select DistributionType</h5>
<Select
options={distributionoptions}
onChange={handleChangeDistribution}
value={selectedDistributionType}
                    />*/}

              <h5 className="mt-4">Select Villages want to assign</h5>
              <Select
                value={selectedOptionVillage}
                onChange={handleChangeVillage}
                options={options}
                isSearchable={true}
                isMulti
                placeholder="Search for a village..."
              />
            </div>
          </div>
         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
