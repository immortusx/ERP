import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Checkbox from '@mui/material/Checkbox'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Link, NavLink, useNavigate, useLocation  } from 'react-router-dom';

import { addManufacturerToDb, clearAddManufacturer } from '../../../redux/slices/Master/Manufacturer/addManufacturerSlice'
import { setShowMessage } from '../../../redux/slices/notificationSlice'
import { Modal, Button } from 'react-bootstrap';
import {getAllManufacturerAction, getManufacturerById, editeManufacturerAction,deleteManufacturerAction} from './getEditeManufacturer'
import AlertDeleteModal from '../../AlertDelete/AlertDeleteModal';

export default function Manufacturer_modal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const autoFocusRef = useRef(null);

    const location = useLocation();
    const rowData = [location.state?.rowData];
    const [allMfacturerData, setAllMfacturerData] = useState([]);
    const [editMaFacturerById, setEditMaFacturerById] = useState('');
    const [modalShow, setModalShow] = React.useState(false);

    //---- Delete Modal Variable -----//
    const [type, setType] = useState(null);
    const [id, setId] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);

    console.log(rowData,'rowDatarowDatarowDatarowDatarowDatarowDatarowDatarowData')
    
    const [modalRowsArr, setModalRowsArr] = useState([]);
    const [firstBlankField, setFirstBlankField] = useState(null);


    const onAddNewRowsHandler = () => {
      setModalRowsArr((prevState) => [
        ...prevState,
        {
          id: new Date().getTime(),
          modalName: '',
          variants: [
            { variantName: '' }
          ]
        }
      ]);
    };
  
    const onAddNewVariantHandler = (modalIndex) => {
      setModalRowsArr((prevState) => {
        const updatedModalRowsArr = [...prevState];
        const modalRow = updatedModalRowsArr[modalIndex];
        modalRow.variants.push({ variantName: '' });
        return updatedModalRowsArr;
      });
    };
  
    const onRemoveModalHandler = (modalId) => {
      setModalRowsArr((prevState) => prevState.filter((modal) => modal.id !== modalId));
    };
    
    const onRemoveVariantHandler = (modalId, variantIndex) => {
      setModalRowsArr((prevState) => {
        const updatedModalRowsArr = [...prevState];
        const modalIndex = updatedModalRowsArr.findIndex((modal) => modal.id === modalId);
        const modalRow = updatedModalRowsArr[modalIndex];
        modalRow.variants.splice(variantIndex, 1);
        return updatedModalRowsArr;
      });
    };
    
    const onModalNameChange = (event, modalIndex) => {
      setModalRowsArr((prevState) => {
        const updatedModalRowsArr = [...prevState];
        const modalRow = updatedModalRowsArr[modalIndex];
        modalRow.modalName = event.target.value;
        return updatedModalRowsArr;
      });
    };
  
    const onVariantNameChange = (event, modalIndex, variantIndex) => {
      setModalRowsArr((prevState) => {
        const updatedModalRowsArr = [...prevState];
        const modalRow = updatedModalRowsArr[modalIndex];
        const variantRow = modalRow.variants[variantIndex];
        variantRow.variantName = event.target.value;
        return updatedModalRowsArr;
      });
    };

    function handleSubmit() {
      const manufacturerNameData = rowData;
      const manufacturerModalVarData = modalRowsArr;
    
      let firstBlankFieldIndex = null; // Index of the first blank field
    
      if (manufacturerNameData.length > 0 && manufacturerModalVarData.length > 0) {
        for (let i = 0; i < manufacturerModalVarData.length; i++) {
          const modalRow = manufacturerModalVarData[i];
          if (modalRow.modalName.trim() === '') {
            firstBlankFieldIndex = i;
            break;
          }
          for (let j = 0; j < modalRow.variants.length; j++) {
            const variantRow = modalRow.variants[j];
            if (variantRow.variantName.trim() === '') {
              firstBlankFieldIndex = i;
              break;
            }
          }
        }
    
        if (firstBlankFieldIndex === null) {
          // All fields are filled, submit the data
          console.log(manufacturerModalVarData);
        } else {
          // Set focus on the first blank field
          setFirstBlankField(firstBlankFieldIndex);
        }
      } else {
        dispatch(setShowMessage('All Field Must be Required.'));
      }
    }
    
  
    const redirectaddmodal = ()=>{
      navigate('/configuration/manufacturer-list');
    }

    const ErrorMsg =()=>{
      dispatch(setShowMessage('All Field Must be Required.'));
    }
    useEffect(() => {
      if (firstBlankField !== null && autoFocusRef.current) {
        autoFocusRef.current.focus();
      }
    }, [firstBlankField]);

    
    useEffect(() => {
      onAddNewRowsHandler();
    }, []);



    return (
      <div>
        <div className='my-3  d-flex align-items-end justify-content-end'>
          <div className='d-flex align-items-center' type='button'>
            <h6 className='m-0 ps-1'></h6>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="d-flex">
              <label className="form-label">
                Manufacturer Name:
              </label>
              <p className="px-4">{rowData.manufacturerName}</p>
            </div>
          </div>
          <div className="card-body">
            {modalRowsArr.length > 0 && (
              modalRowsArr.map((modalRow, modalIndex) => (
                <div className="row" key={`ModaleNumber_${modalIndex}`}>
                  <div className="col-6">
                    <label className="form-label">
                      Modal Name:
                    </label>
                    <div className="row">
                      <div className="col-10">
                      <input
                        type="text"
                        className={`form-control ${firstBlankField === modalIndex ? 'is-invalid' : 'was-validated'}`}
                        id={`modalName_${modalIndex}`}
                        name={`modalName_${modalIndex}`}
                        value={modalRow.modalName}
                        onChange={(event) => onModalNameChange(event, modalIndex)}
                        ref={firstBlankField === modalIndex ? autoFocusRef : null}
                      />
                      </div>                      
                      <div className="col-2">
                        {modalRowsArr.length === modalIndex + 1 ? (
                          <Button variant="primary rounded-circle" onClick={() => onAddNewRowsHandler(modalIndex)}>+</Button>
                        ) : (
                          <Button variant="danger rounded-circle" onClick={() => onRemoveModalHandler(modalRow.id)}>-</Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <label htmlFor="exampleFormControlInput1" className="form-label">
                      Variant Name:
                    </label>
                    {modalRow.variants.map((variantRow, variantIndex) => (
                      <div className="row mb-2" key={`VariantNumber_${variantIndex}`}>
                        <div className="col-10">
                        <input
                          type="text"
                          className={`form-control ${firstBlankField === modalIndex ? 'is-invalid' : 'was-validated'}`}
                          id={`variantName_${modalIndex}_${variantIndex}`}
                          name={`variantName_${modalIndex}_${variantIndex}`}
                          value={variantRow.variantName}
                          onChange={(event) => onVariantNameChange(event, modalIndex, variantIndex)}
                          ref={firstBlankField === modalIndex ? autoFocusRef : null}
                        />
                        </div>
                        <div className="col-2">
                          {modalRow.variants.length === variantIndex + 1 ? (
                            <Button variant="primary rounded-circle" onClick={() => onAddNewVariantHandler(modalIndex)}>+</Button>
                          ) : (
                            <Button variant="danger rounded-circle" onClick={() => onRemoveVariantHandler(modalRow.id, variantIndex)}>-</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="card-footer">
            <div className='d-flex align-items-center justify-content-center'>
              <Button variant="btn btn-warning mx-1" onClick={() => { redirectaddmodal() }}>CANCEL</Button>
              <Button variant="btn btn-success mx-1" onClick={handleSubmit} >SAVE</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }