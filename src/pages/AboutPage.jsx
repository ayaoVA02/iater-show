
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { useTranslation, Trans } from "react-i18next";
import useDeviceType from "../hook/useDeviceType";
import ImageZoom from "../components/ImageZoom";
import { useHoverBox } from "../context/HoverContext"
const AboutPage = () => {
  const location = useLocation()
  // const [activeSection, setActiveSection] = useState("vision")
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();


  // useEffect(() => {
  //   if (location.hash) {
  //     setActiveSection(location.hash.substring(1))
  //   }
  // }, [location])
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      // setActiveSection(sectionId);

      // 👇 Scroll to the element with this ID
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Optional: scroll to top if no hash
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);


  const { setActiveBox } = useHoverBox();


  const handleClick = (boxName) => {
    setActiveBox(boxName);
    navigate("/home"); // ← go to home page
  };

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
  const isMobile = deviceType === "mobile";

  return (
    <div className={`bg-white ${fontClass} `} >
      <div className={`${getContentWidth()} mx-auto px-4 py-6 widthfixed `}>


        <div className="pt-24" id="vision">

          <div className="bg-blue-50 rounded-2xl p-8 mb-12 " >

            <h1 className={` ${isMobile ? "text-2xl" : "text-4xl"} mb-6 text-[#105691] bold ${fontClass} `} > <b>{t("home.aboutMenuItems1")}</b> </h1>
            <p className="mb-4 text-justify leading-relaxed"> <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.vision.1_p1")}</Trans></p>
            <p className="mb-4 text-justify leading-relaxed">
              <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.vision.1_p2")}</Trans>
            </p>
            <p className="mb-4 text-justify leading-relaxed">
              <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.vision.1_p3")}</Trans>
            </p>
            <p className="mb-4 text-justify leading-relaxed">
              <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.vision.1_p4")}</Trans>

            </p>
            <p className="mb-8 text-justify leading-relaxed">
              <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.vision.1_p5")}</Trans>
            </p>
          </div>
        </div>

        <div className={` ${isMobile ? "flex-col space-y-4" : "flex-row  gap-4"} flex justify-around items-center w-full`}>
          <div className={`rounded-lg overflow-hidden ${isMobile ? "w-full" : "w-[400px]"}`}>
            <ImageZoom className="w-full h-[200px] object-cover" src="/webimage/showing00.jpeg" alt="iater image showing" />
          </div>
          <div className={`rounded-lg overflow-hidden ${isMobile ? "w-full" : "w-[400px]"}`}>

            <ImageZoom className="w-full h-[200px] object-cover" src="/webimage/showing02.jpeg" alt="iater image showing" />
          </div>
          <div className={`rounded-lg overflow-hidden ${isMobile ? "w-full" : "w-[400px]"}`}>

            <ImageZoom src="/webimage/showing03.jpeg" alt="iater image showing" className="w-full object-cover  h-[200px]" />
          </div>
        </div>

        {/* Mission */}

        <div className="pt-22" id="mission">

          <div className="px-4 flex flex-col gap-16 " >

            <div className="mt-14" >
              <h1 className={` ${isMobile ? "text-2xl" : "text-4xl"} font-bold mb-12 text-[#105691] `}>{t("home.aboutMenuItems2")}</h1>
              {/* <p className="mb-4"> <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.2_p1")}</Trans>
            </p>
            <p className="mb-4">
              <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.2_p2")}</Trans></p>
            <p className="mb-8 "><Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.2_p3")}</Trans></p> */}
              <div className="bg-blue-50 h-[32vh] px-4 py-8 rounded-lg ">
                {/* <p>급변하는 글로벌 환경 속에서 라오스 청년들이 능력있는 전문 인재를 키우고 라오스 전역에 컴퓨터 교육을 실시 함으로서 기술격차 해소와 ICT 대중화를 이루고 전문 개발자 양성과 강사 개발을 통한 생활 자립을 돕는 연구원을 설립하고자 합니다.</p> */}
                <p className="text-justify leading-relaxed"><Trans i18nKey={"about.mission.context"} /></p>
              </div>
            </div>
          </div>

          <div className="pt-24" id="mission-statement">

            <div className=" mx-auto ">
              <h1 className={` ${isMobile ? "text-2xl" : "text-4xl"} font-bold mb-4 text-[#105691]`}>{t("home.aboutMenuItems3")}</h1>
              <div className="flex justify-center mt-6 gap-4">
                <div className="text-center">
                  <Link to={'/aieducation'} >
                    <div className={` ${isMobile ? "w-[100px]" : "w-[300px]"} h-auto mx-auto  mb-2`}>
                      {i18n.language === 'en' &&

                        <img src="/webimage/cores1_en.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                      {i18n.language === 'la' &&

                        <img src="/webimage/cores1_lao.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                      {i18n.language === 'ko' &&

                        <img src="/webimage/cores1.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                    </div>
                  </Link>
                </div>
                <div className="text-center ">
                  <Link to={'/aieducation'}  >

                    <div className={` ${isMobile ? "w-[100px]" : "w-[300px]"} h-auto mx-auto  mb-2`}>

                      {i18n.language === 'en' &&

                        <img src="/webimage/cores2_en.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                      {i18n.language === 'la' &&

                        <img src="/webimage/cores2_lao.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                      {i18n.language === 'ko' &&

                        <img src="/webimage/cores2.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                    </div>

                  </Link>
                </div>
                <div className="text-center ">
                  <Link to={'/aieducation'} >

                    <div className={` ${isMobile ? "w-[100px]" : "w-[300px]"} h-auto mx-auto  mb-2`}>
                      {i18n.language === 'en' &&


                        <img src="/webimage/cores3_en.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                      {i18n.language === 'la' &&


                        <img src="/webimage/cores3_lao.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                      {i18n.language === 'ko' &&


                        <img src="/webimage/cores3.png" className="hover:scale-110 transition-all duration-300" alt="" />
                      }
                    </div>
                    {/* <p className="text-xs hover:underline">{t("about.3_p3")}</p> */}
                  </Link>
                </div>
              </div>


            </div>

            <div className="pt-12" >

              <div className="bg-blue-50 rounded-2xl p-8 mb-12 " >

                <p className="mb-4 text-justify leading-relaxed">
                  <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.coreValues.2_p1")}</Trans>
                </p>
                <p className="mb-4 text-justify leading-relaxed">
                  <Trans components={{ strong: <strong className="font-bold" /> }}>{t("about.coreValues.2_p2")}</Trans>
                </p>

              </div>
            </div>

          </div>

          <div className="pt-24 " id="organization">


            <div className="relative">
              <h1 className={` ${isMobile ? "text-2xl" : "text-4xl"} font-bold mb-4 text-[#105691]`}>{t("home.aboutMenuItems4")}</h1>

              <div className="flex flex-col gap-4 justify-center items-center">

                <ImageZoom src="/webimage/mission_statment_kr2.png" alt="iater mission statement image" className={` ${isMobile ? "w-[300px]" : "w-[50%]"} h-auto object-cover mt-2`} />
                <h2 className="text-2xl  mt-4 text-center text-gray-600 " ><Trans i18nKey={"about.missionStatement.sigleContext"} /></h2>
              </div>

            </div>
          </div>

          <div className="pt-24" id="logo">

            <div>
              <h1 className={` ${isMobile ? "text-2xl" : "text-4xl"} font-bold mb-4 text-[#105691]`}>{t("home.aboutMenuItems7")}</h1>
              <div className=" p-4 rounded-lg mb-8 text-center">
                <div className={`${isMobile ? "flex-col" : "flex"} gap-10 items-center justify-center`}>
                  <div className={`${isMobile ? "w-[60%]" : "w-[40%]"}`}>
                    <img src={"/webimage/biglogo.png"} alt="logo" className="w-full h-auto object-cover" />
                  </div>
                  {/* <ListMenu classStyle='flex-col' /> */}

                  <div className={`flex flex-col  space-y-6 ${isMobile ? "mt-12" : ""}`}>

                    <button onClick={() => handleClick("about")} className="flex gap-4 cursor-pointer transition-all duration-300 hover:text-gray-400">
                      <div >
                        <img src="/webimage/Rectangle1.png" alt="about iATER" className="w-[50px] h-auto object-cover" />
                      </div>

                      <p><Trans i18nKey={"about.instituteIdentity.option1"} /></p>

                    </button>

                    <button onClick={() => handleClick("project")} className="flex gap-4 cursor-pointer  transition-all duration-300 hover:text-gray-400">

                      <div >
                        <img src="/webimage/Rectangle2.png" alt="project" className="w-[50px] h-auto object-cover" />
                      </div>
                      <p><Trans i18nKey={"about.instituteIdentity.option2"} /></p>


                    </button>

                    <button onClick={() => handleClick("program")} className="flex gap-4 cursor-pointer transition-all duration-300 hover:text-gray-400">

                      <div >
                        <img src="/webimage/Rectangle3.png" alt="Program" className="w-[50px] h-auto object-cover" />
                      </div>
                      <p><Trans i18nKey={"about.instituteIdentity.option3"} /></p>

                    </button>


                    <button onClick={() => navigate("/")} className="flex gap-4 cursor-pointer transition-all duration-300 hover:text-gray-400">
                      <div >
                        <img src="/webimage/Rectangle4.png" alt="none" className="w-[50px] h-auto object-cover" />
                      </div>
                      <p><Trans i18nKey={"about.instituteIdentity.option4"} /></p>

                    </button>

                  </div>

                </div>
                <h1 className={` font-bold mb-4 text-[#7b2d83] uppercase ${isMobile ? "text-[2rem] mt-12" : " mt-12 text-[3rem]"}`}>Step up knowledge</h1>
                <p className="text-xl">" <Trans i18nKey={"about.instituteIdentity.singleContext"} /> "</p>
              </div>


            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default AboutPage
