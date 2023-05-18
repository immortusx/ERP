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
      console.log(response.data.result, "qwertyuio sate");
      return response.data; 
    }
    return null
  } catch (error) {
    console.error(error);
    return null; 
  }
}

export const editeStateAction = async () => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-allsate`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio sate");
      return response.data; 
    }
    return null
  } catch (error) {
    console.error(error);
    return null; 
  }
}

