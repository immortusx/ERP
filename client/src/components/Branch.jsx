import React, { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Branch.css'

import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SwapSection from './SwapSection'
import moment from 'moment'


export default function Branch({ workFor }) {
    const [dealerList, setDealersList] = useState([])
    const [usersList, setUsersList] = useState([])
    const [userData, setUserData] = useState([])

    const navigate = useNavigate()



    function getDateInFormat(data) {
        let momentData = moment(data)
        return momentData.format('LLL')
    }

    const columns = [
        {
            field: 'rowNumber',
            headerAlign: 'center',
            align: 'center',
            headerName: 'No',
            minWidth: 80,
            flex: 1,

        },
        {
            field: 'name',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Name',
            minWidth: 200,
            flex: 1,

        },
        {
            field: 'email_id',
            headerAlign: 'left',
            align: 'left',
            headerName: 'Email Id',
            minWidth: 250,
            flex: 1,

        },
        {
            field: 'address', headerName: 'Address', minWidth: 300, flex: 1,
            valueGetter: (params) => {
                return `${params.row.address ? params.row.address : '-'}`
            }
        },
        {
            field: 'create_date',
            headerName: 'Created On',
            // description: 'This column has a value getter and is not sortable.',
            // sortable: false,
            minWidth: 200,
            flex: 1,
            valueGetter: (params) =>
                //     let tempDate = params.row.create_date

                // // return  `${moment().format('LLL')}`,
                getDateInFormat(params.row.create_date)
            // return  'sdcs',
        },
        {
            field: 'code',
            headerName: 'Code',
            headerAlign: 'center',
            align: 'center',
            type: 'number',
            minWidth: 80,
            flex: 1,
            valueGetter: (params) => {
                return `${params.row.code ? params.row.code : '-'}`
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
                    <button onClick={() => { editActionCall(params.row) }} className='myActionBtn m-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    <button className='myActionBtn m-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                    </button>
                </div>
            ),
        }
    ];

    async function getDealerList() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/branch/get-branch-data`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data && response.data.isSuccess) {
                console.log('response', response.data.result)
                setDealersList(response.data.result.dealers)
                setUsersList(response.data.result.users)
            }
        })

    }
    useEffect(() => {
        getDealerList()
    }, [])
    useEffect(() => {
        console.log('workFor', workFor)
    }, [workFor])
    const [branchid, setBranchid] = useState([1, 2, 3])
    function cancelClicked() {
        console.log('cancelClicked called', branchid)


    }
    function submitClicked() {
        console.log('submitClicked called', branchid)

    }
    function selectBranch(e, data) {
        const inpCheckBox = document.getElementsByClassName('inpCheckBox')
        Array.from(inpCheckBox).forEach(i => {
            i.checked = false
        })
        e.currentTarget.firstChild.firstChild.checked = true
        console.log('e.currentTarget', e.currentTarget.firstChild.firstChild)
        console.log('selectBranch', e.currentTarget.classList)
        console.log('data', data)
    }
    function rightClick() {
        // let tempAr = []
        // Array.from(userData.role).forEach(ids => {
        //     tempAr.push(ids)
        // })
        // Array.from(selectInp.current.selectedOptions).forEach(element => {
        //     const doesExist = userData.role.find(idExist => {
        //         return idExist == element.value
        //     })
        //     if (doesExist === undefined) {
        //         tempAr.push(parseInt(element.value))
        //     }
        // });
        // setUserData(userData => ({ ...userData, role: tempAr }))
        // selectInp.current.value = 0
        // rightArrowBtn.current.classList.add('disabledBtn')
    }
    function callBackFun(checkId) {
        console.log('callBackFun', checkId)

    }
    function callBackLeft(checkId) {
        console.log('callBackLeft', checkId)

    }
    function editActionCall(e) {

    }
    useEffect(() => {
        console.log('dealerList', dealerList)
    }, [dealerList])
    const rowsData = dealerList.map((item, index) => ({ ...item, rowNumber: index + 1 }));
    function changeHandler() {

    }
    function saveBtnCalled() {

    }
    function cancelHandler() {

    }

    return (
        <div className='bg-white rounded p-3'>
            <main>
                <h5 className='m-0'>{workFor === 'addBranch' ? 'New Branch' : 'Branch'}</h5>

                <div className='row m-0'>
                    {

                        workFor !== 'addBranch' && <div className='mb-3  d-flex align-items-end justify-content-end'>
                            <div onClick={() => { navigate('/home/add-branch') }} className='d-flex align-items-center' type='button'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                                <h6 className='m-0 ps-1'>
                                    New branch
                                </h6>
                            </div>

                        </div>
                    }
                    {/* <section className='myTableSection mt-3'>
                        <table className="branchTableList table table-hover text-center myWhiteTextNoWrap">
                            <thead className='text-start'>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">No</th>
                                    <th scope="col">Branch Name</th>
                                    <th scope="col">Email Id</th>
                                </tr>
                            </thead>
                            <tbody className='text-start'>
                                {
                                    dealerList.length > 0 && dealerList.map((data, index) => {
                                        return <tr id={`tr${index}`} className='myCursonPointer' onClick={(e) => { selectBranch(e, data) }} key={index}>
                                            <td><input className='inpCheckBox' type="checkbox" /></td>
                                            <td>{index + 1}</td>
                                            <td>{data.name}</td>
                                            <td>{data.email_id}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </section> */}

                    {/* <main className='mt-3'>
                        <div className=''>
                            <section className='d-flex flex-column col-12'>
                                <label className='myLabel'>Users</label>
                                <SwapSection workFor='users' selectedData={userData} setSelectedData={setUserData} callBackFun={callBackFun} callBackLeft={callBackLeft} selectionData={usersList} />
                            </section>
                        </div>
                    </main> */}

                    {


                        workFor !== 'addBranch' && <div style={{ height: '85vh', width: '100%' }}>
                            <DataGrid
                                rows={rowsData}
                                columns={columns}
                                getRowId={(params) => {
                                    return params.rowNumber
                                }}
                                className='rounded'
                                style={{ fontFamily: 'Poppins', padding: 5, backgroundColor: 'white', }}
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{
                                    ...dealerList.initialState,
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
                    }
                    {
                        workFor === 'addBranch' && <>
                            <div className='row mt-2 m-0'>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">First Name *</label>
                                    <input onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="firstName" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">G.S.T Number *</label>
                                    <input onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="firstName" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">Select State *</label>
                                    <select onChange={changeHandler} className='myInput inpClr' name="dealerId">
                                        <option value='0' className='myLabel'>select</option>
                                        {
                                            // newEnquiryList.listDealer && newEnquiryList.listDealer.length > 0 && newEnquiryList.listDealer.map((i, index) => {
                                            //     return <option key={index} value={i.id} className='myLabel'>{i.name}</option>
                                            // })
                                        }
                                    </select>
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">Select City *</label>
                                    <select onChange={changeHandler} className='myInput inpClr' name="dealerId">
                                        <option value='0' className='myLabel'>select</option>
                                        {
                                            // newEnquiryList.listDealer && newEnquiryList.listDealer.length > 0 && newEnquiryList.listDealer.map((i, index) => {
                                            //     return <option key={index} value={i.id} className='myLabel'>{i.name}</option>
                                            // })
                                        }
                                    </select>
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">Select District *</label>
                                    <select onChange={changeHandler} className='myInput inpClr' name="dealerId">
                                        <option value='0' className='myLabel'>select</option>
                                        {
                                            // newEnquiryList.listDealer && newEnquiryList.listDealer.length > 0 && newEnquiryList.listDealer.map((i, index) => {
                                            //     return <option key={index} value={i.id} className='myLabel'>{i.name}</option>
                                            // })
                                        }
                                    </select>
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                                    <label className='myLabel' htmlFor="email">Contact Person *</label>
                                    <input onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="firstName" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-3'>
                                    <label className='myLabel' htmlFor="email">Mobile Number *</label>
                                    <input onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="firstName" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-3'>
                                    <label className='myLabel' htmlFor="email">Email *</label>
                                    <input onChange={changeHandler} className='inpClr myInput inputElement' autoComplete='false' type="text" name="firstName" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-3'>
                                    <label className='myLabel' htmlFor="email">Branch Address *</label>
                                    <textarea onChange={changeHandler} className='inpClr myInput inputElement' rows='3' autoComplete='false' type="text" name="firstName" />
                                </section>
                                <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-3'>
                                    <label className='myLabel' htmlFor="email">Description *</label>
                                    <textarea onChange={changeHandler} className='inpClr myInput inputElement' rows='3' autoComplete='false' type="text" name="firstName" />
                                </section>
                                <section className='d-flex pt-3 flex-column flex-sm-row'>
                                    <button className='col-12 col-sm-3 col-lg-2 myBtn py-2' onClick={saveBtnCalled} type='button'>Save</button>
                                    <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-3 col-lg-2 myBtn py-2' onClick={cancelHandler} type='button'>Cancel</button>
                                </section>

                            </div>
                        </>
                    }
                </div>
            </main >
        </div >
    )
}
