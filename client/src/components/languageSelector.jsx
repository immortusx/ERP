import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/slices/languageSlice';

// Import your language flag image if needed
 import lang from '../assets/images/languagess.png';

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
    <div className="custom-select" style={{marginTop:"2px"}}>
      {/* You can add the language flag image here */}
      <img src={lang} alt="Language" width="20" height="20" />

      
      <select
        id="languageSelector"
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="custom-select-dropdown"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name} {currentLanguage === language.code ? '✓' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
