
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserListFromDb, clearUserListState } from '../redux/slices/getUserListSlice'
import { setEditUserData } from '../redux/slices/editUserDataSlice'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from 'axios'
import moment from 'moment'
import { Modal, Button } from 'react-bootstrap';
import '../styles/Users.css'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAllVillageAction } from './Master/Village/getEditeVillage'
import Select from 'react-select';
import { addassigneAreaToDb, clearAddassigneAreaState } from '../redux/slices/assignedAreaSlice'
import { setShowMessage } from '../redux/slices/notificationSlice'
import AlertDeleteModal from "./AlertDelete/AlertDeleteModal";
export default function AreaAssignListList() {
    const [areaAssign, setareaAssign] = useState([]);
    const [assigneAreaPerUser, setAssignedAreaPerUser] = useState([]);
    const [show, setShow] = useState(false);
    const [allUser, setallUser] = useState([]);
    const [selectedOptionUser, setSelectedOptionUser] = useState();
    const [selectedCtaegory, setselectedCtaegory] = useState();
    const [selectedOptionVillage, setSelectedOptionVillage] = useState(null);
    const [selectedDistributionType, setSelectedDistributionType] = useState([]);
    const [allVillageData, setAllVillageData] = useState([]);
    const [enquireCtaegory, setEnquiryCtaegory] = useState([]);
    const [displayConfirmationModal, setDisplayConfirmationModal] =
        useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [id, setId] = useState(null);
    const [categoryd, setCategoryd] = useState(null);
    const [dId, setDId] = useState(null);   
    const [type, setType] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const addAssignState = useSelector(state => state.addassigneAreaSlice.addassigneAreaState)
    useEffect(() => {
        if (addAssignState.isSuccess) {
            if (addAssignState.message.isSuccess) {
                dispatch(setShowMessage('Area is assignrd'))
                dispatch(clearAddassigneAreaState())
                setShow(false)
                getAreaAssignUserFromDb();
                clearInpHook();

            } else {
                dispatch(setShowMessage('Something is wrong'))
            }

        }
    }, [addAssignState])
    function clearInpHook() {
        setSelectedOptionUser('');
        setselectedCtaegory('');
        setSelectedDistributionType('')
        setSelectedOptionVillage(null)
    }
    const handleClose = () => {
        setShow(false)
    }
    const handleShow = () => {
        setShow(true)
    }
    const handleChangeUser = (selectedOption) => {
        setSelectedOptionUser(selectedOption)
    };
    const handleChangeCategory = (selectedOption) => {
        setselectedCtaegory(selectedOption)
    };
    const handleChangeVillage = (selectedOption) => {
        setSelectedOptionVillage(selectedOption)
    };
    const handleChangeDistribution = (selectedOption) => {
        setSelectedDistributionType(selectedOption)
    };
    const useroptions = allUser.map((user) => ({
        value: user.id,
        label: user.name,
    }));
    const categoryoptions = enquireCtaegory.map((category) => ({
        value: category.id,
        label: category.category_name,
    }));
    const options = allVillageData.map((village) => ({
        value: village.id,
        label: village.name,
    }));
    const distributionoptions = [
        { value: 1, label: 'Area wise' }
    ];
    const deleteActionCall = (data) => {      
        //console.log(data,"cccccccccccccccccccccccc")
        setType("asignArea_delete");
        setId(data.id);
        setCategoryd(data.category_id);
        setDId(data.dId);
        setDeleteMessage(
            `Are You Sure You Want To Delete The Assign Area of  '${data.first_name} ${data.last_name}'?`
        );
        setDisplayConfirmationModal(true);
    };
    const hideConfirmationModal = () => {
        setDisplayConfirmationModal(false);
    };
    const columns = [
        {
            field: 'rowNumber',
            headerAlign: 'center',
            align: 'center',
            headerName: 'No',
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'name',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Name',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.first_name ? params.row.first_name : '-'}
                ${params.row.last_name ? params.row.last_name : '-'}`
            }
        },
        {
            field: 'category',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Category',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.category_name ? params.row.category_name : '-'}`

            }
        },
        {
            field: 'Distribution Type',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Distribution Type',
            minWidth: 150,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.distribution_type ? params.row.distribution_type : '-'}`

            }
        },




        {
            field: 'actions',
            headerName: 'Actions',
            className: 'bg-dark',
            sortable: false,
            filterable: false,
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            minWidth: 200,
            flex: 1,
            position: 'sticky',
            renderCell: (params) => (
                <div>
                    <button onClick={() => { handleEditArea(params.row) }} className='myActionBtn m-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    <button className='myActionBtn m-1' onClick={() => {
                        deleteActionCall(params.row);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button>
                    {/* <button className='myActionBtn m-1'>
                        assign
                    </button> */}
                </div>
            ),
        }
    ];
    async function getAreaAssignUserFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/get-areaAssignUser`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {
                console.log(response.data.result, "response.data.resultresponse.data.result5555555555555")
                function combineObjects(array) {
                    const combinedObjects = {};

                    // Iterate through the array
                    array.forEach(obj => {
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

                // Output the combined array
                //console.log(combinedArray, "&&&&&&&&&&&&&&&&&&&&77777");

                setareaAssign(combinedArray)

            }
        })
    }
    async function getAllUserFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/get-allUser`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {
                setallUser(response.data.result)
                //console.log(combinedArray, "areaassign result66666666666666")
                //console.log(areaAssign, "areaassign result0000000")
            }
        })
    }
    useEffect(() => {
        getAreaAssignUserFromDb()
        getAllUserFromDb()
    }, [])
    useEffect(() => {
        getAllVillageAction().then((data) => {
            console.log(data, "All villageeeee")
            setAllVillageData(data.result)
        }).catch((error) => {
            console.error('Error in getAllVillageAction:', error);
        });
        getEnquiryCategoryFromDb();
        // setSelectedVillagesList(areaAssign[0].names)
        // setSelecteddTypeList(areaAssign[0].distributionType)
        // setSelectedCategoryList(areaAssign[0].categoryName)
    }, [])
    async function getEnquiryCategoryFromDb() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiry-categories`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await Axios.get(url, config).then((response) => {
            if (response.data?.isSuccess) {

                setEnquiryCtaegory(response.data.result)
            }
        })
    }
    const handleEditArea = async (ev) => {
        //console.log(ev, "evvvvvv")
        const url = `${process.env.REACT_APP_NODE_URL}/api/areaAssign/edit-areaAssignUserById/${ev.id}/${ev.category_id}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };


        const response = await Axios.get(url, config);
        if (response.data?.isSuccess) {
            const combinedArrayForIndividualUser = response.data.result.reduce((result, obj) => {
                const existingObj = result.find(item => item.id === obj.id);
                if (existingObj) {
                    if (!existingObj.names.includes(obj.name)) {
                        existingObj.names.push(obj.name);
                    }
                    if (!existingObj.nameId.includes(obj.distribution_id)) {
                        existingObj.nameId.push(obj.distribution_id);
                    }
                    // if (!existingObj.categoryName.includes(obj.category_name)) {
                    //     existingObj.categoryName.push(obj.category_name);
                    // }
                    // if (!existingObj.distributionType.includes(obj.distribution_type)) {
                    //     existingObj.distributionType.push(obj.distribution_type);
                    // }
                } else {
                    result.push({
                        id: obj.id,
                        categoryName: obj.category_name,
                        distributionType: obj.distribution_type,
                        first_name: obj.first_name,
                        last_name: obj.last_name,
                        phone_number: obj.phone_number,
                        names: [obj.name],
                        nameId: [obj.distribution_id],
                        category_id: obj.category_id,
                        distribution_type: obj.dType
                    });
                }
                return result;
            }, []);

            setAssignedAreaPerUser(combinedArrayForIndividualUser)
            console.log(combinedArrayForIndividualUser[0], "combinedArrayForIndividualUsercombinedArrayForIndividualUser")
            //console.log(assigneAreaPerUser,"assigneAreaPerUserassigneAreaPerUserassigneAreaPerUserassigneAreaPerUser")   
            navigate('/sale/areaAssign/addAsignArea', { state: { assigneAreaPerUser: combinedArrayForIndividualUser } })
        }
    }
    const editeAssignAreaAction = async (Data) => {

    };
    function handleSubmit() {
        for (let i = 0; i < selectedOptionVillage.length; i++) {
            selectedOptionVillage[i].id = selectedOptionUser.value;
            selectedOptionVillage[i].category = selectedCtaegory.value;
            selectedOptionVillage[i].distributionType = selectedDistributionType.value;
        }

        dispatch(addassigneAreaToDb(selectedOptionVillage))
    }
    const submitDelete = async (type, id,categoryd,dId) => {
        //console.log(categoryd,dId,"categoryd,dIdcategoryd,dIdcategoryd,dIdcategoryd,dId")
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
    const rowsData = areaAssign.map((item, index) => ({ ...item, rowNumber: index + 1 }));
    return (

        <>
            <div className='my-3  d-flex align-items-end justify-content-end'>
                <div className='d-flex align-items-center' type='button'>

                    <h6 className='m-0 ps-1'>
                        {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#TalukaModal" data-bs-whatever="@mdo">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>&nbsp;
                                Add Taluka
                            </button> */}
                        <button type="button" className="btn btn-primary" onClick={handleShow}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>&nbsp;
                            Assign Area
                        </button>

                    </h6>
                </div>
            </div>
            <div className='myTbl'>
                <div style={{ height: '85vh', width: '100%' }}>
                    <DataGrid
                        rows={rowsData}
                        columns={columns}
                        getRowId={(params) => {
                            return params.rowNumber
                        }}
                        style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                        className='rounded'
                        pageSizeOptions={[5, 10, 25]}
                        initialState={{
                            ...areaAssign.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        components={{
                            Toolbar: GridToolbar,
                            NoRowsOverlay: () => (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>There is no Enquiry with current branch</span>
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
                <AlertDeleteModal
                    showModal={displayConfirmationModal}
                    confirmModal={submitDelete}
                    hideModal={hideConfirmationModal}
                    type={type}
                    id={id}                
                    categoryd={categoryd}                
                    dId={dId}                
                    message={deleteMessage}
                />
            </div>

            {/* new modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h5 className="modal-title" id="TalukaModalLabel">Assign Area</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="">
                        <div className="row mt-5">
                            <h5>Select User</h5>
                            <Select
                                value={selectedOptionUser}
                                onChange={handleChangeUser}
                                options={useroptions}
                                isSearchable={true}
                                placeholder="Search for a user..."
                            />
                        </div>
                        <div className="row mt-5">

                            <h5>Select Category</h5>
                            <Select
                                value={selectedCtaegory}
                                onChange={handleChangeCategory}
                                options={categoryoptions}

                                placeholder="Search for a category..."
                            />


                            <h5 className='mt-4'>Select DistributionType</h5>
                            <Select options={distributionoptions} onChange={handleChangeDistribution} value={selectedDistributionType} />


                            <h5 className='mt-4'>Select Villages want to assign</h5>
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

    )
}
