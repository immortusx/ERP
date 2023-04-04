import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { inquiryFieldSaveDB, clearAdminState } from '../redux/slices/inquiryFieldSaveSlice'
import { categoryAddToDB, clearCategoryAddState } from '../redux/slices/categoryAddSlice'
import { setShowMessage } from '../redux/slices/notificationSlice'

export default function InquiryCategories() {

    const [allFields, setAllFields] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [currentCategoryData, setCurrentCategoryData] = useState({
        id: '',
        fields: [],
    })
    const [newCategory, setNewCategory] = useState({
    })
    const dispatch = useDispatch()
    const inquiryFieldSaveState = useSelector(state => state.inquiryFieldSaveState.inquiryFieldSaveState)
    const categoryAddState = useSelector(state => state.categoryAddState.categoryAddSliceState)


    function clearInputsAndState() {
        const allInp = document.getElementsByClassName('inputElement')
        Array.from(allInp).forEach((item) => {
            if (item.type === 'checkbox') {
                item.checked = false
            } else {
                item.value = ''
            }
        })
        setCurrentCategoryData({
            id: '',
            fields: [],
        })
        setAllFields([])

    }
    useEffect(() => {
        if (inquiryFieldSaveState.isSuccess) {
            if (inquiryFieldSaveState.result.isSuccess) {
                dispatch(setShowMessage('Data is saved'))
                dispatch(clearAdminState())
                // clearInputsAndState()
                setAllFields([])

            } else {
                dispatch(setShowMessage('Something is wrong'))
            }
        }
    }, [inquiryFieldSaveState])
    useEffect(() => {
        console.log('categoryAddState', categoryAddState)

    }, [categoryAddState])

    async function getCategoriesField() {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-categories-fields`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data) {
                if (response.data.isSuccess) {
                    setAllFields(response.data.result)
                }
            }
        })
    }
    async function getFieldCurrentCategories(id) {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-current-fields/${id}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data) {
                if (response.data.isSuccess) {
                    setCurrentCategoryData(currentCategoryData => ({ ...currentCategoryData, fields: response.data.result }))
                }
            }
        })
    }
    async function handleOnChange(e) {
        const idIs = e.target.value
        console.log('e.target.value', e.target.value);
        clearInputsAndState()
        // console.log(idIs)
        if (idIs != 0) {
            setCurrentCategoryData(currentCategoryData => ({ ...currentCategoryData, id: idIs }))
            getFieldCurrentCategories(idIs)
        }
    }
    async function getInquiryCategories() {
        console.log('>>>>>>getInquiryCategories');
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-inquiry-categories`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data) {
                // setRoles(response.data.result)
                if (response.data.isSuccess) {
                    setCategoriesList(response.data.result)
                }
            }
        })
    }
    useEffect(() => {
        getInquiryCategories()
    }, [])

    function editBtnClicked() {
        getCategoriesField()
    }
    function handleSaveBtn() {
        const tempAr = [];
        currentCategoryData.fields.forEach(i => {
            tempAr.push(i.id)
        })
        const sendObj = {
            id: currentCategoryData.id,
            fields: tempAr
        }

        // console.log('categoriesList', categoriesList);
        console.log('allFields', allFields);
        console.log('currentCategoryData', currentCategoryData);
        console.log('zcsdc', currentCategoryData.fields.find(i => { return i.field_name == 'First Name' }) != undefined);
        dispatch(inquiryFieldSaveDB(sendObj))

    }
    function cancelBtn() {
        setAllFields([])
        getFieldCurrentCategories(currentCategoryData.id)
    }
    function isCkeckedInp(data) {
        let check = currentCategoryData.fields.find(i => { return i.field == data.field })
        if (check === undefined) {
            return false
        } else {
            return true
        }
    }
    function addNewCategoryBtn() {
        console.log('addNewCategoryBtn called');
        console.log('newCategory', newCategory);
        const objectValues = Object.values(newCategory)

        if (!objectValues.includes('')) {
            setNewCategory(newCategory => ({ ...newCategory, [`category${Object.keys(newCategory).length + 1}`]: '' }))
        } else {
            dispatch(setShowMessage('Please fill the last one field'))
        }

    }
    function addNewCategorySubmit() {
        console.log('newCategory', newCategory)
        const objectValues = Object.values(newCategory)
        console.log('objectValues', objectValues.includes(''))
        if (objectValues.includes('')) {
            dispatch(setShowMessage('please fill the field to continue'))

        } else {
            dispatch(categoryAddToDB(newCategory))
        }

    }

    function onChangeHandler(e, id) {
        let tempAr = currentCategoryData.fields;
        if (e.target.checked) {
            let searchResult = allFields.find(i => { return i.id == id })
            tempAr.push(searchResult)
        } else {
            tempAr = tempAr.filter(i => { return i.id != id })
        }
        setCurrentCategoryData(currentCategoryData => ({ ...currentCategoryData, fields: tempAr }))
    }
    function categoryChangeHandler(e) {
        const name = e.target.name
        const value = e.target.value
        console.log('newCategory', name, value)
        setNewCategory(newCategory => ({ ...newCategory, [name]: value }))
    }
    return (
        <main className='bg-white p-3 rounded'>
            <h5 className='m-0'>
                Inquiry categories
            </h5>
            <div className='mt-3'>
                <div className=''>
                    <section className='d-flex mt-3 flex-column col-12 col-lg-5'>
                        <label className='myLabel' htmlFor="email">Select category</label>
                        <div className='d-flex align-items-center '>
                            <select onChange={handleOnChange} className='w-100 myInput' name="selectRole">
                                <option value='0' className='myLabel'>select category</option>
                                {
                                    categoriesList.length > 0 && categoriesList.map((item, index) => {
                                        return <option value={item.id} key={index} className='myLabel'>{item.category_name}</option>
                                    })
                                }
                            </select>
                        </div>

                        {
                            Object.keys(newCategory).length > 0 && <div className='mt-2'>
                                {

                                    Object.keys(newCategory).length > 0 && Object.keys(newCategory).map((data, index) => {
                                        return <section key={index} className='mt-2 col-12 col-lg-5'>
                                            {/* <label className='myLabel' htmlFor="email">Add new category</label> */}
                                            <div className='d-flex align-items-center'>
                                                <input placeholder='enter category' onChange={categoryChangeHandler} className='myInput' name={data} type="text" />
                                            </div>

                                        </section>
                                    })
                                }
                                <button onClick={addNewCategorySubmit} className='mt-3 myBtn py-1 px-4' type='button'>Add</button>
                            </div>
                        }
                        <div onClick={addNewCategoryBtn} className='mt-3 d-flex align-items-center' type='button'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                            <h6 className='m-0 ps-1'>
                                Add new category
                            </h6>
                        </div>

                    </section>


                </div>
                {
                    currentCategoryData.id.length > 0 && currentCategoryData.id != '' > 0 && <div className='mt-3'>
                        <div className='d-flex justify-content-between '>
                            <h5 className='m-0'>
                                {
                                    allFields.length === 0 && currentCategoryData.id.length > 0 ? 'Selected field(s)' : 'Select field(s)'
                                }
                            </h5>
                            {

                                allFields.length === 0 && currentCategoryData.id.length > 0 && <div onClick={editBtnClicked} type='button'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg> Edit...
                                </div>
                            }
                        </div>
                        {

                            allFields.length === 0 && currentCategoryData.id.length > 0 ? <div>
                                {

                                    allFields.length === 0 && currentCategoryData.fields.length > 0 ? <ul className='row myUl m-0'>
                                        {
                                            currentCategoryData.fields.length > 0 && currentCategoryData.fields.map((data, index) => {
                                                return <li className='pt-1 col-6 col-md-4' key={index}>
                                                    <div className='mt-3  d-flex align-items-center'>
                                                        <input readOnly checked type='checkbox' name={data.field} className='myCheckBox inputElement' />
                                                        <label className='ms-2 myLabel' htmlFor="">{data.name}</label>
                                                    </div>
                                                </li>
                                            })
                                        }
                                    </ul> : <label className='mt-2 myLabel' htmlFor="">There is no selected fields</label>
                                }
                            </div> : <div>
                                <ul className='row myUl m-0'>
                                    {
                                        allFields.length > 0 && allFields.map((data, index) => {
                                            return <li className='pt-1 col-6 col-md-4' key={index}>
                                                <div className='mt-3  d-flex align-items-center'>
                                                    <input type='checkbox' checked={isCkeckedInp(data)} onChange={(e) => { onChangeHandler(e, data.id) }} name={data.field} className='myCheckBox inputElement' />
                                                    <label className='ms-2 myLabel' htmlFor="">{data.name}</label>
                                                </div>
                                            </li>
                                        })
                                    }
                                </ul>
                                <section className='mt-3'>
                                    <button className='col-12 col-sm-3 col-lg-2 myBtn py-1' onClick={handleSaveBtn} type='button'>Save </button>
                                    <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-3 col-lg-2 myBtn py-1' onClick={cancelBtn} type='button'>Cancel</button>
                                </section>
                            </div>
                        }
                    </div>
                }
                {/* <button onClick={() => {
                    console.log(currentCategoryData);
                    console.log(allFields);
                }}>clickme</button> */}
            </div>
        </main >
    )
}
