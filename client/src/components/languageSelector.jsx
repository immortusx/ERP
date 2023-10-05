// LanguageSelector.js

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import lang from '../assets/images/languagess.png';
import { setLanguage } from '../redux/slices/languageSlice';

function LanguageSelector() {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.language);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'gj', name: 'ગુજરાતી' },
    // Add more languages as needed
  ];

  const handleLanguageChange = (event) => {
    const selectedValue = event.target.value;
    dispatch(setLanguage(selectedValue));
  };

  return (
    <div className="custom-select">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={lang} alt="lang" width="20" height="20" />
        <label htmlFor="languageSelector"></label>
        <select
          id="languageSelector"
          value={currentLanguage}
          onChange={handleLanguageChange}
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name} {currentLanguage === language.code ? '✓' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default LanguageSelector;
