import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFeatureFromDb } from '../redux/slices/getFeatureSlice'
import { addRoleToDb, clearAddRoleState } from '../redux/slices/addRoleSlice'
import { editRoleToDb, clearEditRoleState } from '../redux/slices/editRoleDataSlice'
import axios from 'axios'
import { getToPathname } from '@remix-run/router'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useNavigate } from 'react-router-dom'
import '../styles/Agency.css'

import SwapSection from './SwapSection'

export default function Agency({ workFor }) {
    const [dealerList, setDealersList] = useState([])
    const [usersList, setUsersList] = useState([])
    const [userData, setUserData] = useState([])

    const navigate = useNavigate()

    const leftArrowBtn = useRef()
    const rightArrowBtn = useRef()

    const selectedListRef = useRef([])
    const selectionListRef = useRef([])

    function selectionChange() { }
    function selectedChange() { }
    function leftClick() { }
    function rightClick() { }

    async function getDealerList() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-agency-data`;
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
    function selectAgency(e, data) {
        const inpCheckBox = document.getElementsByClassName('inpCheckBox')
        Array.from(inpCheckBox).forEach(i => {
            i.checked = false
        })
        e.currentTarget.firstChild.firstChild.checked = true
        console.log('e.currentTarget', e.currentTarget.firstChild.firstChild)
        console.log('selectAgency', e.currentTarget.classList)
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
        console.log('callBackFun',checkId)

    }
    function callBackLeft(checkId) {
        console.log('callBackLeft',checkId)

    }
    function selectChangeCall(e) {
        if (e.target.selectedOptions.length > 0) {
            if (e.target.name === 'selectRole') {
                rightArrowBtn.current.classList.remove('disabledBtn')
            } else {
                leftArrowBtn.current.classList.remove('disabledBtn')
            }
        }
    }

    return (
        <div className='bg-white rounded p-3'>
            <main>
                <h5 className='m-0'>Agency</h5>

                <div className=' row mt-3 m-0'>
                    <div className='  d-flex align-items-end justify-content-end'>
                        <div onClick={() => { navigate('/home/add-agency') }} className='d-flex align-items-center' type='button'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                            <h6 className='m-0 ps-1'>
                                New agency
                            </h6>
                        </div>

                    </div>
                    <section className='myTableSection mt-3'>
                        <table className="agencyTableList table table-hover text-center myWhiteTextNoWrap">
                            <thead className='text-start'>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">No</th>
                                    <th scope="col">Agency Name</th>
                                    <th scope="col">Email Id</th>
                                </tr>
                            </thead>
                            <tbody className='text-start'>
                                {
                                    dealerList.length > 0 && dealerList.map((data, index) => {
                                        return <tr id={`tr${index}`} className='myCursonPointer' onClick={(e) => { selectAgency(e, data) }} key={index}>
                                            <td><input className='inpCheckBox' type="checkbox" /></td>
                                            <td>{index + 1}</td>
                                            <td>{data.name}</td>
                                            <td>{data.email_id}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </section>

                        <main className='mt-3'>
                            <div className=''>
                                <section className='d-flex flex-column col-12'>
                                    <label className='myLabel'>Users</label>
                                    <SwapSection workFor='users' selectedData={userData} setSelectedData={setUserData} callBackFun={callBackFun} callBackLeft={callBackLeft} selectionData={usersList} />
                                    {/* <SwapSection /> */}
                                </section>
                            </div>
                        </main>

                        <section className='d-flex mt-3  flex-column flex-sm-row'>
                            <button onClick={submitClicked} className='col-12 col-sm-5 col-lg-2 myBtn py-2' type='button'>Submit</button>
                            <button onClick={cancelClicked} className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' type='button'>Cancel</button>
                        </section>
                </div>
            </main>
        </div >
    )
}
