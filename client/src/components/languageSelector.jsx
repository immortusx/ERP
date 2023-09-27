import React, { useEffect, useState } from 'react';
import lang from "../assets/images/languagess.png"
import check from '../assets/images/check.png';

function LanguageSelector({ onChangeLanguage }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleLanguageChange = (e) => {
    const selectedValue = e.target.value;
    console.log("Selected Language Value:", selectedValue);
    setSelectedLanguage(selectedValue);
    onChangeLanguage(selectedValue);
  };

  return (
    <div className="custom-select">
      <img src={lang} alt="lang" height={20} width={20} />
      <select onChange={handleLanguageChange} value={selectedLanguage}>
        <option  value="">Select</option>
        <option value="en">English</option>
        <option value="gj">ગુજરાતી</option>
        {/* Add more language options as needed */}
      </select>
      {selectedLanguage && <img src={check} alt="check" height={20} width={20} />}
    </div>
  );
}

export default LanguageSelector;
