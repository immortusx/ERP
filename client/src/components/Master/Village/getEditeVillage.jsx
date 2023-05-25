import React, { useState } from 'react';
import Axios from 'axios';


export const deleteStateAction = async (sData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/delete-satebyId`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, sData, config);
    if (response.data?.isSuccess) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const editeVillageAction = async (vData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/edit-VillagebyId`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, vData, config); // Send sData as the request payload
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio Village");
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllVillageAction = async () => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-allVillage`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      console.log(response.data.result, "qwertyuio Villageaa");
      return response.data;
    }
    return null
  } catch (error) {
    console.error(error);
    return null;
  }
}
export const getVillageById = async (Village_id) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-Villagebyid/${Village_id}`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio Villageiddd111111");
      return response.data.result; 
    }
    return null
  } catch (error) {
    console.error(error);
    return null; 
  }
}

export const deleteVillageAction = async (vData) => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/delete-VillageById`;
  const config = {
    headers: {
      token: localStorage.getItem('rbacToken')
    }
  };

  try {
    const response = await Axios.post(url, vData, config);
    if (response.data?.isSuccess) {
      console.log(response.data, "qwertyuio Village");
      return response.data; 
    }
    return null;
  } catch (error) {
    console.error(error);
    return null; 
  }
};