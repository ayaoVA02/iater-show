import { useState } from "react";
import { Link } from "react-router-dom";
import useDeviceType from "../hook/useDeviceType";
import { useHoverBox } from "../context/HoverContext";
import { Trans } from "react-i18next";
import { im25, im4, im5, im6, im7, im8, im9 } from "../assets/images";

const ProjectBox = ({ title, color, link, subtitle, menuItems }) => {
  const { activeBox, clearActiveBox } = useHoverBox();
  const [isHovered, setIsHovered] = useState(false);
  const deviceType = useDeviceType();
  const isMobile = deviceType === "mobile";

  const isActive = isHovered || activeBox === "project";

  const backgroundImageUrl = isActive
    ? "/webimage/bg_project2.png"
    : "/webimage/bg_project1.png";



  return (
    <div
      className={`relative overflow-hidden transition-transform duration-500 ease-in-out ${isMobile ? "w-[390px] h-[390px] mx-auto" : "w-[390px] h-[390px]"
        } ${isActive && !isMobile ? "scale-125 z-20" : ""}`}
      // onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => {
        setIsHovered(true);
        if (activeBox && activeBox !== "project") clearActiveBox();
      }}
      style={{
        // backgroundImage: `url("${backgroundImageUrl}")`,
        backgroundImage: `${isMobile ? `url("/webimage/bg_project1.png")` : `url("${backgroundImageUrl}")`}`,

        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: isMobile ? "360px" : "390px",

      }}
    >
      <div className="relative w-full h-full p-6 flex flex-col justify-center items-center">


        {isMobile ? (
          <>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 ml-4 transition-transform duration-500 ease-in-out">

                <Trans i18nKey="home.project_subtitle" />

              </h2>
            </div>
            {/* <ul className="text-white space-y-2 pl-12">
              {menuItems?.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="hover:underline">
                    {index + 1}. {item.name}
                  </Link>
                </li>
              ))}
            </ul> */}

            <div className="flex flex-wrap relative">
                  <div className="overflow-hidden rounded-lg m-2 -mb-4 group">
                    <img
                      src={im5}
                      alt="Background Image"
                      width={80}
                      height={80}
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg -mt-2 group">
                    <img
                      src={im4}
                      alt="Background Image"
                      width={100}
                      height={100}
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg h-[60px] w-[70px] mr-2 ml-3 group">
                    <img
                      src={im6}
                      alt="Background Image"
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg mt-12 h-[60px] w-[70px] group">
                    <img
                      src={im7}
                      alt="Background Image"
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg mt-6 ml-4 group">
                    <img
                      src={im8}
                      alt="Background Image"
                      width={100}
                      height={100}
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg mt-6 ml-4 group">
                    <img
                      src={im9}
                      alt="Background Image"
               
                      className="object-cover h-12 w-12 transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
       
                </div>
          </>

        ) : (
          isActive && menuItems ? (
            <>
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 ml-4 transition-transform duration-500 ease-in-out">
                  <Trans i18nKey="home.project_subtitle" />

                </h2>
              </div>

              {/* <ul className="text-white space-y-2 pl-24">
                {menuItems?.map((item, index) => (
                  <li key={index}>
                    <Link to={item.link} className="hover:underline">
                      {index + 1}. {item.name}
                    </Link>
                  </li>
                ))}
              </ul> */}

              <Link to={'/project#external'}>
                <div className="flex flex-wrap relative">
                  <div className="overflow-hidden rounded-lg m-2 -mb-4 group">
                    <img
                      src={im5}
                      alt="Background Image"
                      width={100}
                      height={100}
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg -mt-2 group">
                    <img
                      src={im4}
                      alt="Background Image"
                      width={100}
                      height={100}
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg h-[60px] w-[70px] mr-2 ml-3 group">
                    <img
                      src={im6}
                      alt="Background Image"
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg mt-12 h-[60px] w-[70px] group">
                    <img
                      src={im7}
                      alt="Background Image"
                      className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg mt-6 ml-4 group">
                    <img
                      src={im8}
                      alt="Background Image"
                      width={100}
                      height={100}
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg mt-6 ml-4 group">
                    <img
                      src={im9}
                      alt="Background Image"
               
                      className="object-cover h-12 w-12 transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg mt-6 ml-4 group">
                    <img
                      src={im25}
                      alt="Background Image"
           
                      className="object-cover h-12 w-12 transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </Link>
            </>
          ) : (

            <h1 className="text-white text-5xl font-bold text-center">
              {title}
            </h1>
          )
        )}



      </div>
    </div>
  );
};

export default ProjectBox;
