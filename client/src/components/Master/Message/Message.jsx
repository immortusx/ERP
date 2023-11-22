import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from "axios";
import { Button } from "react-bootstrap";
import translations from "../../../assets/locals/translations";
const Message = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState(null);
  const [messageAction, setMessageAction] = useState(null);
  const [types, setTypes] = useState(null);
  const currentLanguage = useSelector((state) => state.language.language);
  const redirectModal = () => {
    navigate(-1);
  };
  const [newMessage, setNewMessage] = useState({
    listCategory: [],
    listMessageAction: [],
    listTypes: [],
  });
  const onChangeTaskCategory = (e) => {
    setCategory(e.target.value);
  }
  const onChangeMessageAction = (e) => {
    setMessageAction(e.target.value);
  }

  const onChangeTypes = (e) => {
    setTypes(e.target.value);
  }
  async function getlistCategory() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/enquiry/get-enquiry-categories`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response) {

        setNewMessage((newMessage) => ({
          ...newMessage,
          ["listCategory"]: response.data.result,
        }));

      }
    });
  }

  async function getlistmsgAction() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-message-action`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response) {

        setNewMessage((newMessage) => ({
          ...newMessage,
          ["listMessageAction"]: response.data.result,
        }));

      }
    });
  }

  async function getlistTypes() {
    const url = `${process.env.REACT_APP_NODE_URL}/api/get-types`;
    const config = {
      headers: {
        token: localStorage.getItem("rbacToken"),
      },
    };
    await Axios.get(url, config).then((response) => {
      if (response) {

        setNewMessage((newMessage) => ({
          ...newMessage,
          ["listTypes"]: response.data.result,
        }));

      }
    });
  }
  useEffect(() => {
    getlistCategory();
    getlistmsgAction();
    getlistTypes();
  }, [])

  return (
    <div className='addUser  bg-white rounded p-3'>
      <main>
        <div className="row m-0">
          <div className="col-6">
            <h5 className='m-0'>
              Add Messages
            </h5>
          </div>
          <div className="col-6 d-flex align-items-end justify-content-end">
            <Button
              variant="btn btn-warning mx-1"
              style={{
                width: '70px',
                height: '35px',
                fontSize: '14px',
                borderRadius: '20px',
              }}
              onClick={() => {
                redirectModal();
              }}
            >
              {translations[currentLanguage].back}
            </Button>
          </div>
        </div>
        <div className=' row mt-3 m-0'>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="category">
              {translations[currentLanguage].category}
            </label>
            <select onChange={onChangeTaskCategory} className="myInput" name="taskcategory" value={category}>
              <option value="" className="myLabel">
                Select Category
              </option>
              {newMessage.listCategory &&
                newMessage.listCategory.length > 0 &&
                newMessage.listCategory.map((i) => {
                  const msgcategory = `${i.category_name}`;
                  return (
                    <option
                      key={i.id}
                      value={i.id}
                      className="myLabel"
                    >
                      {msgcategory}
                    </option>
                  );
                })}
            </select>
          </section>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="category">
              Message Action
            </label>
            <select onChange={onChangeMessageAction} className="myInput" name="messageAction" value={messageAction}>
              <option value="" className="myLabel">
                Select Action
              </option>
              {newMessage.listMessageAction &&
                newMessage.listMessageAction.length > 0 &&
                newMessage.listMessageAction.map((i) => {
                  const msgaction = `${i.msg_action}`;
                  return (
                    <option
                      key={i.id}
                      value={i.id}
                      className="myLabel"
                    >
                      {msgaction}
                    </option>
                  );
                })}
            </select>
          </section>
          <section className='d-flex mt-3 flex-column col-12 col-sm-6 col-lg-4'>
            <label className="myLabel" htmlFor="category">
              Types
            </label>
            <select onChange={onChangeTypes} className="myInput" name="types" value={types}>
              <option value="" className="myLabel">
                Select Type
              </option>
              {newMessage.listTypes &&
                newMessage.listTypes.length > 0 &&
                newMessage.listTypes.map((i) => {
                  const types = `${i.type}`;
                  return (
                    <option
                      key={i.id}
                      value={i.id}
                      className="myLabel"
                    >
                      {types}
                    </option>
                  );
                })}
            </select>
          </section>
        </div>
        <section className='d-flex mt-3 flex-column col-12' style={{marginLeft:"10px"}}>
          <label className='myLabel' htmlFor="email">Messages</label>
          <textarea rows='4' className='myInput inputElement' autoComplete='false' type="text" name="roleDescription" style={{marginRight:"500px"}}/>
        </section>
      </main>
      <section className="d-flex mt-3  flex-column flex-sm-row">
        <button
          className="col-12 col-sm-5 col-lg-2 myBtn py-2"
          type="button">
         Add Messages
        </button>
        <button className='ms-0 ms-sm-3 mt-3 mt-sm-0 col-12 col-sm-5 col-lg-2 myBtn py-2' type='button'> {translations[currentLanguage].cancel} </button>
      </section>
    </div>
  )
}

export default Message
