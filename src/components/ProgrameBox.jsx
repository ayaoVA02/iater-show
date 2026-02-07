import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDeviceType from "../hook/useDeviceType";
import { useHoverBox } from "../context/HoverContext";
import { isMobile } from "react-device-detect";
import { Trans } from "react-i18next";

const ProgrameBox = ({ title, color, link, subtitle, menuItems }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { activeBox ,clearActiveBox } = useHoverBox(); // Get current activeBox
  const deviceType = useDeviceType();
  // const isMobile = deviceType === "mobile";

  const isActive = isHovered || activeBox === "program";

  const backgroundImageUrl = isActive
    ? "/webimage/bg_program2.png"
    : "/webimage/bg_program1.png";

  return (
    <div
      className={`relative overflow-hidden transition-transform duration-500 ease-in-out ${isMobile ? "w-[390px] h-[390px] mx-auto" : "w-[390px] h-[390px]"
        } ${isActive && !isMobile ? "scale-125 z-20" : ""}`}
      onMouseEnter={() => {
        setIsHovered(true);
        if (activeBox && activeBox !== "program") clearActiveBox();
      }}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundImage: `url("${backgroundImageUrl}")`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: isMobile ? "360px" : "390px",
      }}
    >
      <div className="relative w-full h-full p-6 flex flex-col justify-center items-start">

        {isMobile ? (
          <>
            <div>
            <h2 className="text-3xl font-bold text-white mb-6 ml-4 transition-transform duration-500 ease-in-out">
             <Trans i18nKey={"home.program_subtitle"} />
              
            </h2>
          </div>
            <ul className="text-white space-y-2 pl-24">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="hover:underline">
                    {index + 1}. {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) :
          (
            isActive && menuItems ? (
              <>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4 ml-4">
                    {/* 안녕하세요 <br />iATER를 소개합니다 */}
                    {subtitle}
                  </h2>
                </div>

                <ul className="text-white space-y-2 pl-24">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link to={item.link} className="hover:underline">
                        {index + 1}. {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <h1 className="absolute top-1/2 left-20 transform -translate-x-1/5 -translate-y-1/2 text-white text-5xl font-bold">
                {title}
              </h1>
            )
          )}
      </div>
    </div>
  );
};

export default ProgrameBox;
