import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const Taluka = ({ onSelectedTaluka = () => {}, districtId = '' }) => {
    const navigate = useNavigate();
    const [talukaList, setTalukaList] = useState([]);

    const getTalukaList = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-taluka-list/${districtId}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data.isSuccess) {
                setTalukaList(response.data.result)
            }
        })
    }

    useEffect(() => {
        if (districtId && districtId !== 0 && districtId.length)
            getTalukaList();
    }, [districtId])

    const changeHandlerNewEnquiry = (event) => {
        console.log(event.target.value);
        onSelectedTaluka(event.target.value);
    }
    return (
        <>
            <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                <label className='myLabe    l' htmlFor="email">Select Taluka *</label>
                <select
                    onChange={changeHandlerNewEnquiry}
                    className='inpClr myInput' name="district">
                    <option value='0' className='myLabel' >select</option>
                    {/* <option value='0' className='myLabel' style={{fontWeight: 'bold'}}>Add New Taluka</option> */}
                    {
                        talukaList && talukaList.length > 0 && talukaList.map((i, index) => {
                            return <option key={index} value={i.id} className='myLabel'>{i.name}</option>
                        })
                    }
                </select>
                <span className='singleCompText' onClick={() => { navigate('/administration/configuration/taluka', { state: true }) }}>add new taluka...</span>
            </section>
        </>
    )
}

export default Taluka
