import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const Village = ({ onSelectedVillage, talukaid }) => {
    const navigate = useNavigate();
    const [villageList, setVillageList] = useState([]);
    const getVillageList = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-village-list/${talukaid}`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data.isSuccess) {
                setVillageList(response.data.result)
            }
        })
    }
    useEffect(() => {
        if (talukaid && talukaid !== 0 && talukaid.length){
            getVillageList();
        }
    }, [talukaid])

    const changeHandlerNewEnquiry = (event) => {
        console.log(event.target.value);
        onSelectedVillage(event.target.value);
    }
    return (
        <>
            <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                <label className='myLabe    l' htmlFor="email">Select Village *</label>
                <select
                    onChange={changeHandlerNewEnquiry}
                    className='inpClr myInput' name="village">
                    <option value='0' className='myLabel' >select</option>
                    {/* <option value='0' className='myLabel' style={{fontWeight: 'bold'}}>Add New Village</option> */}
                    {
                        villageList && villageList.length > 0 && villageList.map((i, index) => {
                            return <option key={index} value={i.id} className='myLabel'>{i.name}</option>
                        })
                    }
                </select>
                <span className='singleCompText' onClick={() => { navigate('/administration/configuration/village', { state: true }) }}>add new village...</span>
            </section>
        </>
    )
}

export default Village
