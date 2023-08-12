
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserListFromDb, clearUserListState } from '../redux/slices/getUserListSlice'
import { setEditUserData } from '../redux/slices/editUserDataSlice'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from 'axios'
import moment from 'moment'
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";

import '../styles/Users.css'


import Checkbox from '@mui/material/Checkbox'
import { Link, NavLink, useNavigate } from 'react-router-dom';
export default function EnquiryList() {
    const [enquiries, setEnquiries] = useState([]);
    const [showComponent, setShowComponent] = useState(false);
    const [newEnquiryList, setNewEnquiryList] = useState({
      listDsp: [],
    });
    const navigate = useNavigate()

    function editActionCall() {

    }

    
    const[selectAll,setSelectAll]=useState(false);
    const[rowData,setRowData]=useState([]);
    
    const handleHeaderCheckboxClick=()=>{
        setSelectAll(!selectAll);
    }
  
    const handleChildCheckboxClick=(itemId)=>{
        const updatedRowsData=rowData.map((row)=>{
            if(row.id==itemId){
                return{
                    ...row,
                    checkbox:!row.checkbox,
                };
            }
            return row;
        });
        setRowData(updatedRowsData);
    }


const label = { inputProps: { "aria-label": "Checkbox demo" } };
 const hideModal = () =>{
    setShowComponent(false);
 }

const handleEditArea = async (ev) => {
  try {
    // console.log(ev.group_id, "evvvvvv");
    console.log(ev.id, "evvvvvv");

    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiriesbyId/${ev.id}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };

    const response = await Axios.get(url, config);
    console.log(response.data,"data!!!!!!!!!!!")
    setShowComponent(true)

    // if (response.data && response.data.isSuccess) {
    //   console.log("response.data", response.data.result);
    //   console.log("ev", ev);

    //   const groupedData = {};

    //   for (const item of response.data.result) {
    //     const {
    //       id,
    //       user_id,
    //       category_id,
    //       distribution_id,
    //       dType,
    //       first_name,
    //       last_name,
    //       phone_number,
    //       group_id,
    //     } = item;

    //     if (!groupedData[category_id]) {
    //       groupedData[category_id] = {
    //         id: id,
    //         group_id: group_id,
    //         userId: user_id,
    //         fname: first_name,
    //         lname: last_name,
    //         phonenumber: phone_number,
    //         distributiontype: dType,
    //         categoryData: { label: item.category_name, value: category_id },
    //         villageData: [{ label: item.name, value: distribution_id }],
    //       };
    //     } else {
    //       if (
    //         !groupedData[category_id].villageData.some(
    //           (village) => village.value === distribution_id
    //         )
    //       ) {
    //         groupedData[category_id].villageData.push({
    //           label: item.name,
    //           value: distribution_id,
    //         });
    //       }
    //     }
    //   }

    //   console.log(Object.values(groupedData));

    //   navigate("/sale/area-Assign/add-AsignArea", {
    //     state: { assigneAreaPerUser: Object.values(groupedData) },
    //   });
    // } else {
    //   console.log(
    //     "No data received from the server or the request was not successful."
    //   );
    //   setShowComponent(true);
    //   console.log(ev.user_id, "ev");
    //   // setName(ev.first_name+ " "+ev.last_name);
    //   setId(ev.user_id);
    //   // navigate("/sale/area-Assign", {
    //   //   state: { assigneAreaPerUserid: ev },
    //   // });
    //   // navigate("/sale/area-Assign", {
    //   //   state: { assigneAreaPerUser: response.data.result },
    //   // });
    // }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
  }
};

async function getDspList(id) {
   const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-dsp/${id}`;
   const config = {
     headers: {
       token: localStorage.getItem("rbacToken"),
     },
   };
   await Axios.get(url, config).then((response) => {
     if (response.data) {
       if (response.data.isSuccess) {
         console.log("response.data", response.data);
         // setCategoriesList(response.data.result)
         setNewEnquiryList((newEnquiryList) => ({
           ...newEnquiryList,
           ["listDsp"]: response.data.result,
         }));
       }
     }
   });
 }


function handleSubmit() {
    console.log("form save")
//   console.log(selectedOptionUser, "selectedOptionUser");
//   console.log(selectedOptionVillage, "selectedOptionVillage");
//   console.log(selectedCtaegory, "selectedCtaegory");
//   console.log(allUser, "allUser");
//   let userAr = [];
//   let villageAr = [];
//   let categoryAr = [];

//   selectedOptionVillage.map((singleVillage) => {
//     villageAr.push({ value: singleVillage.value });
//   });
//   selectedCtaegory.map((singleCategory) => {
//     categoryAr.push({
//       category: singleCategory.value,
//       value: villageAr,
//     });
//   });
//   selectedOptionUser.map((singleUser) => {
//     userAr.push({ id: singleUser.value, category: categoryAr });
//   });

//   console.log("userAr", userAr);

//   dispatch(addassigneAreaToDb(userAr));

  // let tempAr = [];
  // selectedOptionUser.forEach((userItem) => {
  //   tempAr.push({
  //     value: selectedOptionVillage.map((villageData) => villageData.value),
  //     // value:selectedOptionVillage.value,
  //     id: userItem.value,
  //     category: selectedCtaegory.value,
  //     category: selectedCtaegory.map((categoryData) => categoryData.value),
  //   });
  // });

  // console.log(tempAr, "tempAr");
}




 
 useEffect( ()=>{
     getDspList();
   },  []);

    const columns = [
      {
        field: "rowNumber",
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
        field: "first_name",
        headerAlign: "left",
        align: "left",
        headerName: "First Name",
        minWidth: 150,
        flex: 1,
        valueGetter: (params) => {
          return `${params.row.first_name ? params.row.first_name : "-"}`;
        },
      },
      {
        field: "last_name",
        headerName: "Last Name",
        minWidth: 150,
        flex: 1,
        valueGetter: (params) => {
          return `${params.row.last_name ? params.row.last_name : "-"}`;
        },
      },
      {
        field: "phone_number",
        headerName: "Phone Number",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
        headerAlign: "left",
        align: "left",
        type: "number",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "product",
        headerName: "Product",
        // description: 'This column has a value getter and is not sortable.',
        // sortable: false,
        minWidth: 200,
        flex: 1,
        // valueGetter: (params) =>
        //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      },
      {
        field: "sales_person",
        headerName: "Sales Person",
        headerAlign: "left",
        align: "left",
        type: "number",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "date",
        headerName: "Enquiry date",
        headerAlign: "left",
        align: "left",
        type: "number",
        minWidth: 130,
        flex: 1,
        valueGetter: (params) => {
          return `${moment(params.row.date).format("LL")}`;
        },
      },
      {
        field: "delivery_date",
        headerName: "Expected delivery",
        headerAlign: "left",
        align: "left",
        minWidth: 150,
        flex: 1,
        valueGetter: (params) => {
          return `${moment(params.row.delivery_date).format("LL")}`;
        },
      },
      {
        field: "district",
        headerName: "District",
        headerAlign: "left",
        align: "left",
        type: "text",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "taluka",
        headerName: "Taluka",
        headerAlign: "left",
        align: "left",
        type: "text",
        minWidth: 120,
        flex: 1,
      },
      {
        field: "village",
        headerName: "Village",
        headerAlign: "left",
        align: "left",
        type: "text",
        minWidth: 120,
        flex: 1,
      },
      {
        field: "enquiry_source",
        headerName: "Source of Enquiry",
        headerAlign: "left",
        align: "left",
        type: "text",
        minWidth: 180,
        flex: 1,
      },
      // {
      //     field: 'actions',
      //     headerName: 'Actions',
      //     className: 'bg-dark',
      //     sortable: false,
      //     filterable: false,
      //     headerAlign: 'center',
      //     align: 'center',
      //     disableColumnMenu: true,
      //     minWidth: 200,
      //     flex: 1,
      //     position: 'sticky',
      //     renderCell: (params) => (
      //         <div>
      //             <button onClick={() => { console.log(params) }} className='myActionBtn m-1'>
      //                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
      //                     <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
      //                     <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
      //                 </svg>
      //             </button>
      //             <button className='myActionBtn m-1'>
      //                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
      //                     <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
      //                 </svg>
      //             </button>
      //         </div>
      //     ),
      // },
      {
        field: "menu",
        headerName: <FontAwesomeIcon icon={faEllipsisV} />,
        className: "bg-dark",
        sortable: false,
        filterable: false,
        headerAlign: "center",
        align: "center",
        disableColumnMenu: true,
        maxWidth: 100,
        // flex: 1,
        position: "sticky",
        renderCell: (params) => (
          <div className="d-flex justify-content-center dotHover">
            <FontAwesomeIcon icon={faEllipsisV} />
            <div className="expandDiv">
              <button
                className="myActionBtn m-1"
                onClick={() => {
                  handleEditArea(params.row);
                }}
              >
                <PlayCircleIcon color="secondary" />
              </button>
              <button
                onClick={() => {
                  console.log(params);
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
              <button className="myActionBtn m-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-trash3"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                </svg>
              </button>
            </div>
          </div>
        ),
      },
    ];
    async function getEnquiriesFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiries`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {

                setEnquiries(response.data.result)
            }
        })
    }
    let counter = 1;
    useEffect(() => {
        getEnquiriesFromDb()
    }, [])

    useEffect(() => {
        const rowsData = enquiries.map((item, index) => ({
          ...item,
          rowNumber: index + 1,
          checkbox: selectAll,
        }));
        setRowData(rowsData);
      }, [enquiries, selectAll]);


    // const rowsData = enquiries.map((item, index) => ({ ...item, rowNumber: index + 1 }));


    return (
      <div>
        <div className="myTbl">
          {/* <NavLink to={/edit-user}>callme</NavLink > */}
          <div className="my-3  d-flex align-items-end justify-content-end">
            <div
              onClick={() => {
                navigate("/sale/enquiryies/newenquiry");
              }}
              className="d-flex align-items-center"
              type="button"
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
              <h6 className="m-0 ps-1">Add enquiry</h6>
            </div>
          </div>

          <div
            className="tableMenuHover"
            style={{ height: "85vh", width: "100%" }}
          >
            <DataGrid
              rows={rowData}
              columns={columns}
              getRowId={(params) => {
                return params.rowNumber;
              }}
              style={{
                fontFamily: "Poppins",
                padding: 5,
                backgroundColor: "white",
              }}
              className="rounded"
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                ...enquiries.initialState,
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
                    <span>There is no Enquiry with current branch</span>
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
        </div>
        <Modal
          show={showComponent}
            onHide={hideModal}
        >
          <Modal.Header closeButton>
            <h5 className="modal-title" id="TalukaModalLabel">
              Assign Seals Person
            </h5>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              <div className="row mt-5">
                <h5>Select Seals Person</h5>
                <Select
                  //   value={selectedCtaegory}
                  //   onChange={handleChangeCategory}
                  //   options={categoryoptions}
                  isMulti
                  placeholder="Search for seals Person..."
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={hideModal}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );

}
