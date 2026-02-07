
import { FaFacebook, FaPhone } from "react-icons/fa"
import { useTranslation } from "react-i18next";
import useDeviceType from "../hook/useDeviceType";
import { isMobile } from "react-device-detect";
import { MdEmail } from "react-icons/md";
const Footer = () => {
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
    return 'mobileWidth'; // default: mobile
  };
  return (
    <footer className={`bg-white py-6 ${fontClass} mx-auto w-full  `} >
      <div className="w-full  h-[1px] bg-gray-200 my-4 " />
      <div className={` ${getContentWidth()} mx-auto  flex  bg-[#d0d0d0] rounded-tl-3xl rounded-br-3xl  justify-center p-4 items-center`}
      >
        <div className="flex flex-col items-center  ">
          <img src="/webimage/iATER_logo.png" alt="" className="" />
          <p className="text-lg text-gray-600 text-center md:text-left mt-2 uppercase">
            {t("banner.title")}
          </p>

          <div className={` gap-4 ${isMobile ? "flex-col" : "flex"}`}>
            <p className="text-meduin text-gray-600 mb-1 flex gap-2 items-center"><MdEmail color="#1a8087" size={24} /> iaterkorea2020@gmail.com</p>
            <p className="text-meduin text-gray-600 mb-2 flex gap-2 items-center"><span> <FaPhone color="#1a8087" size={24} className="rotate-90" /> </span> +82 20 56 527 800</p>
            <a href="https://www.facebook.com/profile.php?id=100076123785189" target="_blank" className="flex gap-2 items-center">
              <span><FaFacebook color="blue" size={24} /></span>
              <span>Page</span>
            </a>

          </div>

          <p className="text-white">
            Copyright &copy; iATER Institute of Advanced Technology Education & Research
          </p>
        </div>


      </div>


    </footer>
  )
}

export default Footer
