import React, { useState } from "react";
import Axios from "axios";

export const getDepartment = async () => {
  const url = `${process.env.REACT_APP_NODE_URL}/api/master/get-department-list`;
  const config = {
    headers: {
      token: localStorage.getItem("rbacToken"),
    },
  };

  try {
    const response = await Axios.get(url, config);
    if (response.data?.isSuccess) {
      console.log(response.data.result, "all sate");
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};





// export const deleteDepartment = async (dData) => {
//   const url = `${process.env.REACT_APP_NODE_URL}/api/master/delete-department`;
//   const config = {
//     headers: {
//       token: localStorage.getItem("rbacToken"),
//     },
//   };

//   try {
//     const response = await Axios.post(url, dData, config);
//     if (response.data?.isSuccess) {
//       return response.data;
//     }
//     return null;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
