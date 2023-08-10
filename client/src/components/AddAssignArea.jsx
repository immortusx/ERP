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

import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";

import Axios from "axios";
import { getToPathname } from "@remix-run/router";
import { setShowMessage } from "../redux/slices/notificationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllVillageAction } from "./Master/Village/getEditeVillage";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";

export default function AddAssignArea() {
  const location = useLocation();
  const areaAssign = location.state ? location.state.assigneAreaPerUser : [];

  console.log(areaAssign, "areaAssign");
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allVillageData, setAllVillageData] = useState([]);
  const [selectedOptionVillage, setSelectedOptionVillage] = useState([]);
  const [selectedVillagesList, setSelectedVillagesList] = useState([]);
  const [selectedVillages, setSelectedVillages] = useState([]);
  const [selectedCtaegory, setSelectedCtaegory] = useState([]);
  const [selectedDistributionType, setSelectedDistributionType] = useState([]);
  const [enquireCtaegory, setEnquiryCtaegory] = useState([]);
  const [show, setShow] = useState(0);
  const [allUser, setallUser] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [userId, setUserId] = useState(null);

  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const [categoryd, setCategoryd] = useState(null);
  const [dId, setDId] = useState(null);

  const addAssignState = useSelector(
    (state) => state.addassigneAreaSlice.addassigneAreaState
  );
  const editassignareaData = useSelector(
    (state) => state.editassignareaDataState.editassignareaSliceState
  );

  function clearInpHook() {
    setSelectedCtaegory([]);
    setSelectedOptionVillage([]);
  }

  useEffect(() => {
    if (addAssignState.isSuccess) {
      if (addAssignState.message.isSuccess) {
        console.log(addAssignState, "addAssignState");
        dispatch(setShowMessage("Area is assigned"));
        dispatch(clearAddassigneAreaState());
        setShow(0);
        navigate("/administration/employees");
        clearInpHook();
        //  clearaddaddAgency();
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [addAssignState]);
  useEffect(() => {
    if (editassignareaData.isSuccess) {
      if (editassignareaData.message.isSuccess) {
        console.log(editassignareaData, "editassignareaData");
        dispatch(setShowMessage("Assign Area is updated"));
        dispatch(clearEditassignareaState());
        setShow(0);
        navigate("/administration/employees");
        // navigate("/sale/area-Assign")
        clearInpHook();
        //  clearaddaddAgency();
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [editassignareaData]);

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
      }
    });
  }

  useEffect(() => {
    getAllUserFromDb();
    console.log(allUser, "alluser");
  }, []);

  useEffect(() => {
    getAllVillageAction()
      .then((data) => {
        setAllVillageData(data.result);
      })
      .catch((error) => {
        console.error("Error in getAllVillageAction:", error);
      });
    getEnquiryCategoryFromDb();
    // setSelectedVillagesList(areaAssign[0].names)
    // setSelectedVillagesList(Array.from(areaAssign[0]?.names || []));
    // const names = areaAssign[0].names;
    // const nameId = areaAssign[0].nameId;
    // const combinedArray = names.map((value, index) => ({
    //   value: nameId[index],
    //   label: value,
    // }));
    // setSelectedVillagesList(combinedArray);
  }, []);
  // const handleChange = (selectedOption) => {
  //   // setSelectedOptionVillage(selectedOption);
  //   // const newVillagesList = new Set(selectedVillagesList);
  //   // selectedOption.forEach((option) => {
  //   //     newVillagesList.add(option.label);
  //   // })
  //   // setSelectedVillagesList(newVillagesList);
  //   setSelectedOptionVillage(selectedOption);
  //   setSelectedVillagesList(selectedOption.map((option) => option));
  // };

  const handleChangeCategory = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    setSelectedCtaegory(selectedOption);
  };

  // const handleChangeDistribution = (selectedOption) => {
  //   setSelectedDistributionType(selectedOption);
  // };
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
    setSelectedId(areaAssign[0].userId);
  };

  const handleClose = () => {
    setShow(0);
  };

  const handleChangeVillage = (selectedOption) => {
    setSelectedOptionVillage(selectedOption);
  };

  function handleSubmit() {
    console.log(selectedId, "selectedId");
    console.log(selectedOptionVillage, "selectedOptionVillage");
    console.log(selectedCtaegory, "selectedCtaegory");
    console.log(allUser, "allUser");
    let userAr = [];
    let villageAr = [];
    let categoryAr = [];

    if (selectedCtaegory.length > 0) {
      selectedOptionVillage.map((singleVillage) => {
        villageAr.push({ value: singleVillage.value });
      });
      selectedCtaegory.map((singleCategory) => {
        categoryAr.push({
          category: singleCategory.value,
          value: villageAr,
        });
      });
    }
    userAr.push({userId: userId, id: selectedId, category: categoryAr });

    if (show === 2) {
      console.log("userAr", userAr);
      dispatch(editassignareaUpdateToDb(userAr));
    } else {
      console.log("userArrr", userAr);
      dispatch(addassigneAreaToDb(userAr));
    }
  }

  const editActionCall = (data) => {
    setShow(2);
    dispatch(setEdiassignareaData(data));
    console.log("data", data);
    console.log("data.id", data.id);
    console.log("data.id", data.id);
    setSelectedId(data.categoryData.value);
    setUserId(data.userId);
    let newArr = [];
    console.log(data.villageData, "JEUEUUUEU");
    if (data.villageData && data.villageData.length > 0) {
      newArr = data.villageData;
      newArr = data.villageData;
    }
    // let tempAr = [];
    // newArr.forEach((element) => {
    //   if (options && options.length > 0) {
    //     const data = options.find((item) => item.value == element);
    //     tempAr.push(data);
    // }
    // console.log(newArr, "newArr");
    // setSelectedOptionVillage(newArr);
    // });

    console.log(newArr, "newArr");
    setSelectedOptionVillage(newArr);
    // let newArry = [];
    // if (data.categoryData && data.categoryData.length > 0) {
    const newArry = data.categoryData;
    console.log(data.categoryData, "catoegiru Dtaa");
    // }
    // let tempArr = [];
    // newArry.forEach((element) => {
    //   if (categoryoptions && categoryoptions.length > 0) {
    //     const data = categoryoptions.find((item) => item.label == element);
    //     tempArr.push(data);
    //   }
    //   setSelectedCtaegory(tempArr);
    // });

    console.log(newArry, "newArry");
    setSelectedCtaegory([newArry]);
  };

  const deleteActionCall = (data) => {
      console.log(data,"cccccccccccccccccccccccc")
      setType("asignArea_delete");
      setId(data.userId);
      setCategoryd(data.categoryData.value);
      // setDId(data.villageData);
      setDeleteMessage(
        `Are You Sure You Want To Delete The Assign Area of  '${data.categoryData.label}'?`
      );
      setDisplayConfirmationModal(true);
  };
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const submitDelete = async (type, id, categoryd, dId) => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/delete-area/${id}/${categoryd}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data && response.data.isSuccess) {
        console.log(response.data);
        dispatch(setShowMessage("Assign Area Deleted"));
        // dispatch(addRoleToDb());
        //  setDisplayConfirmationModal(false);
        //  getAreaAssignUserFromDb();
      } else {
        dispatch(setShowMessage("failed to delete"));
      }
    });
  };

  function handlCancel() {
    console.log(selectedOptionVillage, "selectedOptionVillage");
    navigate("/administration/employees");
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

  useEffect(() => {
    if (show === 0) {
      setSelectedCtaegory([]);
      setSelectedOptionVillage([]);
    }
  }, [show]);

  return (
    <>
      <div className="addUser myBorder bg-white rounded p-3">
        <main>
          <div className=" row mt-3 ">
            <h3 className="myLabel">Assign Area</h3>
          </div>
          <div className="row mt-2">
            <h5 className="myLabel">User Information</h5>
          </div>
          <div className=" row mt-2 ">
            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel"> Name </label>{" "}
              {areaAssign && (
                <>
                  <p className="myInput inputElement">
                    {areaAssign[0].fname} {areaAssign[0].lname}
                    {}
                  </p>
                </>
              )}
            </section>

            <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
              <label className="myLabel">PhoneNumber </label>
              {areaAssign && (
                <>
                  <p className="myInput inputElement">
                    {areaAssign[0].phonenumber}
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

          <div className="row mt-5 m-0">
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
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <ul>
                        <li>{item.categoryData.label}</li>
                      </ul>
                    </td>
                    <td>
                      <ul>
                        <li>{item.distributiontype}</li>
                      </ul>
                    </td>
                    <td>
                      {/* <Select
                        // isMulti
                        value={selectedOptionVillage}
                        // onChange={handleChange}
                        // filterOption={(option, inputValue) =>
                        //   option.label
                        //     .toLowerCase()
                        //     .includes(inputValue.toLowerCase())
                        // }
                        isDisabled={true}
                      />*/}
                      <Select
                        isDisabled={true}
                        // defaultValue={() => {
                        //   let newArr = item.name.split(",");
                        //   let data = newArr.map((i) => {
                        //     return { label: i, value:i.id };
                        //   });
                        //   console.log("data", data);
                        //   return data;
                        // }}
                        defaultValue={() => {
                          const villages = item.villageData.map((village) => ({
                            label: village.label,
                          }));
                          return villages;
                        }}
                        isSearchable={true}
                        isMulti
                        placeholder="Search for a village..."
                      />
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
                      <button
                        onClick={() => {
                          deleteActionCall(item);
                        }}
                        className="myActionBtn m-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="bi bi-trash3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========table======= */}

          <div className="row mt-3 m-0">
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
                // isMulti={show === 1 ? true : false}
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

      <AlertDeleteModal
        showModal={displayConfirmationModal}
        confirmModal={submitDelete}
        hideModal={hideConfirmationModal}
        type={type}
        id={id}
        categoryd={categoryd}
        message={deleteMessage}
      />
    </>
  );
}
