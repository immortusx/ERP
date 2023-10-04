// LanguageSelector.js

import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import lang from '../assets/images/languagess.png';
import { setLanguage } from '../redux/slices/languageSlice';


function LanguageSelector() {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.language);

  const handleLanguageChange = (e) => {

    const selectedLanguage = e.target.value;
    dispatch(setLanguage(selectedLanguage));
  };

  useEffect(() => {
    console.log(currentLanguage, "dfjjjjjjjjjjjuhl")
  }, [currentLanguage])

  return (
    <div className="custom-select">
      <img src={lang} alt="lang" height={20} width={20} />
      <select onChange={handleLanguageChange} value={currentLanguage}>
        <option value="en">English</option>
        <option value="gj">ગુજરાતી</option>
        {/* Add more language options as needed */}
      </select>
    </div>
  );
}

export default LanguageSelector;
