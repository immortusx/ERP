import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { addStateToDb, clearAddState } from '../../../redux/slices/Master/State/addStateSlice'
import { setShowMessage } from '../../../redux/slices/notificationSlice';
import { Modal, Button } from 'react-bootstrap';
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';
import { Switch } from '@mui/material';
import axios from 'axios'
import { id } from 'date-fns/locale';
import Village from '../../singleComponents/villageCom/village';
import District from '../../singleComponents/villageCom/District';
import { Tooltip } from "@mui/material";
const Tax = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const modalStatus = location.state;
    const [selectedTax, setSelectedTax] = useState('');
    const [Percentage, setPercentage] = useState('');
    const [modalState, setModalState] = useState(false);
    const [slab, setSlab] = useState('');
    const [taxesList, setTaxesList] = useState([]);
    const [modalId, setModalId] = useState(0);


    const dispatch = useDispatch();
    const handleSelectedPr = (event) => {
        console.log(event.target.value);
        setSelectedTax(event.target.value)
    }
    const handlePercentage = (event) => {
        console.log(event.target.value);
        setPercentage(event.target.value);
    }


    const handleClose = () => {
        setModalState(false);
    }

    const handleShow = () => {
        setModalId(0);
        setSelectedTax('')
        setPercentage('')
        setModalState(true)
    }
    const redirectModal = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = `${process.env.REACT_APP_NODE_URL}/api/master/addtax`;
        const editurl = `${process.env.REACT_APP_NODE_URL}/api/master/edittax/${modalId}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };

        const requestData = {
            tax: selectedTax,
            percentage: Percentage,
            slabrate: selectedTax + '@' + Percentage + '%'
        };

        if (modalId === 0) {
            console.log(modalId, 'submittime')
            await axios.post(url, requestData, config)
                .then((response) => {
                    if (response.data && response.data.isSuccess) {
                        console.log('response', response.data.result);
                        setModalState(false);
                        setModalId(0);
                        dispatch(setShowMessage('Success'))
                        getAllTaxes();

                    }
                });
        }
        else {
            console.log(modalId, "editTime")
            await axios.post(editurl, requestData, config)
                .then((response) => {
                    if (response.data && response.data.isSuccess) {
                        console.log('response', response.data.result);
                        setModalState(false);
                        setModalId(0);
                        dispatch(setShowMessage('Succesfully Edited'))
                        getAllTaxes();
                    }
                });
        }

        // dispatch(setShowMessage('All field must be field'))
    };
    const getAllTaxes = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/master/gettax`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        }
        await axios.get(url, config).then((response) => {
            if (response.data && response.data.isSuccess) {
                console.log(response.data.result)
                setTaxesList(response.data.result);
            }
        })
    }
    useEffect(() => {
        getAllTaxes();
    }, [])
    const editeStateModal = (editData) => {
        setSelectedTax(editData.tax)
        setPercentage(editData.percentage)
        setModalId(editData.id)
        setModalState(true);
    }

    const isModalStatus = () => {
        if (modalStatus === true) {
            setModalState(true);
        }
    }
    useEffect(() => {
        isModalStatus();
    }, [])
    const onVillageSelect = (village) => {
        console.log(village, 'from parent')
    }

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
            field: 'tax',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Tax %',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.tax ? params.row.tax : '-'}`
            }
        },
        {
            field: 'percentage',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Percentage',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.percentage ? params.row.percentage : '-'}`
            }
        },
        {
            field: 'slab',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Slab Rate',
            minWidth: 100,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.slabrate ? params.row.slabrate : '-'}`
            }
        },
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
                        <Tooltip title="Edit">
                            <button className='myActionBtn m-1'
                                onClick={() => { editeStateModal(params.row) }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const rowsData = taxesList.map((item, index) => ({
            ...item,
            id: item.id,
            checkbox: selectAll,
        }));
        setRowData(rowsData);
    }, [taxesList, selectAll]);

    return (
        <>
            <main className='bg-white p-3 rounded'>
                {/* <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            <label for="taxInput">Tax %:</label>
                            <select onChange={handleSelectedPr} className="form-control" id="taxInput">
                                <option value="0">None</option>
                                <option value="18">GST</option>
                                <option value="12">IGST</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="form-group">
                            <label for="percentageInput">Percentage:</label>
                            <input type="text" className="form-control" id="percentageInput" onChange={handlePercentage} />
                        </div>
                    </div>
                    
                </div> */}
                <div className='my-3  d-flex align-items-end justify-content-end'>
                    <div onClick={handleShow} className='d-flex align-items-center' type='button'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                        <h6 className='m-0 ps-1'>
                            Add Tax
                        </h6>
                        <Button
                            variant="btn btn-warning mx-1"
                            style={{ width: '70px', height: '35px', fontSize: '14px', borderRadius: '20px' }}
                            onClick={() => {
                                redirectModal();
                            }}
                        >
                            BACK
                        </Button>
                    </div>
                </div>
                <div className='mt-4 tableMenuHover' style={{ height: '80vh', width: '100%' }}>
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
                            ...taxesList.initialState,
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
                <Modal
                    show={modalState}
                    onHide={handleClose}
                >
                    <Modal.Header closeButton>
                        <h5 className="modal-title" id="districtModalLabel">ADD TAX</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <div className="mb-3">
                                <div className="form-group">
                                    <label for="taxInput">Tax(%):</label>
                                    <select value={selectedTax} onChange={handleSelectedPr} className="form-control" id="taxInput">
                                        <option value="0">None</option>
                                        <option value="GST">GST</option>
                                        <option value="IGST">IGST</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-group">
                                    <label for="percentageInput">Percentage:</label>
                                    <input type="text" value={Percentage} className="form-control" id="percentageInput" onChange={handlePercentage} />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                            onClick={handleClose}
                        > Close </Button>
                        <Button variant="primary"
                            onClick={handleSubmit}
                        >{modalId === 0 ? 'Add' : 'Save'}</Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </>
    )
}

export default Tax
