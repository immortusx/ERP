import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux'
import translations from "../../../assets/locals/translations";

const District = ({
  onSelectedDistrict = () => { },
  stateId = "",
  districtId = "",
}) => {
  const navigate = useNavigate();
  const [districtList, setDistrictList] = useState([]);
  const currentLanguage = useSelector((state) => state.language.language);

  const getDistrictList = async () => {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-district-list/${stateId}`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await axios.get(url, config).then((response) => {
      if (response.data.isSuccess) {
        setDistrictList(response.data.result);
      }
    });
  };

  useEffect(() => {
    if (stateId) {
      getDistrictList();
    }
  }, [stateId]);

  const changeHandlerNewEnquiry = (event) => {
    console.log(event.target.value);
    onSelectedDistrict(event.target.value);
  };
  useEffect(() => {
    console.log(districtId);
  }, []);
  return (
    <>
      <section className="d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4">
        <label className="myLabe    l" htmlFor="email">
          {translations[currentLanguage].selectdistrict} *
        </label>
        <select
          defaultValue={districtId}
          onChange={changeHandlerNewEnquiry}
          className="inpClr myInput"
          name="district"
        >
          <option value="0" className="myLabel">
            select
          </option>
          {/* <option value='0' className='myLabel' style={{fontWeight: 'bold'}}>Add New District</option> */}
          {districtList &&
            districtList.length > 0 &&
            districtList.map((i, index) => {
              return (
                <option
                  selected={i.id == districtId ? true : false}
                  key={index}
                  value={i.id}
                  className="myLabel"
                >
                  {i.name}
                </option>
              );
            })}
        </select>
        <span
          className="singleCompText"
          onClick={() => {
            navigate("/administration/configuration/district", { state: true });
          }}
        >
          add new district...
        </span>
      </section>
    </>
  );
};

export default District;
