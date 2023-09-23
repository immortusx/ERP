
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserListFromDb,
  clearUserListState,
} from "../redux/slices/getUserListSlice";
import { setEditUserData } from "../redux/slices/editUserDataSlice";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import moment from "moment";
import { Modal, Button } from "react-bootstrap";
import "../styles/Users.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllVillageAction } from "./Master/Village/getEditeVillage";
import Select from "react-select";
import {
  addassigneAreaToDb,
  clearAddassigneAreaState,
} from "../redux/slices/assignedAreaSlice";
import { setShowMessage } from "../redux/slices/notificationSlice";
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
export default function AreaAssignListList({ showModal, hideModal, id, selectedEmployeeIds }) {
  const [areaAssign, setareaAssign] = useState([]);
  const [assigneAreaPerUser, setAssignedAreaPerUser] = useState([]);
  const [show, setShow] = useState(false);
  const [allUser, setallUser] = useState([]);
  const [selectedOptionUser, setSelectedOptionUser] = useState([]);
  const [selectedCtaegory, setselectedCtaegory] = useState();
  const [selectedOptionVillage, setSelectedOptionVillage] = useState(null);
  const [selectedDistributionType, setSelectedDistributionType] = useState([]);
  const [allVillageData, setAllVillageData] = useState([]);
  const [enquireCtaegory, setEnquiryCtaegory] = useState([]);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const location = useLocation();

  const getIds = () => {
    return selectedEmployeeIds;
  }

  //   const [id, setId] = useState(null);
  const [categoryd, setCategoryd] = useState(null);
  const [dId, setDId] = useState(null);
  const [type, setType] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState();
  //   const location = useLocation();
  //   const areaAssignuser = location.state
  //     ? location.state.assigneAreaPerUserid
  //     : [];
  const addAssignState = useSelector(
    (state) => state.addassigneAreaSlice.addassigneAreaState
  );

  useEffect(() => {
    if (addAssignState.isSuccess) {
      if (addAssignState.message.isSuccess) {
        dispatch(setShowMessage("Area is assigned"));
        dispatch(clearAddassigneAreaState());
        hideModal();
        getAreaAssignUserFromDb();
        clearInpHook();
      } else {
        dispatch(setShowMessage("Something is wrong"));
      }
    }
  }, [addAssignState]);
  function clearInpHook() {
    setSelectedOptionUser([]);
    setselectedCtaegory("");
    setSelectedDistributionType("");
    setSelectedOptionVillage(null);
  }
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
 
  const handleChangeCategory = (selectedOption) => {
    setselectedCtaegory(selectedOption);
  };
  const handleChangeVillage = (selectedOption) => {
    setSelectedOptionVillage(selectedOption);
  };
  const handleChangeDistribution = (selectedOption) => {
    setSelectedDistributionType(selectedOption);
    console.log(selectedOption, "selectedOption");
  };
  const useroptions = allUser.map((user) => ({
    value: user.id,
    label: user.name,
  }));
  const [selectedEmployeeassign, setSelectedEmployeeassign] = useState([]);
  const selectedUser = allUser.find((user) => user.id === id);

  const categoryoptions = enquireCtaegory.map((category) => ({
    value: category.id,
    label: category.category_name,
  }));
  const options = allVillageData.map((village) => ({
    value: village.id,
    label: village.name,
  }));
  const distributionoptions = [{ value: 1, label: "Area wise" }];
  // const deleteActionCall = (data) => {
  //     //console.log(data,"cccccccccccccccccccccccc")
  //     setType("asignArea_delete");
  //     setId(data.id);
  //     setCategoryd(data.category_id);
  //     setDId(data.dId);
  //     setDeleteMessage(
  //         `Are You Sure You Want To Delete The Assign Area of  '${data.first_name} ${data.last_name}'?`
  //     );
  //     setDisplayConfirmationModal(true);
  // };
  // const hideConfirmationModal = () => {
  //     setDisplayConfirmationModal(false);
  // };
  async function getAreaAssignUserFromDb() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/get-areaAssignUser`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response.data?.isSuccess) {
        console.log(
          response.data.result,
          "response.data.resultresponse.data.result5555555555555"
        );
        function combineObjects(array) {
          const combinedObjects = {};

          // Iterate through the array
          array.forEach((obj) => {
            const key = obj.category_name + "_" + obj.id;

            // Create or update the combined object
            if (combinedObjects.hasOwnProperty(key)) {
              combinedObjects[key] = { ...combinedObjects[key], ...obj };
            } else {
              combinedObjects[key] = obj;
            }
          });

          // Convert combined objects back to an array
          const result = Object.values(combinedObjects);

          return result;
        }

        // Call the function with the array of objects
        const combinedArray = combineObjects(response.data.result);


        setareaAssign(combinedArray);
        console.log(combinedArray, "combinedArray");
      }
    });
  }
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
    // handleShow()
    getAreaAssignUserFromDb();
    getAllUserFromDb();
    ;
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
    // setSelecteddTypeList(areaAssign[0].distributionType)
    // setSelectedCategoryList(areaAssign[0].categoryName)
  }, []);
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


  function handleSubmit() {
    console.log(selectedOptionUser, "selectedOptionUser");
    console.log(selectedOptionVillage, "selectedOptionVillage");
    console.log(selectedCtaegory, "selectedCtaegory");
    console.log(allUser, "allUser");
    let userAr = [];
    let villageAr = [];
    let categoryAr = [];

    selectedOptionVillage.map((singleVillage) => {
      villageAr.push({ value: singleVillage.value });
    });
    selectedCtaegory.map((singleCategory) => {
      categoryAr.push({
        category: singleCategory.value,
        value: villageAr,
      });
    });
    selectedOptionUser.map((singleUser) => {
      userAr.push({ id: singleUser.value, category: categoryAr });
    });

    console.log("userAr", userAr);


    dispatch(addassigneAreaToDb(userAr));
  }
  const handleChangeUser = (selectedOption) => {
    console.log("selectedOptionmm", selectedOption);
    setSelectedOptionUser(selectedOption);
  };
  useEffect(() => {
    if (selectedUser) {
      setSelectedOptionUser([
        { value: selectedUser.id, label: selectedUser.name },
      ]);
    }
    console.log(selectedUser, "selectedUser");
  }, [selectedUser]);
  useEffect(() => {
   
    if (allUser && selectedEmployeeIds) {
      console.log(selectedEmployeeIds, 'sler')
      const updatedEmployees = []
      allUser.forEach((item) => {
        if (selectedEmployeeIds.includes(item.id)) {
          updatedEmployees.push({
            value: item.id,
            label: item.name,
          });
        }
      });
      setSelectedOptionUser(updatedEmployees);
    }
  }, [allUser, selectedEmployeeIds])


  const submitDelete = async (type, id, categoryd, dId) => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/delete-area/${id}/${categoryd}/${dId}`;
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
        setDisplayConfirmationModal(false);
        getAreaAssignUserFromDb();
      } else {
        dispatch(setShowMessage("failed to delete"));
      }
    });
  };
  return (
    <>
      {/* new modal */}
      <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <h5 className="modal-title" id="TalukaModalLabel">
            Assign Area
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="row mt-5">
              <h5>Select User</h5>
              <Select
                isMulti
                value={selectedOptionUser}
                onChange={handleChangeUser}
                options={useroptions}
                placeholder="Search for a user..."
              />
            </div>
            <div className="row mt-5">
              <h5>Select Category</h5>
              <Select
                value={selectedCtaegory}
                onChange={handleChangeCategory}
                options={categoryoptions}
                isMulti
                placeholder="Search for a category..."
              />

              <h5 className="mt-4">Select DistributionType</h5>
              <Select
                options={distributionoptions}
                onChange={handleChangeDistribution}
                value={selectedDistributionType}
              />

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
          <Button variant="secondary" onClick={hideModal}>
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