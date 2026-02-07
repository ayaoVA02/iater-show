import Logo from "./Logo"
import useDeviceType from "../hook/useDeviceType";
import ListMenu from "./ListMenu";
import { useState } from "react";

const Header = () => {
  const deviceType = useDeviceType();
 const [activeBox, setActiveBox] = useState(null);
  const getContentWidth = () => {
    if (deviceType === 'desktop') return 'desktopWidth';
    if (deviceType === 'tablet') return 'templetWidth';
    return 'mobileWidth'; // default: mobile
  };

  return (
    <header className="z-50 bg-white fixed w-full top-0 left-0 right-0">
      <div className={`mx-auto mt-4 ${getContentWidth()}`}>
        <div className="flex justify-between items-center mb-4 px-4 ">
          <Logo />

          <ListMenu setActiveBox={setActiveBox} classStyle="flex-row" />
        </div>

        {/* <img src="/webimage/002_01.png" alt="" /> */}
      </div>
    </header>
  );
};

export default Header;
