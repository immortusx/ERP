import React, { useState } from 'react';
import Axios from 'axios';

export const getAllTalukaAction = async () => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-allTaluka`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      console.log(response.data.result, "qwertyuio Talukaaa");
      return response.data; 
    }
    return null
  } catch (error) {
    console.error(error);
    return null; 
  }
}

export const getTalukaById = async (Taluka_id) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-Talukabyid/${Taluka_id}`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio talukaiddd111111");
      return response.data.result; 
    }
    return null
  } catch (error) {
    console.error(error);
    return null; 
  }
}
export const editeTalukaAction = async (tData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/edit-TalukabyId`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, tData, config); // Send sData as the request payload
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio Taluka");
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error(error);
    return null; 
  }
};

export const deleteTalukaAction = async (dData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/delete-TalukabyId`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, dData, config);
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio Taluka");
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error(error);
    return null; 
  }
};