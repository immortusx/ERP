import React from 'react';
import lang from "../assets/images/language.png"

function LanguageSelector({ onChangeLanguage }) {

  
  return (
    <div>
      <label>  <img src={lang} alt="lang" height={28} width={28} /></label>
      <select onChange={(e) => onChangeLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="gj">ગુજરાતી</option>
        {/* Add more language options as needed */}
      </select>
    </div>
  );
}

export default LanguageSelector;
