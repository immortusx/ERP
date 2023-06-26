import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getFeatureFromDb } from '../redux/slices/getFeatureSlice'
import { addassigneAreaToDb ,clearAddassigneAreaState} from '../redux/slices/assignedAreaSlice'
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
    console.log(areaAssign,"9999999999999999")
    const [selectedVillagesList, setSelectedVillagesList] = useState([]);  
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);  
    const [selecteddTypeList, setSelecteddTypeList] = useState([]);  
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [allVillageData, setAllVillageData] = useState([]);
    //console.log(allVillageData, "allVillageData in assign area")
    const [selectedOptionVillage, setSelectedOptionVillage] = useState(null);
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
    
    const handleChange = (selectedOption) => {
        setSelectedOptionVillage(selectedOption);
        //console.log(selectedOptionVillage, "selected village in assign area")      
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
            selectedOptionVillage[i].category = selectedCtaegory.value;
            selectedOptionVillage[i].distributionType = selectedDistributionType.value;
        }
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
    useEffect(() => {
        getAllVillageAction().then((data) => {
            console.log(data, "All villageeeee")
            setAllVillageData(data.result)
        }).catch((error) => {
            console.error('Error in getAllVillageAction:', error);
        });
        getEnquiryCategoryFromDb();
        setSelectedVillagesList(areaAssign[0].names)
        setSelecteddTypeList(areaAssign[0].distributionType)
        setSelectedCategoryList(areaAssign[0].categoryName)
    }, [])
    console.log(selectedVillagesList,"selectedVillagesListselectedVillagesListselectedVillagesListselectedVillagesList")
    console.log(selectedCategoryList,"selectedVillagesListselectedVillagesListselectedVillagesListselectedVillagesList")
    console.log(selecteddTypeList,"selectedVillagesListselectedVillagesListselectedVillagesListselectedVillagesList")
    console.log(areaAssign[0],"selectedVillagesListselectedVillagesListselectedVillagesListselectedVillagesList")
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
                    <div class=" row mt-2 m-0">
                        <section class="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
                            <label class="myLabel"> Name </label>
                            {areaAssign && <><p class="myInput inputElement">{areaAssign[0].first_name} {areaAssign[0].last_name}</p></>}
                            
                        </section>
                       
                        <section class="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
                            <label class="myLabel">PhoneNumber </label>
                          {areaAssign && <><p class="myInput inputElement">{areaAssign[0].phone_number}</p></>}  
                        </section>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-4">
                        <h5>Select Category</h5>
                        <Select
                            value={selectedCtaegory}
                            onChange={handleChangeCategory}
                            options={categoryoptions}

                            placeholder="Search for a category..."
                        />
                        </div>
                        <div className="col-md-4">
                        <h5>Select DistributionType</h5>
                        <Select options={distributionoptions} onChange={handleChangeDistribution} value={selectedDistributionType}/>
                        </div>
                        <div className="col-md-4">
                        <h5>Select Villages want to assign</h5>
                        <Select
                            value={selectedOptionVillage}
                            onChange={handleChange}
                            options={options}
                            isSearchable={true}
                            isMulti
                            placeholder="Search for a village..."
                        />
                        </div>
                       
                    </div>
                   <div className="row mt-5">
                    <div className="col-md-4">
                       <h6>Inquiry category</h6>
                      
                       <ul>
                            {selectedCategoryList && selectedCategoryList.map((category,index)=>(
                                <li key={index}>{category}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-4">
                    <h6>Distribution Type</h6>                   
                       <ul>
                            {selecteddTypeList && selecteddTypeList.map((dType,index)=>(
                                <li key={index}>{dType}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6>Villages</h6>
                        <ul>
                            {selectedVillagesList && selectedVillagesList.map((village,index)=>(
                                <li key={index}>{village}</li>
                            ))}
                        </ul>
                    </div>
                   </div>
                    {/* <div className="row mt-3">
                        {selectedVillages.length > 0 && (
                            <div className="selected-villages">
                                <h6>Selected Villages:</h6>
                                <ul>
                                    {selectedVillages.map((village) => (
                                        <li key={village.value}>
                                            {village.label}
                                            <button
                                                className="btn ms-2"
                                                onClick={() => handleRemove(village)}
                                            >
                                              X
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div> */}
                    <div className="row mt-3">
                        <button className='col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handleSubmit} type='button'>Assign </button>
                        <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' onClick={handlCancel} type='button'>Cancel </button>
                    </div>
                </main>
            </div >
        </>
    )
}
