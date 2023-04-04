import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { setInquiryDb, clearInquiryState } from '../redux/slices/inquirySlice'
import { useMemo } from 'react';
export default function Inquiry() {
    const dispatch = useDispatch()
    const inquiryState = useSelector(state => state.inquiryState.inquiryState)

    const [categoriesList, setCategoriesList] = useState([])
    const [currentCategoryData, setCurrentCategoryData] = useState({
        id: '',
        fields: [],
    })
    function clearState() {
        setCurrentCategoryData({
            id: '',
            fields: [],
        })
        setInquiryData({
            category: '',
            firstName: '',
            lastName: '',
            state: '',
            city: '',
            district: '',
            taluko: '',
            village: '',
            mobileNumber: '',
            brand: '',
            whatsappNumber: '',
            visitReason: '',
            sourceOfInquiry: '',
            modelYear: '',
        })
    }

    const [inquiryData, setInquiryData] = useState({
        category: '',
        firstName: '',
        lastName: '',
        state: '',
        city: '',
        district: '',
        taluko: '',
        village: '',
        mobileNumber: '',
        brand: '',
        whatsappNumber: '',
        visitReason: '',
        sourceOfInquiry: '',
        modelYear: '',
    })
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
        console.log('categoriesList', categoriesList);
    }, [categoriesList])
    useEffect(() => {
        getInquiryCategories()
    }, [])
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
    useEffect(() => {
        console.log('inquiryData', inquiryData)
        const idIs = inquiryData.category

        if (inquiryData.category != 0) {
            setCurrentCategoryData(currentCategoryData => ({ ...currentCategoryData, id: idIs }))
            getFieldCurrentCategories(idIs)
        }
    }, [inquiryData.category])
    useEffect(() => {
        console.log('inquiryState', inquiryState)
    }, [inquiryState])
    function handleSubmit() {
        console.log('inquiryData', inquiryData);
        console.log('currentCategoryData', currentCategoryData);
        // dispatch(setInquiryDb(inquiryData))
    }

    // const getSelectedFields = useMemo((data) => {
    //         console.log('getSelectedFields')
    //         console.log('data', data)
    // }, [currentCategoryData.fields])

    function getSelectedFields(data) {
        switch (data.field) {
            case 'firstName':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel'>First name</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="firstName" />
                </section>
                break;
            case 'lastName':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel'>Last name</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="lastName" />
                </section>
                break;

            case 'state':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select state</label>
                    <select onChange={changeHandler} className='myInput' name="state">
                        <option value='gujrat' className='myLabel' selected>Gujrat</option>
                        <option value='madhyaPradesh' className='myLabel'>Madhya pradesh</option>
                        <option value='maharashtra' className='myLabel'>Maharashtra</option>
                    </select>
                </section>
                break;
            case 'city':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select city</label>
                    <select onChange={changeHandler} className='myInput' name="city">
                        <option value='ahemdabad' className='myLabel' selected>Ahemdabad</option>
                        <option value='vadodara' className='myLabel'>Vadodara</option>
                        <option value='surat' className='myLabel'>Surat</option>
                    </select>
                </section>
                break;
            case 'district':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select district</label>
                    <select onChange={changeHandler} className='myInput' name="district">
                        <option value='waghodia' className='myLabel' selected>Waghodia</option>
                        <option value='padra' className='myLabel'>Padra</option>
                        <option value='savli' className='myLabel'>Savli</option>
                    </select>
                </section>
                break;

            case 'taluko':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select taluko</label>
                    <select onChange={changeHandler} className='myInput' name="taluko">
                        <option value='gujrat' className='myLabel' selected>Karjan</option>
                        <option value='madhyaPradesh' className='myLabel'>Dabhoi</option>
                    </select>
                </section>
                break;
            case 'village':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select village</label>
                    <select onChange={changeHandler} className='myInput' name="village">
                        <option value='a' className='myLabel' selected>a</option>
                        <option value='b' className='myLabel'>b</option>
                        <option value='c' className='myLabel'>c</option>
                    </select>
                </section>
                break;

            case 'mobileNumber':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Mobile number</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="mobileNumber" />
                </section>

                break;
            case 'whatsappNumber':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Whatsapp number</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="whatsappNumber" />
                </section>
                break;
            case 'visitReason':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Visit reason</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="visitReason" />
                </section>
                break;
            case 'sourceOfInquiry':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select source of inquiry</label>
                    <select onChange={changeHandler} className='myInput' name="sourceOfInquiry">
                        <option value='calling' className='myLabel' selected>Calling</option>
                        <option value='digital' className='myLabel'>Digital</option>
                        <option value='workShop' className='myLabel'>Work shop</option>
                    </select>
                </section>
                break;
            case 'brand':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select brand</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="brand" />
                </section>
                break;
            case 'model':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Select model</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="model" />
                </section>

                break;
            case 'modelYear':
                return <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                    <label className='myLabel' htmlFor="email">Enter model year</label>
                    <input onChange={changeHandler} className='myInput inputElement' autoComplete='false' type="text" name="modelYear" />
                </section>
                break;
        }

    }

    function changeHandler(e) {
        const name = e.target.name
        const value = e.target.value
        console.log('name, value', name, value);
        if (value === '') {
            clearState()
        } else {
            setInquiryData(inquiryData => ({ ...inquiryData, [name]: value }))
        }
    }
    return (
        <main className='bg-white p-3 rounded'>
            <h5 className='m-0'>
                Inquiry
            </h5>
            <div className='row mt-3 m-0'>
                <section className='d-flex mt-3 flex-column col-12 col-lg-5'>
                    <label className='myLabel' htmlFor="email">Select category</label>
                    <select onChange={changeHandler} className='myInput' name="category">
                        <option value='' className='myLabel'>select category</option>
                        {
                            categoriesList.length > 0 && categoriesList.map((item, index) => {
                                return <option value={item.id} key={index} className='myLabel'>{item.category_name}</option>
                            })
                        }
                    </select>
                </section>
            </div>
            {

                inquiryData.category != '' && currentCategoryData.id != '' && <>
                    <div className='row mt-3 m-0'>
                        {

                            currentCategoryData.fields.length > 0 ?
                                <>
                                    {
                                        currentCategoryData.fields.map(i => {
                                            return getSelectedFields(i)
                                        })
                                    }
                                </> : <h6>There is no selected fields</h6>
                        }
                        <section className='d-flex pt-3 flex-column flex-sm-row'>
                            {

                                currentCategoryData.fields.length > 0 && <button className='col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleSubmit} type='button'>Submit </button>
                            }
                        </section>
                    </div>
                </>
            }
        </main>
    )
}
