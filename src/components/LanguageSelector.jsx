import {  koreanFlag, laosFlag } from '../assets/images';
import { useTranslation } from "react-i18next";
import useDeviceType from "../hook/useDeviceType";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const deviceType = useDeviceType();

   const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth'; // mobile
  };

  const getButtonClass = (lang) => {
    return `w-12 h-auto rounded overflow-hidden cursor-pointer border ${
      i18n.language === lang ? 'border-gray-400' : 'border-transparent'
    }`;
  };

  return (
    <div className={`flex ${deviceType === 'desktop' ? 'space-x-20':'space-x-12'}`}>
      <button onClick={() => changeLanguage('en')} className={getButtonClass('en')}>
        <img src='/webimage/USA.png' alt="English" className="w-full h-full object-cover" />
      </button>
      <button onClick={() => changeLanguage('la')} className={getButtonClass('la')}>
        <img src={laosFlag} alt="Lao" className="w-full h-full object-cover" />
      </button>
      <button onClick={() => changeLanguage('ko')} className={getButtonClass('ko')}>
        <img src={koreanFlag} alt="Korean" className="w-full h-full object-cover" />
      </button>
    </div>
  );
};

export default LanguageSelector;
