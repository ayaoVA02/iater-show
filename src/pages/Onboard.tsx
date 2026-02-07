import LanguageSelector from '../components/LanguageSelector'

import { useTranslation } from 'react-i18next';
import FadeContent from '../components/ui/FadeContent';
import useDeviceType from '../hook/useDeviceType';

function Onboard() {
    const { t, i18n } = useTranslation();

    // Map language to font class
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
        <div className={`bg-white flex items-center justify-center h-screen ${fontClass}`}>
            <div className={` ${getContentWidth()} mx-auto px-4 py-6 `}>
                {/* <div className="flex justify-end items-center mb-8 ">
                  
                    <LanguageSelector />
                </div> */}
                <a href="/iater">

                    <div className="flex items-center justify-center flex-col w-full">

                        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0} className='flex items-center justify-center flex-col '>
                            {/* <img src={logo2} alt="iater" /> */}
                            <img src="/webimage/biglogo.png" alt="iATER Logo" className='w-[80%] h-auto' />
                            {/* Anything placed inside this container will be fade into view */}


                            <div className="text-center mb-12 ">
                                {/* <h1 className="text-3xl mb-4  ">{t("home.iATER_trains")}</h1> */}
                                <img src="/webimage/text.png" alt="" />

                            </div>


                        </FadeContent>
                        <LanguageSelector />
                    </div>
                </a>
            </div>
        </div>
    )
}

export default Onboard