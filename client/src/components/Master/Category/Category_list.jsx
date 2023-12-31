import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import Axios from "axios";
import { getToPathname } from "@remix-run/router";
import { getCategory } from "./getEditCategory";
import { setShowMessage } from "../../../redux/slices/notificationSlice";
import { useNavigate } from "react-router-dom";
import AlertDeleteModal from "../../AlertDelete/AlertDeleteModal";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Checkbox from '@mui/material/Checkbox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { addDepartmentToDb } from "../../../redux/slices/Master/Department/addDepartmentSlice";
import { setEdicategoryData } from "../../../redux/slices/Master/Category/editCategorySlice";
import { Tooltip } from "@mui/material";
import translations from "../../../assets/locals/translations";
export default function Category_list({ workFor }) {
  const currentLanguage = useSelector((state) => state.language.language);
  const [categoryList, setCategoryList] = useState([]);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const getCategoryForm = () => {
    getCategory()
      .then((data) => {
        console.log("Response from getCategory:", data.result);
        const filterCategory = data.result.filter((item) => item.id !== 1);
        setCategoryList(filterCategory);
      })
      .catch((error) => {
        console.error("Error in getCategory:", error);
      });
  }

  useEffect(() => {
    getCategoryForm()

  }, []);

  const editeStateModal = (data) => {
    dispatch(setEdicategoryData(data));
    navigate("/administration/configuration/category/edit", { state: data });
  };

  const [selectAll, setSelectAll] = useState(false);
  const [rowData, setRowData] = useState([]);

  const handleHeaderCheckboxClick = () => {
    setSelectAll(!selectAll);
  }

  const handleChildCheckboxClick = (itemId) => {
    const updatedRowsData = rowData.map((row) => {
      if (row.id == itemId) {
        return {
          ...row,
          checkbox: !row.checkbox,
        };
      }
      return row;
    });
    setRowData(updatedRowsData);
  }


  const label = { inputProps: { "aria-label": "Checkbox demo" } };


  const columns = [
    {
      field: "id",
      headerName: (
        <Checkbox
          {...label}
          checked={selectAll}
          onClick={handleHeaderCheckboxClick}
        />
      ),
      minWidth: 90,
      // flex: 1,
      renderCell: (params) => (
        <Checkbox
          {...label}
          checked={params.row.checkbox}
          onClick={() => handleChildCheckboxClick(params.row.id)}
        />
      ),
    },

    {
      field: "category_name",
      headerAlign: "left",
      align: "left",
      headerName: translations[currentLanguage].category,
      minWidth: 120,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.category_name ? params.row.category_name : "-"}`;
      },
    },
    {
      field: "category_description",
      headerAlign: "left",
      align: "left",
      headerName: translations[currentLanguage].description,
      minWidth: 250,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.category_description
          ? params.row.category_description
          : "-"
          }`;
      },
    },
    {
      field: "department",
      headerAlign: "left",
      align: "left",
      headerName: translations[currentLanguage].department,
      minWidth: 250,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.department ? params.row.department : "-"}`;
      },
    },
    {
      field: "menu",
      headerName: (
        <FontAwesomeIcon icon={faEllipsisV} style={{ marginRight: "15px" }} />
      ),
      className: "bg-dark",
      sortable: false,
      filterable: false,
      headerAlign: "right",
      align: "right",
      disableColumnMenu: true,
      width: 130,
      // flex: 1,
      position: "sticky",
      renderCell: (params) => (
        <div className="d-flex justify-content-center dotHoverempicon ">
          <FontAwesomeIcon icon={faEllipsisV} />
          <div className="expandDiv">
            <Tooltip title={translations[currentLanguage].edit}>
              <button
                className="myActionBtn m-1"
                onClick={() => {
                  editeStateModal(params.row);
                }}
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
            </Tooltip>
            <Tooltip title={translations[currentLanguage].delete}>
              <button
                onClick={() => {
                  deleteActionCall(params.row);
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
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const rowsData = categoryList.map((item) => ({
      ...item,
      id: item.id,
      checkbox: selectAll,
    }));
    setRowData(rowsData);
  }, [categoryList, selectAll]);
  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      console.log(categoryList, 'partList');
    }
  }, [categoryList])
  const deleteActionCall = (data) => {
    setType("category_delete");
    setDeleteCategoryId(data.id);
    setDeleteMessage(
      `Are You Sure You Want To Delete The category '${data.category_name}'?`
    );
    setDisplayConfirmationModal(true);
  };

  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  const submitDelete = async () => {
    if (deleteCategoryId) {
      console.log(deleteCategoryId, "iiiiiiiiiiiiiiii");
      const url = `${process.env.REACT_APP_NODE_URL}/api/master/delete-category/${deleteCategoryId}`;
      const config = {
        headers: {
          token: localStorage.getItem("rbacToken"),
        },
      };
      try {
        const response = await Axios.get(url, config);
        console.log(response, "response.data");
        if (response.data && response.data.isSuccess) {
          console.log(response.data, "delete true");
          dispatch(setShowMessage("Category Deleted"));
          getCategoryForm();
          setDisplayConfirmationModal(false);
        } else {
          console.log(response.data, "false");
          dispatch(setShowMessage("Failed to delete"));
        }
      } catch (error) {
        console.error("Error while deleting branch:", error);
        // Handle the error as needed.
      }
    }
  };
  const redirectModal = () => {
    navigate("/administration/configuration");
  };


  return (
    <>
      <div className="my-3 d-flex align-items-end justify-content-end">
        <div className="d-flex align-items-center" type="button">
          <h6 className="m-0 ps-1">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                navigate("/administration/configuration/category/add");
              }}
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
              &nbsp;  {translations[currentLanguage].addcategory}
            </button>
          </h6>
          <Button
            variant="btn btn-warning mx-1"
            style={{ width: '75px', height: '40px', fontSize: '14px', borderRadius: '20px' }}
            onClick={() => {
              redirectModal();
            }}
          >
            {translations[currentLanguage].back}
          </Button>

        </div>
      </div>
      <div className="addUser myBorder bg-white rounded p-3">
        <div className="mt-4 tableMenuHover" style={{ height: "85vh", width: "100%" }}>
          <DataGrid
            rows={rowData}
            columns={columns}
            getRowId={(params) => {
              return params.id;
            }}
            className="rounded"
            style={{
              fontFamily: "Poppins",
              padding: 5,
              backgroundColor: "white",
            }}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              ...categoryList.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            components={{
              Toolbar: GridToolbar,
              NoRowsOverlay: () => (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>There is no Users with current branch</span>
                </div>
              ),
            }}
            componentsProps={{
              toolbar: {
                position: "right",
                style: { fontFamily: "Poppins", alignSelf: "end" },
              },
            }}
            rowSelection={false}
            autoPageSize={false}
          />
        </div>
        <AlertDeleteModal
          showModal={displayConfirmationModal}
          confirmModal={submitDelete}
          hideModal={hideConfirmationModal}
          type={type}
          id={id}
          message={deleteMessage}
        />
      </div>
    </>
  );
}
