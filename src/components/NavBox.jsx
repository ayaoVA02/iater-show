import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDeviceType from "../hook/useDeviceType";

const NavBox = ({ title, color, link, subtitle, menuItems }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // now includes tablets

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-500",
    orange: "bg-orange-500 hover:bg-orange-500",
    green: "bg-green-500 hover:bg-green-500",
  };

  const showDetails =  isHovered;


        const deviceType = useDeviceType();
  const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth'; // mobile
  };

  return (
    <div
      className={`relative flex justify-center items-center  h-[300px] ${deviceType === 'mobile' ? 'mobileWidth' : 'w-[390px]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <div
        className={`${colorClasses[color]} 

        ${deviceType === 'mobile' ? 'w-full mx-3' : 'w-[530px]'}
       
          hover:absolute
          hover:z-20
          rounded-[50px] 
          hover:rounded-[80px]
          p-8 text-white text-center 
          transition-all duration-300 transform origin-center 
          
          flex flex-col justify-center items-center 
          h-[300px] hover:h-[400px]
     
        `}
      >
        <div className="">

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-sm">{subtitle}</p>
        </div>

        {showDetails && menuItems && (
          <div className="w-full mt-4 transition-all duration-300">
            <ul className="text-left">
              {menuItems.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link to={item.link} className="hover:underline">
                    {index + 1}. {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div> */}

      <div>
        <img src="/webimage/introduct_kr.png" alt="" />
      </div>
    </div>
  );
};

export default NavBox;
