import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'


import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Checkbox from '@mui/material/Checkbox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { addStateToDb, clearAddState } from '../../../redux/slices/Master/State/addStateSlice'
import { setShowMessage } from '../../../redux/slices/notificationSlice'
import { Modal, Button } from 'react-bootstrap';
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';
import { Switch } from '@mui/material';
import axios from 'axios'
const Part_List = () => {
    const dispatch = useDispatch()
    const [modalShow, setModalShow] = React.useState(false);
    const [checked, setChecked] = useState(true);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [partsList, setPartsList] = useState([]);
    const [editID, setEditID] = useState(0);
    const [evData, setEvData] = useState({
        partName: "",
        partNumber: "",
        partDescription: "",
        is_active: false,
        hsn: 34567
    });

    const handleShow = () => {
        setEditMode(false);
        setEvData({
            partName: '',
            partNumber: '',
            partDescription: '',
            is_active: '',
            hsn: ''
        });
        setModalShow(true);
        setModalState(false)
    }
    const handleClose = () => {
        setModalShow(false);
    }
    const editeStateModal = (data) => {
        setEditID(data.id);
        setEditMode(true);
        setEvData({
            partName: data.name,
            partNumber: data.part_no,
            partDescription: data.description,
            is_active: data.is_active,
            hsn: data.hsn_no
        });
        // data.is_active === '1' ? setChecked(true) : setChecked(false);
        setModalShow(true);
        setModalState(true);
    }
    const handleIsActiveChange = (event) => {
        setChecked(event.target.checked);
    };
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };

    const deleteStateAlert = (data) => {
        console.log(editMode, 'eddd');
        setType('state_delete');
        setId(data.id)
        setDeleteMessage(`Are You Sure You Want To Delete The Part '${data.name}'?`);
        setDisplayConfirmationModal(true);
    }
    const submitDelete = (type, id) => {

    }
    const getAllParts = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-parts`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data && response.data.isSuccess) {
                console.log(response.data.result)
                setPartsList(response.data.result);
            }
        });
    }
    useEffect(() => {
        getAllParts();
    }, [])
    useEffect(() => {
        console.log('evData ***********8', evData)
    }, [evData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(evData, 'evdata');
        console.log(checked, 'check');
        console.log(editID, 'editIdSubmit');

        const url = `${process.env.REACT_APP_NODE_URL}/api/master/add-parts`;
        const editurl = `${process.env.REACT_APP_NODE_URL}/api/master/edit-parts/${editID}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };

        const requestData = {
            name: evData.partName,
            part_no: evData.partNumber,
            description: evData.partDescription,
            hsn_no: evData.hsn,
            is_active: checked === true ? '1' : '0'
        };


        if (editID === 0) {
            console.log(editID,'submittime')
            await axios.post(url, requestData, config)
                .then((response) => {
                    if (response.data && response.data.isSuccess) {
                        console.log('response', response.data.result);
                        setModalShow(false);
                        getAllParts();
                        setEditID(0);
                    }
                });
        } else {
            await axios.post(editurl, requestData, config)
                .then((response) => {
                    if (response.data && response.data.isSuccess) {
                        console.log('response', response.data.result);
                        setModalShow(false);
                        getAllParts();
                        setEditID(0);
                    }
                });
        }


        // dispatch(setShowMessage('All field must be field'))
        setEvData({
            partName: '',
            partNumber: '',
            partDescription: '',
            is_active: '',
            hsn: ''
        });
    };

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setEvData({ ...evData, [name]: value })
    }
    const switchStyles = {
        switchColor: '#3E5367',
        handleColor: '#FFF',
    };

    // const columns = [
    //     {
    //         field: 'id',
    //         headerAlign: 'center',
    //         align: 'center',
    //         headerName: 'No',
    //         minWidth: 80,
    //         flex: 1,
    //     },

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
            field: 'partName',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Part Name',
            minWidth: 120,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.name ? params.row.name : '-'}`
            }
        },
        {
            field: 'partNumber',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Part Number',
            minWidth: 130,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.part_no ? params.row.part_no : '-'}`
            }
        },
        {
            field: 'partDescription',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Part Description',
            minWidth: 200,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.description ? params.row.description : '-'}`
            }
        },
        {
            field: 'hsn',
            headerAlign: 'left',
            align: 'left',
            headerName: 'HSN',
            minWidth: 80,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.hsn_no ? params.row.hsn_no : '-'}`
            }
        },
        {
            field: 'is_active',
            headerName: 'Active',
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            minWidth: 90,
            flex: 1,
            renderCell: (params) => (
                params.row.is_active === '1' ? <CheckIcon style={{ color: 'green' }} /> : <ClearIcon style={{ color: 'red' }} />
            ),

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
        //     minWidth: 80,
        //     flex: 1,
        //     position: 'sticky',
        //     renderCell: (params) => (
        //         <div>
        //             {/* <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'> */}
        //             <button className='myActionBtn m-1'
        //                 onClick={() => { editeStateModal(params.row) }}
        //             >
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
        //                     <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
        //                     <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
        //                 </svg>
        //             </button>
        //             {/* <button className='myActionBtn m-1'
        //                 onClick={() => { deleteStateAlert(params.row) }}
        //             >
        //                 <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
        //                     <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
        //                 </svg>
        //             </button> */}
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
            maxWidth: 50,
            // flex: 1,
            position: "sticky",
            renderCell: (params) => (
              <div className="d-flex justify-content-center dotHover">
                <FontAwesomeIcon icon={faEllipsisV} />
                <div className="expandDiv">
                <button className='myActionBtn m-1'
                        onClick={() => { editeStateModal(params.row) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                </div>
              </div>
            ),
          },
    ];

    useEffect(() => {
        const rowsData = partsList.map((item, index) => ({
          ...item,
          id: index + 1,
          checkbox: selectAll,
        }));
        setRowData(rowsData);
      }, [partsList, selectAll]);

    return (
        <>
            <div className=''>
                {/* <NavLink to={/edit-user}>callme</NavLink > */}
                <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div className='d-flex align-items-center' type='button'>

                        <h6 className='m-0 ps-1'>
                            <button type="button" className="btn btn-primary"
                                onClick={handleShow}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add Part
                            </button>
                        </h6>
                    </div>
                </div>


                <div className='tableMenuHover' style={{ height: '85vh', width: '100%' }}>
                    <DataGrid
                        rows={rowData}
                        columns={columns}
                        getRowId={(params) => {
                            return params.id
                        }}
                        className='rounded'
                        style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                              ...partsList.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        components={{
                            Toolbar: GridToolbar,
                            NoRowsOverlay: () => (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>There is no Users with current branch</span>
                                </div>)
                        }}
                        componentsProps={{
                            toolbar: {
                                position: 'right',
                                style: { fontFamily: 'Poppins', alignSelf: 'end' },
                            },
                        }}
                        rowSelection={false}
                        autoPageSize={false}
                    />
                </div>
            </div>


            <AlertDeleteModal
                showModal={displayConfirmationModal}
                confirmModal={submitDelete}
                hideModal={hideConfirmationModal}
                type={type} id={id} message={deleteMessage}
            />
            {/* state modal */}
            <Modal
                show={modalShow}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="districtModalLabel">ADD PART</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="mb-3">
                            <label htmlFor="recipient-name" className="col-form-label">Part Name:</label>
                            <input type="text" className="form-control" id="recipient-name" name="partName"
                                defaultValue={evData.partName} onChange={(e) => { onChangeHandler(e) }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Part Number:</label>
                            <input className="form-control" id="message-text" name="partNumber"
                                defaultValue={evData.partNumber} onChange={(e) => { onChangeHandler(e) }}
                            ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Part Description:</label>
                            <textarea className="form-control" id="message-text" name="partDescription"
                                defaultValue={evData.partDescription} onChange={(e) => { onChangeHandler(e) }}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">HSN:</label>
                            <input className="form-control" id="message-text" name="hsn"
                                defaultValue={evData.hsn} onChange={(e) => { onChangeHandler(e) }}
                            ></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label" name="is_active">Active:</label>
                            <Switch defaultChecked={evData.is_active == '1' ? true : false} onChange={handleIsActiveChange} style={{
                                // background: switchStyles.switchColor,
                                '--react-switch-bg-color': switchStyles.switchColor,
                                '--react-switch-handle-color': switchStyles.handleColor,
                            }} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={handleClose}
                    > Close </Button>
                    <Button variant="primary"
                        onClick={handleSubmit}
                    >  {modalState === true ? "Edit" : "Save"}  </Button>
                </Modal.Footer>
            </Modal>
            {/* state modal end*/}
        </>
    )
}

export default Part_List
