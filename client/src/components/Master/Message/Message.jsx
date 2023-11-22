import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import Axios from "axios";
import translations from "../../../assets/locals/translations";
const Message = () => {
  const [category, setCategory] = useState(null);
  const currentLanguage = useSelector((state) => state.language.language);
  const [newMessage, setNewMessage] = useState({
    listCategory: [],
  });
  const onChangeTaskCategory = (e) => {
    setCategory(e.target.value);
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
  useEffect(() => {
    getlistCategory();

  }, [])
  return (
    <div className='addUser  bg-white rounded p-3'>
      <main>
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
      </main>
    </div>
  )
}

export default Message
