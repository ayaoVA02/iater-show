import { dec, subscribe_bg } from "../assets/images"
import { useTranslation } from "react-i18next";
import useDeviceType from "../hook/useDeviceType";
const Banner = () => {
  const { t, i18n } = useTranslation();


  const fontClass = {
    en: "font-en",
    la: "font-lao",
    ko: "font-kr",
  }[i18n.language];


      const deviceType = useDeviceType();
  const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth'; // mobile
  };



  return (
    <div className={`mx-auto mb-2${fontClass}`}>

        <div className={` ${getContentWidth()} text-white py-6   relative overflow-hidden h-48 rounded-3xl `} style={{ backgroundImage: `url(${subscribe_bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-8">{t("banner.title")}</h2>
          <p className="text-sm opacity-90">
            {t("banner.description")}
          </p>
        </div>

        {/* Rocket illustration */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <img src={dec} alt="" />
          <div className="relative w-12 h-12">
            <div className="absolute w-8 h-8 bg-white opacity-20 rounded-full"></div>
            <div className="absolute w-6 h-6 bg-white opacity-30 rounded-full -right-2 -top-2"></div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
