import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFeatureFromDb } from '../redux/slices/getFeatureSlice'
import { addassigneAreaToDb, clearAddassigneAreaState } from '../redux/slices/assignedAreaSlice'
import { editRoleToDb, clearEditRoleState } from '../redux/slices/editRoleDataSlice'
import Axios from 'axios'
import { getToPathname } from '@remix-run/router'
import { setShowMessage } from '../redux/slices/notificationSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { getAllVillageAction } from './Master/Village/getEditeVillage'
import Select from 'react-select';



export default function AddAssignArea() {
    const location = useLocation();
    const areaAssign = location.state ? location.state.assigneAreaPerUser : [];
   // console.log(areaAssign, "9999999999999999")

    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const [selecteddTypeList, setSelecteddTypeList] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [allVillageData, setAllVillageData] = useState([]);
    //console.log(allVillageData, "allVillageData in assign area")
    const [selectedOptionVillage, setSelectedOptionVillage] = useState([]);
    const [selectedVillagesList, setSelectedVillagesList] = useState([]);
    const [selectedVillages, setSelectedVillages] = useState([]);
    const [selectedCtaegory, setSelectedCtaegory] = useState([]);
    const [selectedDistributionType, setSelectedDistributionType] = useState([]);
    const [enquireCtaegory, setEnquiryCtaegory] = useState([]);

    const addAssignState = useSelector(state => state.addassigneAreaSlice.addassigneAreaState)
    //console.log(addAssignState,"88888888")
    useEffect(() => {
        if (addAssignState.isSuccess) {
            if (addAssignState.message.isSuccess) {
                dispatch(setShowMessage('Area is assignrd'))
                dispatch(clearAddassigneAreaState())
                navigate('/sale/areaAssign')
                //clearInpHook()

            } else {
                dispatch(setShowMessage('Something is wrong'))
            }

        }
    }, [addAssignState])
  
    useEffect(() => {
        getAllVillageAction().then((data) => {
           // console.log(data, "All villageeeee")
            setAllVillageData(data.result)
        }).catch((error) => {
            console.error('Error in getAllVillageAction:', error);
        });
        getEnquiryCategoryFromDb();
        // setSelectedVillagesList(areaAssign[0].names)
       // setSelectedVillagesList(Array.from(areaAssign[0]?.names || []));
        //console.log(areaAssign[0].names,"222222222222222")
       // console.log(areaAssign[0].nameId,"111111111111111")
        const names = areaAssign[0].names
        const nameId = areaAssign[0].nameId
        const combinedArray = names.map((value, index) => ({
            value: nameId[index],
            label: value,
        }));
       // console.log(combinedArray,"combinedArrayfor name and name id")
       setSelectedVillagesList(combinedArray)
    }, [])
    const handleChange = (selectedOption) => {
        // console.log(selectedOption,"333333333")
        // setSelectedOptionVillage(selectedOption);
        // const newVillagesList = new Set(selectedVillagesList);
        // selectedOption.forEach((option) => {
        //     newVillagesList.add(option.label);
        // })
        // setSelectedVillagesList(newVillagesList);
        setSelectedOptionVillage(selectedOption);
        setSelectedVillagesList(selectedOption.map((option) => option));
        //console.log(selectedVillagesList,"222222222222222")
    };

    const handleChangeCategory = (selectedOption) => {
        setSelectedCtaegory(selectedOption)
    };

    const handleChangeDistribution = (selectedOption) => {
        setSelectedDistributionType(selectedOption)
    };
    const categoryoptions = enquireCtaegory.map((category) => ({
        value: category.id,
        label: category.category_name,
    }));
    const options = allVillageData.map((village) => ({
        value: village.id,
        label: village.name,
    }));
    const distributionoptions = [
        { value: 1, label: 'AreaWise' }
    ];
    const handleRemove = (selectedVillage) => {
        const updatedVillages = selectedVillages.filter(
            (village) => village.value !== selectedVillage.value
        );
        setSelectedVillages(updatedVillages);
    };


    function handleSubmit() {
        for (let i = 0; i < selectedOptionVillage.length; i++) {
            selectedOptionVillage[i].id = areaAssign[0].id;
            selectedOptionVillage[i].category = areaAssign[0].category_id;
            selectedOptionVillage[i].distributionType = areaAssign[0].distributionType;
        }
       // console.log(selectedOptionVillage,"11111111111111111111")
        dispatch(addassigneAreaToDb(selectedOptionVillage))
    }
    function handlCancel() {
        navigate('/sale/areaAssign')
    }
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


    return (
        <>
            <div className='addUser myBorder bg-white rounded p-3'>

                <main>
                    <div className=' row mt-3 m-0'>
                        <h3 className='myLabel'>Assign Area</h3>
                    </div>
                    <div className="row mt-2">
                        <h5 className='myLabel'>
                            User Information
                        </h5>
                    </div>
                    <div className=" row mt-2 m-0">
                        <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
                            <label className="myLabel"> Name </label>
                            {areaAssign && <><p className="myInput inputElement">{areaAssign[0].first_name} {areaAssign[0].last_name}</p></>}

                        </section>

                        <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
                            <label className="myLabel">PhoneNumber </label>
                            {areaAssign && <><p className="myInput inputElement">{areaAssign[0].phone_number}</p></>}
                        </section>
                    </div>

                    <div className="row mt-5">

                        {/* =========table======= */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Enquiry Category</th>
                                    <th scope="col">Distribution Type</th>
                                    <th scope="col">Villages</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>
                                        <ul>
                                            <li>{areaAssign[0].categoryName}</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            <li>{areaAssign[0].distribution_type}</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <Select
                                            isMulti
                                            options={options} 
                                            value={selectedVillagesList.map((village) => ({
                                                value: village.value,
                                                label: village.label,
                                              }))}                                         
                                            onChange={handleChange}
                                            isSearchable={true}
                                            filterOption={(option, inputValue) =>
                                                option.label.toLowerCase().includes(inputValue.toLowerCase())

                                            }
                                        />

                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        {/* =========table======= */}


                    </div>


                    <div className="row mt-3">
                        <button className='col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleSubmit} type='button'>Save </button>
                        <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handlCancel} type='button'>Cancel </button>
                    </div>
                </main>
            </div >
        </>
    )
}
