import Logo from "../components/Logo"
import { Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import AnimatedContent from "../components/ui/AnimatedContent";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useDeviceType from "../hook/useDeviceType";
import { Trans, useTranslation } from "react-i18next";
import AIResearchTabs from "./AIEducationTabs";

const ProgramPage = () => {

  const [searchParam, setSearchParams] = useSearchParams();
  const initialSlide = parseInt(searchParam.get('slide')) || 0;

  const swiperRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(initialSlide || 0);

  const { t, i18n } = useTranslation();

  const fontClass = {
    en: "font-en",
    la: "font-lao",
    ko: "font-kr",
  }[i18n.language];

  const deviceType = useDeviceType();
  const isMobileDevice = deviceType === "mobile";
  const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth'; // mobile
  };
  useEffect(() => {
    if (swiperRef.current && initialSlide !== activeIndex) {
      swiperRef.current.slideTo(initialSlide);
    }
  }, [initialSlide]);
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
    swiper.updateAutoHeight(300);
    // Update URL without page reload
    const newSearchParams = new URLSearchParams(searchParam);
    newSearchParams.set('slide', swiper.activeIndex);
    setSearchParams(newSearchParams, { replace: true });
  };

  // Handle keyboard arrow key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!swiperRef.current) return;

      if (e.key === "ArrowRight") {
        swiperRef.current.slideNext(); // Go to next slide
      } else if (e.key === "ArrowLeft") {
        swiperRef.current.slidePrev(); // Go to previous slide
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!swiperRef.current) return;
    const timer = setTimeout(() => {
      swiperRef.current?.updateAutoHeight(300);
    }, 80);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className={`bg-white ${fontClass}`}>
      <div className={` mx-auto px-4 py-6 ${getContentWidth()} `}>

        <div className="relative ">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              // Initialize to correct slide
              swiper.slideTo(initialSlide);
              swiper.updateAutoHeight(0);
            }}
            onSlideChange={handleSlideChange}  // Updated handler
            initialSlide={initialSlide}  // Set initial slide
            spaceBetween={30}
            slidesPerView={1}
            autoHeight={true}
            observer={true}
            observeParents={true}
            observeSlideChildren={true}
            modules={[Navigation, Keyboard]}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
              pageUpDown: true,
            }}
            className="rounded-md overflow-hidden "
          >

            <SwiperSlide>

              <div className="flex justify-center ">
                <div className={`${isMobileDevice ? "flex-col gap-4" : "flex gap-28"} justify-between items-start w-full`}>
                  <div className={`${isMobileDevice ? "w-full" : "w-1/4"} flex items-center gap-4`}>
                    <img src="/icon/Solid/PNG/webcam_.png" alt="" className={`${isMobileDevice ? "w-16" : "w-[100px]"} h-auto object-cover rounded-xl`} />

                    <h1 className={` ${isMobileDevice ? "text-2xl mb-2" : "text-4xl mb-12"} font-bold text-[#105691] `}>{t("home.programMenuItems1")}</h1>
                  </div>

                  <img src="../webimage/programe_slide1.png" alt="" className={`${isMobileDevice ? "w-full" : "w-[80%]"} max-w-full`} />


                </div>
              </div>


              {/* end slide 1 */}
            </SwiperSlide>
            <SwiperSlide>

              {/* slide 2 */}
              <div className="flex justify-center">
                <div className={`${isMobileDevice ? "flex-col" : "flex"} gap-12 items-start w-full`}>
                  <div className={`${isMobileDevice ? "mb-4 w-full" : "w-1/4"} flex items-center`}>
                    <img src="/icon/Solid/PNG/hdmi_.png" alt="" className={`${isMobileDevice ? "w-16" : "w-[100px]"} h-auto object-cover rounded-xl`} />

                    <h1 className={` ${isMobileDevice ? "text-2xl mb-2" : "text-4xl mb-12"} font-bold text-[#105691] `}>{t("home.programMenuItems2")}</h1>
                  </div>

                  {activeIndex === 1 && (
                    isMobileDevice ? (
                      <div className="w-full space-y-6">
                        <div className="rounded-lg overflow-hidden bg-white shadow-sm">
                          <img src="/webimage/402/1st_S.png" alt="program step 1" className="w-full h-auto object-cover" />
                          <ul className="list-disc text-gray-600 px-6 py-4 space-y-1">
                            <li>{t("programs.slide2.1.li_1")}</li>
                            <li>{t("programs.slide2.1.li_2")}</li>
                            <li>{t("programs.slide2.1.li_3")}</li>
                            <li>{t("programs.slide2.1.li_4")}</li>
                          </ul>
                        </div>

                        <div className="rounded-lg overflow-hidden bg-white shadow-sm">
                          <img src="/webimage/402/2,3_S.png" alt="program step 2" className="w-full h-auto object-cover" />
                          <ul className="list-disc text-gray-600 px-6 py-4 space-y-1">
                            <li>{t("programs.slide2.2.li_1")}</li>
                            <li>{t("programs.slide2.2.li_2")}</li>
                            <li>{t("programs.slide2.2.li_3")}</li>
                            <li>{t("programs.slide2.2.li_4")}</li>
                          </ul>
                        </div>

                        <div className="rounded-lg overflow-hidden bg-white shadow-sm">
                          <img src="/webimage/402/4th_S.png" alt="program step 3" className="w-full h-auto object-cover" />
                          <ul className="list-disc text-gray-600 px-6 py-4 space-y-1">
                            <li>{t("programs.slide2.3.li_1")}</li>
                            <li>{t("programs.slide2.3.li_2")}</li>
                            <li>{t("programs.slide2.3.li_3")}</li>
                          </ul>
                        </div>

                        <div className="rounded-lg overflow-hidden bg-white shadow-sm">
                          <img src="/webimage/402/after_S.png" alt="program step 4" className="w-full h-auto object-cover" />
                          <ul className="list-disc text-gray-600 px-6 py-4 space-y-1">
                            <li>{t("programs.slide2.4.li_1")}</li>
                            <li>{t("programs.slide2.4.li_2")}</li>
                            <li>{t("programs.slide2.4.li_3")}</li>
                            <li>{t("programs.slide2.4.li_4")}</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex flex-col ">
                        <AnimatedContent
                          distance={50}
                          direction="up"
                          duration={1.2}
                          initialOpacity={0.2}
                          scale={1.1}
                          threshold={0.2}
                          delay={0.1}
                        >
                          <div className="relative group inline-block w-full px-4 mb-4">
                            <img
                              src="/webimage/402/1st_S.png"
                              alt="professor"
                              className="w-[500px] h-auto object-fill relative z-0 ml-1"
                            />

                            <div className="absolute inset-0 flex items-center justify-start px-4 -mt-8 z-1 w-1/2 translate-y-1/2 h-38 ml-12">
                              <ul className="list-disc text-gray-500">
                                <li>{t("programs.slide2.1.li_1")}</li>
                                <li>{t("programs.slide2.1.li_2")}</li>
                                <li>{t("programs.slide2.1.li_3")}</li>
                                <li>{t("programs.slide2.1.li_4")}</li>
                              </ul>
                            </div>
                          </div>
                        </AnimatedContent>

                        <AnimatedContent
                          distance={60}
                          direction="up"
                          duration={1.2}
                          initialOpacity={0.2}
                          scale={1.1}
                          threshold={0.2}
                          delay={0.2}
                        >
                          <div className="relative group inline-block w-full mb-4">
                            <img
                              src="/webimage/402/2,3_S.png"
                              alt="professor"
                              className="w-[500px] h-auto object-cover relative z-0 -mt-16 ml-54 "
                            />

                            <div className="absolute inset-0 flex items-center justify-start px-4 -mt-4 z-1 w-1/2 translate-x-full h-38">
                              <ul className="list-disc text-gray-200 ml-4">
                                <li>{t("programs.slide2.2.li_1")}</li>
                                <li>{t("programs.slide2.2.li_2")}</li>
                                <li>{t("programs.slide2.2.li_3")}</li>
                                <li>{t("programs.slide2.2.li_4")}</li>
                              </ul>
                            </div>
                          </div>
                        </AnimatedContent>

                        <AnimatedContent
                          distance={70}
                          direction="up"
                          duration={1.2}
                          initialOpacity={0.2}
                          scale={1.1}
                          threshold={0.2}
                          delay={0.3}
                        >
                          <div className="relative group inline-block w-full mb-4">
                            <img
                              src="/webimage/402/4th_S.png"
                              alt="professor"
                              className="w-[500px] h-auto object-cover relative z-0 -mt-16"
                            />

                            <div className="absolute inset-0 flex items-center justify-start px-4 -mt-8 z-1 w-1/2 h-38 ml-12">
                              <ul className="list-disc text-gray-100">
                                <li>{t("programs.slide2.3.li_1")}</li>
                                <li>{t("programs.slide2.3.li_2")}</li>
                                <li>{t("programs.slide2.3.li_3")}</li>
                              </ul>
                            </div>
                          </div>
                        </AnimatedContent>

                        <AnimatedContent
                          distance={80}
                          direction="up"
                          duration={1.2}
                          initialOpacity={0.2}
                          scale={1.1}
                          threshold={0.2}
                          delay={0.4}
                        >
                          <div className="relative group inline-block w-full mb-4">
                            <img
                              src="/webimage/402/after_S.png"
                              alt="professor"
                              className="w-[500px] h-auto object-cover relative z-0 -mt-16 ml-54"
                            />
                            <img
                              src="/webimage/402/hand.png"
                              alt="professor"
                              className="w-[150px] absolute h-auto object-cover ml-22 -mt-10 -z-1 -translate-y-full"
                            />

                            <div className="absolute inset-0 flex items-center justify-start px-4 -mt-4 z-1 w-1/2 translate-x-full h-38">
                              <ul className="list-disc text-gray-200 ml-4">
                                <li>{t("programs.slide2.4.li_1")}</li>
                                <li>{t("programs.slide2.4.li_2")}</li>
                                <li>{t("programs.slide2.4.li_3")}</li>
                                <li>{t("programs.slide2.4.li_4")}</li>
                              </ul>
                            </div>
                          </div>
                        </AnimatedContent>
                      </div>
                    )
                  )}

                </div>
              </div>

              {/* end slide 2 */}
            </SwiperSlide>

            <SwiperSlide>
              {/* slide 3 */}
              <div className="flex justify-center ">
                <div className={`${isMobileDevice ? "flex-col gap-4" : "flex gap-28"} justify-between items-start w-full`}>
                  <div className={`${isMobileDevice ? "w-full" : "w-1/4"} flex items-center gap-4`}>
                    <img src="/icon/Solid/PNG/gaming fan_.png" alt="" className={`${isMobileDevice ? "w-16" : "w-[100px]"} h-auto object-cover rounded-xl`} />

                    <h1 className={` ${isMobileDevice ? "text-2xl mb-2" : "text-4xl mb-12"} font-bold text-[#105691] `}>
                      <Trans i18nKey="home.programMenuItems3" components={{ br: <br /> }} />
                    </h1>
                  </div>
                  <div className="relative flex flex-col w-full ">
                    <div className="relative group inline-block w-full mb-4" id='yu'>
                      {/* Image */}
                      <img
                        src="../webimage/programe_slide3.png"
                        alt="research"
                        className={`${isMobileDevice ? "w-full" : "w-[90%]"} h-auto object-cover relative z-0`}
                      />


                    </div>



                  </div>

                </div>
              </div>
              {/* end slide 3 */}

            </SwiperSlide>

            <SwiperSlide>

              {/* slide 4 */}
              <div className={` ${isMobileDevice ? "items-center" : "px-12"} flex flex-col gap-16 `} >
                <AIResearchTabs />

              </div>

              {/* end slide 4 */}
            </SwiperSlide>

          </Swiper>

          {/* Navigation Buttons */}
          {!isMobileDevice && activeIndex > 0 && (
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow transition-colors duration-300 hover:border-blue-500 hover:text-blue-500 active:scale-95 active:ring active:ring-blue-300"
            >
              {/* <BiChevronLeft size={24} /> */}
              <img src="/icon/Solid/PNG/arrow_.png" alt="" className="w-12 h-auto object-cover" />
            </button>
          )}

          {!isMobileDevice && activeIndex < 3 && (
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white border rounded-full shadow transition-colors duration-300 hover:border-blue-500 hover:text-blue-500 active:scale-95 active:ring active:ring-blue-300"
            >
              <img src="/icon/Solid/PNG/arrow_.png" alt="" className="w-12 h-auto object-cover rotate-180" />

            </button>
          )}
        </div>





      </div>
    </div>
  )
}

export default ProgramPage
