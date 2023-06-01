import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const State = ({ onSelectedState }) => {
    const navigate = useNavigate();
    const [stateList, setStateList] = useState([]);
    const getStateList = async () => {
        const url = `${process.env.REACT_APP_NODE_URL}/api/get-state-list`;
        const config = {
            headers: {
                token: localStorage.getItem('rbacToken')
            }
        };
        await axios.get(url, config).then((response) => {
            if (response.data.isSuccess) {
                setStateList(response.data.result)
            }
        })
    }
    useEffect(() => {
        getStateList();
    }, [])

    const changeHandlerNewEnquiry = (event) => {
        console.log(event.target.value);
        onSelectedState(event.target.value);
    }
    return (
        <>
            <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
                <label className='myLabe    l' htmlFor="email">Select State *</label>
                <select
                    onChange={changeHandlerNewEnquiry}
                    className='inpClr myInput' name="state">
                    <option value='0' className='myLabel' >select</option>
                    {/* <option value='0' className='myLabel' style={{fontWeight: 'bold'}}>Add New State</option> */}
                    {
                        stateList && stateList.length > 0 && stateList.map((i, index) => {
                            return <option key={index} value={i.state_id} className='myLabel'>{i.state_name}</option>
                        })
                    }
                </select>
                <span className='singleCompText' onClick={() => { navigate('/administration/configuration/state', { state: true }) }}>add new state...</span>
            </section>
        </>
    )
}

export default State
