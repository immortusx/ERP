import React, { useState } from 'react';
import Axios from 'axios';

export const getAllManufacturerAction = async () => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-allmanufacturer`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      console.log(response.data.result, "all sate");
      return response.data; 
    }
    return null
  } catch (error) {
    console.error(error);
    return null; 
  }
}


export const getManufacturerById = async (manufacturerId) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-manufacturerbyid/${manufacturerId}`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      return response.data.result; 
    }
    return null
  } catch (error) {
    console.error(error);
    return null; 
  }
}


export const editeManufacturerAction = async (mData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/edit-manufacturerbyId`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, mData, config); 
    if (response.data?.isSuccess) {
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error(error);
    return null; 
  }
};


export const deleteManufacturerAction = async (mData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/delete-manufacturerbyId`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, mData, config);
    if (response.data?.isSuccess) {
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error(error);
    return null; 
  }
};