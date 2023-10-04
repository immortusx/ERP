import React, { useState } from 'react';
import lang from '../assets/images/languagess.png';

function LanguageSelector({ onChangeLanguage }) {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'gj', name: 'ગુજરાતી' },
  ];


  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language is English

  const handleLanguageChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLanguage(selectedValue);
    onChangeLanguage(selectedValue);
  };

  return (
    <div className="custom-select">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={lang} alt="lang" width="20" height="20" />
        <label htmlFor="languageSelector"></label>
        <select
          id="languageSelector"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name} {selectedLanguage === language.code ? '✓' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default LanguageSelector;
