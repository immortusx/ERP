import React, { useState } from 'react';
import Axios from 'axios';

export const getAllStateAction = async () => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-allsate`;
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


export const getStateById = async (state_id) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-statebyid/${state_id}`;
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


export const editeStateAction = async (sData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/edit-satebyId`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, sData, config); // Send sData as the request payload
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio sate");
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error(error);
    return null; 
  }
};
