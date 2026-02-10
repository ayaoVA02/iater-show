import { useNavigate } from 'react-router-dom';
import useDeviceType from '../hook/useDeviceType';
import { isMobile } from 'react-device-detect';
import { Trans, useTranslation } from 'react-i18next';


function Professors() {
    const { t, i18n } = useTranslation();

    const fontClass = {
        en: "font-en",
        la: "font-lao",
        ko: "font-kr",
    }[i18n.language];
    const navigate = useNavigate();
    const deviceType = useDeviceType();
    const getContentWidth = () => {
        if (deviceType === 'desktop') return 'desktopWidth';
        if (deviceType === 'tablet') return 'templetWidth';
        return 'mobileWidth'; // mobile
    };
    return (

        <div className={`bg-white ${fontClass} `}>


            <div className={` ${isMobile ? "" : "desktopWidth "} mx-auto`}>
                <div className={`${getContentWidth()} ${isMobile ? "flex-col px-4" : "flex"} justify-between items-start `}>
                    <div className=" pt-6 flex items-center gap-4">
                        <img src="/icon/Solid/PNG/fan_.png" alt="" className="w-[70px] h-auto object-cover rounded-xl" />
                        <h1 className="text-3xl font-bold text-[#105691]">{t("professors.advisor.Advisor")}</h1>
                    </div>

                    <div className="relative flex flex-col ">

                        {/* Background red box - set behind with lower z-index */}
                        <div className={`${isMobile ? "w-[20px]" : "w-[200px]"} absolute h-[75%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2e939a] z-0`} />


                        <div className="relative group inline-block w-full  mt-6" id='leejong'>


                            <img
                                src="/professors/big/lee jong.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className={`relative group inline-block w-full  mb-24 ${isMobile ? "pt-6" : "pt-32"}`} id='somphone'>

                            <img
                                src="/professors/big/Somphone KANTHAVONG_.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>


                {/* profressors */}
                <div className={`${isMobile ? "flex-col px-4" : "flex"} justify-between items-start `}>
                    <div className={`${isMobile ? "" : "pt-32"} w-1/3  flex items-center gap-4`}>
                        <img src="/icon/Solid/PNG/processor_.png" alt="" className="w-[70px] h-auto object-cover rounded-xl" />

                        <h1 className="text-3xl font-bold text-[#105691]">{t("professors.professor.Professor")}</h1>
                    </div>

                    <div className="relative flex flex-col  ">



                        {/* Background red box - set behind with lower z-index */}
                        <div className={`${isMobile ? "w-[20px]" : "w-[200px]"} absolute h-[90%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2e939a] z-0`} />


                        <div className={`relative group inline-block w-full  ${isMobile ? "pt-6" : "pt-32  mb-24"}`} id='baek'>


                            {/* Image */}
                            <img
                                src="/professors/big/baek.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='limjae'>






                            <img
                                src="/professors/big/lim jae.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='oh'>
                            <img
                                src="/professors/big/oh.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='ryu'>

                            <img
                                src="/professors/big/Ryu.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='sangsik'>





                            <img
                                src="/professors/big/sangsik.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">

                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='choi'>





                            <img
                                src="/professors/big/choi.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>



                    </div>
                </div>


                {/* Human resource */}

                <div className={`${isMobile ? "flex-col px-4" : "flex"} justify-between items-start `}>

                    <div className="w-1/3 pt-32 flex items-center gap-4">
                        <img src="/icon/Solid/PNG/save_.png" alt="" className="w-[70px] h-auto object-cover rounded-xl" />

                        <h1 className="text-3xl font-bold text-[#105691]"><Trans i18nKey={"professors.resouce.Resouce"} /></h1>
                    </div>

                    <div className="relative flex flex-col  ">
                        {/* Background red box - set behind with lower z-index */}
                        <div className={`${isMobile ? "w-[20px]" : "w-[200px]"} absolute h-[75%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2e939a] z-0`} />


                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='yu'>


                            {/* Image */}
                            <img
                                src="/professors/big/YU.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='kimjong'>

                            <img
                                src="/professors/big/kim jong.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className={`relative group inline-block w-full   ${isMobile ? "pt-6" : "pt-32 mb-24"}`} id='seangta'>

                            <img
                                src="/professors/big/MS. Seangta PHILAVONG.png"
                                alt="professor"
                                className="w-full h-auto object-cover relative z-10"
                            />

                            {/* Arrow wrapper — make it respond to hover too */}
                            <div className="absolute inset-0 flex items-center justify-start px-4 z-1 pointer-events-none group-hover:pointer-events-auto translate-y-12">
                                <div
                                    className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:-translate-x-24  transition-all duration-500 ease-in-out"
                                >
                                    <div className="pointer-events-auto">
                                        <button onClick={() => navigate("/home")}>

                                            <img src="/icon/Solid/PNG/arrow_.png" alt="arrow back" className='w-24 h-24 object-cover' />

                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Professors