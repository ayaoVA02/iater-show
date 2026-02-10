
import { Link } from 'react-router-dom'
import { logo2 } from '../assets/images'
import { isMobile } from 'react-device-detect'
const Logo = () => {
  return (
    <>
    <Link to="/home">
    {isMobile ? <img src={logo2} alt="logo" className="w-[60px] h-auto object-cover" /> :  <img src='/webimage/LOGO.png' alt="logo" className="w-auto h-auto object-cover" /> }
       
    </Link>


    </>
  )
}

export default Logo
